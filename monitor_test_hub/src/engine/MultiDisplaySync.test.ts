import { describe, it, expect, vi } from 'vitest';
import { MultiDisplaySync } from './MultiDisplaySync';

describe('MultiDisplaySync', () => {
  it('instantiates cleanly without throwing in Node/Vitest environment', () => {
    const sync = new MultiDisplaySync();
    expect(sync).toBeDefined();
    sync.close();
  });

  it('safely handles postMessage calls when BroadcastChannel is mocked or unsupported', () => {
    const sync = new MultiDisplaySync('test_bus');
    expect(() => sync.broadcastColor('#ff0000')).not.toThrow();
    expect(() => sync.broadcastPattern('grid-5pct')).not.toThrow();
    expect(() => sync.broadcastFullscreen(true)).not.toThrow();
    sync.close();
  });

  it('attaches onSyncMessage handler safely', () => {
    const sync = new MultiDisplaySync('test_bus_handler');
    const handler = vi.fn();
    sync.onSyncMessage(handler);
    expect(handler).not.toHaveBeenCalled();
    sync.close();
  });
});
