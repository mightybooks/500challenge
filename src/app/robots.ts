import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/start",
          "/entries/",
          "/arcana",
        ],
        disallow: [
          "/api/",
          "/editor",
          "/login",
          "/my",
          "/opengraph-image",
        ],
      },
    ],
    sitemap: "https://500challenge.vercel.app/sitemap.xml",
  };
}
