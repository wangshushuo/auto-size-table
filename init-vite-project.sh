#!/bin/bash

# 确保脚本在出现错误时退出
set -e

# 安装所有需要的包
echo "Installing necessary packages..."
npm install --save-dev @types/node prettier tailwindcss postcss autoprefixer prettier-plugin-tailwindcss eslint-plugin-prettier eslint-config-prettier oxlint eslint-plugin-oxlint

# import order
echo "Import order has been configured."
npm install --save-dev @trivago/prettier-plugin-sort-imports

# 创建 Prettier 配置文件
echo "Creating Prettier configuration..."
cat <<EOL > .prettierrc
{
  "plugins": ["@trivago/prettier-plugin-sort-imports", "prettier-plugin-tailwindcss"]
}
EOL

# 初始化 Tailwind CSS
echo "Initializing Tailwind CSS..."
npx tailwindcss init -p

# 配置 Tailwind CSS
echo "Configuring Tailwind CSS..."
cat <<EOL > tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOL

# 创建 Tailwind CSS 基础样式文件
echo "Creating Tailwind CSS base styles..."
cat <<EOL > ./src/index.css
@tailwind base;
@tailwind components;
@tailwind utilities;
EOL

# 创建 ESLint 配置文件
echo "Creating ESLint configuration..."
cat <<EOL > .eslintrc.cjs
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/recommended',
    'prettier',
    'plugin:prettier/recommended',
    'plugin:oxlint/recommended'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
}
EOL

# 创建 .eslintignore 文件
echo "Creating .eslintignore..."
cat <<EOL > .eslintignore
node_modules/
dist/
EOL

# 创建 .prettierignore 文件
echo "Creating .prettierignore..."
cat <<EOL > .prettierignore
node_modules/
dist/
EOL

# 配置 Vite 别名
echo "Configuring Vite alias..."
cat <<EOL > vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { fileURLToPath, URL } from "url";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
    ]
  },
});
EOL
cat <<EOL > tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* alias */
    "paths": {
      "@/*": ["./src/*"],
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
EOL

# 创建 .env 文件
echo "Creating .env file..."
cat <<EOL > .env
# Example environment variables
VITE_API_URL=https://api.example.com
VITE_ANOTHER_ENV_VAR=some_value
EOL

# 创建 config.ts 文件
echo "Creating config.ts file..."
cat <<EOL > src/config.ts
// src/config.ts
export const API_URL = import.meta.env.VITE_API_URL;
export const ANOTHER_ENV_VAR = import.meta.env.VITE_ANOTHER_ENV_VAR;
EOL

echo ".env file and config.ts have been created and configured."

echo "Setup complete! Prettier, Tailwind CSS, Tailwind CSS sorting plugin, and ESLint with auto-fix and oxlint have been installed and configured."