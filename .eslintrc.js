module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        'plugin:vue/recommended',
        '@vue/airbnb',
    ],
    parserOptions: {
        ecmaFeatures: {
            legacyDecorators: true
        },
        parser: 'babel-eslint',
    },
    rules: {
        'no-console': 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'array-element-newline': ['error', 'consistent'],
        'indent': ['error', 4, { 'MemberExpression': 0, 'SwitchCase': 1, 'ignoredNodes': ['TemplateLiteral'] }],
        'quotes': ['error', 'single'],
        'comma-dangle': ['error', 'always-multiline'],
        'semi': ['error', 'never'],
        'object-curly-spacing': ['error', 'always'],
        'max-len': ['error', 140],
        'no-new': 'off',
        'linebreak-style': 'off',
        'import/extensions': 'off',
        'eol-last': 'off',
        'no-shadow': 'off',
        'no-unused-vars': 'warn',
        'import/no-cycle': 'off',
        'arrow-parens': 'off',
        'eqeqeq': 'off',
        'no-param-reassign': 'off',
        'import/prefer-default-export': 'off',
        'no-use-before-define': 'off',
        'no-continue': 'off',
        'prefer-destructuring': 'off',
        'no-plusplus': 'off',
        'prefer-const': 'off',
        'global-require': 'off',
        'no-prototype-builtins': 'off',
        'consistent-return': 'off',
        'vue/require-component-is': 'off',
        'prefer-template': 'off',
        'one-var-declaration-per-line': 'off',
        'one-var': 'off',
        'import/named': 'off',
        'object-curly-newline': 'off',
        'default-case': 'off',
        'import/order': 'off',
        'no-trailing-spaces': 'off',
        'func-names': 'off',
        'radix': 'off',
        'no-unused-expressions': 'off',
        'no-underscore-dangle': 'off',
        'no-nested-ternary': 'off',
        'no-restricted-syntax': 'off',
        'no-mixed-operators': 'off',
        'no-await-in-loop': 'off',
        'template-curly-spacing' : 'off',
        "vue/html-indent": ["error", 1, {
            "attribute": 2,
            "baseIndent": 4,
            "closeBracket": 1,
            "alignAttributesVertically": true,
            "ignores": []
          }],
          "vue/max-attributes-per-line": ["error", {
            "singleline": {
              "max": 3
            },      
            "multiline": {
              "max": 2
            }
          }],
          "vue/require-default-prop": 0,
          "no-constant-condition": 0,
          "vue/no-v-html":0
    },
};
