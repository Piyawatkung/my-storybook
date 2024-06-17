import type { Meta, StoryObj } from '@storybook/react';

import { Card } from '../components/Card';

const meta = {
    title: 'Components/Card',
    component: Card,
    parameters: {
        // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
        layout: 'centered',
    },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicCard: Story = {
    args: {
        title: 'This is a Basic Card',
        description: 'A simple card with a title and description.',
    },
};

export const WithImage: Story = {
    args: {
        title: 'Card Title',
        description: 'This is some content inside the card. It is a brief description or summary of the card content.',
        image: 'https://via.placeholder.com/300',
    }
}
