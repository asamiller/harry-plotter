interface SquircleOptions {
  x: number;
  y: number;
  width: number;
  height: number;
  cornerRadius: number;
}

export function generateSquirclePath(options: SquircleOptions): string {
  const { x, y, width, height, cornerRadius } = options;
  const controlPoint = cornerRadius * 0.551915024494;
  const halfWidth = width / 2;
  const halfHeight = height / 2;

  return `
    M${x + halfWidth},${y}
    C${x + halfWidth + controlPoint},${y} ${x + width},${
    y + halfHeight - controlPoint
  } ${x + width},${y + halfHeight}
    L${x + width},${y + height - halfHeight}
    C${x + width},${y + height - halfHeight + controlPoint} ${
    x + halfWidth + controlPoint
  },${y + height} ${x + halfWidth},${y + height}
    L${x + halfWidth},${y + height}
    C${x + halfWidth - controlPoint},${y + height} ${x},${
    y + height - halfHeight + controlPoint
  } ${x},${y + height - halfHeight}
    L${x},${y + halfHeight}
    C${x},${y + halfHeight - controlPoint} ${
    x + halfWidth - controlPoint
  },${y} ${x + halfWidth},${y}
    Z
  `;
}
