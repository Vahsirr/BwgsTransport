import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import PropTypes from 'prop-types';
import theme from '../themes/Theme';

function AppLoading({ delay = false }) {
  const [showLoading, setShowLoading] = useState(!delay);
  const bounceValue1 = new Animated.Value(1);
  const bounceValue2 = new Animated.Value(1);
  const bounceValue3 = new Animated.Value(1);

  useEffect(() => {
    if (delay) {
      const timer = setTimeout(() => {
        setShowLoading(true);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [delay]);
  
  const bounce = (value, delay) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(value, {
          toValue: 1.5,
          duration: 400,
          delay: delay,
          useNativeDriver: true,
        }),
        Animated.timing(value, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    bounce(bounceValue1, 0);
    bounce(bounceValue2, 200);
    bounce(bounceValue3, 400);
  }, []);

  if (!showLoading) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Loading</Text>
      <View style={styles.spinnerContainer}>
        <Animated.View style={[styles.bounce, { transform: [{ scale: bounceValue1 }] }]} />
        <Animated.View style={[styles.bounce, { transform: [{ scale: bounceValue2 }] }]} />
        <Animated.View style={[styles.bounce, { transform: [{ scale: bounceValue3 }] }]} />
      </View>
    </View>
  );
}

AppLoading.propTypes = {
  delay: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.backgroundColor,
    padding: 24,
  },
  text: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 16,
    color: theme.colors.textColor,
  },
  spinnerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 60,
  },
  bounce: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: theme.colors.primary,
  },
});

export default AppLoading;
