import { create } from 'zustand';

let objectIdCounter = 0;

/**
 * Global app state for canvas tools and settings
 */
export const useStore = create((set, get) => ({
  // Current tool selection
  tool: 'draw', // 'draw', 'shape', 'text', 'image', 'select'
  setTool: (tool) => set({ tool }),

  // Drawing settings
  strokeColor: '#000000',
  setStrokeColor: (color) => set({ strokeColor: color }),

  fillColor: '#ffffff',
  setFillColor: (color) => set({ fillColor: color }),

  brushSize: 2,
  setBrushSize: (size) => set({ brushSize: size }),

  // Shape settings
  shapeType: 'rectangle', // 'rectangle', 'circle', 'ellipse', 'polygon'
  setShapeType: (type) => set({ shapeType: type }),

  // Text settings
  fontSize: 24,
  setFontSize: (size) => set({ fontSize: size }),

  fontFamily: 'Arial',
  setFontFamily: (family) => set({ fontFamily: family }),

  // General
  opacity: 1,
  setOpacity: (opacity) => set({ opacity }),

  // Canvas objects (for drawing, shapes, text, images)
  objects: [], // Array of { id, type, points[], x, y, width, height, rotation, fill, stroke, strokeWidth, text, fontSize, fontFamily, image, opacity }
  addObject: (obj) =>
    set((state) => ({
      objects: [...state.objects, { id: objectIdCounter++, ...obj }],
    })),
  updateObject: (id, updates) =>
    set((state) => ({
      objects: state.objects.map((obj) =>
        obj.id === id ? { ...obj, ...updates } : obj
      ),
    })),
  deleteObject: (id) =>
    set((state) => ({
      objects: state.objects.filter((obj) => obj.id !== id),
    })),
  clearObjects: () => set({ objects: [] }),

  // Selection
  selectedObjectId: null,
  setSelectedObjectId: (id) => set({ selectedObjectId: id }),
}));
