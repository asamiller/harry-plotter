import Frame from "@/components/Frame";
import { useKnobValue, useRandomKnob, useSliderKnob } from "@/components/Knobs";
import { Page, PageColors, Pages, usePageSize } from "@/components/Paper";
import { PenColors } from "@/constants";

export default function Home() {
  const pageColor = useKnobValue<PageColors>("Page Color");
  const pageType = useKnobValue<Pages>("Page Type");
  const penColor = useKnobValue<PenColors>("Pen Color");
  const penSize = useKnobValue<number>("Pen Size");

  const largeCircles = useSliderKnob({
    name: "Large #",
    initialValue: 10,
    min: 1,
    max: 100,
  });

  const medCircles = useSliderKnob({
    name: "Med #",
    initialValue: 10,
    min: 1,
    max: 100,
  });

  const smallCircles = useSliderKnob({
    name: "Small #",
    initialValue: 10,
    min: 1,
    max: 100,
  });

  const size = useSliderKnob({
    name: "Sizes",
    initialValue: 1,
    min: 1,
    max: 100,
  });

  const { pageHeight, pageWidth } = usePageSize(pageType);
  const randomPos = useRandomKnob("Circle Position");
  const randomSize = useRandomKnob("Circle Size");

  return (
    <Frame>
      <svg
        height={pageHeight}
        width={pageWidth}
        viewBox={`0 0 ${pageWidth} ${pageHeight}`}
        id="sketch"
      >
        <Page pageType={pageType} pageColor={pageColor} />

        {[...Array(largeCircles)].map((_, i) => {
          return (
            <polygon
              points="175,209.6 131.7,284.6 218.3,284.6 "
              fill={penColor}
              key={i}
            />
          );
        })}
      </svg>
    </Frame>
  );
}
