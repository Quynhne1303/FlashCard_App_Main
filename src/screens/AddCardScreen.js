import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Keyboard,
  Alert,
  StyleSheet,
} from "react-native";
import { createFlashcard } from "../services/flashcardService";


const AddCardScreen = ({ route, navigation }) => {
  const { deckId } = route.params;
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const saveCard = async () => {
    if (!question.trim() || !answer.trim()) {
      Alert.alert(
        "Thiếu nội dung",
        "Vui lòng nhập đầy đủ mặt trước và mặt sau của thẻ."
      );
      return;
    }

    try {
      Keyboard.dismiss();
      await createFlashcard(deckId, question, answer);
      navigation.goBack();
    } catch (error) {
      Alert.alert("Lỗi", "Không thể lưu thẻ: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 Thêm thẻ mới</Text>

      <Text style={styles.label}>Thuật ngữ (English)</Text>
      <TextInput
        placeholder="Ví dụ: Apple"
        value={question}
        onChangeText={setQuestion}
        style={styles.input}
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Định nghĩa (Vietnamese or English)</Text>
      <TextInput
        placeholder="Ví dụ: Quả táo"
        value={answer}
        onChangeText={setAnswer}
        style={styles.input}
        placeholderTextColor="#999"
      />

      <TouchableOpacity style={styles.button} onPress={saveCard}>
        <Text style={styles.buttonText}>💾 Lưu thẻ</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddCardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8fafc",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0163be",
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 6,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#0163be",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
