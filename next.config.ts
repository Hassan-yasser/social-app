import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // https://linked-posts.routemisr.com/uploads/default-profile.png
  eslint : {
     ignoreDuringBuilds : true
  },
  images : {
    remotePatterns : [
      {
        protocol : "https",
        hostname : "linked-posts.routemisr.com",
        pathname : "/uploads/*",
      }
    ]
  }
};

export default nextConfig;
