export interface Bound {
  min?: number;
  max?: number;
}

export interface Range {
  name: string;
  bounds: Bound[];
  color: string;
}

export interface Measurement {
  time: string;  // ISO date string
  value: number;
}

export interface RangeVisualizerOptions {
  width?: number;
  height?: number;
  // Add other visualization options here
} 