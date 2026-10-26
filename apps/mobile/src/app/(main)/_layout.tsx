/**
 * Main tab layout – visible to authenticated users.
 */

import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { useTheme } from '@luvora/design-system';

function TabIcon({ emoji, label, focused }: { emoji: string; label: string; focused: boolean }) {
  return (
    <Text style={{ fontSize: focused ? 24 : 22, opacity: focused ? 1 : 0.55 }}>
      {emoji}
    </Text>
  );
}

export default function MainLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.tabBar,
          borderTopColor: theme.colors.divider,
          paddingBottom: 4,
          height: 60,
        },
        tabBarActiveTintColor: theme.colors.tabBarActive,
        tabBarInactiveTintColor: theme.colors.tabBarInactive,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="chats"
        options={{
          title: 'Chats',
          tabBarIcon: ({ focused }) => <TabIcon emoji="💬" label="Chats" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="social"
        options={{
          title: 'Discover',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🌸" label="Discover" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="reels"
        options={{
          title: 'Reels',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🎬" label="Reels" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="couple"
        options={{
          title: '💕 Us',
          tabBarIcon: ({ focused }) => <TabIcon emoji="💕" label="Us" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon emoji="👤" label="Profile" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
