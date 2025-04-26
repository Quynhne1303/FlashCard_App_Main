// components/Deck.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Deck = ({ title, onPress, onLongPress }) => {
  return (
    <TouchableOpacity
      style={styles.deck}
      onPress={onPress}
      onLongPress={onLongPress} // 👈 hỗ trợ nhấn giữ để xoá
      delayLongPress={500} // tuỳ chọn: giữ 0.5s sẽ kích hoạt
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
