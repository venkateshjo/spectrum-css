import { useEffect } from '@storybook/client-api'

import '../components/vars/dist/spectrum-global.css';
import '../components/vars/dist/spectrum-darkest.css';
import '../components/vars/dist/spectrum-dark.css';
import '../components/vars/dist/spectrum-light.css';
import '../components/vars/dist/spectrum-medium.css';
import '../components/vars/dist/spectrum-large.css';
import '../components/tokens/dist/index.css';

export const globalTypes = {
  scale: {
    name: 'Scale',
    description: 'The platform scale',
    defaultValue: 'medium',
    toolbar: {
      dynamicTitle: true,
      items: [
        { value: 'medium', title: 'Medium'},
        { value: 'large', title: 'Large'},
      ]
    }
  },
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
  },
  vars: {
    name: 'Vars',
    description: 'Set the vars',
    defaultValue: 'spectrum',
    toolbar: {
      // show the theme name once selected in the toolbar
      dynamicTitle: true,
      items: [
        { value: 'spectrum', title: 'Spectrum' },
        { value: 'express', title: 'Express' },
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

const withDefaultStyles = (StoryFn) => {
  document.body.classList.add('spectrum', 'spectrum--medium', 'spectrum--light');
  return StoryFn();
}

const withScale = (StoryFn, context) => {
  const { parameters, globals } = context;

  const defaultScale = 'medium';
  const scale = parameters.scale || globals.scale || defaultScale;

  useEffect(() => {
    let isDefault = scale === defaultScale;
    if (isDefault) {
      document.body.classList.remove('spectrum--large');
      document.body.classList.add('spectrum--medium');
    } else {
      document.body.classList.remove('spectrum--medium');
      document.body.classList.add('spectrum--large');
    }
  }, [scale]);

  return StoryFn();
}

const withVars = (StoryFn, context) => {
  const { parameters, globals } = context;

  const defaultVars = 'spectrum';
  const vars = parameters.vars || globals.vars || defaultVars;

  useEffect(() => {
    let isDefault = vars === defaultVars;
    document.body.classList.toggle('spectrum--express', !isDefault);
  }, [vars]);

  return StoryFn();
}

const withRTL = (StoryFn, context) => {
  const { parameters, globals } = context;

  const defaultDirection = 'rtl';
  const textDirection = parameters.textDirection || globals.textDirection || defaultDirection;

  useEffect(() => {
    document.body.dir = textDirection
  }, [textDirection]);

  return StoryFn();
}

export const decorators = [withDefaultStyles, withScale, withVars, withRTL];
