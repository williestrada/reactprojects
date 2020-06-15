import React, {useState} from 'react';

import {View, Image, StyleSheet, BackHandler} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/AntDesign';

import ModalAbout from '../components/ModalAbout';

import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

const logo = require('../images/InfoPlus.png');
//const winHeight = Dimensions.get('window').height;

const callAbout = props => {
  props.navigation.closeDrawer();
};

const bckgrndColor = 'dimgray';
function CustomDrawer(props) {
  const [aboutOpen, setAboutOpen] = useState(false);
  return (
    <>
      <DrawerContentScrollView>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            //backgroundColor: '#009AED',
            height: 80,
            borderBottomWidth: 1,
            borderBottomColor: '#DDD',
            padding: 10,
          }}>
          <View>
            <Image
              source={logo}
              style={{width: 50, height: 50}}
              resizeMode="contain"
            />
          </View>
          <DrawerItem
            label="InfoPlus Retail"
            onPress={() => {
              AsyncStorage.removeItem('SETUP');
              props.navigation.closeDrawer();
            }}
          />
        </View>
        <View style={styles.drawerItemList}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View
        style={{
          backgroundColor: bckgrndColor,
          //height: 150,
          paddingLeft: 10,
          marginBottom: 0,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon2 name="questioncircleo" size={26} color="white" />
          <DrawerItem
            label="About"
            labelStyle={{color: 'white', fontWeight: 'bold'}}
            onPress={() => {
              callAbout(props);
              setAboutOpen(true);
            }}
          />
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon name="log-out" size={26} color="white" />
          <DrawerItem
            label="Exit"
            labelStyle={{color: 'white', fontWeight: 'bold'}}
            onPress={() => {
              Platform.OS === 'android' ? BackHandler.exitApp() : exit(9);
            }}
          />
        </View>
        <ModalAbout aboutOpen={aboutOpen} setAboutOpen={setAboutOpen} />
      </View>
    </>
  );
}

{
  /* <DrawerItems {...this.props}  activeTintColor='#2196f3' activeBackgroundColor='rgba(0, 0, 0, .04)' inactiveTintColor='rgba(0, 0, 0, .87)' inactiveBackgroundColor='transparent' style={{backgroundColor: '#000000'}} labelStyle={{color: '#ffffff'}}/> */
}

const styles = StyleSheet.create({
  drawerItemList: {
    //height: winHeight - 150 - 110,
  },
  drawerLogo: {
    //alignItems: 'center',
  },
});

export default React.memo(CustomDrawer);
