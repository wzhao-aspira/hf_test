module.exports = {
    root: true,
    env: {
        browser: true,
        es2020: true,
        node: true,
        "react-native/react-native": true,
    },
    extends: ["airbnb", "airbnb/hooks", "airbnb-typescript", "react-native", "plugin:prettier/recommended"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2020,
        sourceType: "module",
        project: "tsconfig.json",
    },
    plugins: ["react", "react-native", "babel"],
    settings: {
        react: {
            version: "detect",
        },
    },
    overrides: [
        {
            files: ["*.jsx"],
        },
    ],
    rules: {
        // Override this rule because we need use i++ etc. in loop
        "no-plusplus": ["error", { allowForLoopAfterthoughts: true }],
        radix: ["error", "as-needed"],
        // Disable this rule in legacy project, but need open it in new project
        eqeqeq: "off",
        "no-console": "off",
        "no-duplicate-imports": "off",
        // This rule recommend not use import *, but We need use import *
        "import/no-namespace": "off",
        "import/no-commonjs": "off",
        // Recommend turn on this rule
        "@typescript-eslint/no-use-before-define": "off",
        "@typescript-eslint/quotes": "off",
        "react-native/no-color-literals": "error",
        "react-native/no-inline-styles": "off",
        "react-native/no-raw-text": "off",
        "react-native/no-unused-styles": "error",
        "react-native/split-platform-components": "error",
        "react/display-name": "off",
        "react/jsx-filename-extension": ["error", { extensions: [".js", ".jsx", ".tsx"] }],
        "react/jsx-no-bind": "off",
        "react/jsx-props-no-spreading": "off",
        "react/prop-types": "off",
        "react/react-in-jsx-scope": "off",
        "react/require-default-props": "off",
    },
};
