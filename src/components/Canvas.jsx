import React, { useRef, useState } from 'react';
import { Stage, Layer, Line, Circle, Rect, Text as KonvaText, Image as KonvaImage } from 'react-konva';
import { getStroke } from 'perfect-freehand';
import { useStore } from '../store';
import './Canvas.css';

/**
 * Convert path points to smooth Bezier curve using perfect-freehand
 */
function getSmoothPathPoints(points, size) {
  if (points.length < 2) return points;
  
  // Convert flat array to point objects
  const pathPoints = [];
  for (let i = 0; i < points.length; i += 2) {
    pathPoints.push([points[i], points[i + 1]]);
  }

  try {
    // Get smoothed stroke outline
    const stroke = getStroke(pathPoints, {
      size: Math.max(2, size * 0.8),
      thinning: 0.6,
      smoothing: 0.5,
      streamline: 0.5,
      easing: (t) => t,
      capStart: true,
      capEnd: true,
      simulatePressure: true,
      isComplete: false,
    });

    // Flatten back to array
    const flattened = [];
    stroke.forEach(([x, y]) => {
      flattened.push(x, y);
    });
    return flattened;
  } catch {
    // Fallback if perfect-freehand has issues
    return points;
  }
}

/**
 * Canvas component using Konva for infinite canvas drawing
 */
export function Canvas() {
  const stageRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState([]);
  
  const tool = useStore((state) => state.tool);
  const strokeColor = useStore((state) => state.strokeColor);
  const brushSize = useStore((state) => state.brushSize);
  const objects = useStore((state) => state.objects);
  const addObject = useStore((state) => state.addObject);

  // Handle wheel zoom (Ctrl/Cmd + Scroll)
  const handleWheel = (e) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    const oldScale = scale;
    const pointer = stage.getPointerPosition();

    // Zoom factor
    const direction = e.evt.deltaY > 0 ? -0.1 : 0.1;
    const newScale = Math.max(0.1, Math.min(5, oldScale + direction)); // Clamp between 0.1 and 5

    const mousePointTo = {
      x: (pointer.x - position.x) / oldScale,
      y: (pointer.y - position.y) / oldScale,
    };

    const newPosition = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    setScale(newScale);
    setPosition(newPosition);
  };

  const handleMouseDown = (e) => {
    const stage = stageRef.current;
    
    // Spacebar + drag for panning
    if (e.evt.code === 'Space' || e.evt.button === 1) {
      const pointerPos = stage.getPointerPosition();
      stageRef.current._dragStartPos = pointerPos;
      stageRef.current._isPanning = true;
      return;
    }

    // Drawing mode (draw or erase)
    if ((tool === 'draw' || tool === 'erase') && !e.evt.ctrlKey && !e.evt.metaKey) {
      const pointerPos = stage.getPointerPosition();
      const relativePos = {
        x: (pointerPos.x - position.x) / scale,
        y: (pointerPos.y - position.y) / scale,
      };
      setIsDrawing(true);
      setCurrentPath([relativePos.x, relativePos.y]);
    }
  };

  const handleMouseMove = () => {
    const stage = stageRef.current;

    // Panning
    if (stageRef.current._isPanning) {
      const pointerPos = stage.getPointerPosition();
      const startPos = stageRef.current._dragStartPos;

      const deltaX = (pointerPos.x - startPos.x) / scale;
      const deltaY = (pointerPos.y - startPos.y) / scale;

      setPosition({
        x: position.x + deltaX,
        y: position.y + deltaY,
      });

      stageRef.current._dragStartPos = pointerPos;
      return;
    }

    // Drawing
    if (isDrawing && (tool === 'draw' || tool === 'erase')) {
      const pointerPos = stage.getPointerPosition();
      const relativePos = {
        x: (pointerPos.x - position.x) / scale,
        y: (pointerPos.y - position.y) / scale,
      };
      setCurrentPath((prev) => [...prev, relativePos.x, relativePos.y]);
    }
  };

  const handleMouseUp = () => {
    stageRef.current._isPanning = false;

    // Finish drawing
    if (isDrawing && currentPath.length > 1) {
      const smoothedPath = getSmoothPathPoints(currentPath, brushSize);
      
      addObject({
        type: tool === 'erase' ? 'eraser' : 'line',
        points: smoothedPath,
        stroke: tool === 'erase' ? 'transparent' : strokeColor,
        strokeWidth: brushSize,
      });
      setCurrentPath([]);
    }
    setIsDrawing(false);
  };

  return (
    <div className="canvas-container">
      <Stage
        ref={stageRef}
        width={window.innerWidth - 240}
        height={window.innerHeight}
        scaleX={scale}
        scaleY={scale}
        x={position.x}
        y={position.y}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Background grid layer */}
        <Layer>
          <Rect
            x={-5000}
            y={-5000}
            width={10000}
            height={10000}
            fill="white"
          />
          {renderGrid()}
        </Layer>

        {/* Objects layer */}
        <Layer name="drawing">
          {objects.map((obj) => {
            if (obj.type === 'line' || obj.type === 'eraser') {
              return (
                <Line
                  key={obj.id}
                  points={obj.points}
                  stroke={obj.stroke}
                  strokeWidth={obj.type === 'eraser' ? brushSize * 2 : obj.strokeWidth}
                  lineCap="round"
                  lineJoin="round"
                  globalCompositeOperation={obj.type === 'eraser' ? 'destination-out' : 'source-over'}
                />
              );
            }
            return null;
          })}

          {/* Current drawing path (preview) */}
          {currentPath.length > 1 && (
            <Line
              points={getSmoothPathPoints(currentPath, brushSize)}
              stroke={tool === 'erase' ? 'rgba(0,0,0,0.3)' : strokeColor}
              strokeWidth={tool === 'erase' ? brushSize * 2 : brushSize}
              lineCap="round"
              lineJoin="round"
              globalCompositeOperation={tool === 'erase' ? 'destination-out' : 'source-over'}
            />
          )}
        </Layer>
      </Stage>

      {/* Info overlay */}
      <div className="canvas-info">
        <p>Tool: <strong>{tool.charAt(0).toUpperCase() + tool.slice(1)}</strong></p>
        <p className="zoom-info">Zoom: {(scale * 100).toFixed(0)}%</p>
        <p className="brush-info" style={{ display: (tool === 'draw' || tool === 'erase') ? 'block' : 'none' }}>
          {tool === 'erase' ? '🧹' : '✏️'} Size: <strong>{brushSize}px</strong>
        </p>
        <p className="help-text">Scroll: zoom | Space+drag: pan</p>
      </div>
    </div>
  );
}

/**
 * Render a grid for visual reference
 */
function renderGrid() {
  const gridSize = 50;
  const gridLines = [];

  for (let x = -5000; x < 5000; x += gridSize) {
    gridLines.push(
      <Line
        key={`v-${x}`}
        points={[x, -5000, x, 5000]}
        stroke="#f0f0f0"
        strokeWidth={0.5}
      />
    );
  }

  for (let y = -5000; y < 5000; y += gridSize) {
    gridLines.push(
      <Line
        key={`h-${y}`}
        points={[-5000, y, 5000, y]}
        stroke="#f0f0f0"
        strokeWidth={0.5}
      />
    );
  }

  return gridLines;
}
