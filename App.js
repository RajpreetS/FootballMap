import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Linking from 'expo-linking';

// Helper function to convert DMS to decimal
function convertDMS(lat, lng) {
  const convertDMSToDD = (degrees, minutes, seconds, direction) => {
    let dd = degrees + minutes / 60 + seconds / (60 * 60);
    if (direction === 'S' || direction === 'W') {
      dd = dd * -1;
    } // Don't do anything for N or E
    return dd;
  };

  let [latD, latM, latS] = lat.split('-').map(Number);
  let [lngD, lngM, lngS] = lng.split('-').map(Number);

  const latitude = convertDMSToDD(latD, latM, latS, 'N');
  const longitude = convertDMSToDD(lngD, lngM, lngS, 'E');

  return { latitude, longitude };
}

// Convert the DMS coordinates to decimal for the playground
const playgroundCoordinates = convertDMS("22-20-32", "114-10-39");

export default function App() {
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        // Handle permission denial
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);

      // Calculate the distance
      const distance = Location.distance(
        location.coords,
        playgroundCoordinates
      );
      setDistance(distance / 1000); // Convert to km
    })();
  }, []);

  // Function to handle getting directions
  const openDirections = () => {
    const url = Platform.select({
      ios: `maps:${playgroundCoordinates.latitude},${playgroundCoordinates.longitude}`,
      android: `google.navigation:q=${playgroundCoordinates.latitude}+${playgroundCoordinates.longitude}`
    });
    Linking.openURL(url);
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        region={{
          latitude: playgroundCoordinates.latitude,
          longitude: playgroundCoordinates.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={playgroundCoordinates}
          title="Ede Road Playground"
        />
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="Your Location"
          />
        )}
      </MapView>
      {distance && (
        <Text>
          Distance to Ede Road Playground: {distance.toFixed(2)} km
        </Text>
      )}
      <TouchableOpacity onPress={openDirections}>
        <Text>Get Directions</Text>
      </TouchableOpacity>
    </View>
  );
}