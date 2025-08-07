module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Ignore source map warnings from @mediapipe and other packages
      webpackConfig.ignoreWarnings = [
        {
          module: /@mediapipe\/.*/,
          message: /Failed to parse source map/
        },
        {
          module: /node_modules\/.*/,
          message: /source-map-loader/
        },
        {
          module: /node_modules\/.*/,
          message: /Failed to parse source map/
        }
      ];

      return webpackConfig;
    }
  }
};