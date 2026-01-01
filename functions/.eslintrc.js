export default {
  env: {
    node: true,
    es2022: true,
  },

  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
  },

  extends: [
    "eslint:recommended",
    "google"
  ],

  rules: {
    "no-unused-vars": "off",
    "require-jsdoc": "off",
    "valid-jsdoc": "off",
    "prefer-arrow-callback": "off",
  }
};