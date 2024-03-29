/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/gatsby-config/
 */

module.exports = {
    plugins: [
        {
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
        {
            resolve: "gatsby-plugin-sharp",
            options: {
                failOn: "none"
            }
        },
        {
            resolve: `gatsby-plugin-manifest`,
            options: {
                name: "Mountain Dog",
                short_name: "Mountain Dog",
                start_url: "/",
                background_color: "#ffffff",
                theme_color: "#91adca",
                // Enables "Add to Homescreen" prompt and disables browser UI (including back button)
                // see https://developers.google.com/web/fundamentals/web-app-manifest/#display
                display: "standalone",
                icon: "images/logo.png", // This path is relative to the root of the site.
                // An optional attribute which provides support for CORS check.
                // If you do not provide a crossOrigin option, it will skip CORS for manifest.
                // Any invalid keyword or empty string defaults to `anonymous`
                crossOrigin: `use-credentials`,
            },
        },
        `gatsby-transformer-sharp`,
        `gatsby-plugin-react-helmet`,
        `gatsby-plugin-image`
    ],
}
