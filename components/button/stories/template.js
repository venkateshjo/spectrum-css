import { html } from 'lit-html';
import { classMap } from 'lit/directives/class-map.js';

import { generateSVG } from '@spectrum-css/preview/helpers/storyAssets.js';
import { titleCase } from '@spectrum-css/preview/helpers/utilities.js';

// More on component templates: https://storybook.js.org/docs/web-components/writing-stories/introduction#using-args
export const Template = ({ label, hideLabel, icon, size, variant, staticColor, style, isDisabled, className }) => {
  let classList = {};
  
  if (!className) className = 'spectrum-Button';
  classList[className] = true;

  [variant, style].forEach((value) => {
    if (value) classList[`${className}--${value.toLowerCase()}`] = true;
  });

  if (size) classList[`${className}--size${size.toUpperCase()}`] = true;
  if (staticColor) classList[`${className}--static${titleCase(staticColor)}`] = true;

  return html`
    <button class=${classMap(classList)} ?disabled=${isDisabled}>
      ${generateSVG(icon, size)}
      ${label && !hideLabel ? html`<span class=${`${className}-label`}>${label}</span>` : ''}
    </button>
  `;
};