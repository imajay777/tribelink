// Add your OAuth client IDs here. Leave empty to disable Google sign-in in development.
// For Expo managed apps use the webClientId for web and Android/iOS client ids for native.
export const GOOGLE_CLIENT_IDS = {
  webClientId: process.env.EXPO_GOOGLE_WEB_CLIENT_ID || '855384104939-9v3ev0ua4tk56osucnkfg7btj79ldqnf.apps.googleusercontent.com',
  iosClientId: process.env.EXPO_GOOGLE_IOS_CLIENT_ID || '',
  androidClientId: process.env.EXPO_GOOGLE_ANDROID_CLIENT_ID || '',
};

// Example (do NOT commit real secrets):
// export const GOOGLE_CLIENT_IDS = {
//   webClientId: '...apps.googleusercontent.com',
//   iosClientId: '...apps.googleusercontent.com',
//   androidClientId: '...apps.googleusercontent.com',
// };
