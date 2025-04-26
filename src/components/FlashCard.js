//components/FlashCard.js
import React, { useState, useRef } from 'react';
import { Text, StyleSheet, View, Animated, TouchableWithoutFeedback } from 'react-native';

const FlashCard = ({ question, answer }) => {
  const [flipped, setFlipped] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;

  const frontInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg']
  });

  const backInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg']
  });

  const flipCard = () => {
    if (flipped) {
      Animated.spring(animatedValue, {
        toValue: 0,
        useNativeDriver: true
      }).start();
    } else {
      Animated.spring(animatedValue, {
        toValue: 180,
        useNativeDriver: true
      }).start();
    }
    setFlipped(!flipped);
  };

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }]
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }]
  };

  return (
    <TouchableWithoutFeedback onPress={flipCard}>
      <View style={styles.cardContainer}>
        <Animated.View
          style={[styles.card, frontAnimatedStyle, styles.front, { display: flipped ? 'none' : 'flex' }]}>
          <Text style={styles.question}>{question}</Text>
          <Text style={styles.tip}>Chạm để xem đáp án</Text>
        </Animated.View>
        <Animated.View
          style={[styles.card, backAnimatedStyle, styles.back, { display: flipped ? 'flex' : 'none' }]}>
          <Text style={styles.answer}>{answer}</Text>
          <Text style={styles.tip}>Chạm để xem câu hỏi</Text>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  card: {
    width: 300,
    height: 200,
    borderRadius: 12,
    padding: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
    backfaceVisibility: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  front: {
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#e0e0e0',
  },
  back: {
    backgroundColor: '#007aff',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#007aff',
  },
  question: {
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  answer: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  tip: {
    fontSize: 14,
    textAlign: 'center',
    color: '#888'
  },
});

export default FlashCard;
