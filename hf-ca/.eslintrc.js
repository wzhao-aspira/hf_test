module.exports = {
    root: true,
    env: {
        browser: true,
        es2020: true,
        node: true,
        "react-native/react-native": true,
    },
    extends: [
        "airbnb",
        "airbnb/hooks",
        "airbnb-typescript",
        "react-native",
        "plugin:prettier/recommended",
        "prettier/react",
        "prettier",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2020,
        sourceType: "module",
        project: "tsconfig.json",
    },
    plugins: ["react", "react-native", "babel", "prettier"],
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
        // This rule make prettier style check error display as eslint error
        "prettier/prettier": "error",
        // This rule allow .js extensions for JSX
        "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx", ".tsx"] }],
        "react-native/no-unused-styles": "error",
        "react-native/split-platform-components": "error",
        // Disable this rule in legacy project, but nedd open it in new project
        "react-native/no-inline-styles": "off",
        "react-native/no-color-literals": "error",
        "react-native/no-raw-text": "off",
        // Override this rule because we need use i++ etc. in loop
        "no-plusplus": ["error", { allowForLoopAfterthoughts: true }],
        // eslint's built in no-invalid-this rule breaks with class properties
        "no-invalid-this": "off",
        // so we replace it with a version that is class property aware
        "babel/no-invalid-this": "error",
        radix: ["error", "as-needed"],

        // Disable this rule in legacy project, but nedd open it in new project
        eqeqeq: "off",
        "react/require-default-props": "off",
        "react/prop-types": "off",

        // Diable rules that we don't need in legacy nor new project
        // This rule recommand not use import *, but We need use import *
        "import/no-namespace": "off",
        "import/no-commonjs": "off",
        "react/jsx-props-no-spreading": "off",
        "react/display-name": "off",
        "no-console": "off",
        "react/jsx-handler-names": "off",
        "@typescript-eslint/comma-dangle": "off",
        "@typescript-eslint/indent": "off",
        "@typescript-eslint/no-shadow": "warn",
        "@typescript-eslint/no-unused-expressions": "warn",
        "@typescript-eslint/no-use-before-define": "warn",
        "@typescript-eslint/quotes": "off",
        "no-duplicate-imports": "off",
        "react-hooks/exhaustive-deps": "warn",
        "react/react-in-jsx-scope": "off",
    },
};
