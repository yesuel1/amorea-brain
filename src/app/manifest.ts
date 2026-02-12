import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AMOREA Brain Care",
    short_name: "Brain Care",
    description: "매일 10분, 재미있는 게임으로 뇌를 깨우고 좋은 습관으로 젊은 뇌를 유지하세요.",
    start_url: "/brain",
    display: "standalone",
    background_color: "#FAFAF7",
    theme_color: "#1A1A2E",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    categories: ["health", "lifestyle", "medical"],
    lang: "ko",
  };
}
