/**
 * @author: @AngularClass
 */

// Look in ./config folder for webpack.dev.js
switch (process.env.NODE_ENV) {
    case 'prod':
    case 'production':
        module.exports = require('./config/webpack.prod');
        break;
    case 'test':
    case 'testing':
        module.exports = require('./config/webpack.test');
        break;
    case 'electron-dev':
        module.exports = require('./config/webpack.electron.dev');
        break;
    case 'electron-prod':
        module.exports = require('./config/webpack.electron.prod');
        break;
    case 'github':
        module.exports = require('./config/webpack.github');
        break;
    case 'dev':
    case 'development':
    default:
        module.exports = require('./config/webpack.dev');
}