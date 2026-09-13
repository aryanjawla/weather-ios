import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

type IconName = React.ComponentProps<typeof Feather>['name'];

type ForecastDay = {
  day: string;
  condition: string;
  high: number;
  low: number;
  icon: IconName;
  accent: 'warm' | 'cool' | 'cloud';
};

type WeatherLocation = {
  id: string;
  city: string;
  region: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  humidity: number;
  wind: number;
  visibility: number;
  uv: string;
  sunrise: string;
  sunset: string;
  hourly: { time: string; temperature: number; icon: IconName }[];
  forecast: ForecastDay[];
};

const LOCATIONS: WeatherLocation[] = [
  {
    id: 'sf',
    city: 'San Francisco',
    region: 'California, United States',
    temperature: 72,
    feelsLike: 71,
    condition: 'Mostly sunny',
    humidity: 54,
    wind: 9,
    visibility: 10,
    uv: 'Moderate',
    sunrise: '6:18 AM',
    sunset: '7:54 PM',
    hourly: [
      { time: 'Now', temperature: 72, icon: 'sun' },
      { time: '11 AM', temperature: 73, icon: 'sun' },
      { time: '12 PM', temperature: 74, icon: 'sun' },
      { time: '1 PM', temperature: 75, icon: 'sun' },
      { time: '2 PM', temperature: 75, icon: 'cloud' },
      { time: '3 PM', temperature: 74, icon: 'cloud' },
    ],
    forecast: [
      { day: 'Today', condition: 'Mostly sunny', high: 78, low: 61, icon: 'sun', accent: 'warm' },
      { day: 'Tuesday', condition: 'Partly cloudy', high: 76, low: 60, icon: 'cloud', accent: 'cloud' },
      { day: 'Wednesday', condition: 'Sunny', high: 79, low: 62, icon: 'sun', accent: 'warm' },
      { day: 'Thursday', condition: 'Light rain', high: 68, low: 57, icon: 'cloud-drizzle', accent: 'cool' },
      { day: 'Friday', condition: 'Cloudy', high: 70, low: 58, icon: 'cloud', accent: 'cloud' },
    ],
  },
  {
    id: 'nyc',
    city: 'New York',
    region: 'New York, United States',
    temperature: 67,
    feelsLike: 66,
    condition: 'Partly cloudy',
    humidity: 61,
    wind: 12,
    visibility: 8,
    uv: 'Low',
    sunrise: '5:43 AM',
    sunset: '8:12 PM',
    hourly: [
      { time: 'Now', temperature: 67, icon: 'cloud' },
      { time: '11 AM', temperature: 69, icon: 'cloud' },
      { time: '12 PM', temperature: 71, icon: 'sun' },
      { time: '1 PM', temperature: 72, icon: 'sun' },
      { time: '2 PM', temperature: 73, icon: 'cloud' },
      { time: '3 PM', temperature: 72, icon: 'cloud' },
    ],
    forecast: [
      { day: 'Today', condition: 'Partly cloudy', high: 74, low: 59, icon: 'cloud', accent: 'cloud' },
      { day: 'Tuesday', condition: 'Light rain', high: 69, low: 57, icon: 'cloud-drizzle', accent: 'cool' },
      { day: 'Wednesday', condition: 'Sunny', high: 77, low: 61, icon: 'sun', accent: 'warm' },
      { day: 'Thursday', condition: 'Mostly sunny', high: 79, low: 63, icon: 'sun', accent: 'warm' },
      { day: 'Friday', condition: 'Thunderstorms', high: 72, low: 60, icon: 'cloud-lightning', accent: 'cool' },
    ],
  },
  {
    id: 'london',
    city: 'London',
    region: 'England, United Kingdom',
    temperature: 59,
    feelsLike: 57,
    condition: 'Light rain',
    humidity: 78,
    wind: 10,
    visibility: 6,
    uv: 'Low',
    sunrise: '4:53 AM',
    sunset: '9:04 PM',
    hourly: [
      { time: 'Now', temperature: 59, icon: 'cloud-drizzle' },
      { time: '11 AM', temperature: 60, icon: 'cloud-drizzle' },
      { time: '12 PM', temperature: 61, icon: 'cloud' },
      { time: '1 PM', temperature: 62, icon: 'cloud' },
      { time: '2 PM', temperature: 63, icon: 'cloud' },
      { time: '3 PM', temperature: 64, icon: 'sun' },
    ],
    forecast: [
      { day: 'Today', condition: 'Light rain', high: 64, low: 52, icon: 'cloud-drizzle', accent: 'cool' },
      { day: 'Tuesday', condition: 'Cloudy', high: 66, low: 51, icon: 'cloud', accent: 'cloud' },
      { day: 'Wednesday', condition: 'Mostly sunny', high: 69, low: 54, icon: 'sun', accent: 'warm' },
      { day: 'Thursday', condition: 'Light rain', high: 63, low: 50, icon: 'cloud-drizzle', accent: 'cool' },
      { day: 'Friday', condition: 'Partly cloudy', high: 67, low: 52, icon: 'cloud', accent: 'cloud' },
    ],
  },
  {
    id: 'tokyo',
    city: 'Tokyo',
    region: 'Kanto, Japan',
    temperature: 81,
    feelsLike: 84,
    condition: 'Sunny',
    humidity: 48,
    wind: 7,
    visibility: 12,
    uv: 'High',
    sunrise: '4:31 AM',
    sunset: '6:52 PM',
    hourly: [
      { time: 'Now', temperature: 81, icon: 'sun' },
      { time: '11 AM', temperature: 82, icon: 'sun' },
      { time: '12 PM', temperature: 84, icon: 'sun' },
      { time: '1 PM', temperature: 85, icon: 'sun' },
      { time: '2 PM', temperature: 86, icon: 'sun' },
      { time: '3 PM', temperature: 85, icon: 'cloud' },
    ],
    forecast: [
      { day: 'Today', condition: 'Sunny', high: 88, low: 72, icon: 'sun', accent: 'warm' },
      { day: 'Tuesday', condition: 'Sunny', high: 89, low: 73, icon: 'sun', accent: 'warm' },
      { day: 'Wednesday', condition: 'Partly cloudy', high: 84, low: 70, icon: 'cloud', accent: 'cloud' },
      { day: 'Thursday', condition: 'Light rain', high: 79, low: 68, icon: 'cloud-drizzle', accent: 'cool' },
      { day: 'Friday', condition: 'Sunny', high: 86, low: 71, icon: 'sun', accent: 'warm' },
    ],
  },
];

