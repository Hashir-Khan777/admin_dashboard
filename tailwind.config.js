// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    screens: {
      ...defaultTheme.screens,
      xs: '300px',
      phone: '480px',
      tablet: '768px',
      desktopMini: '992px',
      desktop: '1025px',
      large: '1260px',
      xl: '1440px',
    },
    extend: {
      boxShadow: {
        "3xl": "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;",
        "4xl": "rgba(0, 0, 0, 0.1) 0px 10px 50px;"
      },
      spacing: {
        '1/1': '82%',
        '2/7': '49%',
        '2/8': '56%',
        '2/9': '32%',
        '2/10': '46%',
        '3/7': '47%',
        '3/8': '28%',
        '98': '580px',
        '99': '700px',
        '100': '460px'
      },
      minHeight: {
        440: "440px",
      },
      flex: {
        '0.3': '0.3',
        '0.4': '0.4',
        '0.6': '0.6'
      }
    }
  },
  plugins: []
}