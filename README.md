# Range Visualizer

A flexible TypeScript library for visualizing ranges and measurements.

## Features
- Segment-based visualization with individual styling
- Measurement indicators with timestamps
- Boundary indicators with labels
- Segment labels
- Instance-specific styling
- Responsive design
- TypeScript support

## Installation

```bash
npm install range-visualizer
```

## Basic Usage

```typescript
import { RangeVisualizer, RangeVisualizerView } from 'range-visualizer';

// Create the visualizer
const visualizer = new RangeVisualizer();

// Add ranges
visualizer.addRange({
  name: "ok",
  bounds: [{ min: 80, max: 120 }],
  color: "blue"
});

// Add measurements
visualizer.addMeasurement({
  time: "2023-01-01",
  value: 66
});

// Create the view
const view = new RangeVisualizerView('container-id');
view.addStyles();
view.setSegments(visualizer.getSegments());

// Add measurement indicators
const measurements = visualizer.getMeasurements();
view.setIndicators(
  measurements,
  measurements.map(m => visualizer.getIndicatorPosition(m.value)),
  measurements.map(m => visualizer.getRangeForValue(m.value)?.name)
);
```

## Styling

Each element has a unique class name for styling:

```css
.range-visualizer__bar { /* Bar styles */ }
.range-visualizer__segment { /* Segment styles */ }
.range-visualizer__indicator { /* Indicator styles */ }
.range-visualizer__label { /* Label styles */ }
```

Instance-specific styling:
```css
/* Target specific instance */
.range-visualizer__bar-1 { /* Styles for first instance */ }

/* Target specific segment */
.range-visualizer__segment[data-name="ok"] { /* Styles for "ok" segments */ }
```

## Configuration Options

```typescript
const view = new RangeVisualizerView('container-id', {
  // Bar options
  barWidth: 500,          // Width in px or %
  barHeight: 30,          // Height in px
  barBorderRadius: 0,     // Border radius in px
  
  // Indicator options
  showDateLabels: true,   // Show date labels
  showValueLabels: true,  // Show value labels
  showRangeLabels: true,  // Show range labels
  
  // Boundary options
  showBoundaryIndicators: false,  // Show boundary markers
  showSegmentLabels: false,       // Show segment labels
  
  // Styling options
  fontSize: 12,
  fontFamily: 'inherit'
});
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

## Examples

See index.html for complete examples including:
- Basic visualization
- Minimal view (no labels)
- Custom styling
- Boundary indicators
- Segment labels
- Alternating indicators
- Rounded corners

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
