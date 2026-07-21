/**
 * Multi-Display BroadcastChannel Sync Engine
 * Enables zero-latency synchronization of display test patterns, color cycles,
 * VRR sweeps, and fullscreen states across multi-monitor setups.
 */

export interface SyncMessagePayload {
  type: 'COLOR_CHANGE' | 'PATTERN_CHANGE' | 'FULLSCREEN_TOGGLE' | 'PING_SYNC';
  colorHex?: string;
  patternId?: string;
  fullscreenState?: boolean;
  timestamp: number;
  senderId: string;
}

export class MultiDisplaySync {
  private channel: BroadcastChannel | null = null;
  private isSupported = typeof BroadcastChannel !== 'undefined';
  private senderId: string;
  private listeners: Array<(payload: SyncMessagePayload) => void> = [];

  constructor(channelName = 'monitortesthub_sync_bus') {
    this.senderId = typeof window !== 'undefined' ? (window.name || `display-${Math.floor(Math.random() * 10000)}`) : 'node';
    if (this.isSupported) {
      try {
        this.channel = new BroadcastChannel(channelName);
        this.channel.onmessage = (event: MessageEvent<SyncMessagePayload>) => {
          if (event.data && event.data.senderId !== this.senderId) {
            this.listeners.forEach(listener => listener(event.data));
          }
        };
      } catch {
        this.channel = null;
      }
    }
  }

  /**
   * Broadcasts a color change event to all connected secondary monitor windows
   */
  public broadcastColor(colorHex: string): void {
    this.postMessage({
      type: 'COLOR_CHANGE',
      colorHex,
      timestamp: performance.now(),
      senderId: this.senderId
    });
  }

  /**
   * Broadcasts pattern change event
   */
  public broadcastPattern(patternId: string): void {
    this.postMessage({
      type: 'PATTERN_CHANGE',
      patternId,
      timestamp: performance.now(),
      senderId: this.senderId
    });
  }

  /**
   * Broadcasts fullscreen state toggle
   */
  public broadcastFullscreen(fullscreenState: boolean): void {
    this.postMessage({
      type: 'FULLSCREEN_TOGGLE',
      fullscreenState,
      timestamp: performance.now(),
      senderId: this.senderId
    });
  }

  private postMessage(payload: SyncMessagePayload): void {
    if (this.channel) {
      try {
        this.channel.postMessage(payload);
      } catch {
        // Fallback or handle closed channel
      }
    }
  }

  /**
   * Listens for sync payloads from peer monitor windows
   */
  public onSyncMessage(handler: (payload: SyncMessagePayload) => void): void {
    this.listeners.push(handler);
  }

  public close(): void {
    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }
    this.listeners = [];
  }
}
