import { describe, it, expect } from 'vitest';
import { DeviceDatabase } from './DeviceDatabase';

describe('DeviceDatabase Engine Unit Test Suite', () => {
  it('retrieves all slugs for Astro getStaticPaths()', () => {
    const slugs = DeviceDatabase.getAllSlugs();
    expect(slugs.length).toBeGreaterThanOrEqual(8);
    expect(slugs).toContain('macbook-pro');
    expect(slugs).toContain('steam-deck-oled');
    expect(slugs).toContain('alienware-qd-oled');
  });

  it('fetches complete specs for macbook-pro', () => {
    const dev = DeviceDatabase.getDeviceBySlug('macbook-pro');
    expect(dev).toBeDefined();
    expect(dev?.ppi).toBe(254);
    expect(dev?.isoClass).toBe('Class I');
    expect(dev?.brand).toBe('Apple');
  });

  it('returns undefined for non-existent device slug', () => {
    const dev = DeviceDatabase.getDeviceBySlug('unknown-device-123');
    expect(dev).toBeUndefined();
  });
});
