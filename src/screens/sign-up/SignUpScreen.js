import React, { useEffect, useState } from "react";
import { ActivityIndicator, View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Button, Menu, TextInput } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import jwtService from "../../auth/services/jwtService";
import { Link, useNavigation } from "@react-navigation/native";
import _ from "../../utils/AppLodash";
import { useDispatch, useSelector } from "react-redux";
import {
  getOrganizations,
  selectOrganizations,
} from "../../slices/organizationStore/organizationsSlice";
import { getStops, selectStops } from "../../slices/stopStore/stopsSlice";
import AppLoading from "../../components/AppLoading";
import { getRoutes, selectRoutes } from "../../slices/routeStore/routesSlice";
import { showMessage } from '../../slices/messageSlice';
import theme from "../../themes/Theme";
import { ScrollView } from "react-native"

const schema = yup.object().shape({
  organization_id: yup.number().required("Select an organization"),
  route_id: yup.number().required("Select your route"),
  stop_id: yup.number().required("Select your stop"),
  firstname: yup.string().required("Enter first name"),
  lastname: yup.string().required("Enter last name"),
  email: yup.string().email("Enter a valid email").required("Enter an email"),
  mobile: yup
    .string()
    .required("Enter your mobile number")
    .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  password: yup
    .string()
    .required("Enter your password.")
    .min(8, "Password is too short - should be 8 chars minimum."),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

const defaultValues = {
  organization_id: 1,
  route_id: "",
  stop_id: "",
  firstname: "",
  lastname: "",
  email: "",
  mobile: "",
  password: "",
  passwordConfirm: "",
};

function SignUpScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const organizations = useSelector(selectOrganizations);
  const routes = useSelector(selectRoutes);
  const stops = useSelector(selectStops);
  const [countryCode, setCountryCode] = useState("+91");
  const [menuVisible, setMenuVisible] = useState(false);
  const [organizationMenuVisible, setOrganizationMenuVisible] = useState(false);
  const [routeMenuVisible, setRouteMenuVisible] = useState(false);
  const [stopMenuVisible, setStopMenuVisible] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [loading, setloading] = useState(true);
  const [signUpButtonLoading, setSignUpButtonLoading] = useState(false)

  const { control, formState, handleSubmit, watch } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;
  const { route_id } = watch();

  const onSubmit = ({ organization_id, stop_id, firstname, lastname, email, mobile, password }) => {
    setSignUpButtonLoading(true);
    const mobilenumber = countryCode + " " + mobile;
    const name = firstname + lastname;
    jwtService.sendOtp({ email }).then((res) => {
      if (res.status === "success") {
        dispatch(showMessage({ message: res.message, variant: "success" }))
        navigation.navigate("otp", { organization_id, stop_id, name, email, mobilenumber, password })
        setSignUpButtonLoading(false);
      }
    })
  };

  useEffect(() => {
    dispatch(getOrganizations()).then((res) => {
      const organization = res.payload.find((item) => item.id === 1);
      if (organization) {
        const organizationId = organization.id;
        dispatch(getRoutes(organizationId)).then(() => setloading(false));
      }
    });
  }, [dispatch]);

  useEffect(() => {
    if (route_id && route_id !== "") {
      setloading(true);
      setDisabled(false);
      dispatch(getStops(route_id)).then(() => setloading(false));
    }
  }, [route_id, dispatch]);

  if (loading) {
    return <AppLoading />;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Sign Up</Text>
          <View style={styles.signInContainer}>
            <Text>Already have an account?</Text>
            <TouchableOpacity onPress={() => { }}></TouchableOpacity>
            <Link to={{ screen: "signIn" }} style={styles.signInLink}>
              Sign in
            </Link>
          </View>

          <View style={styles.form}>
            <Controller
              name="organization_id"
              control={control}
              render={({ field }) => {
                const selectedOrganization = organizations.find(
                  (org) => org.id === field.value
                );

                return (
                  <Menu
                    visible={organizationMenuVisible}
                    onDismiss={() => setOrganizationMenuVisible(false)}
                    anchor={
                      <TouchableOpacity
                        onPress={() => setOrganizationMenuVisible(true)}
                        style={[
                          styles.menuButton,
                          { color: "rgba(0, 0, 0, 0.38)" },
                        ]}
                        disabled={true}
                      >
                        <Text
                          style={[
                            styles.menuButtonText,
                            { color: "rgba(0, 0, 0, 0.38)" },
                          ]}
                        >
                          {selectedOrganization?.organization_name ||
                            "Select Organization"}
                        </Text>
                      </TouchableOpacity>
                    }
                  >
                    {organizations.map((org, index) => (
                      <Menu.Item
                        key={index}
                        onPress={() => {
                          field.onChange(org.id);
                          setOrganizationMenuVisible(false);
                        }}
                        title={org.organization_name}
                      />
                    ))}
                  </Menu>
                );
              }}
            />
            {errors.organization_id && (
              <Text style={styles.errorText}>
                {errors.organization_id.message}
              </Text>
            )}

            <Controller
              name="route_id"
              control={control}
              render={({ field }) => {
                const selectedRoute = routes.find(
                  (route) => route.id === field.value
                );

                return (
                  <Menu
                    visible={routeMenuVisible}
                    onDismiss={() => setRouteMenuVisible(false)}
                    anchor={
                      <TouchableOpacity
                        onPress={() => setRouteMenuVisible(true)}
                        style={styles.menuButton}
                      >
                        <Text style={styles.menuButtonText}>
                          {selectedRoute?.route_name || "Select Route"}
                        </Text>
                      </TouchableOpacity>
                    }
                  >
                    {routes.map((route, index) => (
                      <Menu.Item
                        key={index}
                        onPress={() => {
                          field.onChange(route.id);
                          setRouteMenuVisible(false);
                        }}
                        title={route.route_name}
                      />
                    ))}
                  </Menu>
                );
              }}
            />
            {errors.route_id && (
              <Text style={styles.errorText}>{errors.route_id.message}</Text>
            )}

            <Controller
              name="stop_id"
              control={control}
              render={({ field }) => {
                const selectedStop = stops.find(
                  (stop) => stop.id === field.value
                );

                return (
                  <Menu
                    visible={stopMenuVisible}
                    onDismiss={() => setStopMenuVisible(false)}
                    anchor={
                      <TouchableOpacity
                        onPress={() => setStopMenuVisible(true)}
                        disabled={disabled}
                        style={[
                          styles.menuButton,
                          disabled && { color: "rgba(0, 0, 0, 0.38)" },
                        ]}
                      >
                        <Text
                          style={[
                            styles.menuButtonText,
                            disabled && { color: "rgba(0, 0, 0, 0.38)" },
                          ]}
                        >
                          {selectedStop?.stopName || "Select Stop"}
                        </Text>
                      </TouchableOpacity>
                    }
                  >
                    {stops.map((stop, index) => (
                      <Menu.Item
                        key={index}
                        onPress={() => {
                          field.onChange(stop.id);
                          setStopMenuVisible(false);
                        }}
                        title={stop.stopName}
                      />
                    ))}
                  </Menu>
                );
              }}
            />
            {errors.stop_id && (
              <Text style={styles.errorText}>{errors.stop_id.message}</Text>
            )}

            <Controller
              name="firstname"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  label="First Name"
                  mode="outlined"
                  autoCapitalize="none"
                  keyboardType="default"
                  returnKeyType="next"
                  autoComplete="name-given"
                  textContentType="givenName"
                  error={!!errors.firstname}
                  onChangeText={field.onChange}
                  style={styles.input}
                />
              )}
            />
            {errors.firstname && (
              <Text style={styles.errorText}>{errors.firstname.message}</Text>
            )}

            <Controller
              name="lastname"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  label="Last Name"
                  mode="outlined"
                  autoCapitalize="none"
                  keyboardType="default"
                  returnKeyType="next"
                  autoComplete="name-family"
                  textContentType="familyName"
                  error={!!errors.lastname}
                  onChangeText={field.onChange}
                  style={styles.input}
                />
              )}
            />
            {errors.lastname && (
              <Text style={styles.errorText}>{errors.lastname.message}</Text>
            )}

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  label="Email"
                  mode="outlined"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  autoComplete="email"
                  textContentType="emailAddress"
                  error={!!errors.email}
                  onChangeText={field.onChange}
                  style={styles.input}
                />
              )}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email.message}</Text>
            )}

            <View style={styles.mobileContainer}>
              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                  <TouchableOpacity
                    onPress={() => setMenuVisible(true)}
                    style={styles.countryCodeButton}
                  >
                    <Text style={styles.countryCodeText}>{countryCode}</Text>
                  </TouchableOpacity>
                }
              >
                <Menu.Item
                  onPress={() => setCountryCode("+91")}
                  title="+91 (India)"
                />
              </Menu>

              <Controller
                name="mobile"
                control={control}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    label="Mobile"
                    mode="outlined"
                    keyboardType="phone-pad"
                    returnKeyType="done"
                    autoComplete="tel"
                    textContentType="telephoneNumber"
                    placeholder="Enter your mobile number"
                    maxLength={10}
                    error={!!errors.mobile}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    style={styles.mobileInput}
                  />
                )}
              />
            </View>
            {errors.mobile && (
              <Text style={styles.errorText}>{errors.mobile.message}</Text>
            )}

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  label="Password"
                  mode="outlined"
                  secureTextEntry
                  textContentType="password"
                  autoComplete="password"
                  placeholder="Enter your password"
                  returnKeyType="done"
                  maxLength={128}
                  error={!!errors.password}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  style={styles.input}
                />
              )}
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password.message}</Text>
            )}

            <Controller
              name="passwordConfirm"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  label="Confirm Password"
                  mode="outlined"
                  secureTextEntry={!showPasswordConfirm}
                  textContentType="password"
                  autoComplete="password"
                  placeholder="Re-enter your password"
                  returnKeyType="done"
                  maxLength={128}
                  error={!!errors.passwordConfirm}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  style={styles.input}
                  right={
                    <TextInput.Icon
                      name={showPasswordConfirm ? "eye-off" : "eye"}
                      onPress={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    />
                  }
                />
              )}
            />
            {errors.passwordConfirm && (
              <Text style={styles.errorText}>
                {errors.passwordConfirm.message}
              </Text>
            )}

            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              disabled={_.isEmpty(dirtyFields) || !isValid || signUpButtonLoading}
              style={styles.signUpButton}
              labelStyle={styles.signUpButtonLabel}
              icon={signUpButtonLoading ? () => <ActivityIndicator size="small" color={theme.colors.primary} /> : null}
            >
              {!signUpButtonLoading ? 'Sign up' : 'Signing up...'}
            </Button>
          </View>
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16
  },
  formContainer: {
    width: "100%",
    backgroundColor: theme.colors.backgroundColorSecond,
    padding: 20,
    borderRadius: 10,
    maxWidth: 320,
  },
  logo: {
    textAlign: "center",
    fontSize: 32,
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 12,
    textAlign: "center",
  },
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  signInLink: {
    marginLeft: 4,
    fontStyle: 'extrabold',
    color: "blue",
  },
  form: {
    marginTop: 32,
  },
  input: {
    marginBottom: 16,
  },
  errorText: {
    color: "red",
    marginBottom: 8,
  },
  signUpButton: {
    marginTop: 16,
  },
  signUpButtonLabel: {
    color: theme.colors.textColor
  },
  mobileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  countryCodeButton: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    paddingHorizontal: 12,
    height: 56,
    marginRight: 8,
  },
  countryCodeText: {
    fontSize: 16,
  },
  mobileInput: {
    flex: 1,
    height: 56,
  },
  menuButton: {
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: "white",
    justifyContent: "center",
    marginBottom: 16,
  },
  menuButtonText: {
    fontSize: 16,
    color: "rgba(0, 0, 0, 0.87)",
  },
});

export default SignUpScreen;
