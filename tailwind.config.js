/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}", //  Next.js App Router 사용 시 필요
    "./src/pages/**/*.{js,ts,jsx,tsx}", //  기존 Pages Router 사용 시 필요
    "./src/components/**/*.{js,ts,jsx,tsx}", //  컴포넌트 폴더 적용
    "./src/layout/**/*.{js,ts,jsx,tsx}", //  레이아웃 관련 폴더 적용
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
