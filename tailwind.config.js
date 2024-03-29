/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                base: '#A1C3D1',
                purple0: '#B39BC8',
                text: '#F0EBF4',
                secondary: '#F172A1',
                primary: '#E64398',
            },
            fontFamily: {
                Prompt: ['Prompt', 'sans-serif'],
                Montserrat: ['Montserrat', 'sans-serif']
            }
        },
    },
    plugins: [],
}