/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                color1: "#635985",
                color2: "#443C68",
                color3: "#393053",
                color4: "#18122B",
                color5: "#0b0117",
            },
            fontFamily: {
                cursive: ["Pacifico", "cursive"],
            },
        },
    },
    plugins: [],
};
