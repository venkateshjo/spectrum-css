import { useEffect } from '@storybook/client-api';

import { getDefaultValue, isObject } from '../utilities';

export const withContextWrapper = (StoryFn, context) => {
  const previousContexts = window.__spectrum_context__;
  const { args, argTypes } = context;

  // This property informs which context stylesheets to source
  //    but does not source a stylesheet for itself
  const isExpress = Boolean(args.express ?? getDefaultValue('express', argTypes));

  /* An update to the express context loads new stylesheets for scale & color */
  let updateStyles = !!(previousContexts.express !== isExpress);

  function fetchStylesheet(value, obj) {
    const s = [];
    const sheets = obj.mapping[value]?.stylesheet;

    if (isObject(sheets)) {
      if (isExpress && sheets.hasOwnProperty('express') && sheets.express.length) {
        s.push(...sheets.express);
      } else if (sheets.hasOwnProperty('default') && sheets.default.length) {
        s.push(...sheets.default);
      } else s.push(...sheets);
    } else {
      s.push(...sheets);
    }

    return s;
  }

  function fetchMetadata(key, value) {
    return {
      className: argTypes[key].mapping[value]?.className,
      stylesheet: fetchStylesheet(value, argTypes[key]),
      options: argTypes[key].options ?? Object.keys(argTypes[key].mapping),
    }
  }

  useEffect(() => {
    /* Scale & color apply stylesheet changes to the preview */
    for (const ctx of ['scale', 'color', 'express']) {
      let value = args[ctx] ?? window.__spectrum_context__[ctx] ?? getDefaultValue(ctx, argTypes);

      if (previousContexts[ctx] !== value) {
        updateStyles = true;

        /* Convert string booleans to true boolean values */
        if (value === 'true' || value === 'false') value = Boolean(value);
        window.__spectrum_context__[ctx] = value;
      }

      const { options, className } = fetchMetadata(ctx, value);

      for (let o of options) {
        const { className: cn, stylesheet } = fetchMetadata(ctx, o);
        console.log(o, cn, stylesheet);
        if (cn && className && cn !== 'spectrum') {
          document.body.classList.toggle(cn, className === cn);
        }

        /* Convert string booleans to true boolean values */
        if (o === 'true' || o === 'false') o = Boolean(o);

        /* If the option matches the window value, add the stylesheet */
        if (o === window.__spectrum_context__[ctx] || updateStyles) {
          stylesheet.forEach(s => {
            if (s.use) s.use();
          });
        } else {
          /* Otherwise, remove the stylesheet */
          stylesheet.forEach(s => {
            if (s.unuse) s.unuse();
          });
        }
      }
    }
  }, [args.color, args.scale, args.express]);

  return StoryFn(context);
};