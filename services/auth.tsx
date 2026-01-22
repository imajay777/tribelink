import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { Alert, Platform } from 'react-native';
import * as Linking from 'expo-linking';
import { GOOGLE_CLIENT_IDS } from '@/constants/google';
import { FIREBASE_CONFIG } from '@/constants/firebaseConfig';

WebBrowser.maybeCompleteAuthSession();

const redirectUrl = AuthSession.makeRedirectUrl({
  path: 'auth/google/callback',
});

let firebaseAuth: any = null;

async function ensureFirebase() {
  if (firebaseAuth) return firebaseAuth;
  if (!FIREBASE_CONFIG || !FIREBASE_CONFIG.apiKey) return null;
  try {
    const firebaseAppModule = await import('firebase/app');
    const authModule = await import('firebase/auth');
    const app = firebaseAppModule.initializeApp(FIREBASE_CONFIG);
    firebaseAuth = authModule.getAuth(app);
    return firebaseAuth;
  } catch (e) {
    console.warn('Lazy Firebase init failed', e);
    return null;
  }
}

export function useGoogleAuthRequest() {
  const clientId = GOOGLE_CLIENT_IDS.webClientId;
  
  if (!clientId) {
    console.warn('⚠️ Google Client ID not configured');
    return { request: null, response: null, promptAsync: null };
  }

  console.log('📱 Redirect URI:', redirectUrl);
  
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId,
      scopes: ['openid', 'profile', 'email'],
      redirectUrl,
    },
    {
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenEndpoint: 'https://www.googleapis.com/oauth2/v4/token',
    }
  );
  
  return { request, response, promptAsync };
}

export async function signInWithGoogleTokens(idToken: string, accessToken?: string) {
  if (!idToken) throw new Error('Missing idToken');
  const auth = await ensureFirebase();
  if (auth) {
    const authModule = await import('firebase/auth');
    const credential = authModule.GoogleAuthProvider.credential(idToken, accessToken || null);
    const userCred = await authModule.signInWithCredential(auth, credential);
    return { from: 'firebase', user: userCred.user };
  }
  return { from: 'local', token: idToken };
}

export async function googleSignInFlow(promptAsync: any) {
  if (!promptAsync) {
    Alert.alert('Google Sign-in not configured', 'Client IDs are missing. Set them in constants/google.ts');
    return null;
  }
  const result = await promptAsync();
  if (result?.type === 'success' && result.params?.id_token) {
    try {
      const res = await signInWithGoogleTokens(result.params.id_token, result.params.access_token);
      return { success: true, payload: res };
    } catch (e: any) {
      console.error('Firebase sign-in failed', e);
      return { success: false, error: e.message || String(e) };
    }
  }
  return { success: false, error: result?.type || 'cancelled' };
}
