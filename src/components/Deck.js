import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

const Deck = ({ title, onPress, onLongPress }) => {
  return (
    <TouchableOpacity
      style={styles.deck}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={500}
    >
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  deck: {
    padding: 16,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Deck;
