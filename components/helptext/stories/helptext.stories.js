import { HelpText } from "../helptext";

export default {
  title: 'Help Text',
  argTypes: {
    hideIcon: {
      control: 'boolean',
      defaultValue: false,
    },
    isDisabled: {
      control: 'boolean',
      defaultValue: false,
    },
    size: {
      name: 'size',
      description: 'The size at which to display the Help Text.',
      type: { name: 'string', required: true },
      table: {
        type: { summary: '"s" | "m" | "l" | "xl"' },
        defaultValue: { summary: 'm' },
      },
      control: {
        type: 'select',
        options: ['s', 'm', 'l', 'xl'],
        defaultValue: 'm',
      },
    },
    text: {
      control: { type: 'text' },
      defaultValue: 'Create a password with at least 8 characters.',
    },
    variant: {
      control: { type: 'radio' },
      options: ['neutral', 'negative'],
      defaultValue: 'neutral',
    }
  },
  args: {
    hideIcon: false,
    isDisabled: false,
    size: 'm',
    text: 'Create a password with at least 8 characters.',
    variant: 'neutral',
  }
}

const Template = (args) => HelpText(args);
export const Neutral = Template.bind({});
export const Negative = Template.bind({});
Negative.args = {
  variant: 'negative'
}
export const SizeS = Template.bind({});
SizeS.args = {
  size: 's',
};
export const SizeM = Template.bind({});
SizeM.args = {
  size: 'm',
};
export const SizeL = Template.bind({});
SizeL.args = {
  size: 'l',
};
export const SizeXL = Template.bind({});
SizeXL.args = {
  size: 'xl',
};
