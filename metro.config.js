const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Resolver configuration for React Native compatibility
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Block problematic Node.js modules
config.resolver.blockList = [
  /node_modules\/ws\/lib\/stream\.js$/,
];

// Provide empty modules for problematic dependencies
config.resolver.alias = {
  ...config.resolver.alias,
  'ws': false,
  'stream': false,
  'util': false,
};

module.exports = config;