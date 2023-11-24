import Frame from "@/components/Frame";
import { useKnobValue, useSliderKnob } from "@/components/Knobs";
import { PageColors, Pages, usePageSize } from "@/components/Paper";
import { PenColors } from "@/constants";
import { generateRandomPath } from "../generators/polygon";

export default function Home() {
  const pageColor = useKnobValue<PageColors>("Page Color");
  const pageType = useKnobValue<Pages>("Page Type");
  const penColor = useKnobValue<PenColors>("Pen Color");
  const penSize = useKnobValue<number>("Pen Size");
  const { pageHeight, pageWidth } = usePageSize(pageType);

  const numberOfLines = useSliderKnob({
    name: "Lines",
    initialValue: 50,
    min: 1,
    max: 10000,
  });

  const leftOffset = useSliderKnob({
    name: "Left Offset",
    initialValue: 0,
    min: 0,
    max: pageHeight,
  });

  const rightOffset = useSliderKnob({
    name: "Right Offset",
    initialValue: 0,
    min: 0,
    max: pageHeight,
  });

  const noiseScale = useSliderKnob({
    name: "Scale",
    initialValue: 10,
    min: 0,
    max: 100,
  });

  return (
    <Frame>
      {[...Array(numberOfLines)].map((_, index) => (
        <path
          key={index}
          d={generateRandomPath({
            startPoint: {
              x: 0,
              y: -leftOffset + (index / numberOfLines) * pageHeight,
            },
            endPoint: {
              x: pageWidth,
              y: rightOffset + (index / numberOfLines) * pageHeight,
            },
            pointCount: 100,
            noiseScale: noiseScale,
            seed: index,
          })}
          // <line
          //   key={index}
          //   x1={0}
          //   y1={}
          //   x2={pageWidth}
          //   y2={rightOffset + (index / numberOfLines) * pageHeight}
          stroke={penColor}
          strokeWidth={penSize}
          strokeLinecap="round"
          fill="none"
        />
      ))}
    </Frame>
  );
}
