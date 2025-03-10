/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow
 */

import React from 'react'
import {
  ActivityIndicator,
  Animated,
  Image,
  Platform,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import RNTesterText from './RNTesterText'

const LOREM_IPSUM = 'Lorem ipsum dolor sit amet, ius ad pertinax oportere accommodare, an vix \
civibus corrumpit referrentur. Te nam case ludus inciderint, te mea facilisi adipiscing. Sea id \
integre luptatum. In tota sale consequuntur nec. Erat ocurreret mei ei. Eu paulo sapientem \
vulputate est, vel an accusam intellegam interesset. Nam eu stet pericula reprimique, ea vim illud \
modus, putant invidunt reprehendunt ne qui.'

/* eslint no-bitwise: 0 */
function hashCode(str) {
  let hash = 15
  for (let ii = str.length - 1; ii >= 0; ii--) {
    hash = (hash << 5) - hash + str.charCodeAt(ii)
  }
  return hash
}

const HEADER = { height: 30, width: 100 }
const SEPARATOR_HEIGHT = StyleSheet.hairlineWidth

const styles = StyleSheet.create({
  headerFooter: {
    ...HEADER,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerFooterContainer: {
    backgroundColor: 'rgb(239, 239, 244)',
  },
  listEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  horizItem: {
    alignSelf: 'flex-start', // Necessary for touch highlight
  },
  item: {
    flex: 1,
  },
  itemSeparator: {
    height: SEPARATOR_HEIGHT,
    backgroundColor: 'rgb(200, 199, 204)',
    marginLeft: 60,
  },
  option: {
    flexDirection: 'row',
    padding: 8,
    paddingRight: 0,
  },
  row: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'white',
  },
  searchTextInput: {
    backgroundColor: 'white',
    borderColor: '#cccccc',
    borderRadius: 3,
    borderWidth: 1,
    paddingLeft: 8,
    paddingVertical: 0,
    height: 26,
    fontSize: 14,
    flexGrow: 1,
  },
  separator: {
    height: SEPARATOR_HEIGHT,
    backgroundColor: 'rgb(200, 199, 204)',
  },
  smallSwitch: Platform.select({
    android: {
      top: 1,
      margin: -6,
      transform: [{ scale: 0.7 }],
    },
    ios: {
      top: 4,
      margin: -10,
      transform: [{ scale: 0.5 }],
    },
  }),
  stacked: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
  },
  thumb: {
    width: 50,
    height: 50,
    left: -5,
  },
  spindicator: {
    marginLeft: 'auto',
    marginTop: 8,
    width: 2,
    height: 16,
    backgroundColor: 'darkgray',
  },
  stackedText: {
    padding: 4,
    fontSize: 18,
  },
  text: {
    flex: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    borderTopWidth: 1,
    borderTopColor: 'rgb(200, 199, 204)',
  },
})

function genItemData(i) {
  const itemHash = Math.abs(hashCode(`Item ${i}`))
  return {
    title: `Item ${i}`,
    text: LOREM_IPSUM.slice(0, (itemHash % 301) + 20),
    key: String(i),
    pressed: false,
  }
}

function genNewerItems(count, start = 0) {
  const dataBlob = []
  for (let i = start; i < count + start; i++) {
    dataBlob.push(genItemData(i))
  }
  return dataBlob
}

function genOlderItems(count, start = 0) {
  const dataBlob = []
  for (let i = count; i > 0; i--) {
    dataBlob.push(genItemData(start - i))
  }
  return dataBlob
}

const HORIZ_WIDTH = 200
const ITEM_HEIGHT = 72

class ItemComponent extends React.PureComponent {
  _onPress = () => {
    this.props.onPress(this.props.item.key)
  }

