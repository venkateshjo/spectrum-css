import expressLight from '!!style-loader?{"injectType":"lazyStyleTag","attributes":{"id":"express-light"}}!css-loader!@spectrum-css/expressvars/dist/spectrum-light.css';
import expressDark from '!!style-loader?{"injectType":"lazyStyleTag","attributes":{"id":"express-dark"}}!css-loader!@spectrum-css/expressvars/dist/spectrum-dark.css';
import expressDarkest from '!!style-loader?{"injectType":"lazyStyleTag","attributes":{"id":"express-darkest"}}!css-loader!@spectrum-css/expressvars/dist/spectrum-darkest.css';

import lightest from '!!style-loader?{"injectType":"lazyStyleTag","attributes":{"id":"lightest"}}!css-loader!@spectrum-css/vars/dist/spectrum-lightest.css';
import midlight from '!!style-loader?{"injectType":"lazyStyleTag","attributes":{"id":"midlight"}}!css-loader!@spectrum-css/vars/dist/spectrum-midlight.css';
import light from '!!style-loader?{"injectType":"lazyStyleTag","attributes":{"id":"light"}}!css-loader!@spectrum-css/vars/dist/spectrum-light.css';
import dark from '!!style-loader?{"injectType":"lazyStyleTag","attributes":{"id":"dark"}}!css-loader!@spectrum-css/vars/dist/spectrum-dark.css';
import middark from '!!style-loader?{"injectType":"lazyStyleTag","attributes":{"id":"middark"}}!css-loader!@spectrum-css/vars/dist/spectrum-middark.css';
import darkest from '!!style-loader?{"injectType":"lazyStyleTag","attributes":{"id":"darkest"}}!css-loader!@spectrum-css/vars/dist/spectrum-darkest.css';

export const colors = ['lightest', 'midlight', 'light', 'dark', 'middark', 'darkest'];
export const colorType = {
  name: 'Color',
  description: 'Controls the color context of the component.',
  options: colors,
  defaultValue: 'light',
  type: { required: true },
  table: { category: "Global", defaultValue: { summary: 'light' } },
  mapping: {
    lightest: {
      className: 'spectrum--lightest',
      stylesheet: {
        default: [lightest],
      },
    },
    midlight: {
      className: 'spectrum--midlight',
      stylesheet: {
        default: [midlight],
      },
    },
    light: {
      className: 'spectrum--light',
      stylesheet: {
        default: [light],
        express: [expressLight],
      },
    },
    dark: {
      className: 'spectrum--dark',
      stylesheet: {
        default: [dark],
        express: [expressDark],
      },
    },
    middark: {
      className: 'spectrum--middark',
      stylesheet: {
        default: [middark],
      },
    },
    darkest: {
      className: 'spectrum--darkest',
      stylesheet: {
        default: [darkest],
        express: [expressDarkest],
      },
    },
  },
  control: {
    type: 'select',
    labels: {
      lightest: 'Lightest',
      midlight: 'Middle Light',
      light: 'Light (default)',
      dark: 'Dark',
      middark: 'Middle Dark',
      darkest: 'Darkest',
    }
  }
};