import {
  Button,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HomeParamList} from '../types';
import {ScreenWidth} from '../utils/screenSize';
import {mainSoftColor} from '../utils/colors';
import {ImageObj} from '../types/image';
import {useCreateChannelNotif, useDisclosure, useGetPermission} from '../hooks';
import {ModalCamera} from '../components';
import notifee, {AndroidImportance} from '@notifee/react-native';

type Props = NativeStackScreenProps<HomeParamList, 'Home'>;

const initialImg =
  'https://cdn.pixabay.com/photo/2023/02/11/13/43/building-7782841_960_720.jpg';

const Home = ({navigation}: Props) => {
  const [img, setImg] = useState<ImageObj>({
    name: '',
    uri: initialImg,
    type: 'image/jpeg',
  });

  const {isOpen, onOpen, onClose} = useDisclosure();
  const {createChannel} = useCreateChannelNotif();

  const onDisplayNotif = useCallback(async () => {
    try {
      await notifee.displayNotification({
        title: 'Notification Title',
        body: 'Main body content of the notification',
        android: {
          channelId: 'important',
          // pressAction is needed if you want the notification to open the app when pressed
          pressAction: {
            id: 'default',
          },
          sound: Platform.Version < 26 ? 'appsound' : undefined,
          importance: AndroidImportance.HIGH,
        },
      });
    } catch (error) {
      console.log('error notif', error);
    }
  }, []);

  useGetPermission({
    onFinish: async () => {
      await createChannel();
    },
  });

  return (
    <>
      <ModalCamera
        visible={isOpen}
        onClose={onClose}
        onFinish={value => setImg(value)}
      />
      <View style={styles.container}>
        <Text>Home</Text>
        <TouchableOpacity onPress={onOpen}>
          <Image
            source={{uri: img.uri}}
            resizeMode="cover"
            style={{
              width: ScreenWidth * 0.8,
              height: 300,
              backgroundColor: mainSoftColor,
            }}
          />
        </TouchableOpacity>
        <Button title="Display Notif" onPress={onDisplayNotif} />
        <Button
          title="Go to Details"
          onPress={() => navigation.navigate('DetailsScreen')}
        />
      </View>
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
