/**
 * Используем классическую связку `tailwindcss` + `autoprefixer`.
 * Это устраняет падение Oxide-плагина на билде.
 */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
