import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { getFlashcardsByDeck } from "../services/flashcardService";
import { getAuth } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";


const QuizScreen = ({ route, navigation }) => {
  const { deckId } = route.params;
  const [cards, setCards] = useState([]); // [{card, direction}]
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const randomDirection = () => (Math.random() < 0.5 ? "enToVi" : "viToEn");

  const loadFlashcards = useCallback(async () => {
    const flashcards = await getFlashcardsByDeck(deckId);
    if (flashcards.length === 0) {
      Alert.alert("Không có thẻ trong bộ này.");
    } else {
      // Gắn mỗi flashcard một chiều random
      const cardQueue = flashcards.map((card) => ({
        card,
        direction: randomDirection(),
      }));
      setCards(cardQueue);
    }
  }, [deckId]);

  useEffect(() => {
    loadFlashcards();
  }, [loadFlashcards]);

  const handleCheck = async () => {
    const { card, direction } = cards[0];
    const correctAnswer =
      direction === "enToVi"
        ? card.back.trim().toLowerCase()
        : card.front.trim().toLowerCase();
  
    const userAns = userAnswer.trim().toLowerCase();
    const correct = userAns === correctAnswer;
  
    setIsCorrect(correct);
    setShowResult(true);
  
    // ✅ Ghi thống kê vào Firestore
    try {
      const currentUser = getAuth().currentUser;
      if (currentUser) {
        await addDoc(collection(db, "statistics"), {
          userId: currentUser.uid,
          cardId: card.id,
          deckId: card.deckId || deckId, // fallback nếu card.deckId không có
          correct,
          timestamp: Date.now(),
        });
      }
    } catch (error) {
      console.error("Lỗi khi ghi thống kê:", error);
    }
  };

  const handleNext = () => {
    const current = cards[0];

    if (isCorrect) {
      // Nếu đúng, loại khỏi hàng đợi
      const newCards = cards.slice(1);
      if (newCards.length === 0) {
        Alert.alert("Hoàn thành", "Bạn đã hoàn thành bài kiểm tra!");
        navigation.goBack();
      } else {
        setCards(newCards);
      }
    } else {
      // Nếu sai, đưa thẻ xuống cuối (giữ nguyên direction)
      setCards((prev) => [...prev.slice(1), current]);
    }

    setUserAnswer("");
    setShowResult(false);
  };

  if (cards.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.noCardText}>Không có từ trong bộ thẻ.</Text>
      </View>
    );
  }

  const { card, direction } = cards[0];
  const questionText =
    direction === "enToVi"
      ? `Dịch sang tiếng Việt: ${card.front}`
      : `Dịch sang tiếng Anh: ${card.back}`;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✏️ Còn lại: {cards.length} câu</Text>
      <Text style={styles.question}>{questionText}</Text>

      <TextInput
        style={styles.input}
        placeholder="Nhập câu trả lời..."
        value={userAnswer}
        onChangeText={setUserAnswer}
        editable={!showResult}
      />

      {!showResult ? (
        <TouchableOpacity style={styles.checkBtn} onPress={handleCheck}>
          <Text style={styles.btnText}>✅ Kiểm tra</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.resultContainer}>
          <Text style={isCorrect ? styles.correct : styles.incorrect}>
            {isCorrect
              ? "Chính xác!"
              : `Sai. Đáp án đúng: ${
                  direction === "enToVi" ? card.back : card.front
                }`}
          </Text>
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.btnText}>👉 Tiếp theo</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default QuizScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noCardText: {
    fontSize: 18,
    color: "gray",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  question: {
    fontSize: 20,
    marginBottom: 20,
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  checkBtn: {
    backgroundColor: "#007bff",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  nextBtn: {
    backgroundColor: "#28a745",
    padding: 14,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  resultContainer: {
    alignItems: "center",
  },
  correct: {
    color: "#28a745",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  incorrect: {
    color: "#dc3545",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
