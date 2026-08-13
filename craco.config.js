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
        vm: false,
        fs: false,
      };

      // Fix ESM modules that import "process/browser" without .js extension
      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        "process/browser": require.resolve("process/browser"),
      };

      // Handle fully-specified ESM imports for process
      config.module = config.module || {};
      config.module.rules = config.module.rules || [];
      config.module.rules.push({
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false,
        },
      });

      // persistent cache for faster rebuilds
      config.cache = {
        type: "filesystem",
        buildDependencies: { config: [__filename] },
      };

      return config;
    },
    plugins: [
      new ProvidePlugin({
        Buffer: ["buffer", "Buffer"],
        process: "process/browser",
      }),
    ],
  },
};
