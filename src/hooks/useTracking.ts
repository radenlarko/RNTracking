import {useCallback, useContext, useLayoutEffect, useRef} from 'react';
import notifee, {
  AndroidImportance,
  EventType,
  Notification,
} from '@notifee/react-native';
import {MainContext} from '../store/MainContext';
import Geolocation from 'react-native-geolocation-service';
import {myToast} from '../utils/myToast';
import {
  getAddress,
  hasLocationPermission,
  hasLocationPermissionBg,
} from '../utils/myFunction';

const defaultConfig: Notification = {
  id: 'trackingloc',
  title: 'Tracking your Location',
  body: 'Tracking is running..',
  android: {
    channelId: 'tracking',
    asForegroundService: true,
    pressAction: {
      id: 'default',
    },
    importance: AndroidImportance.LOW,
  },
};

const waktu = (timestamp: number) => {
  const jam = new Date(timestamp).getHours();
  const menit = new Date(timestamp).getMinutes();

  return `${jam}.${menit}`;
};

const postTracking = (counter: number) => {
  Geolocation.getCurrentPosition(
    async position => {
      const {latitude, longitude} = position.coords;
      const {timestamp} = position;

      if (!latitude) {
        return;
      }

      const alamat = await getAddress(latitude, longitude);

      if (alamat) {
        const {formattedAddress} = alamat;
        fetch('https://jsonplaceholder.typicode.com/posts', {
          method: 'POST',
          body: JSON.stringify({
            title: `Tracking ${counter} (${latitude}, ${longitude}) | ${waktu(
              timestamp,
            )}`,
            body: formattedAddress,
            userId: 1,
          }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        })
          .then(response => response.json())
          .then(async json => {
            console.log('success post: ', json);

            await notifee.displayNotification({
              ...defaultConfig,
              title: 'Tracking Started',
              body: `Tracking is running ${counter} (${latitude}, ${longitude}) | ${waktu(
                timestamp,
              )}`,
            });

            myToast(`(${latitude}, ${longitude}) | ${waktu(timestamp)}`);
          })
          .catch(err => console.log('error tracking: ', err));
      }
    },
    error => {
      console.log(error);
    },
    {
      accuracy: {
        android: 'high',
        ios: 'best',
      },
      enableHighAccuracy: false,
      distanceFilter: 0,
      timeout: 5000,
      maximumAge: 3000,
      forceRequestLocation: false,
      forceLocationManager: false,
      showLocationDialog: true,
    },
  );
};

const useTracking = (onInterval?: (val: number) => void) => {
  const {intervalId, setIntervalId} = useContext(MainContext);

  const savedOnInterval = useRef<(val: number) => void>(() => {});

  savedOnInterval.current = value => {
    if (onInterval) {
      onInterval(value);
    }
  };

  const startForeground = useCallback(async () => {
    const hasPermission = await hasLocationPermission();

    const hasPermissionBg = await hasLocationPermissionBg();

    if (!hasPermission || !hasPermissionBg) {
      return;
    }

    try {
      await notifee.displayNotification(defaultConfig);
    } catch (err) {
      console.log('error notif: ', err);
    }
  }, []);

  const stopForeground = useCallback(async () => {
    if (intervalId) {
      clearInterval(intervalId);
      setTimeout(() => {
        notifee.stopForegroundService();
        setIntervalId(null);
      }, 500);
    }
  }, [intervalId, setIntervalId]);

  useLayoutEffect(() => {
    const createChannel = async () => {
      // Create a channel (required for Android)
      await notifee.createChannel({
        id: 'tracking',
        name: 'Tracking Channel',
        importance: AndroidImportance.LOW,
      });
    };

    const startForegroundService = () => {
      try {
        notifee.registerForegroundService(notification => {
          console.log('foreground started: ', notification);

          return new Promise(() => {
            let counter = 0;
            const interval = setInterval(async () => {
              counter += 1;
              postTracking(counter);

              savedOnInterval.current(counter);
              console.log('starting interval', counter);
            }, 16000);

            console.log('interval id: ', interval);
            setIntervalId(interval);
          });
        });
      } catch (err) {
        console.log('error start foreground :', err);
      }
    };

    createChannel().then(() => startForegroundService());

    const unsubscribeNotifee = notifee.onForegroundEvent(({type, detail}) => {
      switch (type) {
        case EventType.DISMISSED:
          console.log('DISMISS Notifee FG: ', detail.notification?.title);
          break;
        case EventType.PRESS:
          console.log('PRESS Notifee FG: ', detail.notification?.title);
          break;
      }
    });

    return () => {
      unsubscribeNotifee();
    };
  }, [setIntervalId]);
  return {startForeground, stopForeground};
};

export default useTracking;
