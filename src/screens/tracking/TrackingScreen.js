import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, Dimensions } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Circle, AnimatedRegion } from 'react-native-maps';
import { getLocation } from '../../externalApis/locationApi';
import { Marker } from 'react-native-maps';
import BusImg from '../../../assets/bus.png';
import StopImg from '../../../assets/stop.png';
import MapViewDirections from 'react-native-maps-directions';
import { EXPO_GOOGLE_MAPS_API_KEY } from '@env'
import {getDistance} from 'geolib';

const Trackingscreen = (props) => {
    const screen = Dimensions.get('window');
    const ASPECT_RATIO = screen.width / screen.height;
    const LATITUDE_DELTA = 0.04;
    const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
    const [userLocation, setUserLocation] = useState();
    const [driverLocation, setDriverLocation] = useState();
    const [stopLocation, setStopLocation] = useState();
    const mapRef = useRef(null);
    const firstUpdateTrack = useRef(false);

    const animatedDriverLocation = useRef(new AnimatedRegion({
        latitude: 20.5937,
        longitude: 78.9629,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
    })).current

    const [distances, setDistances] = useState({
        userToDriver: null,
        driverToStop: null,
        userToStop: null,
    });

    useEffect(() => {
        const driverId = props?.route?.params?.driverId;
        const stopLocation = {
            latitude: Number(props?.route?.params?.stopData?.latitude),
            longitude: Number(props?.route?.params?.stopData?.longitude),
        }
        setStopLocation(stopLocation);
        // console.log("Stop Location:", stopLocation);
        if (!driverId) return;
        fetchLocation(driverId,stopLocation);
        const fetchlocationInterval = setInterval(() => { fetchLocation(driverId,stopLocation) }, 10000);
        // console.log("Api key is:", EXPO_GOOGLE_MAPS_API_KEY);

        return () => clearInterval(fetchlocationInterval);
    }, [props?.route?.params?.driverId])

    const fetchLocation = async (driver_id,currentStopLocation) => {
        try {
            const response = await getLocation(driver_id);
            if (response) {
                // console.log("Driver Location:", response);
                const newDriverLocation = {
                    latitude: Number(response.data.driver.latitude),
                    longitude: Number(response.data.driver.longitude),
                }
                const newUserLocation = {
                    latitude: Number(response.data.user.latitude),
                    longitude: Number(response.data.user.longitude),
                }
                setDriverLocation(newDriverLocation);
                setUserLocation(newUserLocation);

                animatedDriverLocation.timing({
                    latitude: newDriverLocation.latitude,
                    longitude: newDriverLocation.longitude,
                    duration: 1000,
                    useNativeDriver: false,
                }).start();

                if (!firstUpdateTrack.current && mapRef.current) {
                    firstUpdateTrack.current = true;
                    mapRef.current.animateToRegion({
                        latitude: newUserLocation.latitude,
                        longitude: newUserLocation.longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    })
                }
                calculateDistance(newDriverLocation, newUserLocation, currentStopLocation);
            } else {
                // console.log("No location data received.");
            }
        } catch (e) {
            // console.log("Error getting location:", e);
        }
    }

    const onBusLocationButtonPress = () => {
        mapRef.current.animateToRegion({
            latitude: Number(driverLocation.latitude),
            longitude: Number(driverLocation.longitude),
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
        })
    }
    const onStopLocationButtonPress = () => {
        mapRef.current.animateToRegion({
            latitude: Number(stopLocation.latitude),
            longitude: Number(stopLocation.longitude),
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
        })
    }
    const calculateDistance = (driverLocation, userLocation, stopLocation) => {
        const userToDriver = getDistance(userLocation, driverLocation);
        const driverToStop = getDistance(driverLocation, stopLocation);
        const userToStop = getDistance(userLocation, stopLocation);
        setDistances({
            userToDriver,
            driverToStop,
            userToStop,
        })
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                {driverLocation && (
                    <View style={[styles.showBusLocationButton, { left: 10 }]} onTouchEnd={onBusLocationButtonPress}>
                        <Image source={BusImg} style={styles.busImage} />
                    </View>
                )}
                {stopLocation && (
                    <View style={[styles.showBusLocationButton, { left: '15%' }]} onTouchEnd={onStopLocationButtonPress}>
                        <Image source={StopImg} style={styles.busImage} />
                    </View>
                )}
                <MapView
                    ref={mapRef}
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    initialRegion={{
                        latitude: Number(userLocation?.latitude) || 12,
                        longitude: Number(userLocation?.longitude) || 12,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    }}
                    showsUserLocation={true}
                    showsMyLocationButton={true}>

                    {driverLocation && (
                        <Marker.Animated
                            coordinate={{
                                latitude: Number(driverLocation.latitude),
                                longitude: Number(driverLocation.longitude),
                            }}
                            title="Driver Location"
                            description="Current location of the driver"
                        >
                            <Image source={BusImg} style={styles.busImage} />
                        </Marker.Animated>
                    )}

                    {userLocation && driverLocation ? (
                        <MapViewDirections
                            origin={userLocation}
                            destination={driverLocation}
                            waypoints={[stopLocation]}
                            apikey={EXPO_GOOGLE_MAPS_API_KEY}
                            strokeColor="hotpink"
                            strokeWidth={4}
                        />
                    ) : null}
                    {/* {userLocation && stopLocation ? (
                        <MapViewDirections
                            origin={userLocation}
                            destination={stopLocation}
                            apikey={EXPO_GOOGLE_MAPS_API_KEY}
                            strokeColor="hotpink"
                            strokeWidth={4}
                        />
                    ) : null} */}
                    {stopLocation && (
                        <Marker.Animated
                            coordinate={{
                                latitude: Number(stopLocation.latitude),
                                longitude: Number(stopLocation.longitude),
                            }}
                            title="Bus Stop"
                            description="Current location of the stop"
                        >
                            <Image source={StopImg} style={styles.stopImage} />
                        </Marker.Animated>
                    )}
                </MapView>
                {distances.userToDriver && distances.driverToStop && distances.userToStop && (
                    <View style={styles.distanceContainer}>
                        <Text style={styles.distanceText}>User to Bus: {Number(distances.userToDriver / 1000).toFixed(1)} km</Text>
                        <Text style={styles.distanceText}>Bus to Stop: {Number(distances.driverToStop / 1000).toFixed(1)} km</Text>
                        <Text style={styles.distanceText}>User to Stop: {Number(distances.userToStop / 1000).toFixed(1)} km</Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    busImage: {
        width: 40,
        height: 40,
        resizeMode: 'cover',
    },
    stopImage: {
        width: 43,
        height: 43,
        resizeMode: 'cover',
    },
    showBusLocationButton: {
        position: 'absolute',
        top: 10,
        backgroundColor: 'white',
        padding: 5,
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        elevation: 5,
        zIndex: 1
    },
distanceContainer: {
    position: 'absolute',
    bottom: 20,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Slightly more opaque for better readability
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)', // Subtle border for depth
},
distanceText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333', // Darker text for better contrast
    marginBottom: 5, // Spacing between text lines
},
});

export default Trackingscreen