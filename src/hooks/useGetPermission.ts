import {useEffect, useRef} from 'react';
import {Camera} from 'react-native-vision-camera';
import notifee, {AuthorizationStatus} from '@notifee/react-native';
import {myToast} from '../utils/myToast';
import {
  hasLocationPermission,
  hasLocationPermissionBg,
} from '../utils/myFunction';

interface Config {
  onFinish?: () => Promise<void>;
}

const useGetPermission = ({onFinish}: Config) => {
  const savedOnFinish = useRef<() => Promise<void>>(async () => {});

  savedOnFinish.current = async () => {
    if (onFinish) {
      await onFinish();
    }
  };

  useEffect(() => {
    const getPermissions = async () => {
      await notifee.getNotificationSettings().then(async status => {
        console.log('permission notif: ', status.authorizationStatus);

        if (status.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
          return;
        }

        const notifRequest = await notifee.requestPermission();
        if (
          notifRequest.authorizationStatus >= AuthorizationStatus.AUTHORIZED
        ) {
          myToast(`Permission Notif ${notifRequest.authorizationStatus}`);
          return;
        }
      });

      await Camera.getCameraPermissionStatus().then(async status => {
        console.log('permission camera: ', status);
        if (status === 'authorized') {
          return;
        }

        const cameraRequest = await Camera.requestCameraPermission();
        if (cameraRequest === 'authorized') {
          myToast(`Permission Camera ${cameraRequest}`);
          return;
        }
      });

      await hasLocationPermission();
      await hasLocationPermissionBg();

      await savedOnFinish.current();
    };

    getPermissions();
  }, []);
};

export default useGetPermission;
