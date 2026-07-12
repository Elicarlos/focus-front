/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  
  // Performance optimizations
  swcMinify: true,
  compress: true,
  
  // Build optimization
  productionBrowserSourceMaps: false,
  
  // Experimental optimizations for Turbopack
  experimental: {
    optimizePackageImports: ['react', 'react-dom'],
  },
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
  },
  
  // Security headers
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
      ],
    },
  ],
};

export default nextConfig;
