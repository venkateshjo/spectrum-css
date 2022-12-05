import { unpackDecorator } from "./helpers/utilities.js";

import {
  // Read in the global arguments
  colorType,
  scaleType,
  expressType,
  // Read in the document arguments
  reducedMotionType,
  textDirectionType,
  langType,
} from "./helpers/argTypes/index.js";

import {
  withContextWrapper,
  withTextDirectionWrapper,
  withLanguageWrapper,
  withReducedMotionWrapper
} from "./helpers/decorators/index.js";

import '@spectrum-css/tokens/dist/index.css';
import '@spectrum-css/page/dist/index-vars.css';

window.__spectrum_context__ = {};

window.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('spectrum');
});

// @todo: resolve errors on 'name' and 'title' in console
export const globalTypes = {
  textDirection: textDirectionType,
  lang: langType,
};

export const argTypes = {
    color: colorType,
    scale: scaleType,
    reducedMotion: reducedMotionType,
    express: expressType,
};

export const args = {
    color: 'light',
    scale: 'medium',
    reducedMotion: false,
    express: false,
};

export const parameters = {
  layout: 'padded',
  showNav: true,
  showPanel: true,
  panelPosition: 'right',
  isToolShown: false,
  controls: {
    expanded: false,
    hideNoControlsWarning: true,
  },
  html: {
    root: '#root-inner',
    removeComments: true,
    prettier: {
      tabWidth: 4,
      useTabs: false,
      htmlWhitespaceSensitivity: 'ignore',
    },
    highlighter: {
      showLineNumbers: true,
      wrapLines: false,
    },
  },
  docs: {
    inlineStories: true,
    source: {
        type: 'dynamic',
        language: 'html',
    },
    iframeHeight: '200px',
  },
};

export const decorators = [
  withTextDirectionWrapper,
  withLanguageWrapper,
  withReducedMotionWrapper,
  unpackDecorator,
  withContextWrapper
];