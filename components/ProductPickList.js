import React from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';

import Highlighter from 'react-native-highlight-words';

function ProductPickList({dataList, prodSearch, addCountData}) {
  //Product PickList FlatList render
  function ProdList({item, index, addCountData}) {
    let nIndex = index + 1;
    let nItemPrce = item.ItemPrce.toFixed(2).replace(
      /\d(?=(\d{3})+\.)/g,
      '$&,',
    );

    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity onPress={() => addCountData(item)}>
          <View style={styles.textCodeView}>
            <Highlighter
              highlightStyle={{fontWeight: 'bold', color: 'orange'}}
              searchWords={[prodSearch]}
              textToHighlight={nIndex.toString() + '. # ' + item.OtherCde}
              style={styles.textOtherCde}
              //numberOfLines={1}
            />
            <Text style={styles.textItem}>Price: {nItemPrce}</Text>
          </View>
          <Highlighter
            highlightStyle={{fontWeight: 'bold', color: 'orange'}}
            searchWords={[prodSearch]}
            textToHighlight={item.Descript.substr(0, 50)}
            style={styles.textDescript}
          />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={dataList}
      renderItem={({item, index}) => (
        <ProdList item={item} index={index} addCountData={addCountData} />
      )}
      keyExtractor={item => item.OtherCde}
      ListHeaderComponent={() => {
        if (dataList.length) {
          return (
            <View>
              <Text
                style={{
                  color: 'white',
                  fontSize: 12,
                  alignSelf: 'center',
                }}>
                Tap to select item from {dataList.length} Product list.
              </Text>
            </View>
          );
        }
        return null;
      }}
      ListFooterComponent={() => {
        if (dataList.length) {
          return (
            <View>
              <Text
                style={{
                  color: 'white',
                  fontSize: 12,
                  alignSelf: 'center',
                }}>
                End of List.
              </Text>
            </View>
          );
        }
        return null;
      }}
    />
  );
}

const styles = StyleSheet.create({
  // Flatlist items container
  itemContainer: {
    borderBottomWidth: 0.8,
    borderStyle: 'dashed',
    borderBottomColor: 'rgba(250,250,250,0.4)',
    padding: 3,
    marginVertical: 2,
    marginHorizontal: 10,
    backgroundColor: 'rgba(0,0,0,.3)',
  },
  textCodeView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textOtherCde: {
    flex: 2,
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  textItem: {
    fontSize: 12,
    color: 'white',
  },
  textDescript: {
    fontStyle: 'italic',
    fontSize: 10,
    color: 'white',
    paddingRight: 5,
  },
});

export default React.memo(ProductPickList);
