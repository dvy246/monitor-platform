import type { APIRoute } from 'astro';
import { HardwarePassportEngine } from '../../../engine/HardwarePassportEngine';

export function getStaticPaths() {
  return [
    { params: { hash: 'a4f8b92c103e57f1' } },
    { params: { hash: 'f7e1039a482b611c' } },
    { params: { hash: 'c9b4e18d720a3541' } },
    { params: { hash: 'd382f1056c9a721e' } },
    { params: { hash: 'e5190b432a18f77d' } }
  ];
}

export const GET: APIRoute = ({ params }) => {
  const hash = params.hash || 'a4f8b92c103e57f1';
  const svg = HardwarePassportEngine.generateBadgeSvg({
    timestamp: new Date().toISOString(),
    resolution: '3840x2160',
    devicePixelRatio: 2,
    colorDepth: 30,
    vsyncFps: 240,
    touchSupport: true,
    maxTouchPoints: 10,
    subpixelLayout: 'RGB Stripe',
    oledRiskCategory: 'MINIMAL',
    vrrRange: '48Hz - 240Hz',
    hdrSupport: 'HDR10',
    healthScore: 98,
    signatureHash: hash
  });

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  });
};
