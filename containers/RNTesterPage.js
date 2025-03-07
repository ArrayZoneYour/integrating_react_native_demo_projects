/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow
 */

const React = require('react')
const {
  SafeAreaView, ScrollView, StyleSheet, View,
} = require('react-native')
const RNTesterTitle = require('./RNTesterTitle')

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#f2f2f7ff',
  },
  noscrollWrapper: {
    flex: 1,
    rowGap: 30,
  },
  scrollWrapper: {
    flex: 1,
  },
  scrollWrapperContentContainer: {
    paddingVertical: 10,
    rowGap: 30,
  },
})

function RNTesterPage({ children, title, noScroll }) {
  return (
    <SafeAreaView
      style={styles.background}
    >
      {title && <RNTesterTitle title={title} />}
      {noScroll ? (
        <View style={styles.noscrollWrapper}>{children}</View>
      ) : (
        <ScrollView
          automaticallyAdjustContentInsets={!title}
          contentContainerStyle={styles.scrollWrapperContentContainer}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          style={styles.scrollWrapper}
        >
          {children}
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

module.exports = RNTesterPage
