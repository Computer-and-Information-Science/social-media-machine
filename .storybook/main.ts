import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
    stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-interactions',
        '@storybook/addon-controls',
    ],
    framework: {
        name: '@storybook/react-vite',
        options: {
            strictMode: true,
        },
    },
    docs: {
        autodocs: 'tag',
    },
};
export default config;
