import expressMedium from '!!style-loader?{"injectType":"lazyStyleTag","attributes":{"id":"express-medium"}}!css-loader!@spectrum-css/expressvars/dist/spectrum-medium.css';
import expressLarge from '!!style-loader?{"injectType":"lazyStyleTag","attributes":{"id":"express-large"}}!css-loader!@spectrum-css/expressvars/dist/spectrum-large.css';

import medium from '!!style-loader?{"injectType":"lazyStyleTag","attributes":{"id":"medium"}}!css-loader!@spectrum-css/vars/dist/spectrum-medium.css';
import large from '!!style-loader?{"injectType":"lazyStyleTag","attributes":{"id":"large"}}!css-loader!@spectrum-css/vars/dist/spectrum-large.css';

export const scales = ['medium', 'large'];
export const scaleType = {
    name: 'Platform scale',
    defaultValue: 'medium',
    table: { category: "Global", defaultValue: { summary: 'm' } },
    options: scales,
    mapping: {
        medium: {
            className: 'spectrum--medium',
            stylesheet: {
              default: [medium],
              express: [expressMedium],
            },
        },
        large: {
            className: 'spectrum--large',
            stylesheet: {
              default: [large],
              express: [expressLarge],
            },
        },
    },
    type: { required: true },
    control: {
        type: 'radio',
        labels: {
            medium: 'Medium (default)',
            large: 'Large',
        },
    },
};