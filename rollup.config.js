import json from "@rollup/plugin-json";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/main.ts",
  output: {
    dir: "dist",
    format: "es",
    sourcemap: true,
    preserveModules: true
  },
  plugins: [json(), typescript({ outputToFilesystem: true })],
};
