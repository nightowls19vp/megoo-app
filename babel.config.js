module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    // 'react-native-reanimated/plugin',

    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true,
      },
    ],
    // "@babel/plugin-proposal-class-properties",
    [
      'react-native-reanimated/plugin',
      {
        globals: ['__scanCodes'],
      },
    ],
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '~/assets': './assets',
        },
      },
    ],
  ],
  assumptions: {
    setPublicClassFields: true,
    privateFieldsAsSymbols: true,
  },
};
