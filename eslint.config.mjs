// ESLint 9 flat config.
//
// Uses @next/eslint-plugin-next's native flat config directly instead of the
// `eslint-config-next` shareable config. The legacy shareable config routes
// through `@rushstack/eslint-patch`, which fails to patch ESLint 9.39+ on
// Node 24 ("Failed to patch ESLint because the calling module was not
// recognized") — that break silently disabled linting in both `next lint`
// and the `next build` lint step.
//
// @next/eslint-plugin-next, @typescript-eslint/parser and @eslint/js are all
// pnpm-hoisted to the repo root (pnpm's default public-hoist-pattern matches
// *eslint*), so importing them here resolves without declaring them as direct
// dependencies.
import js from "@eslint/js";
import next from "@next/eslint-plugin-next";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    ignores: [".next/**", "out/**", "node_modules/**", "next-env.d.ts"],
  },
  {
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: next.flatConfig.coreWebVitals.plugins,
    rules: {
      ...js.configs.recommended.rules,
      ...next.flatConfig.coreWebVitals.rules,
      // The TypeScript compiler (`npm run type-check`) handles undefined
      // symbols and unused bindings far better than ESLint's core rules,
      // which false-positive on TS types and JSX. Defer to tsc for both.
      "no-undef": "off",
      "no-unused-vars": "off",
    },
  },
];
