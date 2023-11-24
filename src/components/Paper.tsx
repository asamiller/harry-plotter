import { FC } from "react";
import { useWindowSize } from "usehooks-ts";

export const PADDING = 20;

export enum PageColors {
  white = "white",
  black = "black",
}

export enum Pages {
  landscape11x17 = "11x17 Landscape",
  portrait11x17 = "11x17 Portrait",
  landscape85x11 = "8.5x11 Landscape",
  portrait85x11 = "8.5x11 Portrait",
  landscape11x14 = "11x14 Landscape",
  portrait11x14 = "11x14 Portrait",
}

const heightToWidthRatios = {
  [Pages.landscape11x17]: 11 / 17, // 0.6470588235294118
  [Pages.portrait11x17]: 17 / 11, // 1.5454545454545454
  [Pages.landscape85x11]: 8.5 / 11, // 0.7727272727272727
  [Pages.portrait85x11]: 11 / 8.5, // 1.2941176470588236
  [Pages.landscape11x14]: 11 / 14,
  [Pages.portrait11x14]: 14 / 11,
};

export function usePageSize(pageType: Pages) {
  const { width, height } = useWindowSize();

  if (width === 0 || height === 0) {
    return {
      pageWidth: 0,
      pageHeight: 0,
    };
  }

  const screenWidth = Math.max((width ?? 0) - PADDING * 2, 0) * 0.7; // remove 30% for knobs
  const screenHeight = Math.max((height ?? 0) - PADDING * 2, 0);

  const heightToWidthRatio = heightToWidthRatios[pageType];

  let pageWidth = screenWidth;
  let pageHeight = screenWidth * heightToWidthRatio;

  // If the page height is greater than the start height, then we need to
  // adjust the page width to fit the start height.
  if (pageHeight > screenHeight) {
    pageWidth = screenHeight / heightToWidthRatio;
    pageHeight = screenHeight;
  }

  return {
    pageWidth: Math.round(pageWidth),
    pageHeight: Math.round(pageHeight),
  };
}

interface PageProps {
  pageType: Pages;
  pageColor: PageColors;
}

export const Page: FC<PageProps> = ({
  pageType = Pages.portrait85x11,
  pageColor = PageColors.white,
}) => {
  const { pageHeight, pageWidth } = usePageSize(pageType);

  return (
    <>
      <clipPath id="page-clip">
        <rect
          x={0}
          y={0}
          width={pageWidth}
          height={pageHeight}
          stroke="none"
          strokeWidth="0"
          fill={pageColor}
        />
      </clipPath>
      <rect
        x={0}
        y={0}
        width={pageWidth}
        height={pageHeight}
        stroke="none"
        strokeWidth="0"
        fill={pageColor}
      />
    </>
  );
};