  render() {
    const {
      fixedHeight, horizontal, item, textSelectable,
    } = this.props
    const itemHash = Math.abs(hashCode(item.title))
    const imgSource = THUMB_URLS[itemHash % THUMB_URLS.length]
    return (
      <TouchableWithoutFeedback
        onPress={this._onPress}
        onShowUnderlay={this.props.onShowUnderlay}
        onHideUnderlay={this.props.onHideUnderlay}
        style={horizontal ? styles.horizItem : styles.item}
      >
        <View
          style={[
            styles.row,
            horizontal && { width: HORIZ_WIDTH },
            fixedHeight && { height: ITEM_HEIGHT },
          ]}
        >
          {!item.noImage && <Image style={styles.thumb} source={imgSource} />}
          <Text
            testID={this.props.testID}
            style={styles.text}
            selectable={textSelectable}
            numberOfLines={horizontal || fixedHeight ? 3 : undefined}
          >
            {item.title}
            {' '}
            -
            {item.text}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

const renderStackedItem = ({ item }) => {
  const itemHash = Math.abs(hashCode(item.title))
  const imgSource = THUMB_URLS[itemHash % THUMB_URLS.length]
  return (
    <View style={styles.stacked}>
      <Text style={styles.stackedText}>
        {item.title}
        {' '}
        -
        {item.text}
      </Text>
      <Image style={styles.thumb} source={imgSource} />
    </View>
  )
}

class FooterComponent extends React.PureComponent {
  render() {
    return (
      <View style={styles.headerFooterContainer}>
        <SeparatorComponent />
        <View style={styles.headerFooter}>
          <Text>LIST FOOTER</Text>
        </View>
      </View>
    )
  }
}

class HeaderComponent extends React.PureComponent {
  render() {
    return (
      <View style={styles.headerFooterContainer}>
        <View style={styles.headerFooter}>
          <Text>LIST HEADER</Text>
        </View>
        <SeparatorComponent />
      </View>
    )
  }
}

class ListEmptyComponent extends React.PureComponent {
  render() {
    return (
      <View style={styles.listEmpty}>
        <Text>The list is empty :o</Text>
      </View>
    )
  }
}

class SeparatorComponent extends React.PureComponent {
  render() {
    return <View style={styles.separator} />
  }
}

const LoadingComponent = React.memo(() => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator />
  </View>
))

class ItemSeparatorComponent extends React.PureComponent {
  render() {
    const style = this.props.highlighted
      ? [
        styles.itemSeparator,
        { marginLeft: 0, backgroundColor: 'rgb(217, 217, 217)' },
      ]
      : styles.itemSeparator
    return <View style={style} />
  }
}

class Spindicator extends React.PureComponent {
  render() {
    return (
      <Animated.View
        style={[
          styles.spindicator,
          {
            transform: [
              {
                rotate: this.props.value.interpolate({
                  inputRange: [0, 5000],
                  outputRange: ['0deg', '360deg'],
                  extrapolate: 'extend',
                }),
              },
            ],
          },
        ]}
      />
    )
  }
}

const THUMB_URLS = [
  require('../assets/like.png'),
  require('../assets/dislike.png'),
  require('../assets/call.png'),
  require('../assets/fist.png'),
  require('../assets/bandaged.png'),
  require('../assets/flowers.png'),
  require('../assets/heart.png'),
  require('../assets/liking.png'),
  require('../assets/party.png'),
  require('../assets/poke.png'),
  require('../assets/superlike.png'),
  require('../assets/victory.png'),
]

function getItemLayout(
  data,
  index,
  horizontal,
) {
  const [length, separator, header] = horizontal
    ? [HORIZ_WIDTH, 0, HEADER.width]
    : [ITEM_HEIGHT, SEPARATOR_HEIGHT, HEADER.height]
  return { length, offset: (length + separator) * index + header, index }
}

function pressItem(item) {
  const title = `Item ${item.key}${!item.pressed ? ' (pressed)' : ''}`
  return { ...item, title, pressed: !item.pressed }
}

function renderSmallSwitchOption(
  label,
  value,
  setValue,
  testID,
) {
  if (Platform.isTV) {
    return null
  }
  return (
    <View style={styles.option}>
      <RNTesterText>
        {label}
        :
      </RNTesterText>
      <Switch
        testID={testID}
        style={styles.smallSwitch}
        value={value}
        onValueChange={setValue}
      />
    </View>
  )
}

function PlainInput(props) {
  return (
    <TextInput
      autoCapitalize="none"
      autoCorrect={false}
      clearButtonMode="always"
      underlineColorAndroid="transparent"
      style={styles.searchTextInput}
      {...props}
    />
  )
}

module.exports = {
  FooterComponent,
  HeaderComponent,
  ListEmptyComponent,
  ItemComponent,
  ItemSeparatorComponent,
  PlainInput,
  SeparatorComponent,
  LoadingComponent,
  Spindicator,
  genNewerItems,
  genOlderItems,
  getItemLayout,
  pressItem,
  renderSmallSwitchOption,
  renderStackedItem,
}
