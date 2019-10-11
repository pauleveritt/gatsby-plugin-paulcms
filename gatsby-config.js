module.exports = {
    siteMetadata: {
        title: 'Gatsby Starter MDX Basic'
    },
    plugins: [
        {
            resolve: `gatsby-plugin-mdx`,
            options: {
                // defaultLayouts: {default: path.resolve('./src/components/layout.js')},
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `pages`,
                path: `${__dirname}/src/pages`
            }
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `content`,
                path: `${__dirname}/src/content`
            }
        }
    ],
}
