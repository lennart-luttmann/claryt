export default [
    {
        files: ["src/**/*.js"],
        rules: {
            "no-unused-vars": "warn",
            "no-undef": "error",
        },
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            globals: {
                chrome: "readonly",
                console: "readonly",
                document: "readonly",
                window: "readonly",
            },
        },
    },
];
