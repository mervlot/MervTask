const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

let config = getDefaultConfig(__dirname);

// Set projectRoot
config.projectRoot = `${__dirname}/app`;

// Wrap with NativeWind
config = withNativeWind(config, { input: './app/global.css' });

// **Disable exports enforcement after wrapping**
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
