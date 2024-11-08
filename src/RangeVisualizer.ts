import { Range, Measurement, Bound } from './types';

export class RangeVisualizer {
  private ranges: Range[] = [];
  private measurements: Measurement[] = [];
  private readonly MARGIN_PERCENT = 10;  // Margin for unbounded segments

  constructor() {}

  public addRange(range: Range): void {
    this.ranges.push(range);
    this.ranges.sort((a, b) => 
      (a.bounds[0]?.min ?? -Infinity) - (b.bounds[0]?.min ?? -Infinity)
    );
  }

  public addMeasurement(measurement: Measurement): void {
    this.measurements.push(measurement);
    this.measurements.sort((a, b) => 
      new Date(a.time).getTime() - new Date(b.time).getTime()
    );
  }

  public getMeasurements(): Measurement[] {
    return [...this.measurements].sort((a, b) => 
      new Date(a.time).getTime() - new Date(b.time).getTime()
    );
  }

  private getVisualizationRange(): { min: number; max: number } {
    // Get all measurements values
    const values = this.measurements.map(m => m.value);
    
    // Get all explicit bounds (including partial bounds)
    const allBounds = this.ranges.flatMap(r => r.bounds);
    const definedMins = allBounds.filter(b => b.min !== undefined).map(b => b.min!);
    const definedMaxs = allBounds.filter(b => b.max !== undefined).map(b => b.max!);
    
    let min: number;
    let max: number;

    if (values.length === 0) {
      // No measurements - use defined bounds
      min = Math.min(...definedMins);
      max = Math.max(...definedMaxs);
    } else {
      // Include measurements in range calculation
      const dataMin = Math.min(...values);
      const dataMax = Math.max(...values);
      
      // Use the most restrictive range that includes all measurements
      min = Math.min(dataMin, ...definedMins);
      max = Math.max(dataMax, ...definedMaxs);
      
      // Add margins
      const range = max - min;
      min = min - (range * this.MARGIN_PERCENT / 100);
      max = max + (range * this.MARGIN_PERCENT / 100);
    }

    return { min, max };
  }

  private detectOverlaps(segments: { start: number; end: number; color: string; name: string; }[]): void {
    segments.sort((a, b) => a.start - b.start);
    
    for (let i = 0; i < segments.length - 1; i++) {
      const current = segments[i];
      const next = segments[i + 1];
      
      if (current.end > next.start) {
        console.error(`Range overlap detected: "${current.name}" (${current.start}-${current.end}) overlaps with "${next.name}" (${next.start}-${next.end})`);
      }
    }
  }

  public getBackgroundGradient(): string {
    const { min, max } = this.getVisualizationRange();
    const totalWidth = max - min;
    
    type Segment = { start: number; end: number; color: string; name: string; };
    const segments: Segment[] = [];
    
    this.ranges.forEach(range => {
      range.bounds.forEach(bound => {
        const start = ((bound.min ?? min) - min) / totalWidth * 100;
        const end = bound.max 
          ? ((bound.max - min) / totalWidth * 100)
          : 100;
        segments.push({ 
          start: Math.max(0, start), 
          end: Math.min(100, end), 
          color: range.color,
          name: range.name
        });
      });
    });
    
    // Check for overlaps before generating gradient
    this.detectOverlaps(segments);
    
    segments.sort((a, b) => a.start - b.start);
    
    const gradientStops = segments.map(seg => 
      `${seg.color} ${seg.start}% ${seg.end}%`
    );
    
    return `linear-gradient(90deg, ${gradientStops.join(', ')})`;
  }

  public getIndicatorPosition(value: number): number {
    const { min, max } = this.getVisualizationRange();
    return ((value - min) / (max - min)) * 100;
  }

  public getRangeForValue(value: number): Range | undefined {
    return this.ranges.find(range => 
      range.bounds.some(bound => {
        const aboveMin = bound.min === undefined || value >= bound.min;
        const belowMax = bound.max === undefined || value <= bound.max;
        return aboveMin && belowMax;
      })
    );
  }
} 