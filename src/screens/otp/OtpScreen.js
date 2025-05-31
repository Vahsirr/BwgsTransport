import React, { useState } from 'react';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import jwtService from '../../auth/services/jwtService';
import _ from '../../utils/AppLodash';
import { useDispatch } from 'react-redux';
import { showMessage } from '../../slices/messageSlice';
import theme from '../../themes/Theme';
import { useNavigation } from '@react-navigation/native';

const OtpScreen = (props) => {

    const schema = yup.object().shape({
        otp: yup.string().required('Please enter your otp.')
    });

    const defaultValues = {
        email: props?.route?.params?.email,
        otp: ''
    };

    const { control, formState, handleSubmit } = useForm({
        mode: 'onChange',
        defaultValues,
        resolver: yupResolver(schema),
    });
    const [enableResendOtpButton, setEnableResendOtpButton] = useState(false)
    const [loading, setloading] = useState(false)
    const [emailVerified, setEmailVerified] = useState(false)
    const navigation = useNavigation();

    const dispatch = useDispatch();
    const { isValid, dirtyFields, errors } = formState;

    const onSubmit = async ({ email, otp }) => {
        setloading(true)
        jwtService.verifyOtp({ email, otp }).then((res) => {
            if (res.status === 'success') {
                dispatch(showMessage({ message: res.message, variant: "success" }))
                setEmailVerified(true);
                setloading(false);
                // jwtService.createUser(props?.route?.params).then((response) => {
                //     if (response.status === 200 && response.data.message.split(' ').includes("already")) {
                //       dispatch(showMessage({ message: response.data.message, variant: "error" }))
                //       navigation.navigate("signUp");
                //     } else if (response.status === 200) {
                //       dispatch(showMessage({ message: response.data.message, variant: 'success' }))
                //       navigation.navigate("signIn");
                //     }
                //   }).catch((error) => {
                //     dispatch(showMessage({ message: error.message, variant: "error" }))
                //   });
                jwtService.createUser(props?.route?.params).then((response) => {
                    if (response.status === 200 && response.data.message.split(' ').includes("already")) {
                      dispatch(showMessage({ message: response.data.message, variant: "error" }))
                      navigation.navigate("signUp");
                    } else if (response.status === 400 && response.data.message?.includes("recently deleted")) {
                      dispatch(showMessage({ 
                        message: response.data.message, 
                        variant: "error" ,
                        autoHideDuration: 5000
                      }));
                      navigation.navigate("signUp");
                    } else if (response.status === 200) {
                      dispatch(showMessage({ message: response.data.message, variant: 'success' }))
                      navigation.navigate("signIn");
                    }
                  }).catch((error) => {
                    dispatch(showMessage({ message: error.message, variant: "error" }))
                  });
            } else if (res.status === 'failed') {
                dispatch(showMessage({ message: "Invalid OTP!", variant: "error" }))
                setEnableResendOtpButton(true);
                setloading(false);
            }
        })
    };

    const sendOtp = async () => {
        setloading(true)
        const email = props?.route?.params?.email;
        jwtService.sendOtp({ email }).then((res) => {
            if (res.status === "success") {
                dispatch(showMessage({ message: res.message, variant: "success" }))
                setEnableResendOtpButton(false);
                setloading(false);
            }
        })
    }

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>

                <Text style={styles.title}>{!emailVerified ? 'OTP' : 'Creating User...'}</Text>
                {!emailVerified && <View style={styles.signUpContainer}>
                    <Text>OTP sent on your email</Text>
                    <Text style={{ fontSize: 20 }}>{props?.route?.params?.email}</Text>
                </View>}

                {!emailVerified && <View style={styles.form}>

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
                                disabled={true}
                                textContentType="emailAddress"
                                error={!!errors.email}
                                onChangeText={field.onChange}
                                style={styles.input}
                            />
                        )}
                    />
                    {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

                    {
                        !enableResendOtpButton &&
                        <Controller
                            name="otp"
                            control={control}
                            render={({ field }) => (
                                <TextInput
                                    {...field}
                                    label="OTP"
                                    mode="outlined"
                                    secureTextEntry
                                    textContentType="oneTimeCode"
                                    autoComplete="oneTimeCode"
                                    placeholder="Enter your OTP"
                                    returnKeyType="done"
                                    maxLength={6}
                                    error={!!errors.otp}
                                    onChangeText={field.onChange}
                                    onBlur={field.onBlur}
                                    style={styles.input}
                                    theme={{ colors: styles.inputTheme }}
                                />
                            )}
                        />
                    }
                    {errors.otp && <Text style={styles.errorText}>{errors.otp.message}</Text>}

                    {
                        !enableResendOtpButton
                            ?
                            <Button
                                mode="contained"
                                onPress={handleSubmit(onSubmit)}
                                disabled={_.isEmpty(dirtyFields) || !isValid || loading}
                                style={styles.signInButton}
                                labelStyle={styles.signInButtonLabel}
                                icon={loading ? () => <ActivityIndicator size="small" color="#fffff" /> : null}
                            >
                                {loading ? 'Verifying...' : 'Verify OTP'}
                            </Button>
                            :
                            <Button
                                mode="contained"
                                onPress={() => sendOtp()}
                                style={styles.signInButton}
                                labelStyle={styles.signInButtonLabel}
                                disabled={loading}
                                icon={loading ? () => <ActivityIndicator size="small" color="#fffff" /> : null}
                            >
                                {loading ? 'Sending...' : 'Resend OTP'}
                            </Button>
                    }

                </View>}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: theme.colors.backgroundColor,
        alignItems: 'center',
        padding: 16,
    },
    formContainer: {
        width: '100%',
        backgroundColor: theme.colors.backgroundColorSecond,
        padding: 20,
        borderRadius: 10,
        maxWidth: 320,
    },
    logo: {
        textAlign: 'center',
        fontSize: 32,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 12,
        textAlign: 'center',
    },
    signUpContainer: {
        textAlign: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        marginTop: 8,
    },
    signUpLink: {
        marginLeft: 4,
        fontStyle: 'extrabold',
        color: 'blue',
    },
    form: {
        marginTop: 32,
    },
    input: {
        marginBottom: 16,
    },
    inputTheme: {
        background: 'transparent'
    },
    errorText: {
        color: 'red',
        marginBottom: 8,
    },
    forgotPassContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    forgotPasswordLink: {
        color: 'blue',
        fontStyle: "extrabold"
    },
    signInButton: {
        marginTop: 16,
    },
    signInButtonLabel: {
        color: theme.colors.textColor
    }
});

export default OtpScreen;
