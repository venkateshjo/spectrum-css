// More on default export: https://storybook.js.org/docs/web-components/writing-stories/introduction#default-export
// More on args: https://storybook.js.org/docs/web-components/writing-stories/args

// Uncomment if you plan to include an icon
// import { default as IconStories } from '../../icon/stories/icon.stories.js';

// Import the component markup template
import { Template } from "./template";

// Load styles for this component
import '../index.css';

export default {
  title: "Link",
  description: "The Link component is...",
  component: "Link",
  argTypes: {
    rootClass: {
      name: "Class name",
      type: { name: "string", required: true },
      defaultValue: "spectrum-Link",
      table: { disable: true },
      control: {
        readonly: true,
      }
    },
    customClasses: { table: { disable: true } },
    size: {
      name: "Size",
      type: { name: "string", required: true },
      defaultValue: "m",
      table: {
        type: { summary: "string" },
        category: "Component",
        defaultValue: { summary: "m" }
      },
      options: ["s", "m", "l", "xl"],
      control: "select"
    },
    // Uncomment if you plan to include an icon
    // icon: IconStories && IconStories.argTypes && IconStories.argTypes.iconName ? IconStories.argTypes.iconName : {},
  },
  args: {
    size: "m",
  },
  parameters: {
    actions: {
      handles: []
    },
    status: {
      type: process.env.MIGRATED_PACKAGES.includes('link') ? 'migrated' : undefined
    }
  }
};

export const Default = Template.bind({});
Default.args = {};
