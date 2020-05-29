import React, {useContext} from 'react';

import {View, Image, StyleSheet, BackHandler, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/AntDesign';

import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

const logo = require('../images/InfoPlus.png');

const callAbout = props => {
  props.navigation.closeDrawer();
};

const bckgrndColor = 'dimgray';
function CustomDrawer(props) {
  //alert(props.productData);
  return (
    <DrawerContentScrollView>
      <View
        style={{
          paddingTop: 5,
          flexDirection: 'row',
          alignItems: 'center',
          //backgroundColor: '#009AED',
          height: 80,
          borderBottomWidth: 1,
          borderBottomColor: '#DDD',
          paddingHorizontal: 10,
          paddingBottom: 5,
          marginTop: 0,
          marginBottom: 20,
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
            props.navigation.closeDrawer();
          }}
          //icon={() => isFetchingStore || isFetchingMaster ? <ActivityIndicator size='small' /> : null }
        />
      </View>
      <View style={styles.drawerItemList}>
        <DrawerItemList {...props} />
      </View>
      <View style={{backgroundColor: bckgrndColor, height: 150, padding: 10}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon2 name="questioncircleo" size={26} color="white" />
          <DrawerItem
            label="About"
            labelStyle={{color: 'white', fontWeight: 'bold'}}
            onPress={() => callAbout(props)}
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
      </View>
    </DrawerContentScrollView>
  );
}

{
  /* <DrawerItems {...this.props}  activeTintColor='#2196f3' activeBackgroundColor='rgba(0, 0, 0, .04)' inactiveTintColor='rgba(0, 0, 0, .87)' inactiveBackgroundColor='transparent' style={{backgroundColor: '#000000'}} labelStyle={{color: '#ffffff'}}/> */
}

const styles = StyleSheet.create({
  drawerItemList: {
    height: 380,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
  },
  drawerLogo: {
    //alignItems: 'center',
  },
});

export default React.memo(CustomDrawer);
