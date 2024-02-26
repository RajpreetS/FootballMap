/**import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Linking from 'expo-linking';
import geolib from 'geolib';
import axios from 'axios';
import polyline from '@mapbox/polyline';


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



    const getDirections = async (userLocation, playgroundCoordinates, apiKey) => {
      try {
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/directions/json?origin=${userLocation.latitude},${userLocation.longitude}&destination=${playgroundCoordinates.latitude},${playgroundCoordinates.longitude}&key=${AIzaSyD3MR5Sw8Y-JWlU2RxYAwm854pwD3fMsmE}`
        );
        return response.data;
      } catch (error) {
        console.error(error);
        return null; // or handle the error as appropriate for your app
      }
    };

// Fetch and decode the route
    const fetchRoute = async () => {
      const data = await getDirections(origin, destination, 'YOUR_API_KEY');
      if (data && data.routes.length > 0) {
        const route = data.routes[0];
        const points = polyline.decode(route.overview_polyline.points);
        const coords = points.map(point => ({
          latitude: point[0],
          longitude: point[1]
        }));
        setRouteCoordinates(coords);
      }
    };

    fetchRoute();

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
}**/
import React, { useState, useEffect } from 'react';
import { View, Text, Picker, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';

const API_KEY = 'AIzaSyD1FaQKWbgXjKw-sksj1e4TNzsrwAB6lYkg'; // Replace with your Google Maps API key

const App = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [route, setRoute] = useState(null);
  const [mode, setMode] = useState('driving'); // Default mode

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
    })();
  }, []);

  const getDirections = async (mode) => {
    const origin = `${location.latitude},${location.longitude}`;
    const destination = "37.7749,-122.4194"; // Example: San Francisco coordinates
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=${mode}&key=${API_KEY}`;

    try {
      const response = await axios.get(url);
      const points = decode(response.data.routes[0].overview_polyline.points);
      const coords = points.map((point) => {
        return {
          latitude: point[0],
          longitude: point[1],
        };
      });
      setRoute(coords);
    } catch (error) {
      setErrorMsg('Failed to get directions');
    }
  };

  // Immediately get directions when mode changes
  useEffect(() => {
    if (location) {
      getDirections(mode);
    }
  }, [mode]);

  // Function to decode polyline
  function decode(t, e) {
    for (var n, o, u = 0, l = 0, r = 0, d = [], h = 0, i = 0, a = null, c = Math.pow(10, e || 5); u < t.length;) {
      a = null, h = 0, i = 0;
      do a = t.charCodeAt(u++) - 63, i |= (31 & a) << h, h += 5;
      while (a >= 32);
      n = 1 & i ? ~(i >> 1) : i >> 1, h = i = 0;
      do a = t.charCodeAt(u++) - 63, i |= (31 & a) << h, h += 5;
      while (a >= 32);
      o = 1 & i ? ~(i >> 1) : i >> 1, l += n, r += o, d.push([l / c, r / c]);
    }
    return d.map(function(t) { return { latitude: t[0], longitude: t[1] }; });
  }

  return (
      <View style={styles.container}>
        {location ? (
            <>
              <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
              >
                <Marker coordinate={location} title="My Location" />
                {route && <Polyline coordinates={route} strokeWidth={2} />}
              </MapView>
              <Picker
                  selectedValue={mode}
                  style={styles.picker}
                  onValueChange={(itemValue) => setMode(itemValue)}
              >
                <Picker.Item label="Driving" value="driving" />
                <Picker.Item label="Walking" value="walking" />
                <Picker.Item label="Biking" value="bicycling" />
                <Picker.Item label="Transit" value="transit" />
              </Picker>
            </>
        ) : (
            <Text>{errorMsg || 'Loading...'}</Text>
        )}
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  picker: {
    position: 'absolute',
    bottom: 50,
    width: 150,
    backgroundColor: '#fff',
    opacity: 0.8,
  },
});

export default App;