import { Range, Measurement, Bound } from './types';

/**
 * Core class for visualizing ranges and measurements.
 * Handles the data model and calculations for the visualization.
 */
export class RangeVisualizer {
  private ranges: Range[] = [];
  private measurements: Measurement[] = [];
  private readonly MARGIN_PERCENT = 10;  // Margin for unbounded segments

  constructor() {}

  /**
   * Adds a range to the visualization.
   * Ranges are automatically sorted by their minimum bounds.
   * @param range The range to add, containing bounds, name, and color
   */
  public addRange(range: Range): void {
    this.ranges.push(range);
    this.ranges.sort((a, b) => 
      (a.bounds[0]?.min ?? -Infinity) - (b.bounds[0]?.min ?? -Infinity)
    );
  }

  /**
   * Adds a measurement point to the visualization.
   * Measurements are automatically sorted by time.
   * @param measurement The measurement to add, containing time and value
   */
  public addMeasurement(measurement: Measurement): void {
    this.measurements.push(measurement);
    this.measurements.sort((a, b) => 
      new Date(a.time).getTime() - new Date(b.time).getTime()
    );
  }

  /**
   * Gets all measurements, sorted by time.
   * @returns Array of measurements
   */
  public getMeasurements(): Measurement[] {
    return [...this.measurements].sort((a, b) => 
      new Date(a.time).getTime() - new Date(b.time).getTime()
    );
  }

  /**
   * Calculates the visualization range based on measurements and range bounds.
   * Adds margins for better visual presentation.
   * @returns Object containing min and max values for the visualization
   */
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
    }

    // Only add margins if min is greater than zero
    if (min > 0) {
      const range = max - min;
      min = min - (range * this.MARGIN_PERCENT / 100);
    }
    // Always add margin to max
    const range = max - min;
    max = max + (range * this.MARGIN_PERCENT / 100);

    return { min, max };
  }

  /**
   * Detects and logs any overlapping segments in the visualization.
   * @param segments Array of segments to check for overlaps
   */
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

  /**
   * Gets all segments with their positions calculated as percentages.
   * @returns Array of segments with start/end positions, colors, and names
   */
  public getSegments(): Array<{start: number, end: number, color: string, name: string}> {
    const { min, max } = this.getVisualizationRange();
    const totalWidth = max - min;
    const segments: Array<{start: number, end: number, color: string, name: string}> = [];

    this.ranges.forEach(range => {
        range.bounds.forEach(bound => {
            const start = bound.min === 0 ? 0 : Math.max(0, ((bound.min ?? min) - min) / totalWidth * 100);
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

    this.detectOverlaps(segments);
    return segments.sort((a, b) => a.start - b.start);
  }

  /**
   * Calculates the position of a value as a percentage within the visualization range.
   * @param value The value to position
   * @returns Position as a percentage (0-100)
   */
  public getIndicatorPosition(value: number): number {
    const { min, max } = this.getVisualizationRange();
    return ((value - min) / (max - min)) * 100;
  }

  /**
   * Finds the range that contains a given value.
   * @param value The value to check
   * @returns The matching range or undefined if no range contains the value
   */
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