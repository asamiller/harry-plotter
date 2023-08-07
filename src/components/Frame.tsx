import { FC, useEffect, useState } from "react";
import { useWindowSize } from "usehooks-ts";
import { Knobs, useKnobValue } from "../components/Knobs";
import { Page, PageColors, Pages, usePageSize } from "../components/Paper";

const BACKGROUND_COLORS: {
  [key in PageColors]: string;
} = {
  [PageColors.white]: "black",
  [PageColors.black]: "white",
};

const Frame: FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const pageType = useKnobValue<Pages>("Page Type");
  const pageColor = useKnobValue<PageColors>("Page Color");
  const { pageHeight, pageWidth } = usePageSize(pageType);

  const [isMounted, setIsMounted] = useState(false);
  const { width, height } = useWindowSize();

  useEffect(() => {
    if (width > 0 && height > 0) {
      setIsMounted(true);
    }
  }, [width, height]);

  if (!isMounted) {
    return null;
  }

  return (
    <div
      style={{
        backgroundColor: BACKGROUND_COLORS[pageColor],
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
      }}
    >
      <div
        suppressHydrationWarning
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height={pageHeight}
          width={pageWidth}
          viewBox={`0 0 ${pageWidth} ${pageHeight}`}
          id="sketch"
        >
          <Page pageType={pageType} pageColor={pageColor} />
          <g clipPath="page-clip">{children}</g>
        </svg>
      </div>
      <Knobs />
    </div>
  );
};

export default Frame;
