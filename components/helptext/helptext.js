import { html } from 'lit-html';
import './dist/themes/spectrum.css';
import './dist/themes/express.css';
import './dist/index.css';

export const HelpText = ({
  isDisabled = false,
  hideIcon = false,
  size = "m",
  text,
  variant
}) => {

  let neutralVariantClass = 'spectrum-HelpText--neutral';
  let negativeVariantClass = 'spectrum-HelpText--negative';
  let variantClass = variant === 'neutral' ? neutralVariantClass : negativeVariantClass;
  let disabledClass = `is-disabled`;

  let iconMarkup = html`
    <svg class="spectrum-Icon spectrum-Icon--sizeM spectrum-HelpText-validationIcon" focusable="false" aria-hidden="true">
      <use xlink:href="#spectrum-icon-18-Alert" />
    </svg>
  `;

  return html`
    <div style="max-width: 500px;">
    <div
      class=${[
        'spectrum-HelpText',
        `spectrum-HelpText--size${size.toUpperCase()}`,
        variantClass,
        `${isDisabled ? disabledClass : ''}`
      ].join(' ')}
    >
      ${hideIcon ? '' : iconMarkup}
      <div class="spectrum-HelpText-text">
        ${text}
      </div>
    </div>
    </div>
  `;
}
