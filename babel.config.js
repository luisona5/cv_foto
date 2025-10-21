module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      // Debe contener SOLO el preset base de Expo
      'babel-preset-expo',
    ],
    plugins: [
      // 1. El plugin de NativeWind (solo una vez)
      // Debe ir antes que el de Expo Router
      "nativewind/babel",
      
      // 2. El plugin de Expo Router DEBE ir al final
      'expo-router/babel',
    ],
  };
};
