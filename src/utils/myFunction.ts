import {
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
} from 'react-native';
import Geocoder from 'react-native-geocoder-reborn';

const hasLocationPermission = async () => {
  if (Platform.OS === 'android' && Platform.Version < 23) {
    return true;
  }

  const hasPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (status === PermissionsAndroid.RESULTS.GRANTED) {
    return true;
  }

  if (status === PermissionsAndroid.RESULTS.DENIED) {
    ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG);
  } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    ToastAndroid.show(
      'Location permission revoked by user.',
      ToastAndroid.LONG,
    );
  }

  return false;
};

const hasLocationPermissionBg = async () => {
  if (Platform.OS === 'android' && Platform.Version < 23) {
    return true;
  }

  const hasPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
  );

  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
  );

  if (status === PermissionsAndroid.RESULTS.GRANTED) {
    return true;
  }

  if (status === PermissionsAndroid.RESULTS.DENIED) {
    Alert.alert(
      'Location Permission',
      'Permission Lokasi harus di Izinkan Sepanjang Waktu!',
      [{text: 'Open Setting', onPress: () => Linking.openSettings()}],
      {cancelable: false},
    );
  } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    Alert.alert(
      'Location Permission',
      'Permission Lokasi harus di Izinkan Sepanjang Waktu!',
      [{text: 'Open Setting', onPress: () => Linking.openSettings()}],
      {cancelable: false},
    );
  }

  return false;
};

const getAddress = async (lat: number, lng: number) => {
  try {
    const response = await Geocoder.geocodePosition({
      lat,
      lng,
    });

    return response[0];
  } catch (err) {
    console.log('get address err: ', err);
  }
};

export {hasLocationPermission, hasLocationPermissionBg, getAddress};
