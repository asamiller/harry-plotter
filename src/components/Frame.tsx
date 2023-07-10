import { FC, useEffect, useState } from "react";
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

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
