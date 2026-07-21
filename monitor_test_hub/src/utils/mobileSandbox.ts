/**
 * Mobile viewports sandboxing and event prevention utility
 */
export function setupTouchSandbox(canvas: HTMLCanvasElement): void {
  const preventDefault = (e: TouchEvent) => {
    // Disable native zooming/scrolling gestures on diagnostic surfaces
    if (e.touches.length > 0) {
      e.preventDefault();
    }
  };

  // Add non-passive event listeners to enable preventDefault
  canvas.addEventListener('touchstart', preventDefault, { passive: false });
  canvas.addEventListener('touchmove', preventDefault, { passive: false });
  canvas.addEventListener('touchend', preventDefault, { passive: false });
  canvas.addEventListener('touchcancel', preventDefault, { passive: false });
}

/**
 * Normalize viewport client pointer positions to Canvas space coordinates
 */
export function getNormalizedCoords(clientX: number, clientY: number, canvas: HTMLCanvasElement) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (clientX - rect.left) * (canvas.width / rect.width),
    y: (clientY - rect.top) * (canvas.height / rect.height)
  };
}
