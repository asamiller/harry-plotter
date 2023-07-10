import { FC } from "react";
import { PenColors } from "../constants";
import { useRandomKnob, useSelectKnob, useSliderKnob } from "./Knobs";
import { Page, PageColors, Pages, usePageSize } from "./Paper";

export const Sketch: FC = () => {
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

  const numberOfLines = useSliderKnob({
    name: "Lines",
    initialValue: 10,
    min: 1,
    max: 10000,
  });

  const { pageHeight, pageWidth } = usePageSize(pageType);
  const random = useRandomKnob("lines");

  return (
    <svg
      height={pageHeight}
      width={pageWidth}
      viewBox={`0 0 ${pageWidth} ${pageHeight}`}
      id="sketch"
    >
      <Page pageType={pageType} pageColor={pageColor} />

      {[...Array(numberOfLines)].map((_, i) => {
        return (
          <line
            x1={random() * pageWidth}
            y1={random() * pageHeight}
            x2={random() * pageWidth}
            y2={random() * pageHeight}
            stroke={penColor}
            strokeWidth={penSize}
            strokeLinecap="round"
            key={i}
          />
        );
      })}
    </svg>
  );
};

export default Sketch;
