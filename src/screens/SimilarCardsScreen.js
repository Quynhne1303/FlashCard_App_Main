import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import { getFlashcardsByDeck } from "../services/flashcardService";

const shuffleArray = (array) => {
  return [...array].sort(() => Math.random() - 0.5);
};

const SimilarCardsScreen = ({ route, navigation }) => {
  const { deckId } = route.params;

  const [remainingCards, setRemainingCards] = useState([]);
  const [shuffledFronts, setShuffledFronts] = useState([]);
  const [shuffledBacks, setShuffledBacks] = useState([]);
  const [selectedFront, setSelectedFront] = useState(null);
  const [selectedBack, setSelectedBack] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
    const fetchCards = async () => {
      const data = await getFlashcardsByDeck(deckId);
      const cardsWithMatched = data.map((card) => ({
        ...card,
        matched: false, // Thêm thuộc tính matched để theo dõi thẻ đã đúng
      }));
      setRemainingCards(cardsWithMatched);
      setShuffledFronts(shuffleArray(cardsWithMatched));
      setShuffledBacks(shuffleArray(cardsWithMatched));
    };
    fetchCards();
  }, [deckId]);

  const handleMatch = () => {
    if (!selectedFront || !selectedBack) return;

    const isMatch = selectedFront.id === selectedBack.id;

    if (isMatch) {
      // Cập nhật matched: true cho cặp thẻ đúng
      const updatedCards = remainingCards.map((card) =>
        card.id === selectedFront.id || card.id === selectedBack.id
          ? { ...card, matched: true }
          : card
      );
      setRemainingCards(updatedCards);

      // Cập nhật danh sách shuffledFronts và shuffledBacks
      setShuffledFronts((prev) =>
        prev.filter((card) => card.id !== selectedFront.id)
      );
      setShuffledBacks((prev) =>
        prev.filter((card) => card.id !== selectedBack.id)
      );

      setCorrectCount((prev) => prev + 1);

      // Kiểm tra nếu hết thẻ
      if (updatedCards.filter((card) => !card.matched).length === 0) {
        Alert.alert(
          "🎉 Hoàn thành!",
          `Bạn đã ghép đúng ${correctCount + 1} / ${correctCount + 1} cặp!`,
          [
            {
              text: "Quay lại",
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }
    } else {
      Alert.alert("❌ Sai rồi", "Thuật ngữ không khớp với định nghĩa.");
    }

    setSelectedFront(null);
    setSelectedBack(null);
  };

  useEffect(() => {
    if (selectedFront && selectedBack) {
      handleMatch();
    }
  }, [selectedFront, selectedBack]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🧩 Ghép thẻ tương đồng</Text>

      <Text style={styles.progress}>
        Đã đúng: {correctCount} / {correctCount + remainingCards.length}
      </Text>

      <View style={styles.columns}>
        <View style={styles.column}>
          <Text style={styles.columnTitle}>Thuật ngữ</Text>
          <FlatList
            data={shuffledFronts}
            keyExtractor={(item) => item.id + "-front"}
            renderItem={({ item }) => (
              !item.matched && ( // Kiểm tra xem thẻ đã được ghép đúng chưa
                <TouchableOpacity
                  style={[
                    styles.itemBox,
                    selectedFront?.id === item.id && styles.selectedBox,
                  ]}
                  onPress={() => setSelectedFront(item)}
                >
                  <Text style={styles.itemText}>{item.front}</Text>
                </TouchableOpacity>
              )
            )}
          />
        </View>

        <View style={styles.column}>
          <Text style={styles.columnTitle}>Định nghĩa</Text>
          <FlatList
            data={shuffledBacks}
            keyExtractor={(item) => item.id + "-back"}
            renderItem={({ item }) => (
              !item.matched && ( // Kiểm tra xem thẻ đã được ghép đúng chưa
                <TouchableOpacity
                  style={[
                    styles.itemBox,
                    selectedBack?.id === item.id && styles.selectedBox,
                  ]}
                  onPress={() => setSelectedBack(item)}
                >
                  <Text style={styles.itemText}>{item.back}</Text>
                </TouchableOpacity>
              )
            )}
          />
        </View>
      </View>
    </View>
  );
};

export default SimilarCardsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    backgroundColor: "#FFF",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  progress: {
    textAlign: "center",
    marginBottom: 10,
    color: "#555",
  },
  columns: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    flex: 1,
  },
  column: {
    flex: 1,
    padding: 8,
  },
  columnTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
    textAlign: "center",
  },
  itemBox: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: "#f7f7f7",
  },
  selectedBox: {
    backgroundColor: "#D1C4E9",
    borderColor: "#7E57C2",
  },
  itemText: {
    fontSize: 14,
    textAlign: "center",
  },
});
