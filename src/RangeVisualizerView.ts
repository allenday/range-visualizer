import { Measurement } from './types';
import { defaultStyles } from './styles';

interface ViewOptions {
  classNames?: {
    container?: string;
    bar?: string;
    indicator?: string;
    label?: string;
    value?: string;
    measurements?: string;
  };
  barWidth?: number | string;
  barHeight?: number;
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
}

export class RangeVisualizerView {
  private container: HTMLElement;
  private bar: HTMLElement;
  private indicatorsContainer: HTMLElement;
  private measurementsList: HTMLElement;
  private options: ViewOptions;
  private classNames: typeof defaultStyles;

  constructor(containerId: string, options: ViewOptions = {}) {
    this.options = {
      barWidth: 500,
      barHeight: 30,
      barBorderRadius: 15,
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
      showMeasurementsList: true,
      fontSize: 12,
      fontFamily: 'inherit',
      
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

  private initializeElements(): void {
    this.bar.className = this.classNames.bar;
    this.indicatorsContainer.className = this.classNames.indicator;
    this.bar.appendChild(this.indicatorsContainer);
    this.measurementsList.className = this.classNames.measurements;
    
    this.container.appendChild(this.bar);
    if (this.options.showMeasurementsList) {
      this.container.appendChild(this.measurementsList);
    }
  }

  public setGradient(gradient: string): void {
    this.bar.style.background = gradient;
  }

  public setIndicators(measurements: Measurement[], positions: number[], ranges: (string | undefined)[]): void {
    this.indicatorsContainer.innerHTML = '';
    
    measurements.forEach((measurement, index) => {
      const indicator = document.createElement('div');
      indicator.className = this.classNames.indicator;
      indicator.style.left = `${positions[index]}%`;
      
      if (this.options.showDateLabels) {
        const label = document.createElement('div');
        label.className = this.classNames.label;
        label.textContent = new Date(measurement.time).toLocaleDateString();
        indicator.appendChild(label);
      }
      
      if (this.options.showValueLabels || this.options.showRangeLabels) {
        const value = document.createElement('div');
        value.className = this.classNames.value;
        const valueParts = [];
        if (this.options.showValueLabels) valueParts.push(measurement.value);
        if (this.options.showRangeLabels && ranges[index]) valueParts.push(`(${ranges[index]})`);
        value.textContent = valueParts.join(' ');
        indicator.appendChild(value);
      }
      
      this.indicatorsContainer.appendChild(indicator);
    });
  }

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

  public addStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
      .${this.classNames.bar} {
        width: ${this.options.barWidth}${typeof this.options.barWidth === 'number' ? 'px' : ''};
        height: ${this.options.barHeight}px;
      }
      
      .${this.classNames.indicator} {
        width: ${this.options.indicatorWidth}px;
        height: ${this.options.indicatorHeight}px;
        background: ${this.options.indicatorColor};
        position: absolute;
        top: ${this.options.indicatorOffset}px;
        transform: translateX(-50%);
        z-index: 2;
      }
      
      .${this.classNames.label} {
        position: absolute;
        top: -25px;
        left: 50%;
        transform: translateX(-50%) rotate(${this.options.dateAngle}deg);
        white-space: nowrap;
        font-size: ${this.options.fontSize}px;
        font-family: ${this.options.fontFamily};
      }
      
      .${this.classNames.value} {
        position: absolute;
        bottom: -20px;
        left: 50%;
        transform: translateX(-50%);
        white-space: nowrap;
        font-size: ${this.options.fontSize}px;
        font-family: ${this.options.fontFamily};
      }
      
      .${this.classNames.measurements} {
        margin-top: 40px;
        font-family: ${this.options.fontFamily};
      }
      
      .${this.classNames.measurements} ul {
        list-style: none;
        padding: 0;
      }
      
      .${this.classNames.measurements} li {
        margin: 5px 0;
        font-size: ${this.options.fontSize}px;
      }
    `;
    document.head.appendChild(style);
  }
} 