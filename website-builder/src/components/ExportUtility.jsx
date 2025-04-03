// ExportUtility.jsx
import { useState } from 'react';

const ExportUtility = ({ elements, onClose }) => {
  const [format, setFormat] = useState('html');
  
  const generateHtml = () => {
    // Create basic HTML document structure
    let htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exported Website</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
    }
    .element-container {
      position: absolute;
    }
  </style>
</head>
<body>
`;

    // Add each element
    elements.forEach(el => {
      const style = `position: absolute; left: ${el.posX}; top: ${el.posY}; width: ${el.width}; height: ${el.height}; background-color: ${el.bgColor}; color: ${el.textColor}; border-radius: ${el.borderRadius}; font-size: ${el.fontSize}; display: flex; justify-content: center; align-items: center;`;
      
      let elementHtml = '';
      
      switch (el.type) {
        case 'text':
          elementHtml = `<div style="${style}">${el.content || 'Text'}</div>`;
          break;
        case 'button':
          elementHtml = `<button style="${style}">${el.content || 'Button'}</button>`;
          break;
        case 'image':
          elementHtml = `<div style="${style.replace(/display: flex.*/g, '')}"><img src="${el.content}" alt="Image" style="width: 100%; height: 100%; object-fit: cover; border-radius: ${el.borderRadius};" /></div>`;
          break;
        default:
          elementHtml = `<div style="${style}">Unknown element</div>`;
      }
      
      htmlContent += `  ${elementHtml}\n`;
    });

    // Close HTML document
    htmlContent += `</body>
</html>`;

    return htmlContent;
  };
  
  const generateReactCode = () => {
    let reactCode = `import React from 'react';

function ExportedWebsite() {
  return (
    <div className="relative w-full h-screen">
`;

    // Add each element as a React component
    elements.forEach(el => {
      const style = `{
        position: 'absolute',
        left: '${el.posX}',
        top: '${el.posY}',
        width: '${el.width}',
        height: '${el.height}',
        backgroundColor: '${el.bgColor}',
        color: '${el.textColor}',
        borderRadius: '${el.borderRadius}',
        fontSize: '${el.fontSize}',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }`;
      
      let elementJsx = '';
      
      switch (el.type) {
        case 'text':
          elementJsx = `      <div style=${style}>${el.content || 'Text'}</div>`;
          break;
        case 'button':
          elementJsx = `      <button style=${style}>${el.content || 'Button'}</button>`;
          break;
        case 'image':
          elementJsx = `      <div style={{...${style}, display: 'block'}}>
        <img 
          src="${el.content}" 
          alt="Image" 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '${el.borderRadius}'
          }} 
        />
      </div>`;
          break;
        default:
          elementJsx = `      <div style=${style}>Unknown element</div>`;
      }
      
      reactCode += `${elementJsx}\n`;
    });
    
    // Close React component
    reactCode += `    </div>
  );
}

export default ExportedWebsite;
`;

    return reactCode;
  };

  const handleCopyToClipboard = () => {
    const code = format === 'html' ? generateHtml() : generateReactCode();
    navigator.clipboard.writeText(code)
      .then(() => {
        alert(`${format.toUpperCase()} code copied to clipboard!`);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        alert('Failed to copy code. Please try again or copy manually.');
      });
  };

  const handleDownload = () => {
    const code = format === 'html' ? generateHtml() : generateReactCode();
    const fileName = format === 'html' ? 'exported-website.html' : 'ExportedWebsite.jsx';
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-2/3 max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Export Website</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">Export Format</label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="format"
                value="html"
                checked={format === 'html'}
                onChange={() => setFormat('html')}
                className="mr-2"
              />
              HTML
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="format"
                value="react"
                checked={format === 'react'}
                onChange={() => setFormat('react')}
                className="mr-2"
              />
              React Component
            </label>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">Preview</label>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-[400px] text-sm">
            {format === 'html' ? generateHtml() : generateReactCode()}
          </pre>
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={handleCopyToClipboard}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Copy to Clipboard
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Download {format === 'html' ? 'HTML' : 'React Component'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportUtility;