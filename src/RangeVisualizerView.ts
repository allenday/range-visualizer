import { Measurement } from './types';
import { defaultStyles } from './styles';

/**
 * Interface for configuring the visualization view
 */
interface ViewOptions {
  /** Custom class names for styling different elements */
  classNames?: {
    container?: string;
    bar?: string;
    indicator?: string;
    label?: string;
    value?: string;
    measurements?: string;
    boundaryIndicator?: string;
    boundaryValue?: string;
    segmentLabel?: string;
  };
  /** Width of the visualization bar (px or %) */
  barWidth?: number | string;
  /** Height of the visualization bar (px) */
  barHeight?: number;
  /** Border radius of the bar (px) */
  barBorderRadius?: number;
  barBorderWidth?: number;
  barBorderColor?: string;
  
  indicatorWidth?: number;
  indicatorHeight?: number;
  indicatorColor?: string;
  indicatorOffset?: number;
  
  showDateLabels?: boolean;
  dateAngle?: number;
  showValueLabels?: boolean;
  showRangeLabels?: boolean;
  showMeasurementsList?: boolean;
  fontSize?: number;
  fontFamily?: string;
  showBoundaryIndicators?: boolean;
  showSegmentLabels?: boolean;
}

/**
 * View class for rendering the range visualization
 * Handles DOM manipulation and styling
 */
export class RangeVisualizerView {
  private static instanceCount = 0;
  private instanceId: number;
  private container: HTMLElement;
  private bar: HTMLElement;
  private indicatorsContainer: HTMLElement;
  private measurementsList: HTMLElement;
  private options: ViewOptions;
  private classNames: typeof defaultStyles;

  /**
   * Creates a new visualization view
   * @param containerId - ID of the DOM element to render into
   * @param options - Configuration options for the visualization
   */
  constructor(containerId: string, options: ViewOptions = {}) {
    this.instanceId = ++RangeVisualizerView.instanceCount;
    this.options = {
      barWidth: 500,
      barHeight: 30,
      barBorderRadius: 0,
      barBorderWidth: 1,
      barBorderColor: '#ccc',
      
      indicatorWidth: 2,
      indicatorHeight: 40,
      indicatorColor: 'black',
      indicatorOffset: -5,
      
      showDateLabels: true,
      dateAngle: -45,
      showValueLabels: true,
      showRangeLabels: true,
      showMeasurementsList: false,
      fontSize: 12,
      fontFamily: 'inherit',
      showBoundaryIndicators: false,
      showSegmentLabels: false,
      
      ...options
    };

    this.classNames = {
      ...defaultStyles,
      ...options.classNames
    };

    this.container = document.getElementById(containerId) || document.createElement('div');
    this.bar = document.createElement('div');
    this.indicatorsContainer = document.createElement('div');
    this.measurementsList = document.createElement('div');
    this.initializeElements();
  }

  /**
   * Sets up the initial DOM elements and structure
   * @private
   */
  private initializeElements(): void {
    this.bar.className = `${this.classNames.bar} ${this.classNames.bar}-${this.instanceId}`;
    this.indicatorsContainer.className = `${this.classNames.indicatorsContainer} ${this.classNames.indicatorsContainer}-${this.instanceId}`;
    this.measurementsList.className = `${this.classNames.measurements} ${this.classNames.measurements}-${this.instanceId}`;
    
    this.bar.appendChild(this.indicatorsContainer);
    this.container.appendChild(this.bar);
    if (this.options.showMeasurementsList) {
      this.container.appendChild(this.measurementsList);
    }
  }

  /**
   * Renders segments in the visualization
   * @param segments - Array of segment data including position, color, and labels
   */
  public setSegments(segments: Array<{
    start: number,
    end: number,
    color: string,
    name: string,
    className?: string,
    showBoundary?: boolean,
    showLabel?: boolean,
    value?: number
  }>): void {
    // Clear existing segments
    this.bar.querySelectorAll(`.${this.classNames.segment}`).forEach(el => el.remove());
    
    segments.forEach(segment => {
        const segmentElement = document.createElement('div');
        segmentElement.className = `${this.classNames.segment} ${this.classNames.segment}-${this.instanceId}`;
        if (segment.className) {
            segmentElement.classList.add(segment.className);
        }
        segmentElement.style.left = `${segment.start}%`;
        segmentElement.style.width = `${segment.end - segment.start}%`;
        segmentElement.style.background = segment.color;
        segmentElement.dataset.name = segment.name;
        this.bar.appendChild(segmentElement);

        // Handle boundary indicators
        if ((this.options.showBoundaryIndicators || segment.showBoundary) && segment.showBoundary !== false) {
            const indicator = document.createElement('div');
            indicator.className = `${this.classNames.boundaryIndicator} ${this.classNames.boundaryIndicator}-${this.instanceId}`;
            indicator.style.left = `${segment.start}%`;
            
            const valueLabel = document.createElement('div');
            valueLabel.className = `${this.classNames.boundaryValue} ${this.classNames.boundaryValue}-${this.instanceId}`;
            valueLabel.textContent = segment.value?.toString() ?? '';
            indicator.appendChild(valueLabel);
            
            this.bar.appendChild(indicator);
        }

        // Handle segment labels
        if ((this.options.showSegmentLabels || segment.showLabel) && segment.showLabel !== false) {
            const label = document.createElement('div');
            label.className = `${this.classNames.segmentLabel} ${this.classNames.segmentLabel}-${this.instanceId}`;
            label.textContent = segment.name;
            label.style.left = `${segment.start + (segment.end - segment.start)/2}%`;
            this.bar.appendChild(label);
        }
    });
  }

