import { html } from "lit-html";
import { classMap } from "lit-html/directives/class-map.js";
import { ifDefined } from "lit-html/directives/if-defined.js";

export const Template = ({
  rootClass = "spectrum-Popover",
  size = "m",
  isOpen = true,
  withTip = true,
  position,
  customClasses = [],
  id,
  content = [],
  ...globals
}) => {
  const { express } = globals;

  try {
    // Load styles for this component
    import(/* webpackPrefetch: true */ "../index.css");
    if (!express) import(/* webpackPrefetch: true */ "../themes/spectrum.css");
    else import(/* webpackPrefetch: true */ "../themes/express.css");
  } catch (e) {
    console.warn(e);
  }

  return html`
    <div
      class=${classMap({
        [rootClass]: true,
        "is-open": isOpen,
        [`${rootClass}--size${size?.toUpperCase()}`]: typeof size !== "undefined",
        [`${rootClass}--withTip`]: withTip,
        [`${rootClass}--${position}`]: typeof position !== "undefined",
        ...customClasses.reduce((a, c) => ({ ...a, [c]: true }), {}),
      })}
      role="presentation"
      id=${ifDefined(id)}>
      ${content}
      ${withTip ?
        position && ['top', 'bottom'].some(e => position.startsWith(e)) ?
          html`<svg class="${rootClass}-tip" viewBox="0 -0.5 16 9"><path class="${rootClass}-tip-triangle" d="M-1,-1 8,8 17,-1"></svg>` :
          html`<svg class="${rootClass}-tip" viewBox="0 -0.5 9 16"><path class="${rootClass}-tip-triangle" d="M-1,-1 8,8 -1,17"></svg>` :
        ""}
    </div> `;
};