import { withSentryConfig } from "@sentry/nextjs"
import type { NextConfig } from "next"

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
  webpack: (configToModify) => {
    // Only apply aliases when building for the browser

    if (
      configToModify.name === "client" ||
      configToModify.name === "edge-server"
    ) {
      configToModify.resolve = configToModify.resolve || {}
      configToModify.resolve.alias = {
        ...configToModify.resolve.alias,
        fs: require.resolve("./shims/ModuleStub.js"),
        path: require.resolve("./shims/ModuleStub.js"),
        child_process: require.resolve("./shims/ModuleStub.js"),
        net: require.resolve("./shims/ModuleStub.js"),
        tls: require.resolve("./shims/ModuleStub.js"),
        crypto: require.resolve("./shims/ModuleStub.js"),
        http: require.resolve("./shims/ModuleStub.js"),
        https: require.resolve("./shims/ModuleStub.js"),
        zlib: require.resolve("./shims/ModuleStub.js"),
        stream: require.resolve("./shims/ModuleStub.js"),
        util: require.resolve("./shims/ModuleStub.js"),
        os: require.resolve("./shims/ModuleStub.js"),
        assert: require.resolve("./shims/ModuleStub.js"),
        buffer: require.resolve("./shims/ModuleStub.js"),
        vm: require.resolve("./shims/ModuleStub.js"),
        worker_threads: require.resolve("./shims/ModuleStub.js"),
        "./writerBe": require.resolve("./shims/ModuleStub.js"),
        "./readerBe": require.resolve("./shims/ModuleStub.js"),
        "./toBeQueryBuilder": require.resolve("./shims/ModuleStub.js"),
      }
    }

    return configToModify
  },
}

if (process.env.NODE_ENV === "production") {
  module.exports = withSentryConfig(nextConfig, {
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
} else {
  module.exports = nextConfig
}
