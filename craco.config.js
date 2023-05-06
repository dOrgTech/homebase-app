const { ProvidePlugin } = require("webpack")

module.exports = {
  webpack: {
    configure: {
      ignoreWarnings: [/Failed to parse source map/],
      resolve: {
        fallback: {
          assert: require.resolve("assert/"),
          crypto: require.resolve("crypto-browserify/"),
          http: require.resolve("stream-http/"),
          https: require.resolve("https-browserify/"),
          os: require.resolve("os-browserify/browser"),
          stream: require.resolve("stream-browserify/"),
          url: require.resolve("url/"),
          util: require.resolve("util/"),
          fs: false
        }
      }
    },
    plugins: [
      new ProvidePlugin({
        Buffer: ["buffer", "Buffer"]
      })
    ]
  }
}
