import alea from "alea";
import { createNoise2D } from "simplex-noise";

interface Point {
  x: number;
  y: number;
}

interface PathConfig {
  startPoint: Point;
  endPoint: Point;
  pointCount: number;
  noiseScale: number;
  seed: number;
}

export function generateRandomPath(config: PathConfig): string {
  const { startPoint, endPoint, pointCount, noiseScale, seed } = config;
  const noise2D = createNoise2D(alea(seed));

  const pathPoints: Point[] = [];

  const xDist = endPoint.x - startPoint.x;
  const yDist = endPoint.y - startPoint.y;

  for (let i = 0; i < pointCount; i++) {
    const t = i / (pointCount - 1);

    const x = startPoint.x + t * xDist;
    const y = startPoint.y + t * yDist;

    const noise = noise2D(x, y) * noiseScale;

    pathPoints.push({ x, y: y + noise });
  }

  const pathData = pathPoints
    .map((point, index) => {
      if (index === 0) {
        return `M${point.x},${point.y}`;
      } else {
        return `L${point.x},${point.y}`;
      }
    })
    .join(" ");

  return pathData;
}
