/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/gatsby-config/
 */

module.exports = {
    plugins: [

        {
            resolve: `gatsby-plugin-s3`,
            options: {
                bucketName: "mountain-dog.co.uk",
            },
        }, {
            resolve: 'gatsby-plugin-react-leaflet',
            options: {
                linkStyles: true // (default: true) Enable/disable loading stylesheets via CDN
            }
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `images`,
                path: `${__dirname}/images/`,
            },
        },
        `gatsby-plugin-sharp`,
        `gatsby-transformer-sharp`,
        `gatsby-plugin-react-helmet`,
    ],
}
