export const config = {
    depthBidColor: "rgba(111, 22, 14, 0.4)",
    bidColor: "rgba(111, 22, 14, 0.05)",
    depthAskColor: "rgba(60, 179, 113, 0.4)",
    askColor: "rgba(60, 179, 113, 0.05)",
    cellFontSize: (height, width) => 1 + (height + width) / 1.7 * 0.017,
    cellHeaderFontSize: (height, width) => 4 + (height + width) / 1.7 * 0.017,
}