const Navbar = ({ onSave, onLoad, onPreview, onClear, onExport, previewMode }) => {
  return (
    <div className="w-full bg-blue-600 text-white p-4 flex justify-between items-center">
      <div className="font-bold text-xl">WebBuilder</div>
      <div className="flex space-x-4">
        <button 
          onClick={onPreview} 
          className={`px-4 py-2 rounded ${previewMode ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-700 hover:bg-blue-800'}`}
        >
          {previewMode ? 'Exit Preview' : 'Preview'}
        </button>
        <button 
          onClick={onLoad} 
          className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700"
        >
          Load
        </button>
        <button 
          onClick={onSave} 
          className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
        >
          Save
        </button>
        <button 
          onClick={onExport} 
          className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-700"
        >
          Export
        </button>
        <button 
          onClick={onClear} 
          className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default Navbar;