const STORAGE_KEY = 'weather-selected-location';

export default function WeatherHome() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [selectedLocationId, setSelectedLocationId] = useState<string>('sf');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [locating, setLocating] = useState<boolean>(false);

  const location = LOCATIONS.find((item) => item.id === selectedLocationId) ?? LOCATIONS[0];
  const filteredLocations = LOCATIONS.filter((item) =>
    `${item.city} ${item.region}`.toLowerCase().includes(search.trim().toLowerCase()),
  );

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((storedId) => {
      if (storedId && LOCATIONS.some((item) => item.id === storedId)) {
        setSelectedLocationId(storedId);
      }
    });
  }, []);

  const chooseLocation = async (id: string) => {
    await Haptics.selectionAsync();
    setSelectedLocationId(id);
    await AsyncStorage.setItem(STORAGE_KEY, id);
    setSearch('');
    setIsSearchOpen(false);
  };

  const refresh = async () => {
    setRefreshing(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setRefreshing(false);
  };

  const useCurrentLocation = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Location unavailable', 'Open the app on your iPhone to use your current location.');
      return;
    }

    setLocating(true);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== Location.PermissionStatus.GRANTED) {
        Alert.alert('Location access is off', 'You can still search for a city above, or enable location access in Settings.');
        return;
      }
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Location found', 'Your local forecast will be available when live weather is connected.');
    } finally {
      setLocating(false);
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <LinearGradient
        colors={[colors.skyDeep, colors.sky, colors.skyMid, colors.skyDeep]}
        locations={[0, 0.35, 0.7, 1]}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: Math.max(insets.top, Platform.OS === 'web' ? 67 : 16),
            paddingBottom: Math.max(insets.bottom + 24, Platform.OS === 'web' ? 34 : 24),
          },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.onSky} />}
      >
        <View style={styles.topBar}>
          <View>
            <Text style={styles.eyebrow}>TUESDAY, JUNE 10</Text>
            <Text style={styles.greeting}>Good morning</Text>
          </View>
          <Pressable
            testID="use-current-location"
            onPress={useCurrentLocation}
            style={({ pressed }) => [styles.locationButton, pressed && styles.pressed]}
          >
            {locating ? (
              <ActivityIndicator color={colors.onSky} size="small" />
            ) : (
              <Feather name="navigation" size={17} color={colors.onSky} />
            )}
          </Pressable>
        </View>

        <Pressable
          testID="location-selector"
          onPress={() => setIsSearchOpen((current) => !current)}
          style={({ pressed }) => [styles.locationSelector, pressed && styles.pressed]}
        >
          <View style={styles.locationPin}>
            <Feather name="map-pin" size={16} color={colors.warm} />
          </View>
          <View style={styles.locationText}>
            <Text style={styles.locationName}>{location.city}</Text>
            <Text style={styles.locationRegion}>{location.region}</Text>
          </View>
          <Feather name={isSearchOpen ? 'chevron-up' : 'chevron-down'} size={18} color={colors.mutedForeground} />
        </Pressable>

        {isSearchOpen && (
          <View style={styles.searchPanel}>
            <View style={styles.searchInputWrap}>
              <Feather name="search" size={17} color={colors.mutedForeground} />
              <TextInput
                testID="city-search"
                value={search}
                onChangeText={setSearch}
                placeholder="Search cities"
                placeholderTextColor={colors.mutedForeground}
                autoFocus
                style={styles.searchInput}
              />
              {search.length > 0 && (
                <Pressable onPress={() => setSearch('')} hitSlop={10}>
                  <Feather name="x-circle" size={17} color={colors.mutedForeground} />
                </Pressable>
              )}
            </View>
            <FlatList
              data={filteredLocations}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <Pressable
                  testID={`city-${item.id}`}
                  onPress={() => chooseLocation(item.id)}
                  style={({ pressed }) => [styles.cityResult, pressed && styles.pressed]}
                >
                  <View>
                    <Text style={styles.cityResultName}>{item.city}</Text>
                    <Text style={styles.cityResultRegion}>{item.region}</Text>
                  </View>
                  {item.id === selectedLocationId && <Feather name="check" size={18} color={colors.cool} />}
                </Pressable>
              )}
              ListEmptyComponent={<Text style={styles.noResults}>No saved city matches that search.</Text>}
            />
          </View>
        )}

        <View style={styles.currentWeather}>
          <View style={styles.weatherOrb}>
            <View style={styles.sunGlow} />
            <Feather name={location.condition.toLowerCase().includes('rain') ? 'cloud-drizzle' : location.condition.toLowerCase().includes('cloud') ? 'cloud' : 'sun'} size={72} color={location.condition.toLowerCase().includes('rain') ? colors.cool : colors.warm} />
          </View>
          <Text style={styles.temperature}>{location.temperature}°</Text>
          <Text style={styles.condition}>{location.condition}</Text>
          <Text style={styles.highLow}>H {location.forecast[0].high}°  ·  L {location.forecast[0].low}°  ·  Feels like {location.feelsLike}°</Text>
        </View>

        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>Hourly forecast</Text>
          <Text style={styles.sectionMeta}>Next 24 hours</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hourlyRow}>
          {location.hourly.map((hour, index) => (
            <View key={hour.time} style={[styles.hourCard, index === 0 && styles.hourCardActive]}>
              <Text style={[styles.hourTime, index === 0 && styles.hourTimeActive]}>{hour.time}</Text>
              <Feather name={hour.icon} size={21} color={index === 0 ? colors.warm : colors.cloud} />
              <Text style={styles.hourTemp}>{hour.temperature}°</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.detailGrid}>
          <DetailTile icon="droplet" label="Humidity" value={`${location.humidity}%`} colors={colors} styles={styles} />
          <DetailTile icon="wind" label="Wind" value={`${location.wind} mph`} colors={colors} styles={styles} />
          <DetailTile icon="sun" label="UV index" value={location.uv} colors={colors} styles={styles} />
          <DetailTile icon="eye" label="Visibility" value={`${location.visibility} mi`} colors={colors} styles={styles} />
        </View>

        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>5-day forecast</Text>
          <Text style={styles.sectionMeta}>Updated just now</Text>
        </View>
        <View style={styles.forecastCard}>
          {location.forecast.map((day, index) => (
            <View key={day.day} style={[styles.forecastRow, index < location.forecast.length - 1 && styles.forecastDivider]}>
              <Text style={styles.forecastDay}>{day.day}</Text>
              <View style={styles.forecastCondition}>
                <Feather
                  name={day.icon}
                  size={20}
                  color={day.accent === 'warm' ? colors.warm : day.accent === 'cool' ? colors.cool : colors.cloud}
                />
                <Text style={styles.forecastDescription}>{day.condition}</Text>
              </View>
              <Text style={styles.forecastHigh}>{day.high}°</Text>
              <Text style={styles.forecastLow}>{day.low}°</Text>
            </View>
          ))}
        </View>

        <View style={styles.sunCard}>
          <View style={styles.sunItem}>
            <View style={styles.sunIcon}><Feather name="sunrise" size={20} color={colors.warm} /></View>
            <View><Text style={styles.sunLabel}>Sunrise</Text><Text style={styles.sunValue}>{location.sunrise}</Text></View>
          </View>
          <View style={styles.sunDivider} />
          <View style={styles.sunItem}>
            <View style={styles.sunIcon}><Feather name="sunset" size={20} color={colors.warm} /></View>
            <View><Text style={styles.sunLabel}>Sunset</Text><Text style={styles.sunValue}>{location.sunset}</Text></View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function DetailTile({
  icon,
  label,
  value,
  colors,
  styles,
}: {
  icon: IconName;
  label: string;
  value: string;
  colors: ReturnType<typeof useColors>;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <View style={styles.detailTile}>
      <Feather name={icon} size={18} color={colors.cool} />
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    content: { paddingHorizontal: 20 },
    topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 },
    eyebrow: { color: colors.cool, fontSize: 11, fontFamily: 'Inter_600SemiBold', letterSpacing: 1.4, marginBottom: 5 },
    greeting: { color: colors.foreground, fontSize: 28, fontFamily: 'Inter_700Bold', letterSpacing: -0.7 },
    locationButton: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.secondary, borderWidth: 1, borderColor: colors.border },
    locationSelector: { flexDirection: 'row', alignItems: 'center', padding: 13, backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 18, marginBottom: 12 },
    locationPin: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center', marginRight: 11 },
    locationText: { flex: 1 },
    locationName: { color: colors.foreground, fontFamily: 'Inter_600SemiBold', fontSize: 14 },
    locationRegion: { color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 12, marginTop: 3 },
    searchPanel: { backgroundColor: colors.card, borderRadius: 18, borderWidth: 1, borderColor: colors.border, padding: 10, marginBottom: 13 },
    searchInputWrap: { height: 44, borderRadius: 13, backgroundColor: colors.secondary, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 9 },
    searchInput: { flex: 1, color: colors.foreground, fontFamily: 'Inter_400Regular', fontSize: 14 },
    cityResult: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 11, paddingHorizontal: 5 },
    cityResultName: { color: colors.foreground, fontFamily: 'Inter_500Medium', fontSize: 14 },
    cityResultRegion: { color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 3 },
    noResults: { color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 13, padding: 10, textAlign: 'center' },
    currentWeather: { alignItems: 'center', paddingTop: 16, paddingBottom: 26 },
    weatherOrb: { width: 120, height: 100, alignItems: 'center', justifyContent: 'center', position: 'relative' },
    sunGlow: { position: 'absolute', width: 78, height: 78, borderRadius: 39, backgroundColor: colors.warm, opacity: 0.14 },
    temperature: { color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 76, letterSpacing: -5, lineHeight: 84 },
    condition: { color: colors.cloud, fontFamily: 'Inter_500Medium', fontSize: 18, marginTop: 3 },
    highLow: { color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 12, marginTop: 10 },
    sectionHeading: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 5, marginBottom: 12 },
    sectionTitle: { color: colors.foreground, fontFamily: 'Inter_600SemiBold', fontSize: 17 },
    sectionMeta: { color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 11 },
    hourlyRow: { gap: 10, paddingBottom: 24 },
    hourCard: { width: 64, height: 104, borderRadius: 18, alignItems: 'center', justifyContent: 'space-evenly', backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 },
    hourCardActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    hourTime: { color: colors.mutedForeground, fontFamily: 'Inter_500Medium', fontSize: 11 },
    hourTimeActive: { color: colors.primaryForeground },
    hourTemp: { color: colors.foreground, fontFamily: 'Inter_600SemiBold', fontSize: 15 },
    detailGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 22 },
    detailTile: { width: '48.3%', minHeight: 92, padding: 14, borderRadius: 18, backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 },
    detailLabel: { color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 10 },
    detailValue: { color: colors.foreground, fontFamily: 'Inter_600SemiBold', fontSize: 15, marginTop: 4 },
    forecastCard: { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 20, paddingHorizontal: 15, marginBottom: 14 },
    forecastRow: { minHeight: 57, flexDirection: 'row', alignItems: 'center' },
    forecastDivider: { borderBottomWidth: 1, borderBottomColor: colors.border },
    forecastDay: { width: 72, color: colors.foreground, fontFamily: 'Inter_500Medium', fontSize: 13 },
    forecastCondition: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 9 },
    forecastDescription: { color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 11 },
    forecastHigh: { color: colors.foreground, fontFamily: 'Inter_600SemiBold', fontSize: 14, width: 34, textAlign: 'right' },
    forecastLow: { color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 14, width: 34, textAlign: 'right' },
    sunCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 20, minHeight: 82, paddingVertical: 14, marginBottom: 10 },
    sunItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    sunIcon: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center' },
    sunLabel: { color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 11 },
    sunValue: { color: colors.foreground, fontFamily: 'Inter_600SemiBold', fontSize: 13, marginTop: 3 },
    sunDivider: { width: 1, height: 33, backgroundColor: colors.border },
    pressed: { opacity: 0.72 },
  });
}