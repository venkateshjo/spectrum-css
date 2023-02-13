import { html } from 'lit-html';
import { classMap } from 'lit-html/directives/class-map.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';

import { Template as Checkbox } from '@spectrum-css/checkbox/stories/template.js';
import { Template as Icon } from '@spectrum-css/icon/stories/template.js';

import '../index.css';
import '../skin.css';

export const Template = ({
  rootClass = "spectrum-AssetList",
  content = [],
  customClasses = [],
  id,
  ...globals
}) => {
  return html`
    <ul class=${classMap({
    [rootClass]: true,
    ...customClasses.reduce((a, c) => ({ ...a, [c]: true }), {}),
  })} id=${ifDefined(id)}>
  ${repeat(content, (item) => {
    const { image, exampleImage, label } = item;
    const subClasses = {
      [`${rootClass}-item`]: true,
      'is-selectable': true,
      'is-selected': true,
      'is-branch': true,
    };
    return html`
      <li class=${classMap(subClasses)} tabindex="0">
        ${Checkbox({
          ...globals,
          size: "m",
          customClasses: [`${rootClass}-itemSelector`],
        })}
        <img src=${image ?? exampleImage} class="${rootClass}-itemThumbnail">
        <span class="${rootClass}-itemLabel">${label}</span>
        ${Icon({
          ...globals,
          name: "ChevronRight100",
          customClasses: [`${rootClass}-itemChildIndicator`],
        })}
      </li>`;
  })}
  </ul>
  `;
}
