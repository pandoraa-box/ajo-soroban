import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { Home, Users, TrendingUp, Wallet, User } from 'lucide-react-native';

function TabIcon({ icon: Icon, focused }: { icon: any; focused: boolean }) {
  return (
    <View
      className={`w-10 h-10 items-center justify-center rounded-2xl ${
        focused ? 'bg-ajo-lime-soft' : ''
      }`}
    >
      <Icon
        size={20}
        color={focused ? '#D47253' : '#73716D'}
        strokeWidth={focused ? 2.5 : 2}
      />
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#EBE8E1',
          borderTopWidth: 1,
          height: 84,
          paddingBottom: 16,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#D47253',
        tabBarInactiveTintColor: '#73716D',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginTop: -2 },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon icon={Home} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="circles"
        options={{
          title: 'Circles',
          tabBarIcon: ({ focused }) => <TabIcon icon={Users} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Save',
          tabBarIcon: ({ focused }) => <TabIcon icon={TrendingUp} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: 'Wallet',
          tabBarIcon: ({ focused }) => <TabIcon icon={Wallet} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon icon={User} focused={focused} />,
        }}
      />
    </Tabs>
  );
}
