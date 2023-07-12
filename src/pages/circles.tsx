import Frame from "@/components/Frame";
import {
  useRandomKnob,
  useSelectKnob,
  useSliderKnob,
} from "@/components/Knobs";
import { Page, PageColors, Pages, usePageSize } from "@/components/Paper";
import { PenColors } from "@/constants";

export default function Home() {
  const pageType = useSelectKnob<Pages>({
    name: "Page Type",
    values: Object.values(Pages),
    initialValue: Pages.portrait85x11,
  });

  const pageColor = useSelectKnob<PageColors>({
    name: "Page Color",
    values: Object.values(PageColors),
    initialValue: PageColors.white,
  });

  const penColor = useSelectKnob<PenColors>({
    name: "Pen Color",
    values: Object.values(PenColors),
    initialValue: PenColors.black,
  });

  const penSize = useSliderKnob({
    name: "Pen Size",
    initialValue: 1,
    min: 1,
    max: 10,
  });

  const numberOfCircles = useSliderKnob({
    name: "# Circles",
    initialValue: 10,
    min: 1,
    max: 10000,
  });

  const circleSizeChange = useSliderKnob({
    name: "Size Variance",
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

        {[...Array(numberOfCircles)].map((_, i) => {
          return (
            <circle
              cx={randomPos() * pageWidth}
              cy={randomPos() * pageHeight}
              r={randomSize() * circleSizeChange}
              fill="none"
              stroke={penColor}
              strokeWidth={Math.ceil(randomSize() * penSize)}
              strokeLinecap="round"
              key={i}
            />
          );
        })}
      </svg>
    </Frame>
  );
}
