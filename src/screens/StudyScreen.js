// src/screens/StudyScreen.js
import React, { useEffect, useState } from 'react';
import { View, Button, Text, Alert, TouchableOpacity } from 'react-native';
import FlashCard from '../components/FlashCard';
import { getFlashcardsByDeck } from '../services/flashcardService';

const StudyScreen = ({ route, navigation }) => {
  const { deckId } = route.params;
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const flashcards = await getFlashcardsByDeck(deckId);
        setCards(flashcards);
      } catch (error) {
        Alert.alert('Lỗi khi tải thẻ', error.message);
      }
    };

    fetchCards();
  }, [deckId]);

  if (cards.length === 0) return <Text style={{ padding: 20 }}>Không có thẻ nào.</Text>;

  const card = cards[index];

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#f2f2f2' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 }}>
        📚 Chế độ học
      </Text>

      <Text style={{ fontSize: 16, textAlign: 'center', marginBottom: 10 }}>
        Câu {index + 1} / {cards.length}
      </Text>

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <FlashCard question={card.front} answer={card.back} />
      </View>

      <View style={{ marginTop: 20, alignItems: 'center' }}>
        {index < cards.length - 1 ? (
          <TouchableOpacity
            onPress={() => setIndex(index + 1)}
            style={{
              backgroundColor: '#007bff',
              paddingVertical: 12,
              paddingHorizontal: 30,
              borderRadius: 8,
              marginBottom: 10,
            }}
          >
            <Text style={{ color: 'white', fontSize: 16 }}>👉 Tiếp theo</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 16, marginBottom: 10 }}>🎉 Bạn đã hoàn thành tất cả các thẻ!</Text>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                backgroundColor: '#28a745',
                paddingVertical: 12,
                paddingHorizontal: 30,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: 'white', fontSize: 16 }}>🔙 Quay lại</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default StudyScreen;
