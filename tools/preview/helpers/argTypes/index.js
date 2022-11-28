// Global properties added to each component;
//      determines what stylesheets are loaded
export * from './color.js';
export * from './scale.js';
export * from './express.js';

// @todo https://jira.corp.adobe.com/browse/CSS-314
export const reducedMotionType = {
    name: 'Reduce motion',
    description: 'Reduce animation and transitions',
    defaultValue: false,
    control: { type: 'boolean' },
    table: { category: "Global", defaultValue: { summary: false } },
    type: { required: true },
};

// Rendered as controls; these properties are assigned
//      to the document root element
export const langType = {
    title: 'Language',
    name: 'lang',
    showName: true,
    icon: 'globe',
    description: 'Language of the content',
    defaultValue: 'en-US',
    toolbar: {
        items: [
            { value: 'en-US', title: '🇺🇸', right: 'English (US)' },
            { value: 'ja', title: '🇯🇵', right: 'Japanese' },
            { value: 'ko', title: '🇰🇷', right: '한국어' },
            { value: 'zh', title: '🇨🇳', right: '中文' },
        ],
        dynamicTitle: true,
    },
};

export const textDirectionType = {
    title: 'Text Direction',
    description: 'Direction of the content flow',
    showName: true,
    defaultValue: 'ltr',
    toolbar: {
        items: [
            { value: 'ltr', title: 'ltr', right: 'left to right' },
            { value: 'rtl', title: 'rtl', right: 'right to left' },
        ],
        dynamicTitle: true,
    },
};