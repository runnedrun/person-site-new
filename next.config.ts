import { withSentryConfig } from "@sentry/nextjs"
import type { NextConfig } from "next"
import createMDX from "@next/mdx"

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  transpilePackages: ["next-mdx-remote", "jsdom"],
  experimental: {
    turbo: {
      resolveAlias: {
        fs: { browser: "./shims/ModuleStub.js" },
        path: { browser: "./shims/ModuleStub.js" },
        child_process: { browser: "./shims/ModuleStub.js" },
        net: { browser: "./shims/ModuleStub.js" },
        tls: { browser: "./shims/ModuleStub.js" },
        crypto: { browser: "./shims/ModuleStub.js" },
        http: { browser: "./shims/ModuleStub.js" },
        https: { browser: "./shims/ModuleStub.js" },
        zlib: { browser: "./shims/ModuleStub.js" },
        stream: { browser: "./shims/ModuleStub.js" },
        util: { browser: "./shims/ModuleStub.js" },
        os: { browser: "./shims/ModuleStub.js" },
        assert: { browser: "./shims/ModuleStub.js" },
        buffer: { browser: "./shims/ModuleStub.js" },
        vm: { browser: "./shims/ModuleStub.js" },
        worker_threads: { browser: "./shims/ModuleStub.js" },
        constants: { browser: "./shims/ModuleStub.js" },
        events: { browser: "./shims/ModuleStub.js" },
        module: { browser: "./shims/ModuleStub.js" },
        process: { browser: "./shims/ModuleStub.js" },
        querystring: { browser: "./shims/ModuleStub.js" },
        request: { browser: "./shims/ModuleStub.js" },
        url: { browser: "./shims/ModuleStub.js" },
        "./readerBe": {
          browser: "./shims/ModuleStub.js",
        },
        "./writerBe": {
          browser: "./shims/ModuleStub.js",
        },
        "./toBeQueryBuilder": {
          browser: "./shims/ModuleStub.js",
        },
      },
    },
  },
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
