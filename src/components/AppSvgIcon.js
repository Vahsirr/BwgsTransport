import React, { forwardRef, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import Svg, { Use } from 'react-native-svg';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AppSvgIcon = forwardRef((props, ref) => {
  const { children, size, style, color } = props;

  const iconPath = useMemo(() => {
    return children.includes(':') ? children.replace(':', '.svg#') : null;
  }, [children]);

  return useMemo(() => {
    if (!iconPath) {
      // Use MaterialIcons for standard icons
      return (
        <Icon
          ref={ref}
          name={children}
          size={size}
          color={color}
          style={[styles.icon, style]}
        />
      );
    } else {
      // Use react-native-svg for custom SVG icons
      return (
        <View
          ref={ref}
          style={[
            styles.svgContainer,
            { width: size, height: size },
            style,
          ]}
        >
          <Svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <Use href={`assets/icons/${iconPath}`} fill={color} />
          </Svg>
        </View>
      );
    }
  }, [iconPath, children, size, color, style, ref]);
});

AppSvgIcon.propTypes = {
  children: PropTypes.string.isRequired,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  style: PropTypes.object,
  color: PropTypes.string,
};

AppSvgIcon.defaultProps = {
  size: 24,
  style: {},
  color: 'black',
};

export default AppSvgIcon;

const styles = StyleSheet.create({
  svgContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    alignSelf: 'center',
  },
});
