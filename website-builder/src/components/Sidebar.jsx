import { useDraggable } from "@dnd-kit/core";

const DraggableElement = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="p-2 border rounded cursor-grab bg-gray-100"
    >
      {children}
    </div>
  );
};

const Sidebar = () => {
  return (
    <div className="w-1/4 p-4 bg-gray-200 h-screen">
      <h2 className="text-lg font-bold mb-4">Elements</h2>
      <DraggableElement id="text">📄 Text</DraggableElement>
      <DraggableElement id="image">🖼️ Image</DraggableElement>
      <DraggableElement id="button">🔘 Button</DraggableElement>
    </div>
  );
};

export default Sidebar;
