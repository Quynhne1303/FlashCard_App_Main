import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { getSharedDecks } from "../services/sharedDeckService";
import { saveDeckTitle } from "../services/deckService";

const SharedDecksScreen = ({ navigation }) => {
  const [sharedDecks, setSharedDecks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const decks = await getSharedDecks();
        setSharedDecks(decks);
      } catch (error) {
        Alert.alert("Lỗi", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDecks();
  }, []);

  // ✅ Hàm lưu bộ thẻ (long press)
  const promptSaveDeck = (deck) => {
    Alert.alert("Lưu bộ thẻ", `Bạn có muốn lưu bộ thẻ "${deck.title}" không?`, [
      {
        text: "Huỷ",
        style: "cancel",
      },
      {
        text: "Lưu",
        onPress: async () => {
          try {
            await saveDeckTitle(deck.title, deck.cards || []);
            Alert.alert("✅ Đã lưu bộ thẻ thành công!");
          } catch (error) {
            Alert.alert("Lỗi", error.message);
          }
        },
      },
    ]);
  };

  // ✅ Render mỗi bộ thẻ
  const renderDeck = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("DeckDetail", { deck: item, title: item.title })
      }
      onLongPress={() => promptSaveDeck(item)}
      style={styles.deckCard}
    >
      <Text style={styles.deckTitle}>{item.title}</Text>
      <Text style={styles.deckOwner}>👤 {item.owner}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#0163be" style={{ flex: 1 }} />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🌐 Bộ thẻ được chia sẻ</Text>
      <FlatList
        data={sharedDecks}
        keyExtractor={(item) => item.id}
        renderItem={renderDeck}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Không có bộ thẻ nào.</Text>
        }
        contentContainerStyle={{ gap: 12 }}
      />
    </View>
  );
};

export default SharedDecksScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f9fc",
    padding: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#0163be",
  },
  deckCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  deckTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  deckOwner: {
    marginTop: 4,
    color: "#777",
    fontSize: 14,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#999",
  },
});
