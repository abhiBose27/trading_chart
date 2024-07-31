export const config = {
    depthBidColor: "rgba(111, 22, 14, 0.4)",
    bidColor: "rgba(111, 22, 14, 0.05)",
    depthAskColor: "rgba(60, 179, 113, 0.4)",
    askColor: "rgba(60, 179, 113, 0.05)",
    boxShadow: "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
    cellFontSize: (height, width) => 1 + (height + width) / 1.7 * 0.017,
    cellHeaderFontSize: (height, width) => 4 + (height + width) / 1.7 * 0.017,
    orderBookDepthToDisplay: (height, factor) => Math.floor(height / factor)
}