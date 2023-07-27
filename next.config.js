//next.config.js	Configuration file for Next.js

/** @type {import('next').NextConfig} */

const debug = process.env.NODE_ENV !== "production";
const repository = "brynnalog";

const nextConfig = {
    basePath: `/${repository}`,
    reactStrictMode: true,
    assetPrefix: !debug ? `/${repository}/` : "",
    trailingSlash: true
}

module.exports = nextConfig
