// path: ./src/api/article/controllers/article.js

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::article.article', ({ strapi }) => ({
  // Custom controller method for syncing articles to production
  async syncAllArticlesToProduction(ctx) {
    try {
        
      // Fetch all articles from the staging Strapi database
      const articles = await strapi.entityService.findMany('api::article.article');
      console.log("🚀 ~ file: article.ts:11 ~ syncAllArticlesToProduction ~ articles:", articles)


      for (const article of articles) {
        const articleData = {
          ...article,
          stageId: article.stageId, 
        };

        const updateResult = await strapi.service("api::article.article").syncContentToProduction( articleData );
      }

      ctx.send({
        message: 'All articles synced successfully to Production',
      });
    } catch (error) {
      console.error('Error syncing articles to Production:', error.message);
      ctx.throw(500, 'Failed to sync articles');
    }
  },
}));
