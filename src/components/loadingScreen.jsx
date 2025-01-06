import { getLoadedFonts } from 'expo-font';
import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Animated, Easing, Image } from 'react-native';

const LoadingScreen = ({ visible, text }) => {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Döndürme animasyonu
      Animated.loop(
        Animated.timing(rotation, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true, // Performans için
        })
      ).start();
    } else {
      rotation.stopAnimation(); // Animasyonu durdur
    }
  }, [visible, rotation]);

  // Döndürme stili
  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {}}
    >
      <View style={styles.overlay}>
        <Animated.Image
          source={require('../../assets/vault (1).png')}
          style={[styles.image, { transform: [{ rotate: rotateInterpolate }] }]}
        />
        <Text style={styles.text}>{text}</Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3075cc', // Yarı saydam arka plan
  },
  image: {
    width: 64, // Görsel genişliği
    height: 64, // Görsel yüksekliği
  },
  text: {
    marginTop: 20,
    fontSize: 28,
    color: '#ffffff',
    fontFamily: "AfacadFlux-Black"
  },
});

export default LoadingScreen;