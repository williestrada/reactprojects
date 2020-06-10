import React, {useState} from 'react';
import {View, Text, StyleSheet, TextInput, Dimensions} from 'react-native';

import {Icon} from 'react-native-elements';
import {CheckBox} from 'react-native-elements';

function CountBarcodeInput({
  handlerShowProdList,
  setShowProdList,
  setShowCounList,
  handlerSearchOtherCde,
  valOtherCde,
}) {
  const [barScannerOn, setBarScannerOn] = useState(false);
  const winHeight = Dimensions.get('window').height * 0.65;
  const othercde = React.createRef();

  let scannerColor = barScannerOn ? 'white' : 'black';
  return (
    <View
      style={{
        flexDirection: 'row',
        paddingTop: 10,
        alignItems: 'center',
      }}>
      <Text style={styles.text}>Bar Code: </Text>
      <TextInput
        ref={othercde}
        style={{...styles.textInput, ...styles.textBarCode}}
        placeholder="barcode ..."
        autoCapitalize="characters"
        maxLength={20}
        value={valOtherCde}
        selectTextOnFocus={true}
        onSubmitEditing={() => {
          handlerShowProdList();
          othercde.current.focus();
        }}
        onFocus={() => {
          setShowProdList(0);
          setShowCounList(winHeight);
        }}
        showSoftInputOnFocus={!barScannerOn}
        onChangeText={val => handlerSearchOtherCde(val)}
      />
      <Icon
        name="speaker-phone"
        containerStyle={{
          paddingRight: 0,
          marginRight: 0,
          borderWidth: 0,
        }}
        size={28}
        color={scannerColor}
      />
      <CheckBox
        center
        size={20}
        checkedColor="white"
        uncheckedColor="rgba(255,255,255,.7)"
        onPress={() => {
          setBarScannerOn(!barScannerOn);
          othercde.current.focus();
        }}
        textStyle={{
          padding: 0,
          color: 'white',
        }}
        containerStyle={{
          padding: 0,
          margin: 0,
          borderWidth: 0,
          color: 'white',
          backgroundColor: '#00000000',
        }}
        checked={barScannerOn}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imgBackground: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    backgroundColor: '#333',
    position: 'absolute', // covers the whole SafeAreaView
  },
  imgStyle: {
    resizeMode: 'stretch',
    opacity: 0.4,
  },
  textBarCode: {
    width: 200,
  },
  textMastFile: {
    width: 200,
  },
  textInput: {
    backgroundColor: 'rgba(250,250,250,.7)',
    padding: 10,
    fontSize: 12,
    borderWidth: 0.5,
    borderRadius: 8,
    height: 40, //TextBox height
  },

  text: {
    fontSize: 12,
    color: 'white',
    width: 80,
    paddingLeft: 10,
    paddingRight: 10,
  },
});

export default React.memo(CountBarcodeInput);
