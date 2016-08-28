require('babel-register')(
  {
    "presets": ["es2015", "stage-0"],
    "plugins": ["transform-regenerator"]
  }
);

require('babel-polyfill');
require('./main.js');
