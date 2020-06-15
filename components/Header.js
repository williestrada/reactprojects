import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/AntDesign';
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons';

function Header({navigation, title, iconName, iconAbout}) {
  console.log('Rendering Header component');
  return (
    <View>
      <View style={styles.topHeaderContainer}>
        <TouchableOpacity style={styles.imgLogo}>
          {typeof iconAbout == 'undefined' ? (
            <Icon name={iconName} size={20} color="white" />
          ) : null}
          {typeof iconAbout != 'undefined' ? (
            <Icon2 name={iconAbout} size={20} color="white" />
          ) : null}
        </TouchableOpacity>
        <View style={styles.centerNote}>
          <Text style={styles.txtHeader}> {title} </Text>
        </View>
        {typeof iconAbout == 'undefined' ? (
          <TouchableOpacity
            style={styles.txtDummy}
            onPress={() => navigation.openDrawer()}>
            <Icon name="menu" size={20} color="white" />
          </TouchableOpacity>
        ) : (
          <Text>{'         '}</Text>
        )}
      </View>
    </View>
  );
}

// let bckgrndColor = 'rgb(0,64,128)';
let bckgrndColor = 'rgba(0,0,0,.8)';

const styles = StyleSheet.create({
  // Header
  topHeaderContainer: {
    flexDirection: 'row',
    backgroundColor: bckgrndColor,
    padding: 3,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: 40,
  },
  imgLogo: {
    marginLeft: 0,
    marginRight: 15,
  },

  centerNote: {
    padding: 0,
    margin: 0,
  },
  txtHeader: {
    width: 200,
    fontSize: 18,
    //    fontFamily: 'serif',
    color: 'white',
    textAlign: 'center',
  },
  txtDummy: {
    fontSize: 0,
    padding: 10,
  },
});

export default React.memo(Header);
