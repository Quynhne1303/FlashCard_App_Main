import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import {
  getFlashcardsByDeck,
  deleteFlashcard,
} from "../services/flashcardService";
import * as Speech from "expo-speech";

const speakWord = (text) => {
  Speech.speak(text, {
    language: "en",
    rate: 0.9,
    pitch: 1.0,
  });
};

const DeckDetailScreen = ({ route, navigation }) => {
  const { deck } = route.params || {};
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        setLoading(true);
        const flashcards = await getFlashcardsByDeck(deck.id);
        setCards(flashcards);
      } catch (error) {
        Alert.alert("Lỗi tải thẻ", error.message);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = navigation.addListener("focus", fetchCards);
    return unsubscribe;
  }, [navigation, deck?.id]);

  const handleLongPress = (card) => {
    Alert.alert("Tùy chọn thẻ", `Bạn muốn làm gì với thẻ "${card.front}"?`, [
      {
        text: "📝 Chỉnh sửa",
        onPress: () => navigation.navigate("EditCard", { card }),
      },
      {
        text: "🗑️ Xoá",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteFlashcard(card.id);
            setCards((prev) => prev.filter((c) => c.id !== card.id));
            Alert.alert("Đã xoá thẻ.");
          } catch (err) {
            Alert.alert("Lỗi xoá thẻ", err.message);
          }
        },
      },
      { text: "Huỷ", style: "cancel" },
    ]);
  };

  if (!deck) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Không tìm thấy bộ thẻ.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={{ marginTop: 10 }}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F9F9F9" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>📘 Danh Sách Thẻ {deck.name}</Text>

        {cards.length === 0 ? (
          <Text style={styles.emptyText}>Chưa có thẻ nào trong bộ này.</Text>
        ) : (
          cards.map((item) => (
            <TouchableOpacity
              key={item.id}
              onLongPress={() => handleLongPress(item)}
              style={styles.cardBox}
            >
              <View style={styles.cardRow}>
                <Text style={styles.cardFront}>{item.front}</Text>
                <TouchableOpacity onPress={() => speakWord(item.front)}>
                  <Text style={styles.speakerIcon}>🔊</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#4CAF50" }]}
          onPress={() => navigation.navigate("AddCard", { deckId: deck.id })}
        >
          <Text style={styles.buttonText}>➕ Thêm thẻ</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#2196F3" }]}
          onPress={() => navigation.navigate("Study", { deckId: deck.id })}
        >
          <Text style={styles.buttonText}>📚 Bắt đầu học</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#FF9800" }]}
          onPress={() => navigation.navigate("Quiz", { deckId: deck.id })}
        >
          <Text style={styles.buttonText}>📝 Bắt đầu kiểm tra</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#9C27B0" }]}
          onPress={() =>
            navigation.navigate("SimilarCards", { deckId: deck.id })
          }
        >
          <Text style={styles.buttonText}>🧠 Chọn thẻ tương đồng</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DeckDetailScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#F9F9F9",
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  cardBox: {
    backgroundColor: "#FFF",
    padding: 12,
    marginVertical: 6,
    borderRadius: 12,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardFront: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
  buttonGroup: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#F9F9F9",
  },
  actionButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  speakerIcon: {
    fontSize: 20,
    paddingHorizontal: 10,
    color: "#007AFF",
  },
});
