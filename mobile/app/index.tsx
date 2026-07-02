import { useRef } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { 
  useAnimatedScrollHandler, 
  useSharedValue, 
  useAnimatedStyle,
  interpolate,
  Extrapolation
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    title: 'The African way to save',
    description: 'Ajo brings the traditional savings circle on-chain. Fair, transparent, and built for communities.',
    image: require('../assets/slide1.png')
  },
  {
    title: 'No more chasing payments',
    description: "Smart contracts automate the payouts. When it's your turn, the funds arrive in your wallet instantly.",
    image: require('../assets/slide2.png')
  },
  {
    title: 'Zero platform fees',
    description: 'Save in USDC without losing a single cent to middlemen. Completely self-custodial and secure.',
    image: require('../assets/slide3.png')
  }
];

export default function OnboardingScreen() {
  const router = useRouter();
  const scrollX = useSharedValue(0);
  const scrollRef = useRef<Animated.ScrollView>(null);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const nextSlide = () => {
    const nextIndex = Math.ceil(scrollX.value / width);
    if (nextIndex < SLIDES.length - 1) {
      scrollRef.current?.scrollTo({ x: width * (nextIndex + 1), animated: true });
    } else {
      router.replace('/(tabs)/home');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-ajo-surface" edges={['top', 'bottom']}>
      
      {/* Top Logo */}
      <View className="px-8 pt-10 pb-4 flex-row items-center gap-3">
        <Image source={require('../assets/logo.png')} className="w-9 h-9 opacity-90 grayscale sepia-[.2]" resizeMode="contain" />
        <Text className="font-serif text-3xl font-bold text-ajo-dark">Ajo</Text>
      </View>

      {/* Swipeable Slides */}
      <View className="flex-1">
        <Animated.ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          bounces={false}
        >
          {SLIDES.map((slide, i) => {
            return (
              <View key={i} style={{ width }} className="justify-center px-8">
                <View className="w-full h-72 bg-white rounded-[2rem] shadow-sm border border-ajo-border/60 mb-6 overflow-hidden">
                  <Image source={slide.image} className="w-full h-full" resizeMode="cover" />
                </View>
                <Text className="font-serif text-[40px] font-bold text-ajo-dark leading-[1.1] tracking-tight mb-4">
                  {slide.title}
                </Text>
                <Text className="text-lg text-ajo-muted leading-relaxed pr-4">
                  {slide.description}
                </Text>
              </View>
            );
          })}
        </Animated.ScrollView>
      </View>

      {/* Bottom Actions */}
      <View className="px-8 py-10 gap-10">
        <View className="flex-row gap-2">
          {SLIDES.map((_, i) => {
            const dotStyle = useAnimatedStyle(() => {
              const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
              const dotWidth = interpolate(scrollX.value, inputRange, [8, 32, 8], Extrapolation.CLAMP);
              const opacity = interpolate(scrollX.value, inputRange, [0.3, 1, 0.3], Extrapolation.CLAMP);
              const backgroundColor = scrollX.value >= (i - 0.5) * width && scrollX.value <= (i + 0.5) * width ? '#D47253' : '#EBE8E1';
              return { width: dotWidth, opacity, backgroundColor };
            });

            return (
              <Animated.View 
                key={i} 
                style={dotStyle}
                className="h-1.5 rounded-full" 
              />
            );
          })}
        </View>

        <View className="flex-row justify-between items-center">
          <TouchableOpacity onPress={() => router.replace('/(tabs)/home')}>
            <Text className="text-ajo-muted font-bold tracking-widest uppercase text-xs p-2 -ml-2">Skip</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={nextSlide}
            activeOpacity={0.8}
            className="bg-ajo-dark rounded-[1.5rem] w-16 h-16 items-center justify-center shadow-sm"
          >
            <Text className="text-white text-2xl">→</Text>
          </TouchableOpacity>
        </View>
      </View>

    </SafeAreaView>
  );
}
