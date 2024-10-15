/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary-color)", // Sử dụng biến cho màu đoạn văn
        second: "var(--second-color)",
      },
    },
  },
  plugins: [],
};
