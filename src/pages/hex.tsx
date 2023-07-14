import Frame from "@/components/Frame";
import { useKnobValue, useSliderKnob } from "@/components/Knobs";
import { Page, PageColors, Pages, usePageSize } from "@/components/Paper";
import { PenColors } from "@/constants";
import { generatePolygonPath } from "../generators/polygon";
import { generateSquirclePath } from "../generators/squircle";

export default function Home() {
  const pageColor = useKnobValue<PageColors>("Page Color");
  const pageType = useKnobValue<Pages>("Page Type");
  const penColor = useKnobValue<PenColors>("Pen Color");
  const penSize = useKnobValue<number>("Pen Size");

  const size = useSliderKnob({
    name: "Size",
    initialValue: 100,
    min: 1,
    max: 1000,
  });

  const radius = useSliderKnob({
    name: "Radius",
    initialValue: 0.5,
    min: 0,
    max: 1,
    steps: 0.01,
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

  const cornerRadius = useSliderKnob({
    name: "Corner Radius",
    initialValue: 0,
    min: 0,
    max: 100,
  });

  const rotation = useSliderKnob({
    name: "Rotation",
    initialValue: 0,
    min: 0,
    max: 360,
  });

  return (
    <Frame>
      <svg
        height={pageHeight}
        width={pageWidth}
        viewBox={`0 0 ${pageWidth} ${pageHeight}`}
        id="sketch"
      >
        <Page pageType={pageType} pageColor={pageColor} />

        <path
          d={generatePolygonPath({
            centerX: startX,
            centerY: startY,
            radius: size,
            sides: 6,
            rotation,
            cornerRadius,
          })}
          stroke={penColor}
          strokeWidth={penSize}
          strokeLinecap="round"
          fill="none"
        />

        <path
          d={generateSquirclePath({
            x: startX - size / 2,
            y: startY - size / 2,
            width: size,
            height: size,
            cornerRadius: size * radius,
          })}
          stroke={penColor}
          strokeWidth={penSize}
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </Frame>
  );
}
