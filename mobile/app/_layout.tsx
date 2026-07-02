import '../global.css';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { WalletProvider } from '@/context/WalletContext';

export default function RootLayout() {
  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaProvider>
        <WalletProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: '#FAFAFA' },
            }}
          />
        </WalletProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
