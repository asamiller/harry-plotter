import { roundCorners } from "svg-round-corners";

interface PolygonParams {
  centerX: number;
  centerY: number;
  radius: number;
  sides: number;
  /** Rotation in degrees. */
  rotation?: number;
  cornerRadius?: number;
}

export function generatePolygonPath(params: PolygonParams): string {
  const {
    centerX,
    centerY,
    radius,
    sides,
    rotation = 0,
    cornerRadius = 0,
  } = params;

  if (sides < 3) {
    throw new Error("A polygon must have at least 3 sides.");
  }

  const pathCommands = ["M"];

  const rotationInRadians = (rotation * Math.PI) / 180;

  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI) / sides - Math.PI / 2 + rotationInRadians;
    const pointX = centerX + radius * Math.cos(angle);
    const pointY = centerY + radius * Math.sin(angle);
    pathCommands.push(`${pointX},${pointY}`);
    if (i !== sides - 1) {
      pathCommands.push("L");
    }
  }

  pathCommands.push("Z");

  const pathString = pathCommands.join(" ");

  if (cornerRadius > 0) {
    return roundCorners(pathString, cornerRadius).path;
  }

  return pathCommands.join(" ");
}
