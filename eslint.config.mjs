import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig, // 務必放在最後，用來關閉與 prettier 衝突的規則
  {
    rules: {
      "no-console": "off", // 終端機程式通常需要 console
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
);
