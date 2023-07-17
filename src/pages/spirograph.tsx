import Frame from "@/components/Frame";
import { useKnobValue, useSliderKnob } from "@/components/Knobs";
import { Page, PageColors, Pages, usePageSize } from "@/components/Paper";
import { PenColors } from "@/constants";
import { generateSpirographPath } from "../generators/spirograph";

export default function Home() {
  const pageColor = useKnobValue<PageColors>("Page Color");
  const pageType = useKnobValue<Pages>("Page Type");
  const penColor = useKnobValue<PenColors>("Pen Color");
  const penSize = useKnobValue<number>("Pen Size");
  const { pageHeight, pageWidth } = usePageSize(pageType);

  const length = useSliderKnob({
    name: "Shapes",
    initialValue: 50,
    min: 1,
    max: 10000,
  });

  const ratio = useSliderKnob({
    name: "Ratio",
    initialValue: 2,
    min: 1,
    max: 100,
  });

  const svgPath = generateSpirographPath(
    [
      { radius: 30, inside: true },
      { radius: 50, inside: false, ratio },
    ],
    length,
    pageWidth / 2,
    pageHeight / 2
  );

  console.log("svgPath", svgPath);

  return (
    <Frame>
      <svg
        height={pageHeight}
        width={pageWidth}
        viewBox={`0 0 ${pageWidth} ${pageHeight}`}
        id="sketch"
      >
        <Page pageType={pageType} pageColor={pageColor} />
        <path d={svgPath} stroke={penColor} strokeWidth={penSize} fill="none" />
      </svg>
    </Frame>
  );
}
