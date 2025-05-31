import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Snackbar, Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import {
  hideMessage,
  selectAppMessageOptions,
  selectAppMessageState,
} from '../slices/messageSlice';
import AppSvgIcon from './AppSvgIcon';

const variantStyles = {
  success: { backgroundColor: '#4CAF50', color: '#FFFFFF' }, // Green
  error: { backgroundColor: '#F44336', color: '#FFFFFF' },   // Red
  info: { backgroundColor: '#2196F3', color: '#FFFFFF' },    // Blue
  warning: { backgroundColor: '#FFC107', color: '#FFFFFF' }, // Amber
};

const variantIcon = {
  success: 'check_circle',
  warning: 'warning',
  error: 'error_outline',
  info: 'info',
};

function AppMessage() {
  const dispatch = useDispatch();
  const state = useSelector(selectAppMessageState);
  const options = useSelector(selectAppMessageOptions);

  const handleClose = () => dispatch(hideMessage());

  const styles = StyleSheet.create({
    snackbarContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      alignItems: 'center',
      marginTop: 80,
      zIndex: 1000,
    },
    snackbar: {
      backgroundColor: variantStyles[options.variant]?.backgroundColor || '#323232',
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      marginRight: 8,
    },
    message: {
      color: variantStyles[options.variant]?.color || '#FFFFFF',
      flex: 1,
    },
  });

  return (
    <View style={styles.snackbarContainer}>
      <Snackbar
        visible={state}
        onDismiss={handleClose}
        style={styles.snackbar}
        duration={options.autoHideDuration || 3000}
        action={{
          label: 'Close',
          onPress: handleClose,
        }}
      >
        <View style={styles.content}>
          {/* {variantIcon[options.variant] && (
            <AppSvgIcon
              children={variantIcon[options.variant]}
              size={24}
              color={variantStyles[options.variant]?.color || '#FFFFFF'}
              style={styles.icon}
            />
          )} */}
          <Text style={styles.message}>{options.message}</Text>
        </View>
      </Snackbar>
    </View>
  );
}

export default memo(AppMessage);
