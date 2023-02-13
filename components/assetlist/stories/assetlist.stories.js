// Import the component markup template
import { Template } from "./template";

import { default as Checkbox } from "@spectrum-css/checkbox/stories/checkbox.stories.js";
// import { ava } from "@spectrum-css/asset/stories/asset.stories.js";

export default {
  title: "Asset list",
  description: "A selectable list of Assets, often used inside of Miller Columns.",
  component: "Assetlist",
  argTypes: {},
  args: {
    rootClass: "spectrum-AssetList",
  },
  parameters: {
    actions: {
      handles: [
        ...Checkbox.parameters.actions.handles,
      ]
    },
    status: {
      type: process.env.MIGRATED_PACKAGES.includes('assetlist') ? 'migrated' : undefined
    }
  }
};

export const Default = Template.bind({});
Default.args = {};
