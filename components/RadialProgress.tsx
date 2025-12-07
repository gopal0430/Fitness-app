
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

interface RadialProgressProps {
  value: number;
  max: number;
  color: string;
  size: number;
  strokeWidth: number;
  label?: string;
  icon?: React.ReactNode;
}

const RadialProgress: React.FC<RadialProgressProps> = ({ 
  value, 
  max, 
  color, 
  size, 
  strokeWidth,
  label,
  icon
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = Math.min(value / max, 1);
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ transform: [{ rotate: '-90deg' }] }}>
        <Svg width={size} height={size}>
          {/* Background Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </Svg>
      </View>
      <View style={StyleSheet.absoluteFill}>
        <View style={styles.centerContent}>
            {icon && <View style={styles.iconWrapper}>{icon}</View>}
            <Text style={styles.valueText}>{value}</Text>
            {label && <Text style={styles.labelText}>{label}</Text>}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    marginBottom: 4,
  },
  valueText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
  },
  labelText: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: '600',
  }
});

export default RadialProgress;
