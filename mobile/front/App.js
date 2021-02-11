// import React in our code
import React, {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import all the components we are going to use
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

//import DeviceInfo which will help us to get UniqueId
import DeviceInfo from 'react-native-device-info';


const storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value)
    console.log(jsonValue)
    await AsyncStorage.setItem('deviceId', jsonValue)
  } catch (e) {
    // saving error
    console.log(e)
  }
}

const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('deviceId')
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch(e) {
    console.log(e)
    // error reading value
  }
}


const App = () => {
  const [deviceId, setDeviceId] = 
    useState('Click below to get unique Id');

  const getdeviceId = () => {
    var uniqueId = DeviceInfo.getUniqueId();
    setDeviceId(uniqueId);
    storeData(uniqueId);
    console.log(uniqueId,getData());
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.titleStyle}>
          Cryptolio !!
        </Text>
        <Text style={styles.textStyle}>
          {deviceId}
        </Text>
        <TouchableOpacity
          onPress={getdeviceId}
          activeOpacity={0.5}
          style={styles.buttonStyle}>
          <Text style={styles.buttonTextStyle}>
            SHOW ME THE UNIQUE ID OF DEVICE
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleStyle: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  buttonStyle: {
    padding: 10,
    backgroundColor: '#646464',
  },
  buttonTextStyle: {
    color: '#fff',
    textAlign: 'center',
  },
  textStyle: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 10,
    padding: 20,
    color: '#f00',
  },
});