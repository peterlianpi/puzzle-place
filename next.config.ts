import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  async rewrites(){
    return [
      {
        source: '/@:username',
        destination: '/:username'
      }
    ]
  }

};

export default nextConfig;
