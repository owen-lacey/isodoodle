![Isodoodle wordmark spelling ISODOODLE](assets/isodoodle.svg)

**Draw isometric graphics with code.**

[**Try it →**](https://isodoodle.netlify.app)

---

A TypeScript library for creating isometric drawings. Chain simple direction commands and get perfect SVG output every time.

Isodoodle generates clean, minimal SVG markup. No canvas. No WebGL. No runtime.

## Installation

```bash
npm install isodoodle
```

## Quick Start

```typescript
import { isodoodle } from 'isodoodle';

const diamond = isodoodle({ scale: 40, fill: 'teal' })
  .ne(2).se(2).sw(2).nw(2)
  .toSvgString();

document.body.innerHTML = diamond;
```
Gives:

<svg data-iso-scale="40" data-iso-padding="10" data-iso-origin-x="10" data-iso-origin-y="50" xmlns="http://www.w3.org/2000/svg" width="158.56406460551017" height="100" viewBox="0 0 158.56406460551017 100">
  <path d="M 10.00 50.00 L 79.28 10.00 L 148.56 50.00 L 79.28 90.00 L 10.00 50.00" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" fill="teal" />
</svg>

## Isometric grid

The library uses standard coordinates for an isometric grid:
<svg data-iso-scale="20" data-iso-padding="10" data-iso-origin-x="217.84609690826525" data-iso-origin-y="250" xmlns="http://www.w3.org/2000/svg" width="500" height="540" viewBox="0 -10 500 620">
  <path stroke="teal" d="M 217.85 250.00 L 391.05 150.00 L 373.73 140.00 M 391.05 150.00 L 391.05 170.00 M 217.85 250.00 L 217.85 50.00 L 200.53 60.00 M 217.85 50.00 L 235.17 60.00 M 217.85 250.00 L 44.64 150.00 L 61.96 140.00 M 44.64 150.00 L 44.64 170.00 M 217.85 250.00 L 44.64 350.00 L 44.64 330.00 M 44.64 350.00 L 61.96 360.00 M 217.85 250.00 L 217.85 450.00 L 200.53 440.00 M 217.85 450.00 L 235.17 440.00 M 217.85 250.00 L 391.05 350.00 L 391.05 330.00 M 391.05 350.00 L 373.73 360.00" stroke-linecap="round" stroke-linejoin="round" stroke-width="5" fill="none" />
  <text x="217.85" y="20" font-size="32" fill="teal" text-anchor="middle" dominant-baseline="auto">N</text>
  <text x="417.03" y="135" font-size="32" fill="teal" text-anchor="start" dominant-baseline="auto">NE</text>
  <text x="417.03" y="365" font-size="32" fill="teal" text-anchor="start" dominant-baseline="hanging">SE</text>
  <text x="217.85" y="480" font-size="32" fill="teal" text-anchor="middle" dominant-baseline="hanging">S</text>
  <text x="18.66" y="365" font-size="32" fill="teal" text-anchor="end" dominant-baseline="hanging">SW</text>
  <text x="18.66" y="135" font-size="32" fill="teal" text-anchor="end" dominant-baseline="auto">NW</text>
</svg>

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


`moveTo(n, ne, nw)` - Jump to an absolute position without drawing using isometric coordinates: `n` (north), `ne` (northeast), and `nw` (northwest). Values are in grid units and are converted to screen pixels by the library's `scale` option. 

`move(n, ne, nw)` - Move relative to the current position without drawing using isometric coordinates (same coordinate order as `moveTo`).

Both `moveTo` and `move` accept three numeric arguments which are interpreted as counts along the isometric axes rather than direct x/y screen coordinates. For example:
  - `move(1,0,1)` moves 1 unit north and one unit northwest
  - `move(0,2,0)` moves 2 units northeast
  - `move(0,-1,0)` moves 1 unit southwest (the opposite of northeast)

The origin (0,0,0) is where the path was started from.

`path(options?)` - Start new path with optional style overrides

### Output Methods

- `.toSvgString()` - Returns SVG markup string
- `.toElement()` - Returns SVGElement (browser only)
- `.toPathData()` - Returns just the path `d` attribute

## License

MIT
