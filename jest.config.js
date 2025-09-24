import { createDefaultPreset } from "ts-jest";

const preset = createDefaultPreset();

/** @type {import("jest").Config} **/
export default {
  transform: {
    ...preset.transform,
  },
  testEnvironment: "node",
};
