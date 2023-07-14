import { FC, useEffect, useState } from "react";
import { useWindowSize } from "usehooks-ts";
import { Knobs, useKnobValue } from "../components/Knobs";
import { PageColors } from "../components/Paper";

const BACKGROUND_COLORS: {
  [key in PageColors]: string;
} = {
  [PageColors.white]: "black",
  [PageColors.black]: "white",
};

const Frame: FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);
  const pageColor = useKnobValue<PageColors>("Page Color");

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
    <>
      <div
        suppressHydrationWarning
        style={{
          backgroundColor: BACKGROUND_COLORS[pageColor],
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}
      >
        {children}
      </div>
      <Knobs />
    </>
  );
};

export default Frame;
