/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    // Handle PDF.js and pdf-parse
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
    };

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        "pdf-parse": false,
      };
    }

    // Ignore pdf-parse test files
    config.externals = config.externals || [];
    if (isServer) {
      config.externals.push({
        "pdf-parse/test": "commonjs pdf-parse/test",
      });
    }

    return config;
  },
  // Suppress warnings about external packages
  serverExternalPackages: ["pdf-parse"],

  // Ignore ESLint and TypeScript errors during build for Vercel
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
