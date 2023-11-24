import Frame from "@/components/Frame";
import { useKnobValue, useSliderKnob } from "@/components/Knobs";
import { PageColors, Pages, usePageSize } from "@/components/Paper";
import { PenColors } from "@/constants";

// import perlin from "../perlin";
import { perlinNoise2dFactory } from "../noise/squeaker";

export default function Home() {
  const pageColor = useKnobValue<PageColors>("Page Color");
  const pageType = useKnobValue<Pages>("Page Type");
  const penColor = useKnobValue<PenColors>("Pen Color");
  const penSize = useKnobValue<number>("Pen Size");

  const seed = useSliderKnob({
    name: "Seed",
    initialValue: 1,
    min: 1,
    max: 100,
  });

  const xCount = useSliderKnob({
    name: "Width #",
    initialValue: 10,
    min: 1,
    max: 1000,
  });

  const yCount = useSliderKnob({
    name: "Height #",
    initialValue: 10,
    min: 1,
    max: 1000,
  });

  const size = useSliderKnob({
    name: "Sizes",
    initialValue: 1,
    min: 1,
    max: 100,
  });

  const xSize = useSliderKnob({
    name: "X Size",
    min: 0,
    max: 10,
    steps: 0.1,
  });

  const ySize = useSliderKnob({
    name: "Y Size",
    initialValue: 1,
    min: 0,
    max: 10,
    steps: 0.1,
  });

  // const noise = new perlin(seed);
  const noise = perlinNoise2dFactory({
    seed,
  });

  const { pageHeight, pageWidth } = usePageSize(pageType);

  return (
    <Frame>
      {[...Array(xCount)].map((_, xIndex) => (
        <g key={xIndex}>
          {[...Array(yCount)].map((_, yIndex) => (
            <circle
              cx={pageWidth / xCount / 2 + (pageWidth / xCount) * xIndex}
              cy={pageHeight / yCount / 2 + (pageHeight / yCount) * yIndex}
              r={
                noise((xIndex / xCount) * xSize, (yIndex / yCount) * ySize) *
                (size / 10)
              }
              fill="none"
              stroke={penColor}
              strokeWidth={penSize}
              strokeLinecap="round"
              key={`${xIndex}-${yIndex}`}
            />
          ))}
        </g>
      ))}
    </Frame>
  );
}
