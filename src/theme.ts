import {
  createSystem,
  defaultConfig,
  defineConfig,
} from "@chakra-ui/react"

const config = defineConfig({
  theme: {
    breakpoints: {
      sm: "320px",
      md: "768px",
      lg: "960px",
      xl: "1200px",
    },
    tokens: {
      colors: {
        midnightGreen: { value: "#1A535C" },
        persianGreen: { value: "#2AB9A3" },
        blueGray: { value: "#7D84B2" },
        robinBlue: { value: "#4ECDC4" },
        cream: { value: "#F7FFF7" },
        rust: { value: "#D33F49" },
        selectiveYellow: { value: "#FFB100" },
        princetonOrange: { value: "#FE9000" },
        navy : { value: "#02006C" },
      },
    },
    semanticTokens: {
      colors: {
        danger: { value: "{colors.red}" },
      },
    },
    keyframes: {
      spin: {
        from: { transform: "rotate(0deg)" },
        to: { transform: "rotate(360deg)" },
      },
    },
  },
})
const system = createSystem(defaultConfig, config);

export default system;