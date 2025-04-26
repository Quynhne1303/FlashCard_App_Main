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
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { getAuth } from "firebase/auth";
import { updateOldSharedDecks } from "../services/sharedDeckService";

export const deleteSharedDeck = async (deckId, ownerId) => {
  const user = getAuth().currentUser;
  if (!user) throw new Error("Bạn chưa đăng nhập");

  if (user.uid !== ownerId) {
    throw new Error("Bạn không có quyền xoá bộ thẻ này");
  }

  const deckRef = doc(db, "sharedDecks", deckId);
  await deleteDoc(deckRef);
};



const SharedDecksScreen = ({ navigation }) => {
  const [sharedDecks, setSharedDecks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        await updateOldSharedDecks();
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

  const promptDeckAction = (deck) => {
    const isOwner = deck.ownerId === getAuth().currentUser?.uid;
  
    const actions = [
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
    ];
  
    if (isOwner) {
      actions.push({
        text: "🗑️ Xoá",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteSharedDeck(deck.id, deck.ownerId);
            Alert.alert("✅ Đã xoá bộ thẻ khỏi chia sẻ");
            setSharedDecks((prev) => prev.filter((d) => d.id !== deck.id));
          } catch (error) {
            Alert.alert("Lỗi", error.message);
          }
        },
      });
    }
  
    Alert.alert(`Bộ thẻ "${deck.title}"`, "Bạn muốn thực hiện gì?", actions);
  };
  
  const renderDeck = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("DeckDetail", { deck: item, title: item.title })
      }
      onLongPress={() => promptDeckAction(item)}

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
