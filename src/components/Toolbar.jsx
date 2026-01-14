import React from 'react';
import { useStore } from '../store';
import './Toolbar.css';

/**
 * Toolbar component for tool selection and settings
 */
export function Toolbar() {
  const {
    tool,
    setTool,
    strokeColor,
    setStrokeColor,
    fillColor,
    setFillColor,
    brushSize,
    setBrushSize,
    shapeType,
    setShapeType,
    fontSize,
    setFontSize,
    objects,
    clearObjects,
  } = useStore();

  return (
    <aside className="toolbar">
      <div className="toolbar-section">
        <h3>Tools</h3>
        <div className="tool-buttons">
          <button
            className={`tool-btn ${tool === 'draw' ? 'active' : ''}`}
            onClick={() => setTool('draw')}
            title="Draw (Pencil)"
          >
            ✏️
          </button>
          <button
            className={`tool-btn ${tool === 'erase' ? 'active' : ''}`}
            onClick={() => setTool('erase')}
            title="Eraser"
          >
            🧹
          </button>
          <button
            className={`tool-btn ${tool === 'shape' ? 'active' : ''}`}
            onClick={() => setTool('shape')}
            title="Shapes"
          >
            ◼️
          </button>
          <button
            className={`tool-btn ${tool === 'text' ? 'active' : ''}`}
            onClick={() => setTool('text')}
            title="Text"
          >
            T
          </button>
          <button
            className={`tool-btn ${tool === 'image' ? 'active' : ''}`}
            onClick={() => setTool('image')}
            title="Image"
          >
            🖼️
          </button>
          <button
            className={`tool-btn ${tool === 'select' ? 'active' : ''}`}
            onClick={() => setTool('select')}
            title="Select / Transform"
          >
            ✦
          </button>
        </div>
      </div>

      {/* Shape settings (when shape tool active) */}
      {tool === 'shape' && (
        <div className="toolbar-section">
          <h4>Shape</h4>
          <select value={shapeType} onChange={(e) => setShapeType(e.target.value)}>
            <option value="rectangle">Rectangle</option>
            <option value="circle">Circle</option>
            <option value="ellipse">Ellipse</option>
            <option value="polygon">Polygon</option>
          </select>
        </div>
      )}

      {/* Text settings (when text tool active) */}
      {tool === 'text' && (
        <div className="toolbar-section">
          <h4>Text</h4>
          <div className="input-group">
            <label>Font Size</label>
            <input
              type="range"
              min="8"
              max="96"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
            />
            <span>{fontSize}px</span>
          </div>
        </div>
      )}

      {/* Color & brush settings (all tools) */}
      <div className="toolbar-section">
        <h4>Stroke</h4>
        <div className="input-group">
          <label>Color</label>
          <input
            type="color"
            value={strokeColor}
            onChange={(e) => setStrokeColor(e.target.value)}
          />
        </div>
        {(tool === 'draw' || tool === 'erase') && (
          <div className="input-group">
            <label>Size</label>
            <input
              type="range"
              min="1"
              max="50"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
            />
            <span>{brushSize}px</span>
          </div>
        )}
      </div>

      {/* Fill color (shapes & text) */}
      {(tool === 'shape' || tool === 'text') && (
        <div className="toolbar-section">
          <h4>Fill</h4>
          <div className="input-group">
            <label>Color</label>
            <input
              type="color"
              value={fillColor}
              onChange={(e) => setFillColor(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="toolbar-section">
        <h4>Actions</h4>
        <button
          className="action-btn"
          onClick={() => {
            if (confirm('Clear all objects? This cannot be undone.')) {
              clearObjects();
            }
          }}
          disabled={objects.length === 0}
        >
          🗑️ Clear All
        </button>
      </div>

      {/* Stats */}
      <div className="toolbar-section stats">
        <p><strong>{objects.length}</strong> objects</p>
      </div>
    </aside>
  );
}
