/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                cairo: ['Cairo', 'sans-serif'],
            },
            colors: {
                dark: {
                    950: '#020617',
                    900: '#0f172a',
                    800: '#1e293b',
                    700: '#334155',
                },
                primary: {
                    500: '#3b82f6',
                    600: '#2563eb',
                }
            }
        },
    },
    plugins: [],
}