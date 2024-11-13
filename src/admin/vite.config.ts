import { server } from '@strapi/strapi/admin/test';
import { mergeConfig, type UserConfig } from 'vite';

export default (config: UserConfig) => {
  // Important: always return the modified config
  return mergeConfig(config, {
    resolve: {
      alias: {
        '@': '/src',
      },
      server:{
        port : 5174
      }
    },
  });
};