import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import Auth from './auth';
import GuestStack from './guest';
import { NavigationContainer } from '@react-navigation/native';

const RootStack = () => {
  return (
    <GuestStack />
  )
}

export default RootStack;

