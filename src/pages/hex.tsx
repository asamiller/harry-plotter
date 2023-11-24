import Frame from "@/components/Frame";
import { useFromToKnob, useKnobValue, useSliderKnob } from "@/components/Knobs";
import { PageColors, Pages, usePageSize } from "@/components/Paper";
import { PenColors } from "@/constants";
import { generatePolygonPath } from "../generators/polygon";
import { interpolateNumber } from "../helpers";

export default function Home() {
  const pageColor = useKnobValue<PageColors>("Page Color");
  const pageType = useKnobValue<Pages>("Page Type");
  const penColor = useKnobValue<PenColors>("Pen Color");
  const penSize = useKnobValue<number>("Pen Size");
  const { pageHeight, pageWidth } = usePageSize(pageType);

  const numberOfShapes = useSliderKnob({
    name: "Shapes",
    initialValue: 50,
    min: 1,
    max: 10000,
  });

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

  const [cornerRadiusFrom, cornerRadiusTo] = useFromToKnob({
    name: "Corner Radius",
    min: 0,
    max: 1000,
  });

  const [sizeFrom, sizeTo] = useFromToKnob({
    name: "Size",
    min: 1,
    max: 1200,
    fromInitialValue: 1,
    toInitialValue: 1000,
  });

  const [rotationFrom, rotationTo] = useFromToKnob({
    name: "Rotation",
    min: -360 * 3,
    max: 360 * 3,
    fromInitialValue: 0,
    toInitialValue: 0,
    steps: 10,
  });

  const sizeInterpolation = interpolateNumber(sizeFrom, sizeTo);
  const rotationInterpolation = interpolateNumber(rotationFrom, rotationTo);
  const cornerRadiusInterpolation = interpolateNumber(
    cornerRadiusFrom,
    cornerRadiusTo
  );

  return (
    <Frame>
      {[...Array(numberOfShapes)].map((_, index) => (
        <path
          d={generatePolygonPath({
            centerX: startX,
            centerY: startY,
            radius: sizeInterpolation(index / numberOfShapes),
            sides: 6,
            rotation: rotationInterpolation(index / numberOfShapes),
            cornerRadius: cornerRadiusInterpolation(index / numberOfShapes),
          })}
          stroke={penColor}
          strokeWidth={penSize}
          strokeLinecap="round"
          fill="none"
          key={index}
        />
      ))}

      {/* 
        <path
          d={generateSquirclePath({
            x: startX - sizeFrom / 2,
            y: startY - sizeFrom / 2,
            width: sizeFrom,
            height: sizeFrom,
            cornerRadius: sizeFrom * radius,
          })}
          stroke={penColor}
          strokeWidth={penSize}
          strokeLinecap="round"
          fill="none"
        /> */}
    </Frame>
  );
}
