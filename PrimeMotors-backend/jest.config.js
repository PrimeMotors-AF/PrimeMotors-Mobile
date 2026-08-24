const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  // Detecta arquivos dentro de src ou tests que terminam em .test.ts ou .spec.ts
  testMatch: ["**/tests/**/*.test.ts", "**/?(*.)+(spec|test).ts"],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  testEnvironment: "node", 
};
