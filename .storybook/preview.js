import { useEffect } from '@storybook/client-api'

import '../components/vars/dist/spectrum-global.css';
import '../components/vars/dist/spectrum-darkest.css';
import '../components/vars/dist/spectrum-dark.css';
import '../components/vars/dist/spectrum-light.css';
import '../components/vars/dist/spectrum-medium.css';
import '../components/vars/dist/spectrum-large.css';
import '../components/tokens/dist/index.css';

export const globalTypes = {
  textDirection: {
    name: 'Text direction',
    description: 'Direction of the text',
    defaultValue: 'ltr',
    toolbar: {
      icon: 'arrowrightalt',
      items: [
        { value: 'ltr', icon: 'arrowrightalt', title: 'left to right' },
        { value: 'rtl', icon: 'arrowleftalt', title: 'right to left' },
      ]
    }
  }
}

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

const withDefaultStyles = (StoryFn, context) => {
  const { parameters, globals } = context;
  const defaultStyles = parameters.defaultStyles || globals.defaultStyles;

  useEffect(() => {
    document.body.classList.add('spectrum', 'spectrum--medium', 'spectrum--light');
  });

  return StoryFn();
}

const withRTL = (StoryFn, context) => {
  const { parameters, globals } = context;

  const defaultDirection = 'rtl';
  const textDirection = parameters.textDirection || globals.textDirection || defaultDirection;

  useEffect(() => {
    // Set RTL only if passed as a parameter or toggled via toolbar
    document.body.dir = textDirection
  }, [textDirection]);

  return StoryFn();
}

export const decorators = [withDefaultStyles, withRTL];
