import type { Config } from 'tailwindcss'

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class', // ← THIS IS KEY! Enables dark mode via class
    theme: {
        extend: {},
    },
    plugins: [],
} satisfies Config