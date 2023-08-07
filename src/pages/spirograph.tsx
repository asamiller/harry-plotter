import Frame from "@/components/Frame";
import { useKnobValue, useSliderKnob } from "@/components/Knobs";
import { PageColors, Pages, usePageSize } from "@/components/Paper";
import { PenColors } from "@/constants";
import { generateSpirographPath } from "../generators/spirograph";

export default function Home() {
  const pageColor = useKnobValue<PageColors>("Page Color");
  const pageType = useKnobValue<Pages>("Page Type");
  const penColor = useKnobValue<PenColors>("Pen Color");
  const penSize = useKnobValue<number>("Pen Size");
  const { pageHeight, pageWidth } = usePageSize(pageType);

  const length = useSliderKnob({
    name: "Length",
    initialValue: 20,
    min: 1,
    max: 1000,
  });

  const c1Radius = useSliderKnob({
    name: "Circle 1 Radius",
    initialValue: 50,
    min: 1,
    max: 1000,
  });

  const c1Ratio = useSliderKnob({
    name: "Circle 1 Ratio",
    initialValue: 1,
    min: 0.01,
    max: 1,
    steps: 0.01,
  });

  const c2Radius = useSliderKnob({
    name: "Circle 2 Radius",
    initialValue: 50,
    min: 1,
    max: 1000,
  });

  const c2Ratio = useSliderKnob({
    name: "Circle 2 Ratio",
    initialValue: 1,
    min: 0.01,
    max: 1,
    steps: 0.01,
  });

  const c3Radius = useSliderKnob({
    name: "Circle 3 Radius",
    initialValue: 50,
    min: 1,
    max: 1000,
  });

  const c3Ratio = useSliderKnob({
    name: "Circle 3 Ratio",
    initialValue: 1,
    min: 0.01,
    max: 1,
    steps: 0.01,
  });

  const scale = useSliderKnob({
    name: "Scale",
    initialValue: 1,
    min: 0.01,
    max: 2,
    steps: 0.01,
  });

  const svgPath = generateSpirographPath(
    [
      { radius: c1Radius * scale, inside: false, ratio: c1Ratio },
      { radius: c2Radius * scale, inside: false, ratio: c2Ratio },
      { radius: c3Radius * scale, inside: false, ratio: c3Ratio },
    ],
    length,
    pageWidth / 2,
    pageHeight / 2
  );

  const rotate = useSliderKnob({
    name: "Rotate",
    initialValue: 0,
    min: 0,
    max: 359,
  });

  return (
    <Frame>
      <g transform={`rotate(${rotate}, ${pageWidth / 2}, ${pageHeight / 2})`}>
        <path d={svgPath} stroke={penColor} strokeWidth={penSize} fill="none" />
      </g>
    </Frame>
  );
}
