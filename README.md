# Isodoodle

A minimal TypeScript library for drawing SVGs on an isometric grid.

## Installation

```bash
npm install isodoodle
```

## Usage

```typescript
import { isodoodle } from 'isodoodle';

// Draw an isometric diamond
const svg = isodoodle({ scale: 20, stroke: '#333' })
  .ne(2).se(2).sw(2).nw(2)
  .toSvgString();

// Insert into DOM
document.body.innerHTML = svg;
```

## API

### Factory Function

```typescript
isodoodle(options?: IsoDoodleOptions): IsoDoodle
```

Creates a new IsoDoodle instance.

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `scale` | number | 20 | Pixels per unit |
| `stroke` | string | '#000' | Stroke color |
| `strokeLinecap` | 'butt' \| 'round' \| 'square' | 'round' | Stroke linecap |
| `strokeLinejoin` | 'miter' \| 'round' \| 'bevel' | 'round' | Stroke linejoin |
| `strokeWidth` | number | 1 | Stroke width |
| `fill` | string | 'none' | Fill color |
| `width` | number | auto | SVG width |
| `height` | number | auto | SVG height |
| `padding` | number | 10 | Padding around drawing |

### Direction Methods

All direction methods accept an optional `distance` parameter (default: 1).

- `.n(distance?)` - Move North (up)
- `.ne(distance?)` - Move Northeast
- `.se(distance?)` - Move Southeast
- `.s(distance?)` - Move South (down)
- `.sw(distance?)` - Move Southwest
- `.nw(distance?)` - Move Northwest

### Path Control

- `.moveTo(x, y)` - Jump to position without drawing (in scaled units)
- `.path(options?)` - Start new path with optional style overrides

### Output Methods

- `.toSvgString()` - Returns SVG markup string
- `.toElement()` - Returns SVGSVGElement (browser only)
- `.toPathData()` - Returns just the path `d` attribute

## Examples

### Isometric Cube

```typescript
const cube = isodoodle({ scale: 30, stroke: '#333' })
  // Top face
  .moveTo(0, 0)
  .ne(2).se(2).sw(2).nw(2)
  // Left face
  .path({ fill: '#ccc' })
  .moveTo(0, 0)
  .nw(2).s(2).se(2).n(2)
  // Right face
  .path({ fill: '#999' })
  .moveTo(0, 0)
  .ne(2).s(2).sw(2).n(2)
  .toSvgString();
```

### Multiple Shapes

```typescript
const shapes = isodoodle({ scale: 20 })
  .ne(1).se(1).sw(1).nw(1)
  .path({ stroke: 'red', strokeLinecap: 'square', strokeLinejoin: 'bevel' })
  .moveTo(3, 0)
  .ne(1).se(1).sw(1).nw(1)
  .toSvgString();
```

### Stroke Linecaps

```typescript
const caps = isodoodle({ scale: 20, strokeLinecap: 'round', strokeLinejoin: 'round' })
  .ne(1).se(1).sw(1).nw(1)
  .path({ strokeLinecap: 'butt', strokeLinejoin: 'miter' })
  .moveTo(3, 0)
  .ne(1).se(1).sw(1).nw(1)
  .toSvgString();
```

## Isometric Geometry

The library uses standard isometric projection where the X and Y axes are at 30° angles from horizontal:

```
       N
       |
  NW   |   NE
    \  |  /
     \ | /
      \|/
-------.-------
      /|\
     / | \
    /  |  \
  SW   |   SE
       |
       S
```

## License

MIT
