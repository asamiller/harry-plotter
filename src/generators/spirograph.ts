interface SpirographCircle {
  radius: number;
  inside: boolean;
  ratio?: number;
}

export function generateSpirographPath(
  circles: SpirographCircle[],
  overallLength: number,
  centerX: number,
  centerY: number
): string {
  let path = `M ${centerX + getTotalRadius()}, ${centerY}`;
  let x = centerX;
  let y = centerY;

  function getTotalRadius(): number {
    let totalRadius = 0;
    for (let i = 0; i < circles.length; i++) {
      const circle = circles[i];
      totalRadius += circle.inside ? -circle.radius : circle.radius;
    }
    return totalRadius;
  }

  for (let theta = 0; theta <= overallLength; theta += 0.1) {
    let cumulativeX = centerX;
    let cumulativeY = centerY;

    for (let i = 0; i < circles.length; i++) {
      const circle = circles[i];
      const ratio = circle.ratio ?? 1;

      const currentX = circle.radius * Math.cos(theta * ratio);
      const currentY = circle.radius * Math.sin(theta * ratio);

      if (circle.inside) {
        cumulativeX -= currentX;
        cumulativeY -= currentY;
      } else {
        cumulativeX += currentX;
        cumulativeY += currentY;
      }
    }

    x = cumulativeX;
    y = cumulativeY;
    path += ` L ${x}, ${y}`;
  }

  return path;
}
