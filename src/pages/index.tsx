import Frame from "@/components/Frame";
import { useKnobValue, useRandomKnob, useSliderKnob } from "@/components/Knobs";
import { PageColors, Pages, usePageSize } from "@/components/Paper";
import { PenColors } from "@/constants";

export default function Home() {
  const pageColor = useKnobValue<PageColors>("Page Color");
  const pageType = useKnobValue<Pages>("Page Type");
  const penColor = useKnobValue<PenColors>("Pen Color");
  const penSize = useKnobValue<number>("Pen Size");

  const numberOfLines = useSliderKnob({
    name: "Lines",
    initialValue: 10,
    min: 1,
    max: 10000,
  });

  const { pageHeight, pageWidth } = usePageSize(pageType);
  const random = useRandomKnob("lines");

  return (
    <Frame>
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
    </Frame>
  );
}
