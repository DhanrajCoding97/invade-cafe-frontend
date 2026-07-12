import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack(config) {
    // Find the existing rule that handles SVG files
    const fileLoaderRule = config.module.rules.find((rule: any) =>
      rule.test?.test?.('.svg'),
    );

    if (!fileLoaderRule) {
      return config;
    }

    config.module.rules.push(
      // Keep support for importing SVGs as URLs
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },

      // Import SVGs as React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: {
          not: [...(fileLoaderRule.resourceQuery?.not || []), /url/],
        },
        use: ['@svgr/webpack'],
      },
    );

    // Exclude SVGs from the default file loader
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
};

export default nextConfig;
