# Range Visualizer

A flexible TypeScript library for visualizing ranges and measurements with configurable styling. Perfect for displaying health metrics, performance indicators, or any other data that needs to be visualized against defined ranges.

## Features

- Multiple range definitions with custom colors
- Support for overlapping and unbounded ranges
- Multiple measurement points with timestamps
- Fully customizable styling
- Responsive design support
- TypeScript support with full type definitions

## Installation

```bash
npm install range-visualizer
```

## Basic Usage

```typescript
import { RangeVisualizer, RangeVisualizerView } from 'range-visualizer';
import 'range-visualizer/dist/styles.css'; // Optional default styles

// Create visualizer and add ranges
const visualizer = new RangeVisualizer();

// Add ranges with bounds
visualizer.addRange({
    name: "normal",
    bounds: [{ min: 80, max: 120 }],
    color: "green"
});

visualizer.addRange({
    name: "warning",
    bounds: [
        { min: 60, max: 80 },   // Lower warning range
        { min: 120, max: 140 }  // Upper warning range
    ],
    color: "yellow"
});

visualizer.addRange({
    name: "critical",
    bounds: [
        { min: undefined, max: 60 },  // Lower unbounded range
        { min: 140 }                  // Upper unbounded range
    ],
    color: "red"
});

// Add measurements
visualizer.addMeasurement({ time: "2024-01-01", value: 90 });
visualizer.addMeasurement({ time: "2024-01-02", value: 110 });

// Create and configure view
const view = new RangeVisualizerView('container');
view.addStyles();
view.setGradient(visualizer.getBackgroundGradient());


// Display measurements
const measurements = visualizer.getMeasurements();
view.setIndicators(
    measurements,
    measurements.map(m => visualizer.getIndicatorPosition(m.value)),
    measurements.map(m => visualizer.getRangeForValue(m.value)?.name)
);
```

## Styling Options

### Default Styling
Import the default CSS:

```typescript
import 'range-visualizer/dist/styles.css';
```

### Custom Classes
Override with your own CSS classes:

```typescript
const view = new RangeVisualizerView('container', {
    classNames: {
        bar: 'my-custom-bar',
        indicator: 'my-custom-indicator',
        label: 'my-custom-label',
        value: 'my-custom-value',
        measurements: 'my-custom-measurements'
    }
});
```

### Configuration Options

```typescript
interface ViewOptions {
    // Layout
    barWidth?: number | string;  // e.g., 500 or '100%'
    barHeight?: number;
    barBorderRadius?: number;
    
    // Display
    showDateLabels?: boolean;
    showValueLabels?: boolean;
    showRangeLabels?: boolean;
    showMeasurementsList?: boolean;
    
    // Typography
    fontSize?: number;
    fontFamily?: string;
    dateAngle?: number;
    
    // Custom Classes
    classNames?: {
        container?: string;
        bar?: string;
        indicator?: string;
        label?: string;
        value?: string;
        measurements?: string;
    }
}
```

## Range Types

### Bounded Range

```typescript
{
    name: "normal",
    bounds: [{ min: 80, max: 120 }],
    color: "green"
}
```

### Multiple Bounds

```typescript
{
    name: "warning",
    bounds: [
        { min: 60, max: 80 },
        { min: 120, max: 140 }
    ],
    color: "yellow"
}
```

### Unbounded Range

```typescript
{
    name: "critical",
    bounds: [{ min: 140 }], // Unbounded above
    // or
    bounds: [{ max: 60 }],  // Unbounded below
    color: "red"
}
```

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge).

## Development

```bash
# Install dependencies
npm install
# Build
npm run build
# Watch mode
npm run watch
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
