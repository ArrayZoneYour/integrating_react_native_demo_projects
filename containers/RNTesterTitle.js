/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow strict-local
 */

const React = require('react')
const { StyleSheet, Text, View } = require('react-native')
const { default: theme } = require('./theme')

class RNTesterTitle extends React.Component {
  render() {
    return (
      <View
        style={[
          styles.container,
          {
            borderColor: theme.SeparatorColor,
            backgroundColor: theme.TertiaryGroupedBackgroundColor,
          },
        ]}
      >
        <Text style={[styles.text, { color: theme.LabelColor }]}>
          {this.props.title}
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    borderWidth: 0.5,
    margin: 10,
    marginBottom: 0,
    height: 45,
    padding: 10,
  },
  text: {
    fontSize: 19,
    fontWeight: '500',
  },
})

module.exports = RNTesterTitle
