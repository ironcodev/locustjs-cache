const { babel } = require("@rollup/plugin-babel");

module.exports = {
  input: "src/index.js",
  plugins: [
    babel({
      babelHelpers: "bundled",
      presets: ["@babel/preset-env"],
    }),
  ],
  output: {
    file: "./dist/index.js",
    format: "cjs",
  },
  external: ["@locustjs/base","@locustjs/exception"],
};
