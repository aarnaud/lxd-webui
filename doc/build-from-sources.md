# Build from sources

## Requirements

### to develop

* Node.js >= 4
* npm

````
npm install
npm start
````

### to build angular 2 webapp

* Node.js >= 4
* npm

````
npm install
npm run build:prod
npm run server:prod # Not for production, just for test build
````

Result in `build` directory

### to build electon application with deb package

* Node.js >= 4
* npm

````
sudo apt-get install graphicsmagick imagemagick icnsutils
sudo apt-get install ruby-dev build-essential
sudo gem install fpm
npm install
npm run build:electron:prod
npm run package:electron:linux
````

Result in `dist` directory