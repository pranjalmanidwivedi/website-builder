import { useState, useEffect } from "react";

const PropertyEditor = ({ selectedElement, updateElement, onDelete }) => {
  const [properties, setProperties] = useState({
    content: "",
    width: "150",
    height: "50",
    bgColor: "#ffffff",
    textColor: "#000000",
    borderRadius: "5",
    fontSize: "16",
    posX: "20",
    posY: "20"
  });

  useEffect(() => {
    if (selectedElement) {
      // Strip "px" from dimension values
      setProperties({
        content: selectedElement.content || "",
        width: selectedElement.width?.replace("px", "") || "150",
        height: selectedElement.height?.replace("px", "") || "50",
        bgColor: selectedElement.bgColor || "#ffffff",
        textColor: selectedElement.textColor || "#000000",
        borderRadius: selectedElement.borderRadius?.replace("px", "") || "5",
        fontSize: selectedElement.fontSize?.replace("px", "") || "16",
        posX: selectedElement.posX?.replace("px", "") || "20",
        posY: selectedElement.posY?.replace("px", "") || "20"
      });
    }
  }, [selectedElement]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProperties(prev => ({ ...prev, [name]: value }));
    
    // Add "px" to dimension values when updating element
    const updatedValue = ["width", "height", "borderRadius", "fontSize", "posX", "posY"].includes(name) 
      ? `${value}px` 
      : value;
    
    updateElement(selectedElement.id, { [name]: updatedValue });
  };

  // Special handler for image URLs
  const handleImageUrl = () => {
    if (selectedElement.type === "image") {
      const url = prompt("Enter image URL:", properties.content || "");
      if (url !== null) {
        setProperties(prev => ({ ...prev, content: url }));
        updateElement(selectedElement.id, { content: url });
      }
    }
  };

  if (!selectedElement) return null;

  return (
    <div className="w-1/4 p-4 bg-gray-200 h-screen overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Edit {selectedElement.type}</h2>
        <button 
          onClick={onDelete}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
      
      <div className="space-y-4">
        {selectedElement.type === "text" || selectedElement.type === "button" ? (
          <>
            <label className="block">Content</label>
            <input 
              type="text" 
              name="content" 
              value={properties.content} 
              onChange={handleChange} 
              className="p-2 border rounded w-full" 
            />
          </>
        ) : selectedElement.type === "image" ? (
          <>
            <label className="block">Image URL</label>
            <div className="flex">
              <input 
                type="text" 
                name="content" 
                value={properties.content} 
                onChange={handleChange} 
                className="p-2 border rounded w-full" 
              />
              <button 
                onClick={handleImageUrl}
                className="ml-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Set
              </button>
            </div>
          </>
        ) : null}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block">Width (px)</label>
            <input 
              type="number" 
              name="width" 
              value={properties.width} 
              onChange={handleChange} 
              className="p-2 border rounded w-full" 
            />
          </div>
          <div>
            <label className="block">Height (px)</label>
            <input 
              type="number" 
              name="height" 
              value={properties.height} 
              onChange={handleChange} 
              className="p-2 border rounded w-full" 
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block">Position X (px)</label>
            <input 
              type="number" 
              name="posX" 
              value={properties.posX} 
              onChange={handleChange} 
              className="p-2 border rounded w-full" 
            />
          </div>
          <div>
            <label className="block">Position Y (px)</label>
            <input 
              type="number" 
              name="posY" 
              value={properties.posY} 
              onChange={handleChange} 
              className="p-2 border rounded w-full" 
            />
          </div>
        </div>

        <div>
          <label className="block">Background Color</label>
          <div className="flex">
            <input 
              type="color" 
              name="bgColor" 
              value={properties.bgColor} 
              onChange={handleChange} 
              className="p-1 border rounded h-10" 
            />
            <input 
              type="text" 
              name="bgColor" 
              value={properties.bgColor} 
              onChange={handleChange} 
              className="p-2 border rounded w-full ml-2" 
            />
          </div>
        </div>

        <div>
          <label className="block">Text Color</label>
          <div className="flex">
            <input 
              type="color" 
              name="textColor" 
              value={properties.textColor} 
              onChange={handleChange} 
              className="p-1 border rounded h-10" 
            />
            <input 
              type="text" 
              name="textColor" 
              value={properties.textColor} 
              onChange={handleChange} 
              className="p-2 border rounded w-full ml-2" 
            />
          </div>
        </div>

        <div>
          <label className="block">Border Radius (px)</label>
          <input 
            type="number" 
            name="borderRadius" 
            value={properties.borderRadius} 
            onChange={handleChange} 
            className="p-2 border rounded w-full" 
          />
        </div>

        <div>
          <label className="block">Font Size (px)</label>
          <input 
            type="number" 
            name="fontSize" 
            value={properties.fontSize} 
            onChange={handleChange} 
            className="p-2 border rounded w-full" 
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyEditor;