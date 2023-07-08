/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
    root: true,
    extends: [
        "plugin:vue/vue3-essential",
        "eslint:recommended",
        "plugin:prettier/recommended",
    ],
    parserOptions: {
        ecmaVersion: "latest",
    },
    rules: {
        indent: ["error", 4],
        "prettier/prettier": ["error", {}, { usePrettierrc: true }],
        "no-unused-vars": "off",
        "vue/no-unused-vars": "off",
        "import/no-unresolved": "off",
        "no-undef": "off",
    },
};
