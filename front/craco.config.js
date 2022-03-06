const CracoLessPlugin = require('craco-less');
module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { 
              '@primary-color': '#ffc82c',
          '@text-color': '#173a64',
          '@btn-text-hover-bg': '#000'
        },
            
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};