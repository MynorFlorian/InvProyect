const path = require('path')
if (process.env.NODE_ENV === 'development') {
    require('dotenv').config()
}


/** @type {import('next').NextConfig} */

// Remove this if you're not using Fullcalendar features
const withTM = require('next-transpile-modules')([
    '@fullcalendar/common',
    '@fullcalendar/react',
    '@fullcalendar/daygrid',
    '@fullcalendar/list',
    '@fullcalendar/timegrid'
])

module.exports = withTM({
    trailingSlash: true,
    reactStrictMode: false,
    experimental: {
        esmExternals: false,
        jsconfigPaths: true // enables it for both jsconfig.json and tsconfig.json
    },
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        config.optimization.splitChunks.cacheGroups = { };
        config.optimization.minimize = true;
        config.resolve.alias = {
            ...config.resolve.alias,
            apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
        }
        return config
    },
    env: {
        ACCESS_KEY_ID: process.env.ACCESS_KEY_ID,
        SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY,
        APIKEY: process.env.APIKEY,
        AUTHDOMAIN: process.env.AUTHDOMAIN,
        PROJECTID: process.env.PROJECTID,
        GA_TAG_ID: process.env.GA_TAG_ID,
    }
})
