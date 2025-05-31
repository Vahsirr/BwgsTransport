import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
  AppState,
} from "react-native";
import { Card, Avatar } from "react-native-paper";
import UserMenu from "../../components/UserMenu";
import theme from "../../themes/Theme";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../slices/userSlice";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import { updateLocation } from "../../externalApis/locationApi";
import JwtService from "../../auth/services/jwtService";
import { getStop, selectStop } from "../../slices/stopStore/stopSlice";
import { getStops, selectStops } from "../../slices/stopStore/stopsSlice";
import { getRoute, selectRoute } from "../../slices/routeStore/routeSlice";
import {
  getTransport,
  getTransportByDriverId,
  selectTransport,
} from "../../slices/transportStore/transportSlice";
import AppLoading from "../../components/AppLoading";

function AppLayout(props) {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const stop = useSelector(selectStop);
  const stops = useSelector(selectStops);
  const route = useSelector(selectRoute);
  const transport = useSelector(selectTransport);
  const [loading, setloading] = useState(true);

  //Rishav
  const navigation = useNavigation();
  let locationInterval = useRef(null);
  const appState = useRef(AppState.currentState);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    if (user.role === "user") {
      dispatch(getStop(user.stop_id)).then((stopRes) => {
        const stop = stopRes.payload;
        dispatch(getRoute(stop.route_id)).then((routeRes) => {
          const route = routeRes.payload;
          dispatch(getTransport(route.transportId)).then(() =>
            setloading(false)
          );
        });
      });
    } else if (user.role === "driver") {
      dispatch(getTransportByDriverId(user.data.id)).then((transportRes) => {
        const transport = transportRes.payload;
        dispatch(getRoute(transport.route_id)).then((routeRes) => {
          const route = routeRes.payload;
          dispatch(getStops(route.id)).then(() => setloading(false));
        });
      });
    }
  }, [dispatch]);

  useEffect(() => {
    checkUserAuthentication();
    const onAutoLogout = () => {
      setAccessToken(null);
      stopTracking();
    };

    JwtService.on("onAutoLogout", onAutoLogout);
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => {
      if (locationInterval.current) clearInterval(locationInterval.current);
      subscription.remove();
      JwtService.removeListener("onAutoLogout", onAutoLogout);
    };
  }, []);

  useEffect(() => {
    if (accessToken) {
      checkLocationPermission();
    } else {
      stopTracking();
    }
  }, [accessToken]);

  const handleAppStateChange = async (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      // console.log("App has come to the foreground!");
      await checkUserAuthentication();
      if (accessToken) checkLocationPermission();
      else stopTracking();
    }
  };

  const checkUserAuthentication = async () => {
    try {
      const token = await JwtService.getAccessToken();
      if (token && JwtService.isAuthTokenValid(token)) {
        setAccessToken(token);
      } else {
        setAccessToken(null);
      }
    } catch (e) {
      // console.log("Error checking user authentication:", e);
    }
  };

  const checkLocationPermission = async () => {
    if (!accessToken) return;
    try {
      let enabled = await Location.hasServicesEnabledAsync();
      if (!enabled) {
        Alert.alert(
          "Location Permission",
          "Please enable location services to track the bus"
        );
        return;
      }

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Location Permission Denied",
          "Please allow location access to track the bus. Please enable it in settings.",
          [{ text: "go to settings", onPress: () => openSettings() }]
        );
        return;
      }

      startTracking();
    } catch (e) {
      // console.log("Error checking location:", e);
    }
  };

  const openSettings = () => {
    Linking.openSettings();
  };

  const startTracking = () => {
    if (locationInterval.current) return;
    getCurrentLocation();
    locationInterval.current = setInterval(getCurrentLocation, 15000);
  };

  const getCurrentLocation = async () => {
    if (!accessToken) {
      stopTracking();
      return;
    }
    try {
      const { coords } = await Location.getCurrentPositionAsync();
      if (!coords) {
        // console.log("No location found");
        return;
      }

      const { latitude, longitude } = coords;
      // console.log("Current Location:", latitude, longitude);
      if (!latitude || !longitude) return;
      const response = await updateLocation(longitude, latitude);
    } catch (e) {
      // console.log("Error getting current location:", e);
    }
  };

  const stopTracking = () => {
    if (locationInterval.current) {
      clearInterval(locationInterval.current);
      locationInterval.current = null;
    }
  };
  //Rishav

  if (loading) {
    return <AppLoading />;
  }

  return (
    <View style={[styles.container, props.style]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={styles.appBar.backgroundColor}
      />
      <View style={styles.appBar}>
        <View style={styles.leftContainer}></View>
        <View style={styles.rightContainer}>
          <UserMenu />
        </View>
      </View>

      <ScrollView style={styles.scrollViewContainer}>
        <Text style={styles.title}>Dashboard</Text>
        <View style={styles.cardContainer}>
          <Card style={[styles.card, { paddingBottom: 5 }]}>
            <Card.Content>
              <Text style={styles.cardTitle}>
                Transport No - {transport.id}
              </Text>
              <Avatar.Image
                source={{
                  uri: "https://jcbl.com/jcbl-images/products/school-bus/school-bus-front-1.jpg",
                }}
                size={50}
                style={{ position: "absolute", top: 15, right: 15 }}
              />
              <Text style={styles.cardSubtitle}>
                Reg. No : {transport.registrationNumber}
              </Text>
              <View
                style={{
                  marginTop: 65,
                  marginLeft: 5,
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "row",
                  width: "28%",
                }}
              >
                <Text style={[styles.cardDetail, { marginTop: 10 }]}>
                  Status
                </Text>
                {transport.status === "Active" && (
                  <Avatar.Image
                    source={{
                      uri: "https://www.shutterstock.com/image-vector/flat-round-check-mark-green-260nw-652023034.jpg",
                    }}
                    size={25}
                    style={{ marginTop: 10 }}
                  />
                )}
              </View>
            </Card.Content>
          </Card>
          {user.role === "user" && (
            <>
              <Card style={[styles.card, { paddingBottom: 80 }]}>
                <Card.Content>
                  <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                    Stoppage - {stop.stopName}
                  </Text>
                  <View
                    style={{
                      marginTop: 10,
                      padding: 15,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      height: "auto",
                      flexDirection: "row",
                      borderRadius: 20,
                      backgroundColor: theme.colors.primary,
                    }}
                  >
                    <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                      Arrival : {stop.arrivalTime}
                    </Text>
                    <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                      Departure: {stop.departureTime}
                    </Text>
                  </View>
                  <Text
                    style={{ marginTop: 10, fontWeight: "600", fontSize: 16 }}
                  >
                    Route : {route.startpoint} {`->`} {route.endpoint}
                  </Text>
                  <Text
                    style={{ marginTop: 10, fontWeight: "600", fontSize: 16 }}
                  >
                    Stop No. : {stop.stopOrder}
                  </Text>
                  <Text
                    style={{ marginTop: 10, fontWeight: "600", fontSize: 16 }}
                  >
                    Landmark : {stop.stopLandMark}
                  </Text>
                </Card.Content>
              </Card>
              <Card style={[styles.card, { padding: 16 }]}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    height: "auto",
                  }}
                >
                  {user.data.photoURL ? (
                    <Avatar.Image
                      size={40}
                      source={{ uri: user.data.photoURL }}
                    />
                  ) : (
                    <Avatar.Text size={40} label={transport.driverName[0]} />
                  )}
                  <Text
                    style={{ fontSize: 16, fontWeight: "bold", marginLeft: 10 }}
                  >
                    {transport.driverName}
                  </Text>
                </View>
                <Text
                  style={{ marginTop: 10, fontWeight: "600", fontSize: 16 }}
                >
                  Contact No : {transport.driverContact}
                </Text>
              </Card>
              <TouchableOpacity
                style={styles.trackButton}
                activeOpacity={0.7}
                onPress={() =>
                  navigation.navigate("tracking", {
                    driverId: transport.driverId,
                    stopData: stop,
                  })
                }
              >
                <Text style={styles.trackButtonText}>Track</Text>
              </TouchableOpacity>
            </>
          )}
          {user.role === "driver" && (
            <>
              <Card style={[styles.card, { paddingBottom: 80 }]}>
                <Card.Content>
                  <Text
                    style={{ marginTop: 10, fontWeight: "600", fontSize: 16 }}
                  >
                    Route : {route.startpoint} {`->`} {route.endpoint}
                  </Text>
                  {stops.map((stop) => (
                    <View
                      key={stop.id}
                      style={{
                        flex: 1,
                        padding: 16,
                        backgroundColor: theme.colors.backgroundColorSecond,
                      }}
                    >
                      <View style={styles.stopBox}>
                        <View style={styles.bulletPoint} />
                        <View style={styles.textContainer}>
                          {/* <Text style={styles.stopNumber}>
                            {stop.stopOrder}
                          </Text> */}
                          <Text style={styles.details}>{stop.stopName}</Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </Card.Content>
              </Card>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundColor,
  },
  appBar: {
    height: 64,
    backgroundColor: theme.colors.backgroundColorSecond,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  leftContainer: {
    flex: 1,
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  scrollViewContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: theme.colors.backgroundColor,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  cardContainer: {
    flexDirection: "column",
  },
  card: {
    flex: 1,
    marginBottom: 20,
    borderRadius: 16,
    backgroundColor: theme.colors.backgroundColorSecond,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    position: "absolute",
    top: 15,
    left: 15,
    fontSize: 25,
    fontWeight: "bold",
  },
  cardSubtitle: {
    fontSize: 16,
    fontWeight: "600",
    position: "absolute",
    top: 55,
    left: 20,
  },
  cardDetail: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  trackButton: {
    width: "100%",
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 2 },
    elevation: 6,
    marginTop: 10,
    marginBottom: 40
  },
  trackButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    textTransform: "uppercase",
  },
  stopBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFE082",
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  bulletPoint: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4A4A4A",
    marginRight: 12,
  },
  textContainer: {
    display: "flex",
    flexDirection: "row",
  },
  stopNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    marginLeft: 2,
    color: theme.colors.textColor,
  },
});

export default React.memo(AppLayout);
