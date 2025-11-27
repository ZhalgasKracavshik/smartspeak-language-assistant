/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on'
                    },
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains; preload'
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN'
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff'
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'origin-when-cross-origin'
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://apis.google.com https://www.google.com https://www.gstatic.com https://www.youtube.com https://s.ytimg.com https://www.tiktok.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://api.dicebear.com https://lh3.googleusercontent.com https://img.youtube.com https://i.ytimg.com https://p16-sign-va.tiktokcdn.com https://res.cloudinary.com; media-src 'self' https://res.cloudinary.com; font-src 'self' data:; connect-src 'self' https://*.supabase.co https://generativelanguage.googleapis.com https://youtube-transcript-api.vercel.app https://www.youtube.com https://www.tiktok.com; frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://www.tiktok.com;"
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=*, geolocation=(), interest-cohort=()'
                    }
                ]
            }
        ];
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
};

module.exports = nextConfig;
