
import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { DailyStats } from '../types';

interface ActivityChartProps {
  data: DailyStats[];
  dataKey: keyof DailyStats;
  color: string;
}

const ActivityChart: React.FC<ActivityChartProps> = ({ data, dataKey, color }) => {
  const screenWidth = Dimensions.get('window').width;

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => color,
    strokeWidth: 3, 
    barPercentage: 0.5,
    decimalPlaces: 0,
    propsForDots: {
        r: "0", // hide dots
        strokeWidth: "0",
        stroke: "#ffa726"
    },
    fillShadowGradientFrom: color,
    fillShadowGradientTo: color,
    fillShadowGradientFromOpacity: 0.2,
    fillShadowGradientToOpacity: 0.0,
  };

  const labels = data.map(d => new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }));
  const values = data.map(d => d[dataKey] as number);

  return (
    <View style={styles.container}>
      <LineChart
        data={{
          labels: labels,
          datasets: [
            {
              data: values
            }
          ]
        }}
        width={screenWidth - 70} // adjust for card padding
        height={180}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withDots={false}
        withInnerLines={true}
        withOuterLines={false}
        withVerticalLines={false}
        yAxisInterval={1}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    alignItems: 'center',
    overflow: 'hidden'
  },
  chart: {
    paddingRight: 0,
    paddingLeft: 0,
  }
});

export default ActivityChart;
