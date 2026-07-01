import { View, Text } from 'react-native';

type Accent = 'default' | 'green' | 'amber' | 'dark';

interface MetricCardProps {
  label: string;
  value: string;
  subtext?: string;
  icon?: string;
  accent?: Accent;
}

const CARD_BG: Record<Accent, string> = {
  default: 'bg-white border-ajo-border',
  green:   'bg-ajo-lime-soft border-ajo-lime',
  amber:   'bg-ajo-amber-light border-ajo-amber-light',
  dark:    'bg-ajo-dark border-ajo-dark',
};

const VALUE_COLOR: Record<Accent, string> = {
  default: 'text-ajo-dark',
  green:   'text-ajo-lime',
  amber:   'text-ajo-amber',
  dark:    'text-white',
};

const LABEL_COLOR: Record<Accent, string> = {
  default: 'text-ajo-muted',
  green:   'text-ajo-lime',
  amber:   'text-ajo-amber',
  dark:    'text-white/60',
};

export function MetricCard({ label, value, subtext, icon, accent = 'default' }: MetricCardProps) {
  return (
    <View className={`flex-1 rounded-2xl border p-4 gap-1 ${CARD_BG[accent]}`}>
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <Text className={`text-xs font-medium mb-1 ${LABEL_COLOR[accent]}`}>{label}</Text>
          <Text className={`text-2xl font-extrabold tracking-tight ${VALUE_COLOR[accent]}`}>
            {value}
          </Text>
          {subtext && (
            <Text className={`text-xs mt-0.5 ${LABEL_COLOR[accent]}`}>{subtext}</Text>
          )}
        </View>
        {icon && (
          <View className="w-10 h-10 rounded-xl bg-white/30 items-center justify-center">
            <Text className="text-xl">{icon}</Text>
          </View>
        )}
      </View>
    </View>
  );
}
