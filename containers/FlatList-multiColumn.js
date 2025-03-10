/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow
 */

import RNTesterPage from './RNTesterPage'

const React = require('react')
const {
  Alert, FlatList, StyleSheet, Text, View,
} = require('react-native')
const infoLog = require('react-native/Libraries/Utilities/infoLog')
const {
  FooterComponent,
  HeaderComponent,
  ItemComponent,
  PlainInput,
  SeparatorComponent,
  genNewerItems,
  getItemLayout,
  pressItem,
  renderSmallSwitchOption,
} = require('./ListExampleShared')

class MultiColumnExample extends React.PureComponent {
  state = {
    data: genNewerItems(1000),
    filterText: '',
    fixedHeight: true,
    logViewable: false,
    numColumns: 2,
    virtualized: true,
  }

  /* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
   * LTI update could not be added via codemod */
  _onChangeFilterText = filterText => {
    this.setState(() => ({ filterText }))
  }

  _onChangeNumColumns = numColumns => {
    this.setState(() => ({ numColumns: Number(numColumns) }))
  }

  _setBooleanValue = key => value => this.setState({ [key]: value })

  render() {
    const filterRegex = new RegExp(String(this.state.filterText), 'i')
    const filter = item => filterRegex.test(item.text) || filterRegex.test(item.title)
    const filteredData = this.state.data.filter(filter)
    return (
      <RNTesterPage
        title={this.props.navigator ? null : '<FlatList> - MultiColumn'}
        noScroll
      >
        {/* <View style={styles.searchRow}>
          <View style={styles.row}>
            <PlainInput
              onChangeText={this._onChangeFilterText}
              placeholder="Search..."
              value={this.state.filterText}
            />
            <Text> numColumns: </Text>
            <PlainInput
              clearButtonMode="never"
              onChangeText={this._onChangeNumColumns}
              value={this.state.numColumns ? String(this.state.numColumns) : ''}
            />
          </View>
          <View style={styles.row}>
            {renderSmallSwitchOption(
              'Virtualized',
              this.state.virtualized,
              this._setBooleanValue('virtualized'),
            )}
            {renderSmallSwitchOption(
              'Fixed Height',
              this.state.fixedHeight,
              this._setBooleanValue('fixedHeight'),
            )}
            {renderSmallSwitchOption(
              'Log Viewable',
              this.state.logViewable,
              this._setBooleanValue('logViewable'),
            )}
          </View>
        </View> */}
        <SeparatorComponent />
        <FlatList
          ListFooterComponent={FooterComponent}
          ListHeaderComponent={HeaderComponent}
          getItemLayout={
            // $FlowFixMe[method-unbinding] added when improving typing for this parameters
            this.state.fixedHeight ? this._getItemLayout : undefined
          }
          data={filteredData}
          key={this.state.numColumns + (this.state.fixedHeight ? 'f' : 'v')}
          numColumns={this.state.numColumns || 1}
          // onRefresh={() => Alert.alert('Alert', 'onRefresh: nothing to refresh :P')}
          refreshing={false}
          renderItem={this._renderItemComponent}
          disableVirtualization={!this.state.virtualized}
          onViewableItemsChanged={this._onViewableItemsChanged}
        />
      </RNTesterPage>
    )
  }

  _getItemLayout(
    data,
    index,
  ) {
    const length = getItemLayout(data, index).length + 2 * (CARD_MARGIN + BORDER_WIDTH)
    return { length, offset: length * index, index }
  }

  _renderItemComponent = ({ item, index }) => {
    console.log(index)
    return (
      <View style={styles.card}>
        <ItemComponent
          item={item}
          fixedHeight={this.state.fixedHeight}
          onPress={this._pressItem}
        />
      </View>
    )
  }

  // This is called when items change viewability by scrolling into or out of the viewable area.
  _onViewableItemsChanged = info => {
    // Impressions can be logged here
    if (this.state.logViewable) {
      infoLog(
        'onViewableItemsChanged: ',
        info.changed.map(v => ({ ...v, item: '...' })),
      )
    }
  }

  _pressItem = (key: string) => {
    const index = Number(key)
    const itemState = pressItem(this.state.data[index])
    this.setState(state => ({
      ...state,
      data: [
        ...state.data.slice(0, index),
        itemState,
        ...state.data.slice(index + 1),
      ],
    }))
  }
}

const CARD_MARGIN = 4
const BORDER_WIDTH = 1

const styles = StyleSheet.create({
  card: {
    margin: CARD_MARGIN,
    borderRadius: 10,
    flex: 1,
    overflow: 'hidden',
    borderColor: 'lightgray',
    borderWidth: BORDER_WIDTH,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchRow: {
    padding: 10,
  },
})

export default MultiColumnExample
