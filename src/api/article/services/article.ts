// path: ./src/services/productionSync.js

"use strict";

const axios = require("axios");

module.exports = {
  async syncContentToProduction(contentData) {
   
    const productionApiUrl = process.env.PRODUCTION_API_URL || 'http://localhost:1337/api/articles';
    const apiKey = process.env.PRODUCTION_API_KEY || '0b00b15d05f32f9699e7039792d3805468759652671c31027f620f53e56a306196aadb75642254fd4d1fe63a6c65069b6cd9723c2fbd8a3da32aab4b7afec381fe624e5f04e0b5033aff2776137eaa0cdc728086c3b5c3c84c6d94e6cacb13e4ff4870b93ce9b91a294da79ef2e73339b7a057e3734f1f3c3c12291e4d24acf3';

    try {
      // Extract the unique identifier for checking if content exists
      const { stageId } = contentData;
      let existingContent = null;
      let response = null;

      // Check if content with the given stageId already exists in Production
      try {
         response = await axios.get(`${productionApiUrl}?filters[stageId][$eq]=${''+stageId}`, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },
        });
  
          // Assuming response.data.data contains the content items
          const items = response.data.data;
          if (items.length > 0) {
            // If there's data, find the exact item by stageId
            existingContent = items?.map((item)=>{
                return item?.stageId === stageId ? item : ''
            })
          }

      } catch (checkError) {
        console.warn(`Content with stageId ${stageId} not found, creating new entry.`,existingContent[0]?.data);
      }

      if (response?.status === 200 && existingContent?.length > 0  ) {
        // Update existing content if found
        const contentId = existingContent[0].documentId ; ;
        console.log("🚀 ~ file: article.ts:43 ~ syncContentToProduction ~ contentId:", contentId)

        //delele unnecossory data
        delete contentData?.locale
        delete contentData?.publishedAt
        delete contentData?.createdAt
        delete contentData?.updatedAt
        delete contentData?.documentId
        delete contentData?.id

        
        await axios.put(
          `${productionApiUrl}/${contentId}`,
          {data : contentData},
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
            },
          }
        );
        console.log(`Content with stageId ${stageId} updated successfully in Production.`);
        return { message: "Content updated successfully in Production." };
      } else {
        console.log('-------------------------------------------------------------------------------')
        // Create new content if not found
        const payload = {
            Title : contentData.Title,
            stageId : contentData.stageId
        }
      const res =  await axios.post(
          productionApiUrl,
          {data : payload},
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
            },
          }
        );
        console.log(`Content with stageId ${stageId} published successfully to Production.`);
        return { message: "Content published successfully to Production." };
      }
    } catch (error) {
      console.log("🚀 ~ file: article.ts:64 ~ syncContentToProduction ~ error:", error)
      console.error("Error syncing content to Production:", error.response?.data?.error?.details?.errors || error.message);
      throw new Error("Error syncing content to Production");
    }
  },
};
