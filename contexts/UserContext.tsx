import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useEffect, useState } from 'react';

import { UserType } from '@/types';
import { recommendTribes } from '@/utils/tribeMatching';
import { SAMPLE_TRIBES } from '@/constants/tribes';

const USER_TYPE_KEY = '@user_type';
const USER_PROFILE_KEY = '@user_profile_v1';

export const [UserProvider, useUser] = createContextHook(() => {
  const [userType, setUserTypeState] = useState<UserType>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [storedType, storedProfile] = await Promise.all([
          AsyncStorage.getItem(USER_TYPE_KEY),
          AsyncStorage.getItem(USER_PROFILE_KEY),
        ]);

        if (storedType) setUserTypeState(storedType as UserType);
        if (storedProfile) setUserProfile(JSON.parse(storedProfile));
      } catch (error) {
        console.error('Failed to load user data:', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const setUserType = async (type: UserType) => {
    try {
      if (type) {
        await AsyncStorage.setItem(USER_TYPE_KEY, type);
      } else {
        await AsyncStorage.removeItem(USER_TYPE_KEY);
      }
      setUserTypeState(type);
    } catch (error) {
      console.error('Failed to save user type:', error);
    }
  };

  const saveProfile = async (profile: any) => {
    try {
      setUserProfile(profile);
      await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
    } catch (error) {
      console.error('Failed to save user profile:', error);
    }
  };

  const setTribeName = async (name: string) => {
    const updated = {
      ...userProfile,
      tribe: {
        ...(userProfile?.tribe || {}),
        name,
      },
    };
    await saveProfile(updated);
  };

  // Preferences helpers for onboarding and matching
  const setPreferences = async (preferences: Record<string, any>) => {
    const updated = { ...(userProfile || {}), preferences };
    await saveProfile(updated);
    return updated;
  };

  const getTribeRecommendations = (opts?: any) => {
    try {
      const prefs = userProfile?.preferences || {};
      return recommendTribes(prefs, SAMPLE_TRIBES, opts || {});
    } catch (e) {
      console.error('Failed to compute tribe recommendations', e);
      return [];
    }
  };

  return {
    userType,
    setUserType,
    userProfile,
    setUserProfile: saveProfile,
    setTribeName,
    setPreferences,
    getTribeRecommendations,
    isLoading,
  };
});
