import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const Screen = ({children}) => {
  return (
   <SafeAreaView style={styles.safeAreaContainer}>
     <View style={styles.container} >
      {children}
    </View>
   </SafeAreaView>
  )
}

export default Screen

const styles = StyleSheet.create({
    safeAreaContainer:{
        backgroundColor: 'white',
        flex: 1,
    },
    container:{
        flex:1,
        padding:16,
    }

})