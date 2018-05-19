const path = require('path');

export default {
    entry: 'src/index.js',
    extraBabelPlugins: [
        ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }],
    ],
    env: {
        development: {
            extraBabelPlugins: ['dva-hmr'],
        },
    },
    alias: {
        components: path.resolve(__dirname, 'src/components/'),
        services: path.resolve(__dirname, 'src/services/'),
        models: path.resolve(__dirname, 'src/models/'),
        routes: path.resolve(__dirname, 'src/routes/'),
        common: path.resolve(__dirname, 'src/common/'),
        assets: path.resolve(__dirname, 'src/assets/'),
        utils: path.resolve(__dirname, 'src/utils/'),
        // enums: path.resolve(__dirname, 'src/utils/enums.js'),
    },
    ignoreMomentLocale: true,
    theme: './src/theme.js',
    html: {
        template: './src/index.ejs',
    },
    disableDynamicImport: false,
    publicPath: '/',
    hash: true,
};
