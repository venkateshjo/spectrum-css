module.exports = {
  "stories": [
    "../components/**/stories/**/*.stories.mdx",
    "../components/**/stories/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@whitespace/storybook-addon-html"
  ],
  "framework": "@storybook/web-components"
}
