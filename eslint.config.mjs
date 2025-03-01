import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
// import tsResolver from "eslint-import-resolver-typescript";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json"
        }
      }
    }
  },
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // 自定义规则
    rules: {
      // "@typescript-eslint/no-require-imports": "off",
      // "@typescript-eslint/no-var-requires": "off",    // 允许使用 require() 赋值
      // "import/no-commonjs": "off",     
    },
  },
];