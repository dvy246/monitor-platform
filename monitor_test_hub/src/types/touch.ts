export interface ITouchSample {
  id: number;
  clientX: number;
  clientY: number;
  canvasX: number;
  canvasY: number;
  timestamp: number;
  pressure: number;
}

export interface IVectorDevResult {
  rawPoints: ITouchSample[];
  idealStart: { x: number; y: number };
  idealEnd: { x: number; y: number };
  rmsDeviationPx: number;
  maxDeviationPx: number;
}
