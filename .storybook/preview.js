import '../components/vars/dist/spectrum-global.css';
import '../components/vars/dist/spectrum-darkest.css';
import '../components/vars/dist/spectrum-dark.css';
import '../components/vars/dist/spectrum-light.css';
import '../components/vars/dist/spectrum-medium.css';
import '../components/vars/dist/spectrum-large.css';
import '../components/tokens/dist/index.css';


export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  html: {
    removeEmptyComments: true,
  }
}
