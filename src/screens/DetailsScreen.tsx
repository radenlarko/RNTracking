import {Button, StyleSheet, Text, View} from 'react-native';
import React, {useContext, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HomeParamList} from '../types';
import {MainContext} from '../store/MainContext';
import {useTracking} from '../hooks';

type Props = NativeStackScreenProps<HomeParamList, 'DetailsScreen'>;

const DetailsScreen = ({navigation}: Props) => {
  const {intervalId} = useContext(MainContext);
  const [counterVal, setCounterVal] = useState(0);

  const {startForeground, stopForeground} = useTracking({
    onInterval: val => setCounterVal(val),
  });

  return (
    <View style={styles.container}>
      <Text>DetailsScreen {intervalId}</Text>
      {intervalId !== null ? (
        <View>
          <Text>Tracking is Running {counterVal > 0 ? counterVal : '..'}</Text>
          <Button title="Stop Foreground" onPress={stopForeground} />
        </View>
      ) : (
        <View>
          <Button title="Start Foreground" onPress={startForeground} />
        </View>
      )}
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default DetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
