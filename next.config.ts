import { withSentryConfig } from "@sentry/nextjs"
import type { NextConfig } from "next"
import createMDX from "@next/mdx"

const nextConfig: NextConfig = {
  /* config options here */

  // serverExternalPackages: [
  //   "@google-cloud/firestore",
  //   "firebase-admin/firestore",
  //   "https-proxy-agent",
  // ],

  // Define the fallbacks that will be used for both webpack and turbopack

  // Keep the webpack config for non-turbo builds
  // webpack: (configToModify) => {
  //   configToModify.resolve.fallback = {
  //     fs: false,
  //     path: false,
  //     child_process: false,
  //     net: false,
  //     tls: false,
  //     crypto: false,
  //     http: false,
  //     https: false,
  //     zlib: false,
  //     stream: false,
  //     util: false,
  //     os: false,
  //     assert: false,
  //     buffer: false,
  //     constants: false,
  //     events: false,
  //     module: false,
  //     process: false,
  //     querystring: false,
  //     request: false,
  //     url: false,
  //     vm: false,
  //     worker_threads: false,
  //   }
  //   return configToModify
  // },

  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  transpilePackages: ["next-mdx-remote", "jsdom"],
}

const withMDX = createMDX({
  // Add markdown plugins here, as desired
})

if (process.env.NODE_ENV === "production") {
  module.exports = withMDX(
    withSentryConfig(nextConfig, {
      // For all available options, see:
      // https://github.com/getsentry/sentry-webpack-plugin#options

      org: "gaynor",
      project: "personal-site",

      // Only print logs for uploading source maps in CI
      silent: !process.env.CI,

      // For all available options, see:
      // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

      // Upload a larger set of source maps for prettier stack traces (increases build time)
      widenClientFileUpload: true,

      // Automatically annotate React components to show their full name in breadcrumbs and session replay
      reactComponentAnnotation: {
        enabled: true,
      },

      // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
      // This can increase your server load as well as your hosting bill.
      // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
      // side errors will fail.
      tunnelRoute: "/monitoring",

      // Automatically tree-shake Sentry logger statements to reduce bundle size
      disableLogger: true,

      // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
      // See the following for more information:
      // https://docs.sentry.io/product/crons/
      // https://vercel.com/docs/cron-jobs
      automaticVercelMonitors: true,
    })
  )
} else {
  module.exports = withMDX(nextConfig)
}
