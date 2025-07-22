import React, { useRef, useEffect, useState, useCallback } from 'react';
import Icon from '../../../components/AppIcon';

const DrawingCanvas = ({ 
  currentTool, 
  currentColor, 
  currentThickness, 
  isErasing, 
  participants,
  onCanvasUpdate,
  canvasData,
  isRecording 
}) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);

  // Mock drawing data for real-time collaboration
  const [drawingData, setDrawingData] = useState([
    {
      id: 1,
      type: 'path',
      points: [
        { x: 100, y: 100 }, { x: 150, y: 120 }, { x: 200, y: 140 }
      ],
      color: '#2563EB',
      thickness: 3,
      userId: 'user1'
    },
    {
      id: 2,
      type: 'text',
      x: 300,
      y: 200,
      text: 'Solve for x: 2x + 5 = 15',
      color: '#1E293B',
      fontSize: 16,
      userId: 'user2'
    }
  ]);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateCanvasSize = () => {
      const container = canvas.parentElement;
      const rect = container.getBoundingClientRect();
      
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      
      setCanvasSize({ width: rect.width, height: rect.height });
      
      const context = canvas.getContext('2d');
      context.scale(window.devicePixelRatio, window.devicePixelRatio);
      context.lineCap = 'round';
      context.lineJoin = 'round';
      contextRef.current = context;
      
      redrawCanvas();
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  // Redraw canvas with all drawing data
  const redrawCanvas = useCallback(() => {
    const context = contextRef.current;
    if (!context) return;

    // Clear canvas
    context.clearRect(0, 0, canvasSize.width, canvasSize.height);
    
    // Apply zoom and pan
    context.save();
    context.translate(pan.x, pan.y);
    context.scale(zoom, zoom);

    // Draw background grid
    drawGrid(context);

    // Draw all paths and shapes
    drawingData.forEach(item => {
      if (item.type === 'path') {
        drawPath(context, item);
      } else if (item.type === 'text') {
        drawText(context, item);
      } else if (item.type === 'shape') {
        drawShape(context, item);
      }
    });

    // Draw participant cursors
    participants.forEach(participant => {
      if (participant.cursor && participant.id !== 'current-user') {
        drawCursor(context, participant);
      }
    });

    context.restore();
  }, [drawingData, participants, zoom, pan, canvasSize]);

  const drawGrid = (context) => {
    const gridSize = 20;
    context.strokeStyle = '#E2E8F0';
    context.lineWidth = 0.5;
    
    for (let x = 0; x <= canvasSize.width; x += gridSize) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, canvasSize.height);
      context.stroke();
    }
    
    for (let y = 0; y <= canvasSize.height; y += gridSize) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(canvasSize.width, y);
      context.stroke();
    }
  };

  const drawPath = (context, pathData) => {
    if (pathData.points.length < 2) return;
    
    context.strokeStyle = pathData.color;
    context.lineWidth = pathData.thickness;
    context.beginPath();
    context.moveTo(pathData.points[0].x, pathData.points[0].y);
    
    pathData.points.forEach(point => {
      context.lineTo(point.x, point.y);
    });
    
    context.stroke();
  };

  const drawText = (context, textData) => {
    context.fillStyle = textData.color;
    context.font = `${textData.fontSize}px Inter`;
    context.fillText(textData.text, textData.x, textData.y);
  };

  const drawShape = (context, shapeData) => {
    context.strokeStyle = shapeData.color;
    context.lineWidth = shapeData.thickness;
    
    if (shapeData.shape === 'rectangle') {
      context.strokeRect(shapeData.x, shapeData.y, shapeData.width, shapeData.height);
    } else if (shapeData.shape === 'circle') {
      context.beginPath();
      context.arc(shapeData.x, shapeData.y, shapeData.radius, 0, 2 * Math.PI);
      context.stroke();
    }
  };

  const drawCursor = (context, participant) => {
    const { cursor, color, name } = participant;
    
    // Draw cursor pointer
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(cursor.x, cursor.y);
    context.lineTo(cursor.x + 12, cursor.y + 4);
    context.lineTo(cursor.x + 4, cursor.y + 12);
    context.closePath();
    context.fill();
    
    // Draw name label
    context.fillStyle = '#FFFFFF';
    context.fillRect(cursor.x + 15, cursor.y - 5, name.length * 8 + 10, 20);
    context.fillStyle = color;
    context.font = '12px Inter';
    context.fillText(name, cursor.x + 20, cursor.y + 8);
  };

  // Get mouse/touch position relative to canvas
  const getCanvasPosition = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0]?.clientY) || 0;
    
    return {
      x: (clientX - rect.left - pan.x) / zoom,
      y: (clientY - rect.top - pan.y) / zoom
    };
  };

  // Mouse/Touch event handlers
  const startDrawing = (e) => {
    e.preventDefault();
    const position = getCanvasPosition(e);
    
    if (currentTool === 'pan') {
      setIsPanning(true);
      setLastPosition(position);
      return;
    }
    
    setIsDrawing(true);
    setLastPosition(position);
    
    if (currentTool === 'pen' || currentTool === 'eraser') {
      const newPath = {
        id: Date.now(),
        type: 'path',
        points: [position],
        color: isErasing ? '#FFFFFF' : currentColor,
        thickness: currentThickness,
        userId: 'current-user'
      };
      
      setDrawingData(prev => [...prev, newPath]);
    }
  };

  const draw = (e) => {
    e.preventDefault();
    const position = getCanvasPosition(e);
    
    if (isPanning) {
      const deltaX = position.x - lastPosition.x;
      const deltaY = position.y - lastPosition.y;
      setPan(prev => ({
        x: prev.x + deltaX * zoom,
        y: prev.y + deltaY * zoom
      }));
      return;
    }
    
    if (!isDrawing) return;
    
    if (currentTool === 'pen' || currentTool === 'eraser') {
      setDrawingData(prev => {
        const newData = [...prev];
        const currentPath = newData[newData.length - 1];
        if (currentPath && currentPath.userId === 'current-user') {
          currentPath.points.push(position);
        }
        return newData;
      });
    }
    
    setLastPosition(position);
  };

  const stopDrawing = (e) => {
    e.preventDefault();
    setIsDrawing(false);
    setIsPanning(false);
    
    // Simulate real-time update to other participants
    if (onCanvasUpdate) {
      onCanvasUpdate(drawingData);
    }
  };

  // Zoom handlers
  const handleZoom = (delta, centerX, centerY) => {
    const zoomFactor = delta > 0 ? 1.1 : 0.9;
    const newZoom = Math.max(0.1, Math.min(5, zoom * zoomFactor));
    
    // Zoom towards the center point
    const zoomPoint = {
      x: (centerX - pan.x) / zoom,
      y: (centerY - pan.y) / zoom
    };
    
    setPan(prev => ({
      x: centerX - zoomPoint.x * newZoom,
      y: centerY - zoomPoint.y * newZoom
    }));
    
    setZoom(newZoom);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    const centerX = e.clientX - rect.left;
    const centerY = e.clientY - rect.top;
    handleZoom(-e.deltaY, centerX, centerY);
  };

  // Touch gesture handlers
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      // Pinch gesture start
      e.preventDefault();
      return;
    }
    startDrawing(e);
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      // Handle pinch zoom
      e.preventDefault();
      return;
    }
    draw(e);
  };

  // Redraw when data changes
  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  // Clear canvas
  const clearCanvas = () => {
    setDrawingData([]);
  };

  // Undo last action
  const undoLastAction = () => {
    setDrawingData(prev => prev.slice(0, -1));
  };

  return (
    <div className="relative w-full h-full bg-white overflow-hidden">
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 cursor-crosshair touch-none"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={stopDrawing}
        onWheel={handleWheel}
        style={{
          cursor: currentTool === 'pan' ? 'grab' : 
                 currentTool === 'eraser' ? 'crosshair' : 'crosshair'
        }}
      />

      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col space-y-2 bg-card rounded-lg shadow-elevation-2 p-2">
        <button
          onClick={() => handleZoom(1, canvasSize.width / 2, canvasSize.height / 2)}
          className="w-8 h-8 flex items-center justify-center bg-muted hover:bg-muted/80 rounded-md transition-colors"
        >
          <Icon name="Plus" size={16} />
        </button>
        <div className="text-xs text-center text-muted-foreground px-1">
          {Math.round(zoom * 100)}%
        </div>
        <button
          onClick={() => handleZoom(-1, canvasSize.width / 2, canvasSize.height / 2)}
          className="w-8 h-8 flex items-center justify-center bg-muted hover:bg-muted/80 rounded-md transition-colors"
        >
          <Icon name="Minus" size={16} />
        </button>
        <button
          onClick={() => {
            setZoom(1);
            setPan({ x: 0, y: 0 });
          }}
          className="w-8 h-8 flex items-center justify-center bg-muted hover:bg-muted/80 rounded-md transition-colors"
        >
          <Icon name="Home" size={16} />
        </button>
      </div>

      {/* Recording Indicator */}
      {isRecording && (
        <div className="absolute top-4 left-4 flex items-center space-x-2 bg-error/10 text-error px-3 py-2 rounded-lg">
          <div className="w-2 h-2 bg-error rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">Recording</span>
        </div>
      )}

      {/* Canvas Info */}
      <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm text-muted-foreground">
        {drawingData.length} objects
      </div>
    </div>
  );
};

export default DrawingCanvas;