// import React in our code
import React, {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import all the components we are going to use
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';

//import DeviceInfo which will help us to get UniqueId
import DeviceInfo from 'react-native-device-info';


const storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value)
    //console.log(jsonValue)
    await AsyncStorage.setItem('deviceIdo', jsonValue)
  } catch (e) {
    // saving error
    console.log(e)
  }
}

const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('deviceIdo')
    //console.log("getData",jsonValue)
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch(e) {
    console.log(e)
    // error reading value
  }
}


const App = () => {
  const [deviceId, setDeviceId] = useState('Click below to get unique Id');

  const getdeviceId = () => {
    var uniqueId = DeviceInfo.getUniqueId();
    setDeviceId("eee");
    let o = {};
    o.uniqueId = uniqueId
    storeData(o);
  };

  const [check, setCheck] = React.useState(null);

  React.useEffect(() => {
      async function checkData() {
          const data = await getData();
          setCheck(data.uniqueId);
      }
      checkData();

  }, []);


  const getDataUsingGet = () => {
    //GET request
    fetch('http://127.0.0.1:5000/v1/getTokens/Bitcoin/', {
      method: 'GET',
      //Request Type
    })
      .then((response) => response.json())
      //If response is in json then in success
      .then((responseJson) => {
        //Success
        alert(JSON.stringify(responseJson));
        console.log(responseJson);
      })
      //If response is not in json then in error
      .catch((error) => {
        //Error
        alert(JSON.stringify(error));
        console.error(error);
      });
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
            SHOW ME THE UNIQUE ID OF DEVICE {check}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={styles.buttonStyle}
            onPress={getDataUsingGet}>
            <Text style={styles.textStyle}>
              Get Data Using GET
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={getDataUsingGet}
            style={styles.touchableOpacityStyle}>
            <Image
              // FAB using TouchableOpacity with an image
              // For online image
              source={{
                uri:
                  'https://raw.githubusercontent.com/AboutReact/sampleresource/master/plus_icon.png',
              }}
              // For local image
              //source={require('./images/float-add-icon.png')}
              style={styles.floatingButtonStyle}
            />
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
  touchableOpacityStyle: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
  },
  floatingButtonStyle: {
    resizeMode: 'contain',
    width: 50,
    height: 50,
    //backgroundColor:'black'
  },
});