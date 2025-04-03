import { useState, useCallback } from "react";
import { DndContext, pointerWithin, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import Sidebar from "./components/Sidebar";
import Canvas from "./components/Canvas";
import PropertyEditor from "./components/PropertyEditor";
import Navbar from "./components/Navbar";
import ExportUtility from "./components/ExportUtility";

function App() {
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [showExport, setShowExport] = useState(false);
  
  // Configure sensors for better drag behavior
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragEnd = (event) => {
    const { over, active } = event;
    
    // When dropping a new element from sidebar onto canvas
    if (over && over.id === "canvas" && typeof active.id === 'string') {
      // Calculate drop position relative to canvas
      const { x, y } = event.delta;
      const canvasElement = document.getElementById('canvas');
      const canvasRect = canvasElement.getBoundingClientRect();
      const dropX = event.activatorEvent.clientX - canvasRect.left;
      const dropY = event.activatorEvent.clientY - canvasRect.top;
      
      // Add new element to the canvas
      if (['text', 'image', 'button'].includes(active.id)) {
        const newElement = {
          id: `el-${Date.now()}`,
          type: active.id,
          content: active.id === 'text' ? 'Text Element' : 
                  active.id === 'button' ? 'Button' : '',
          width: "150px",
          height: active.id === 'button' ? "40px" : "100px",
          bgColor: active.id === 'button' ? "#4A90E2" : "#ffffff",
          textColor: active.id === 'button' ? "#ffffff" : "#000000",
          borderRadius: active.id === 'button' ? "5px" : "0px",
          fontSize: "16px",
          posX: `${dropX}px`,
          posY: `${dropY}px`
        };
        
        setElements(prev => [...prev, newElement]);
        setSelectedElement(newElement);
      }
    } 
    // For reordering existing elements on the canvas
    else if (over && active.id.startsWith('el-') && over.id.startsWith('el-')) {
      const oldIndex = elements.findIndex(el => el.id === active.id);
      const newIndex = elements.findIndex(el => el.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        setElements(arrayMove(elements, oldIndex, newIndex));
      }
    }
    // For moving elements on the canvas
    else if (active.id.startsWith('el-')) {
      const { x, y } = event.delta;
      setElements(prev => 
        prev.map(el => 
          el.id === active.id 
            ? {
                ...el,
                posX: `${parseInt(el.posX || '0') + x}px`,
                posY: `${parseInt(el.posY || '0') + y}px`
              }
            : el
        )
      );
    }
  };

  const handleElementClick = (id) => {
    if (previewMode) return;
    const element = elements.find(el => el.id === id);
    setSelectedElement(element);
  };

  const updateElement = (id, newProps) => {
    setElements(prev => 
      prev.map(el => 
        el.id === id 
          ? { ...el, ...newProps } 
          : el
      )
    );
    
    // Update selected element reference
    if (selectedElement && selectedElement.id === id) {
      setSelectedElement(prev => ({ ...prev, ...newProps }));
    }
  };

  const handleSave = () => {
    const projectData = JSON.stringify(elements);
    localStorage.setItem('webbuilder_project', projectData);
    alert('Project saved successfully!');
  };

  const handleLoad = () => {
    const savedProject = localStorage.getItem('webbuilder_project');
    if (savedProject) {
      try {
        const parsedData = JSON.parse(savedProject);
        setElements(parsedData);
        setSelectedElement(null);
      } catch (error) {
        console.error('Failed to load project:', error);
        alert('Failed to load project. The saved data might be corrupted.');
      }
    } else {
      alert('No saved project found.');
    }
  };

  const handlePreview = () => {
    setPreviewMode(!previewMode);
    setSelectedElement(null);
  };

  const handleExport = () => {
    setShowExport(true);
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear the canvas? All unsaved changes will be lost.')) {
      setElements([]);
      setSelectedElement(null);
    }
  };

  const handleDeleteElement = () => {
    if (selectedElement) {
      setElements(prev => prev.filter(el => el.id !== selectedElement.id));
      setSelectedElement(null);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar 
        onSave={handleSave} 
        onLoad={handleLoad}
        onPreview={handlePreview} 
        onClear={handleClear}
        onExport={handleExport}
        previewMode={previewMode}
      />
      
      <DndContext 
        sensors={sensors}
        onDragEnd={handleDragEnd}
        collisionDetection={pointerWithin}
      >
        <div className="flex flex-1 overflow-hidden">
          {!previewMode && (
            <Sidebar />
          )}
          
          <SortableContext items={elements.map(el => el.id)}>
            <Canvas 
              elements={elements} 
              onElementClick={handleElementClick}
              previewMode={previewMode}
            />
          </SortableContext>
          
          {!previewMode && selectedElement && (
            <PropertyEditor 
              selectedElement={selectedElement} 
              updateElement={updateElement}
              onDelete={handleDeleteElement}
            />
          )}
        </div>
      </DndContext>

      {showExport && (
        <ExportUtility 
          elements={elements} 
          onClose={() => setShowExport(false)} 
        />
      )}
    </div>
  );
}

export default App;