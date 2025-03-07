/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import React, { useMemo } from 'react'
import { Text } from 'react-native'
import theme from './theme'

export default function RNTesterText(props) {
  const { style, variant, ...rest } = props
  const color = useMemo(() => {
    switch (variant) {
      case 'body':
        return theme.LabelColor
      case 'label':
        return theme.SecondaryLabelColor
      case 'caption':
        return theme.TertiaryLabelColor
      default:
        return theme.LabelColor
    }
  }, [variant])
  return <Text {...rest} style={[{ color }, style]} />
}