  public setIndicators(measurements: Measurement[], positions: number[], ranges: (string | undefined)[]): void {
    this.indicatorsContainer.innerHTML = '';
    
    measurements.forEach((measurement, index) => {
        const indicator = document.createElement('div');
        indicator.className = `${this.classNames.indicator} ${this.classNames.indicator}-${this.instanceId}`;
        indicator.style.left = `${positions[index]}%`;
        
        const label = document.createElement('div');
        label.className = `${this.classNames.label} ${this.classNames.label}-${this.instanceId}`;
        
        // Simple two-line format
        const date = new Date(measurement.time).toISOString().split('T')[0];
        const value = measurement.value.toString();
        const range = ranges[index] || '';
        label.textContent = `${value}, ${range}\n${date}`;
        
        indicator.appendChild(label);
        this.indicatorsContainer.appendChild(indicator);
    });
  }

  /**
   * Updates the measurements list in the DOM
   * @param measurements Array of measurements to display in the list
   */
  public updateMeasurements(measurements: Measurement[]): void {
    if (!this.options.showMeasurementsList) return;
    
    this.measurementsList.innerHTML = '';
    const list = document.createElement('ul');
    measurements.forEach(m => {
      const item = document.createElement('li');
      item.textContent = `${new Date(m.time).toLocaleDateString()}: ${m.value}`;
      list.appendChild(item);
    });
    this.measurementsList.appendChild(list);
  }

  /**
   * Adds instance-specific styles to the document
   * Creates a style tag with scoped CSS rules for this instance
   */
  public addStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
      .${this.classNames.bar}-${this.instanceId} {
        width: ${this.options.barWidth}${typeof this.options.barWidth === 'number' ? 'px' : ''};
        height: ${this.options.barHeight}px;
        margin: 20px 0;
        border-radius: ${this.options.barBorderRadius}px;
        position: relative;
        border: 1px solid #ccc;
        overflow: visible;
      }
      
      .${this.classNames.indicator}-${this.instanceId} {
        width: 1px;
        height: 10px;
        background: #666;
        position: absolute;
        bottom: -10px;
        transform: translateX(-50%);
        z-index: 2;
      }
      
      .${this.classNames.label}-${this.instanceId} {
        position: absolute;
        bottom: -22px;
        left: 50%;
        transform: translateX(-50%);
        white-space: pre;
        font-size: 10px;
        font-family: ${this.options.fontFamily};
        color: #666;
        text-align: center;
        line-height: 1.2;
      }
      
      .${this.classNames.boundaryIndicator}-${this.instanceId} {
        width: 1px;
        height: 10px;
        background: #666;
        position: absolute;
        top: -10px;
        transform: translateX(-50%);
        z-index: 1;
      }
      
      .${this.classNames.boundaryValue}-${this.instanceId} {
        position: absolute;
        top: -10px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 10px;
        color: #666;
        white-space: nowrap;
      }
      
      .${this.classNames.segmentLabel}-${this.instanceId} {
        position: absolute;
        top: -5px;
        transform: translate(-50%, -100%);
        font-size: 10px;
        color: #666;
        white-space: nowrap;
        text-align: center;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Sets boundary indicators at specified positions
   * @param boundaries Array of boundary positions and their labels
   */
  public setBoundaryIndicators(boundaries: Array<{value: number, label: string}>): void {
    if (!this.options.showBoundaryIndicators) return;
    
    boundaries.forEach(({value, label}) => {
      if (value < 0 || value > 100) return;
      
      const indicator = document.createElement('div');
      indicator.className = `${this.classNames.boundaryIndicator} ${this.classNames.boundaryIndicator}-${this.instanceId}`;
      indicator.style.left = `${Math.max(0, Math.min(100, value))}%`;
      
      const valueLabel = document.createElement('div');
      valueLabel.className = `${this.classNames.boundaryValue} ${this.classNames.boundaryValue}-${this.instanceId}`;
      valueLabel.textContent = label;
      indicator.appendChild(valueLabel);
      
      this.bar.appendChild(indicator);
    });
  }
} 