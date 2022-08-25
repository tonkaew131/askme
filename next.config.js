/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    async redirects() {
        return [
            {
                source: '/account/login',
                destination: '/api/auth/login',
                permanent: true,
            },
            {
                source: '/account/logout',
                destination: '/api/auth/logout',
                permanent: true,
            },
        ]
    },
}

module.exports = nextConfig
