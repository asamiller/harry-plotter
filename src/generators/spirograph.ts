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
  let [circle1, circle2] = circles;
  let path = `M ${centerX + circle1.radius + circle2.radius}, ${centerY}`;
  let x = 0;
  let y = 0;

  for (let theta = 0; theta <= overallLength; theta += 0.01) {
    x =
      centerX +
      circle1.radius * Math.cos(theta) +
      circle2.radius * Math.cos(theta * (circle2.ratio ?? 1));
    y =
      centerY +
      circle1.radius * Math.sin(theta) +
      circle2.radius * Math.sin(theta * (circle2.ratio ?? 1));
    path += ` L ${x}, ${y}`;
  }

  return path;
}
