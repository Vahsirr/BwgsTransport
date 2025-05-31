import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import jwtService from '../../auth/services/jwtService';
import { Link } from '@react-navigation/native';
import _ from '../../utils/AppLodash';
import { useDispatch } from 'react-redux';
import { showMessage } from '../../slices/messageSlice';
import theme from '../../themes/Theme';

const schema = yup.object().shape({
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .required('Please enter your password.')
});

const defaultValues = {
  email: '',
  password: ''
};

const SignInScreen = () => {
  const { control, formState, handleSubmit } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });
  const dispatch = useDispatch();
  const { isValid, dirtyFields, errors } = formState;

  const onSubmit = async ({ email, password }) => {
    try {
      await jwtService.signInWithEmailAndPassword(email, password);
    } catch (error) {
      dispatch(showMessage({ message: "Invalid credentials!", variant: "error" }))
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>

        <Text style={styles.title}>Sign in</Text>
        <View style={styles.signUpContainer}>
          <Text>Don't have an account?</Text>
          <TouchableOpacity onPress={() => { }}></TouchableOpacity>
          <Link to={{ screen: 'signUp' }} style={styles.signUpLink}>
            Sign up
          </Link>
        </View>

        <View style={styles.form}>

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
          {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

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
                theme={{ colors: styles.inputTheme }}
              />
            )}
          />
          {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

          <View style={styles.forgotPassContainer}>
            <Link to={{ screen: 'forgotPassword' }} style={styles.forgotPasswordLink}>
              Forgot password?
            </Link>
          </View>

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            disabled={_.isEmpty(dirtyFields) || !isValid}
            style={styles.signInButton}
            labelStyle={styles.signInButtonLabel}
          >
            Sign in
          </Button>

        </View>
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
    flexDirection: 'row',
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

export default SignInScreen;
