import base from '!!style-loader?{"injectType":"lazyStyleTag","attributes":{"id":"base"}}!css-loader!@spectrum-css/vars/dist/spectrum-global.css';
import components from '!!style-loader?{"injectType":"lazyStyleTag","attributes":{"id":"components"}}!css-loader!@spectrum-css/vars/dist/components/index.css';

import expressBase from '!!style-loader?{"injectType":"lazyStyleTag","attributes":{"id":"express-base"}}!css-loader!@spectrum-css/expressvars/dist/spectrum-global.css';
import expressComponents from '!!style-loader?{"injectType":"lazyStyleTag","attributes":{"id":"express-components"}}!css-loader!@spectrum-css/expressvars/dist/components/index.css';

export const expressType = {
    name: 'Express',
    description: 'Use the express theme',
    defaultValue: false,
    table: { category: "Global", defaultValue: { summary: false } },
    type: { required: true },
    control: { type: 'boolean' },
    mapping: {
        true: {
            className: 'spectrum--express',
            stylesheet: [expressBase, expressComponents],
        },
        false: {
            className: 'spectrum',
            stylesheet: [base, components],
        },
    }
  };