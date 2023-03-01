/**
 * @format
 */

import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import notifee, {EventType} from '@notifee/react-native';

notifee.onBackgroundEvent(async ({type, detail}) => {
  const {notification} = detail;
  if (type === EventType.DISMISSED) {
    console.log('DISMISS Notifee BG: ', detail.notification?.title);

    // Remove the notification
    return await notifee.cancelNotification(notification.id);
  }

  if (type === EventType.PRESS) {
    console.log('PRESS Notifee BG: ', detail.notification?.title);
  }
});

function HeadlessCheck({isHeadless}) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }

  return <App />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);
