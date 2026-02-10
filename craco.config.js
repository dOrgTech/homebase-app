// craco.config.js
const { ProvidePlugin } = require("webpack");

module.exports = {
  webpack: {
    configure: (config) => {
      // keep your settings
      config.ignoreWarnings = [/Failed to parse source map/];
      config.resolve = config.resolve || {};
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        assert: require.resolve("assert/"),
        crypto: require.resolve("crypto-browserify/"),
        http: require.resolve("stream-http/"),
        https: require.resolve("https-browserify/"),
        os: require.resolve("os-browserify/browser"),
        stream: require.resolve("stream-browserify/"),
        url: require.resolve("url/"),
        util: require.resolve("util/"),
        fs: false,
      };

      // persistent cache for faster rebuilds
      config.cache = {
        type: "filesystem",
        buildDependencies: { config: [__filename] },
      };

      return config;
    },
    plugins: [new ProvidePlugin({ Buffer: ["buffer", "Buffer"] })],
  },
};
