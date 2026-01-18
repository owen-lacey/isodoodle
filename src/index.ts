/**
 * Isodoodle - A minimal library for drawing SVGs on an isometric grid
 */

const SQRT3_2 = Math.sqrt(3) / 2; // ≈ 0.866

/** Unit vectors for each direction in screen coordinates (Y positive downward) */
export const DIRECTIONS = {
  N: { x: 0, y: -1 },
  S: { x: 0, y: 1 },
  NE: { x: SQRT3_2, y: -0.5 },
  SE: { x: SQRT3_2, y: 0.5 },
  SW: { x: -SQRT3_2, y: 0.5 },
  NW: { x: -SQRT3_2, y: -0.5 },
} as const;

export type Direction = keyof typeof DIRECTIONS;

export interface Point {
  x: number;
  y: number;
}

export interface IsoDoodleOptions {
  /** Pixels per unit (default: 20) */
  scale?: number;
  /** Stroke color (default: '#000') */
  stroke?: string;
  /** Stroke width (default: 1) */
  strokeWidth?: number;
  /** Fill color (default: 'none') */
  fill?: string;
  /** SVG width (auto if omitted) */
  width?: number;
  /** SVG height (auto if omitted) */
  height?: number;
  /** Padding around the drawing (default: 10) */
  padding?: number;
}

export interface PathOptions {
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
}

interface PathSegment {
  type: 'M' | 'L' | 'Z';
  x?: number;
  y?: number;
}

interface PathData {
  segments: PathSegment[];
  options: PathOptions;
}

export class IsoDoodle {
  private options: Required<Omit<IsoDoodleOptions, 'width' | 'height'>> & {
    width?: number;
    height?: number;
  };
  private currentX = 0;
  private currentY = 0;
  private paths: PathData[] = [];
  private currentPath: PathData;
  private minX = 0;
  private maxX = 0;
  private minY = 0;
  private maxY = 0;

  constructor(options: IsoDoodleOptions = {}) {
    this.options = {
      scale: options.scale ?? 20,
      stroke: options.stroke ?? '#000',
      strokeWidth: options.strokeWidth ?? 1,
      fill: options.fill ?? 'none',
      padding: options.padding ?? 10,
      width: options.width,
      height: options.height,
    };

    this.currentPath = {
      segments: [],
      options: {
        stroke: this.options.stroke,
        strokeWidth: this.options.strokeWidth,
        fill: this.options.fill,
      },
    };
  }

  private step(direction: Direction, distance: number, draw: boolean): this {
    const dir = DIRECTIONS[direction];
    const dx = dir.x * distance * this.options.scale;
    const dy = dir.y * distance * this.options.scale;

    // Start a new path with M if this is the first segment
    if (this.currentPath.segments.length === 0) {
      this.currentPath.segments.push({ type: 'M', x: this.currentX, y: this.currentY });
    }

    this.currentX += dx;
    this.currentY += dy;

    if (draw) {
      this.currentPath.segments.push({ type: 'L', x: this.currentX, y: this.currentY });
    } else {
      this.currentPath.segments.push({ type: 'M', x: this.currentX, y: this.currentY });
    }

    this.updateBounds();
    return this;
  }

  private updateBounds(): void {
    this.minX = Math.min(this.minX, this.currentX);
    this.maxX = Math.max(this.maxX, this.currentX);
    this.minY = Math.min(this.minY, this.currentY);
    this.maxY = Math.max(this.maxY, this.currentY);
  }

  /** Move North (up) */
  n(distance = 1): this {
    return this.step('N', distance, true);
  }

  /** Move South (down) */
  s(distance = 1): this {
    return this.step('S', distance, true);
  }

  /** Move Northeast */
  ne(distance = 1): this {
    return this.step('NE', distance, true);
  }

  /** Move Southeast */
  se(distance = 1): this {
    return this.step('SE', distance, true);
  }

  /** Move Southwest */
  sw(distance = 1): this {
    return this.step('SW', distance, true);
  }

