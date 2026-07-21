export class WorkerBridge {
  private worker: Worker | null = null;

  public initOffscreen(canvas: HTMLCanvasElement, workerPath: string, payload: Record<string, unknown>): boolean {
    if (canvas && typeof canvas.transferControlToOffscreen === 'function') {
      const offscreen = canvas.transferControlToOffscreen();
      this.worker = new Worker(workerPath, { type: 'module' });
      this.worker.postMessage({ type: 'INIT', canvas: offscreen, ...payload }, [offscreen]);
      return true;
    }
    return false; // Fallback to main thread execution
  }

  public sendUpdate(data: Record<string, unknown>): void {
    this.worker?.postMessage({ type: 'UPDATE', ...data });
  }

  public terminate(): void {
    this.worker?.terminate();
    this.worker = null;
  }
}
