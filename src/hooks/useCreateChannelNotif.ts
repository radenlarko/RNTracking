import {Platform} from 'react-native';
import {useLayoutEffect, useRef, useState} from 'react';
import notifee, {
  AndroidChannel,
  AndroidImportance,
} from '@notifee/react-native';

interface Config {
  channel?: AndroidChannel;
  startOnMount?: boolean;
}

const useCreateChannelNotif = (config?: Config) => {
  const {channel, startOnMount} = config || {};
  const [channelId, setChannelId] = useState('');

  const createChannel = useRef(async () => {});

  createChannel.current = async () => {
    // Create a channel (required for Android)
    const id = await notifee.createChannel(
      channel || {
        id: 'important',
        name: 'Important Notifications',
        sound: Platform.Version >= 26 ? 'appsound' : undefined,
        importance: AndroidImportance.HIGH,
      },
    );

    console.log('channel created: ', id);

    setChannelId(id);
  };

  useLayoutEffect(() => {
    if (startOnMount) {
      createChannel.current();
    }
  }, [startOnMount]);

  return {channelId, createChannel: createChannel.current};
};

export default useCreateChannelNotif;
