import Frame from "@/components/Frame";
import { useKnobValue, useSliderKnob } from "@/components/Knobs";
import { PageColors, Pages, usePageSize } from "@/components/Paper";
import { PenColors } from "@/constants";

export default function Home() {
  const pageColor = useKnobValue<PageColors>("Page Color");
  const pageType = useKnobValue<Pages>("Page Type");
  const penColor = useKnobValue<PenColors>("Pen Color");
  const penSize = useKnobValue<number>("Pen Size");

  const numOfCircles = useSliderKnob({
    name: "Circles",
    initialValue: 10,
    min: 1,
    max: 1000,
  });

  const expansion = useSliderKnob({
    name: "Expansion",
    initialValue: 1,
    min: 0,
    max: 50,
    steps: 0.1,
  });

  const { pageHeight, pageWidth } = usePageSize(pageType);

  const startX = useSliderKnob({
    name: "Start X",
    initialValue: pageWidth ? pageWidth / 2 : undefined,
    min: 0,
    max: pageWidth,
  });

  const startY = useSliderKnob({
    name: "Start Y",
    initialValue: pageHeight ? pageHeight / 2 : undefined,
    min: 0,
    max: pageHeight,
  });

  const rotationSpeed = useSliderKnob({
    name: "Rotation Speed",
    initialValue: 0.1,
    min: 0,
    max: 1,
    steps: 0.005,
  });

  return (
    <Frame>
      {[...Array(numOfCircles)].map((_, i) => {
        return (
          <circle
            cx={startX + Math.sin(rotationSpeed * i) * i * expansion}
            cy={startY + Math.cos(rotationSpeed * i) * i * expansion}
            r={i * expansion}
            fill="none"
            stroke={penColor}
            strokeWidth={penSize}
            strokeLinecap="round"
            key={i}
          />
        );
      })}
    </Frame>
  );
}
