import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View, PermissionsAndroid,Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { shareAsync } from 'expo-sharing';
import { useState } from 'react';

import { MMKV } from 'react-native-mmkv'

export default function App() {
const storage = new MMKV()
storage.set('user.name', 'Marc')
const username = storage.getString('user.name')

  const [downloadProgress, setDownloadProgress] = useState(0);

  const sampleFileUrl = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
  const downloadSampleFile = async () => {
    console.log('Storage permission granted');
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'Storage Permission',
        message: 'App needs access to your storage to download files.',
        buttonPositive: 'OK',
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
     
    try {
      const downloadResumable = FileSystem.createDownloadResumable(
        sampleFileUrl,
        `${FileSystem.documentDirectory}sample.mp4`,
        {},
        (downloadProgress) => {
          const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
          console.log(progress * 100);
          setDownloadProgress(Math.round(progress * 100));
        }
      );

      const { uri } = await downloadResumable.downloadAsync();

      // Save the downloaded file URI to AsyncStorage
      console.log("uri ...",uri);
      await AsyncStorage.setItem('sampleFilePath', uri);

      shareAsync(uri);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
   
  }else {
    console.log('Storage permission denied');
  }
  }

  return (
    <View style={styles.container}>
      <Text>{`${downloadProgress} %`}</Text>
      <Text>{username}</Text>
      <Button title="Download" onPress={downloadSampleFile} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
