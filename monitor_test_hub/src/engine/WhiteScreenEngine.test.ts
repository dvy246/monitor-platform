import { describe, it, expect } from 'vitest';
import { WhiteScreenEngine } from './WhiteScreenEngine';

describe('WhiteScreenEngine Unit & Math Test Suite', () => {
  it('converts 6500K D65 temperature to approximately white RGB hex', () => {
    const rgb = WhiteScreenEngine.kelvinToRgb(6500);
    const hex = WhiteScreenEngine.rgbToHex(rgb);
    
    expect(rgb.r).toBeGreaterThanOrEqual(250);
    expect(rgb.g).toBeGreaterThanOrEqual(245);
    expect(rgb.b).toBeGreaterThanOrEqual(245);
    expect(hex).toMatch(/^#[0-9a-fA-F]{6}$/);
  });

  it('converts 2700K warm soft light temperature to tungsten warm RGB', () => {
    const rgb = WhiteScreenEngine.kelvinToRgb(2700);
    expect(rgb.r).toBe(255);
    expect(rgb.g).toBeLessThan(200);
    expect(rgb.b).toBeLessThan(150);
  });

  it('generates all 5 standard temperature presets with valid metadata', () => {
    const presets = WhiteScreenEngine.getTemperaturePresets();
    expect(presets.length).toBe(5);
    expect(presets[0].kelvin).toBe(2700);
    expect(presets[4].kelvin).toBe(6500);
    expect(presets[4].hex).toMatch(/^#[0-9a-fA-F]{6}$/);
  });

  it('sanitizes grid overlay parameters within valid pixel/opacity bounds', () => {
    const overlay = WhiteScreenEngine.calculateDustGridOverlay(150, 0.9);
    expect(overlay.cellSizePx).toBe(100); // Max clamped to 100
    expect(overlay.opacity).toBe(0.5); // Max clamped to 0.5
  });
});
