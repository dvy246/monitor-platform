export interface IGameScore {
  gameId: string;
  gameName: string;
  score: number;
  rating: string;
  timestamp: number;
  telemetry: Record<string, unknown>;
}

export interface IGhostingTelemetry {
  refreshRate: number;
  frameDeltaMs: number;
  targetSpeedPps: number;
  responseTimeMs: number;
  overdriveCoronaIndex: number;
}

export interface IColorMatchTelemetry {
  stagesCompleted: number;
  finalDeltaE: number;
  colorSpace: string;
}

export interface ILatencyTelemetry {
  clicksRecorded: number;
  averageLatencyMs: number;
  estimatedInputLagMs: number;
  pollingRateHz: number;
}

export interface ITouchDefusalTelemetry {
  activeTouches: number;
  gridResolution: string;
  jitterDeltaPx: number;
  digitizerHealthScore: number;
}
