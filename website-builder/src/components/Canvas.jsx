import { useDroppable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const DraggableItem = ({ id, type, properties, onClick, previewMode }) => {
  const { attributes, listeners, setNodeRef, transform } = useSortable({ 
    id,
    disabled: previewMode
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    touchAction: "none",
    cursor: previewMode ? "default" : "grab",
    padding: "10px",
    border: previewMode ? "none" : "1px solid #ccc",
    background: properties.bgColor || "white",
    color: properties.textColor || "black",
    width: properties.width || "150px",
    height: properties.height || "50px",
    borderRadius: properties.borderRadius || "5px",
    fontSize: properties.fontSize || "16px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    userSelect: "none",
    boxShadow: previewMode ? "none" : "0 1px 3px rgba(0,0,0,0.12)"
  };

  // Only attach event handlers if not in preview mode
  const elementProps = previewMode ? {} : {
    ...attributes,
    ...listeners,
    onClick: () => onClick(id)
  };

  let content;
  switch (type) {
    case "text":
      content = <div>{properties.content || "Text Element"}</div>;
      break;
    case "image":
      content = properties.content ? 
        <img src={properties.content} alt="User Image" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: properties.borderRadius }} /> : 
        "🖼️ Image";
      break;
    case "button":
      content = <button 
        style={{ 
          background: properties.bgColor, 
          color: properties.textColor, 
          borderRadius: properties.borderRadius,
          padding: "5px 15px",
          border: "none",
          cursor: previewMode ? "pointer" : "grab",
          width: "100%",
          height: "100%"
        }}
        onClick={previewMode ? (e) => {
          e.stopPropagation();
          alert("Button clicked in preview mode!");
        } : undefined}
      >
        {properties.content || "Button"}
      </button>;
      break;
    default:
      content = `Unknown element: ${type}`;
  }

  return (
    <div 
      ref={setNodeRef} 
      {...elementProps} 
      style={style}
    >
      {content}
    </div>
  );
};

const Canvas = ({ elements, onElementClick, previewMode }) => {
  const { setNodeRef } = useDroppable({ 
    id: "canvas"
  });

  const canvasClass = `${previewMode ? 'w-full' : 'w-3/4'} h-screen ${previewMode ? 'bg-white' : 'bg-gray-50'} ${previewMode ? '' : 'border border-gray-300'} p-4 relative overflow-auto`;

  return (
    <div 
      ref={setNodeRef} 
      className={canvasClass}
      id="canvas"
    >
      {!previewMode && elements.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          Drag elements here to start building
        </div>
      )}
      
      {elements.map((el) => (
        <div 
          key={el.id} 
          className="absolute" 
          style={{ 
            left: el.posX || "20px", 
            top: el.posY || "20px",
            zIndex: 10
          }}
        >
          <DraggableItem 
            id={el.id} 
            type={el.type} 
            properties={el} 
            onClick={onElementClick}
            previewMode={previewMode}
          />
        </div>
      ))}
    </div>
  );
};

export default Canvas;