  /** Move Northwest */
  nw(distance = 1): this {
    return this.step('NW', distance, true);
  }

  /** Jump to absolute position without drawing using isometric coordinates (n, ne, nw) */
  moveTo(n: number, ne: number, nw: number): this {
    // Calculate screen position by combining direction vectors
    // N: (0, -1), NE: (SQRT3_2, -0.5), NW: (-SQRT3_2, -0.5)
    const x = (ne - nw) * SQRT3_2 * this.options.scale;
    const y = (-n - 0.5 * (ne + nw)) * this.options.scale;
    this.currentX = x;
    this.currentY = y;
    this.currentPath.segments.push({ type: 'M', x: this.currentX, y: this.currentY });
    this.updateBounds();
    return this;
  }

  /** Move relative to current position without drawing using isometric coordinates (n, ne, nw) */
  move(n: number, ne: number, nw: number): this {
    // Calculate offset by combining direction vectors
    const dx = (ne - nw) * SQRT3_2 * this.options.scale;
    const dy = (-n - 0.5 * (ne + nw)) * this.options.scale;
    this.currentX += dx;
    this.currentY += dy;
    this.currentPath.segments.push({ type: 'M', x: this.currentX, y: this.currentY });
    this.updateBounds();
    return this;
  }

  /** Close current path */
  close(): this {
    this.currentPath.segments.push({ type: 'Z' });
    return this;
  }

  /** Start a new path with optional style overrides */
  path(options?: PathOptions): this {
    // Save current path if it has content
    if (this.currentPath.segments.length > 0) {
      this.paths.push(this.currentPath);
    }

    this.currentPath = {
      segments: [],
      options: {
        stroke: options?.stroke ?? this.options.stroke,
        strokeWidth: options?.strokeWidth ?? this.options.strokeWidth,
        fill: options?.fill ?? this.options.fill,
      },
    };

    return this;
  }

  private buildPathD(segments: PathSegment[]): string {
    return segments
      .map((seg) => {
        switch (seg.type) {
          case 'M':
            return `M ${seg.x!.toFixed(2)} ${seg.y!.toFixed(2)}`;
          case 'L':
            return `L ${seg.x!.toFixed(2)} ${seg.y!.toFixed(2)}`;
          case 'Z':
            return 'Z';
        }
      })
      .join(' ');
  }

  /** Returns just the path `d` attribute for the current path */
  toPathData(): string {
    return this.buildPathD(this.currentPath.segments);
  }

  /** Returns SVG markup string */
  toSvgString(): string {
    const padding = this.options.padding;
    const width = this.options.width ?? this.maxX - this.minX + padding * 2;
    const height = this.options.height ?? this.maxY - this.minY + padding * 2;

    // Calculate offset to ensure all content is visible
    const offsetX = -this.minX + padding;
    const offsetY = -this.minY + padding;

    // Collect all paths including current
    const allPaths = [...this.paths];
    if (this.currentPath.segments.length > 0) {
      allPaths.push(this.currentPath);
    }

    const pathElements = allPaths
      .map((p) => {
        const d = this.buildPathD(
          p.segments.map((seg) => ({
            ...seg,
            x: seg.x !== undefined ? seg.x + offsetX : undefined,
            y: seg.y !== undefined ? seg.y + offsetY : undefined,
          }))
        );
        return `  <path d="${d}" stroke="${p.options.stroke}" stroke-width="${p.options.strokeWidth}" fill="${p.options.fill}" />`;
      })
      .join('\n');

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
${pathElements}
</svg>`;
  }

  /** Returns SVGSVGElement (browser only) */
  toElement(): SVGSVGElement {
    const parser = new DOMParser();
    const doc = parser.parseFromString(this.toSvgString(), 'image/svg+xml');
    return doc.documentElement as unknown as SVGSVGElement;
  }
}

/** Factory function to create an IsoDoodle instance */
export function isodoodle(options?: IsoDoodleOptions): IsoDoodle {
  return new IsoDoodle(options);
}

export default isodoodle;
