export function interpolate(
  input: [number, number],
  output: [number, number],
  /** A number between 0 and 1. */
  percent: number
): number {
  // Extract the input values
  const [inputStart, inputEnd] = input;

  // Extract the output values
  const [outputStart, outputEnd] = output;

  // Clamp the percent value between 0 and 1
  const clampedPercent = Math.max(0, Math.min(1, percent));

  // Calculate the interpolated number
  const interpolatedNumber =
    outputStart +
    (outputEnd - outputStart) *
      ((clampedPercent - inputStart) / (inputEnd - inputStart));

  console.log("interpolatedNumber", interpolatedNumber, {
    inputStart,
    inputEnd,
    outputStart,
    outputEnd,
    percent,
  });

  return interpolatedNumber;
}

const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;
const invlerp = (x: number, y: number, a: number) => clamp((a - x) / (y - x));
const clamp = (a: number, min = 0, max = 1) => Math.min(max, Math.max(min, a));
const range = (x1: number, y1: number, x2: number, y2: number, a: number) =>
  lerp(x2, y2, invlerp(x1, y1, a));

export const interpolateNumber = function (a: number, b: number) {
  return (
    (a = +a),
    (b = +b),
    function (t: number) {
      return a * (1 - t) + b * t;
    }
  );
};
