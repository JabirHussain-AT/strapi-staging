module.exports = {
    routes: [
        {
            method: "GET",
            path: '/publish-articles',
            handler: 'article.syncAllArticlesToProduction', 
            config: {
                policies: [],
                middlewares: [],
                auth: false, 
                type: "content-api",
                permissions: [
                    {
                        action: 'plugin::upload.read',
                        subject: null,
                    },
                ],
            }
        }
    ]
}
