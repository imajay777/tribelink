import React from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { Alert, Platform } from 'react-native';
import { GOOGLE_CLIENT_IDS } from '@/constants/google';
import { FIREBASE_CONFIG } from '@/constants/firebaseConfig';

WebBrowser.maybeCompleteAuthSession();

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

  console.log('📱 Platform:', Platform.OS);
  
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest(
    {
      clientId,
    }
  );
  
  // Log redirect URL after request is created
  React.useEffect(() => {
    if (request?.redirectUrl) {
      console.log('📱 Redirect URI:', request.redirectUrl);
    }
  }, [request]);
  
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
  console.log('🔐 Calling promptAsync...');
  const result = await promptAsync();
  console.log('🔐 promptAsync result:', result);
  
  if (result?.type === 'success' && result.params?.id_token) {
    try {
      console.log('🔐 Got id_token, signing in with Firebase...');
      const res = await signInWithGoogleTokens(result.params.id_token, result.params.access_token);
      console.log('🔐 Sign-in successful:', res);
      return { success: true, payload: res };
    } catch (e: any) {
      console.error('🔐 Firebase sign-in failed', e);
      return { success: false, error: e.message || String(e) };
    }
  }
  console.warn('🔐 Sign-in not successful. Result type:', result?.type);
  return { success: false, error: result?.type || 'cancelled' };
}
