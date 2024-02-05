import { MMKV } from 'react-native-mmkv'

import { useQuery } from "@tanstack/react-query";
import { StyleSheet, Text, View } from "react-native";
import fetchData from "./fetch";

export default function Comp() {
const storage = new MMKV();



const { data, error, isLoading } = useQuery({
    queryKey: ["test"],
    queryFn: fetchData,
  });
  if(data){
  storage.set('category', data.category);
  storage.set('brand', data.brand);
  storage.set('title', data.title);
  storage.set('price', data.price);
  }
  
  const category = storage.getString('category');
  const brand = storage.getString('brand');

  const title = storage.getString('title');

  const price = storage.getString('price');

return (
    <View style={styles.container}>
     <Text>{category} </Text>
     <Text>{brand} </Text>
     <Text>{title} </Text>
     <Text>{price} </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
    stretch: {
      width: 50,
      height: 200,
      resizeMode: 'stretch',
    },
  });