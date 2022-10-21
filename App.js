import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList} from 'react-native';
import * as SQLite from'expo-sqlite';
import { Header, Input, ListItem, Button, Icon } from'react-native-elements';


export default function App() {
  const db = SQLite.openDatabase('shoplist.db');
  const [listItem, setListItem] = useState('');
  const [listQuantity, setListQuantity] = useState('');
  const [shopping, setShopping] = useState([]);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists shopping (id integer primary key not null, item text, quantity text);');
    }, null, updateList);
  }, []);

  const addPressed = () => { 
    db.transaction(tx => {
      tx.executeSql('insert into shopping (item, quantity) values (?, ?);',
        [listItem, listQuantity]);
      }, null, updateList)
      setListItem('');
      setListQuantity('');
  }

  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from shopping;', [], (_, { rows }) =>
         setShopping(rows._array)
      );
     }, null, null);
  }

  const deleteItem = (id) => {
    db.transaction(
    tx => {
    tx.executeSql('delete from shopping where id = ?;', [id]);
  }, null, updateList) 
  }

  return (
    
    <View style={styles.container}>
      <Header centerComponent={{ text: 'SHOPPING LIST', style: { color: '#fff' } }}  
      />
      <View>
      <Input   
          placeholder='Product' label='Product' style='input'
          onChangeText={listItem => setListItem(listItem)} value={listItem}
      />
      <Input   
          placeholder='Amount' label='Amount' style='input'
          onChangeText={listQuantity => setListQuantity(listQuantity)} value={listQuantity}
      />
      </View>
      <View style={styles.buttoncontainer}>
        <View style={styles.button}>
        <Button raised icon={{ name: 'save', color: '#fff' }} onPress={addPressed}title="SAVE" />
        </View>
      </View>
      <FlatList 
        data={shopping}
        renderItem = {({ item }) => (
          <ListItem bottomDivider>
            <ListItem.Content>
              <View  style={styles.listcontainer}>
              <View>
                <ListItem.Title>{item.item}</ListItem.Title>
                <ListItem.Subtitle>{item.quantity}</ListItem.Subtitle>
              </View> 
              <View>
                <Icon type="material" name="delete" color ='red' onPress={() => deleteItem(item.id)}></Icon>
              </View>
              </View>
            </ListItem.Content>
          </ListItem>
        )}
        keyExtractor={item => item.id.toString()}
        />

      <StatusBar style="auto" />

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
    
  },

  buttoncontainer : {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
    
  },

  button : {
    width:150  ,
    marginBottom: 30,
    color:'#fff'
  },

  input : {
    width:200  , 
    alignItems: 'left',
  },

  listcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'

   },
});
