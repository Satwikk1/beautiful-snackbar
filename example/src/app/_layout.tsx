import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import React from 'react';
import { View, Text, useColorScheme } from 'react-native';
import { BeautifulSnackbar } from 'beautiful-snackbar';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';

const customTemplates = {
  customCard: ({ item }: { item: any }) => (
    <View style={{
      marginHorizontal: 16,
      padding: 16,
      backgroundColor: '#31115F', // Premium dark purple/indigo
      borderRadius: 16,
      borderColor: '#4c1d95',
      borderWidth: 1.5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.25,
      shadowRadius: 10,
      elevation: 8,
    }}>
      <View style={{ flex: 1, paddingRight: 8 }}>
        <Text style={{ color: '#F3E8FF', fontWeight: '800', fontSize: 15, letterSpacing: -0.2 }}>
          {item.message}
        </Text>
        {item.data?.subtitle && (
          <Text style={{ color: '#C084FC', fontSize: 12, marginTop: 2, fontWeight: '500' }}>
            {item.data.subtitle}
          </Text>
        )}
      </View>
      {item.data?.badge && (
        <View style={{
          backgroundColor: '#F59E0B',
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 8,
        }}>
          <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 11 }}>
            {item.data.badge}
          </Text>
        </View>
      )}
    </View>
  )
};

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <AppTabs />
      <BeautifulSnackbar templates={customTemplates} />
    </ThemeProvider>
  );
}
