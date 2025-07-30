import { Config } from 'tailwindcss'

/** @type {Config} */
export default {
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                inter: ['var(--font-inter)', 'ui-sans-serif', 'system-ui'],
                poppins: ['var(--font-poppins)', 'ui-sans-serif', 'system-ui'],
            },
        },
    },
    plugins: [],
} 