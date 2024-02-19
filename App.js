import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location'; // Import the Location module from expo-location

export default function App() {
  const [initialPosition, setInitialPosition] = useState(null);

  useEffect(() => {
    const fetchLocationAndData = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Location permission denied');
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        setInitialPosition({ latitude, longitude });

        const response = await fetch("https://api.csdi.gov.hk/apim/dataquery/api/?id=lcsd_rcd_1629267205215_71653&layer=geodatastore&bbox-crs=HK80&bbox=800000,800000,890000,890000&limit=10&offset=0");
        const data = await response.json();
        console.log(data);
        // Handle the fetched data here
      } catch (error) {
        console.log(error);
      }
    };

    fetchLocationAndData();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Current Location:</Text>
      {initialPosition && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: initialPosition.latitude,
            longitude: initialPosition.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: initialPosition.latitude,
              longitude: initialPosition.longitude,
            }}
            title="Your Location"
          />
        </MapView>
      )}
      <Text style={styles.textdecor}>Football Maps</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textdecor: {
    color: '#fff',
    fontSize: 30,
    fontFamily: 'Cochin',
    position: 'absolute',
    top: 20,
  },
  map: {
    flex: 1,
    width: '100%',
  },
});

import { StyleSheet, Text, View } from 'react-native';

async function logFootballGroundNames() {
  try {
    const response = await fetch("https://www.lcsd.gov.hk/datagovhk/facility/facility-hssp5.json");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const facilities = await response.json();

    for (const facility of facilities) {
      console.log(facility.Name_en);
    }
  } catch (error) {
    console.error('Could not fetch the football grounds:', error);
  }
}

logFootballGroundNames();