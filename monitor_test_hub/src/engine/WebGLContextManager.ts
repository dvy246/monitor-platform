export interface ContextOptions {
  alpha?: boolean;
  desynchronized?: boolean;
  powerPreference?: 'high-performance' | 'low-power' | 'default';
  preserveDrawingBuffer?: boolean;
}

export class WebGLContextManager {
  public gl: WebGL2RenderingContext | null = null;
  public ctx2d: CanvasRenderingContext2D | null = null;

  constructor(private canvas: HTMLCanvasElement, options: ContextOptions = {}) {
    if (!canvas || typeof canvas.getContext !== 'function') {
      return;
    }

    const defaultOpts: WebGLContextAttributes = {
      alpha: options.alpha ?? false,
      desynchronized: options.desynchronized ?? true,
      powerPreference: options.powerPreference ?? 'high-performance',
      preserveDrawingBuffer: options.preserveDrawingBuffer ?? false
    };
    
    this.gl = canvas.getContext('webgl2', defaultOpts);
    if (!this.gl) {
      console.warn('WebGL 2.0 unavailable. Falling back to Canvas2D desynchronized rendering.');
      this.ctx2d = canvas.getContext('2d', { desynchronized: true }) as CanvasRenderingContext2D;
    }
  }
}
