import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View, PermissionsAndroid,Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { shareAsync } from 'expo-sharing';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Comp from './comp';
export default function App() {

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

// storage.set('data', data);
const client = new QueryClient()
// const {data}=useQuery({
//   queryKey:["test"],
//   queryFn:fetch,

// })
// console.log(data);
return (
    <QueryClientProvider client={client}>
    <View style={styles.container}>
      <Text>{`${downloadProgress} %`}</Text>
    
      <Button title="Download" onPress={downloadSampleFile} />
      <Comp></Comp>
      <StatusBar style="auto" />

    </View>
    </QueryClientProvider>
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
