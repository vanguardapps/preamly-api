import json from "@rollup/plugin-json";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/main.ts",
  output: {
    file: "dist/bundle.js",
    format: "es",
    sourcemap: true,
  },
  plugins: [json(), typescript({ outputToFilesystem: true })],
};
