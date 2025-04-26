import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  ActivityIndicator,
  Alert,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getAuth, signOut } from "firebase/auth";
import {
  getDecks,
  saveDeckTitle,
  deleteDeck,
  updateDeckTitle,
} from "../services/deckService";
import { Menu } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { shareDeckToFirestore } from "../services/sharedDeckService";

const HomeScreen = () => {
  const [decks, setDecks] = useState([]);
  const [filteredDecks, setFilteredDecks] = useState([]);
  const [title, setTitle] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [newDeckTitle, setNewDeckTitle] = useState("");

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Trang chủ",
      headerLeft: () => (
        <View style={styles.menuContainer}>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <TouchableOpacity
                onPress={() => setMenuVisible(true)}
                style={styles.menuButton}
              >
                <Icon name="menu" size={24} color="#fff" />
              </TouchableOpacity>
            }
            anchorPosition="bottom"
            contentStyle={styles.menuContent}
          >
            <Menu.Item
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate("Stats");
              }}
              title="📈 Thống kê"
              titleStyle={styles.menuItemText}
            />
            <Menu.Item
              onPress={async () => {
                setMenuVisible(false);
                try {
                  await signOut(getAuth());
                } catch (error) {
                  Alert.alert("Lỗi khi đăng xuất", error.message);
                }
              }}
              title="🚪 Đăng xuất"
              titleStyle={styles.menuItemText}
            />
          </Menu>
        </View>
      ),
      headerRight: () => null,
      headerStyle: {
        backgroundColor: "#0163be",
      },
      headerTitleStyle: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 20,
      },
    });
  }, [navigation, menuVisible]);

  useEffect(() => {
    loadDecks();
  }, []);

  const loadDecks = async () => {
    try {
      setLoading(true);
      const data = await getDecks();
      setDecks(data);
    } catch (error) {
      Alert.alert("Lỗi khi tải bộ thẻ", error.message);
    } finally {
      setLoading(false);
    }
  };

  const shareDeckOnline = async (deck) => {
    try {
      await shareDeckToFirestore(deck);
      Alert.alert("✅ Đã chia sẻ bộ thẻ lên kho online!");
      await loadDecks();
    } catch (error) {
      Alert.alert("Lỗi khi chia sẻ", error.message);
    }
  };

  useEffect(() => {
    const filtered = decks.filter((deck) =>
      deck.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDecks(filtered);
  }, [decks, searchTerm]);

  const addDeck = async () => {
    if (!title.trim()) {
      Alert.alert("Vui lòng nhập tên bộ thẻ.");
      return;
    }

    setLoading(true);
    Keyboard.dismiss();

    try {
      await saveDeckTitle(title);
      setTitle("");
      await loadDecks();
      Alert.alert("✅ Đã thêm bộ thẻ mới!");
    } catch (error) {
      Alert.alert("Lỗi khi thêm bộ thẻ", error.message);
    }

    setLoading(false);
  };

  const showDeckOptions = (deck) => {
    Alert.alert("Tùy chọn bộ thẻ", `Bạn muốn làm gì với "${deck.title}"?`, [
      {
        text: "❌ Huỷ",
        style: "cancel",
      },
      {
        text: "📤 Chia sẻ bộ thẻ",
        onPress: () => shareDeckOnline(deck),
      },
      {
        text: "🗑️ Xoá bộ thẻ",
        style: "destructive",
        onPress: () => confirmDeleteDeck(deck),
      },
    ]);
  };

  const confirmDeleteDeck = (deck) => {
    Alert.alert(
      "Xác nhận xoá",
      `Bạn có chắc chắn muốn xoá bộ thẻ "${deck.title}" không?`,
      [
        {
          text: "Huỷ",
          style: "cancel",
        },
        {
          text: "Xoá",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDeck(deck.id);
              await loadDecks();
              Alert.alert("✅ Đã xoá bộ thẻ thành công!");
            } catch (error) {
              Alert.alert("Lỗi khi xoá", error.message);
            }
          },
        },
      ]
    );
  };

  const handleEditDeckTitle = (deck) => {
    setSelectedDeck(deck);
    setNewDeckTitle(deck.title);
    setEditModalVisible(true);
  };

  const handleConfirmEditTitle = async () => {
    if (newDeckTitle.trim() === "") {
      Alert.alert("Tên bộ thẻ không được để trống.");
      return;
    }

    try {
      await updateDeckTitle(selectedDeck.id, newDeckTitle);
      setEditModalVisible(false);
      setSelectedDeck(null);
      setNewDeckTitle("");
      await loadDecks();
      Alert.alert("✅ Đã cập nhật tên bộ thẻ!");
    } catch (error) {
      Alert.alert("Lỗi khi cập nhật tên", error.message);
    }
  };

  const renderDeck = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("DeckDetail", {
          deck: item,
          title: item.title,
        })
      }
      onLongPress={() => showDeckOptions(item)}
      style={styles.deckCard}
    >
      <View style={styles.deckHeader}>
        <Text style={styles.deckTitle}>{item.title}</Text>
        <TouchableOpacity onPress={() => handleEditDeckTitle(item)}>
          <Icon name="pencil" size={24} color="#0163be" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>📚 Danh sách bộ thẻ</Text>

      <TextInput
        placeholder="🔍 Tìm kiếm bộ thẻ"
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={styles.searchInput}
        placeholderTextColor="#888"
      />

      <FlatList
        data={filteredDecks}
        keyExtractor={(item) => item.id}
        renderItem={renderDeck}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Không tìm thấy bộ thẻ nào.</Text>
        }
        contentContainerStyle={{ gap: 12 }}
      />

      <TextInput
        placeholder="Nhập tên bộ thẻ mới"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        placeholderTextColor="#888"
      />

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#0163be"
          style={{ marginTop: 10 }}
        />
      ) : (
        <TouchableOpacity onPress={addDeck} style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Thêm bộ thẻ</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={() => navigation.navigate("SharedDecks")}
        style={[
          styles.addButton,
          { backgroundColor: "#ff9800", marginTop: 10 },
        ]}
      >
        <Text style={styles.addButtonText}>🌐 Bộ thẻ online</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={loadDecks} style={styles.refreshButton}>
        <Text style={styles.refreshButtonText}>🔄 Làm mới</Text>
      </TouchableOpacity>

      {/* Modal chỉnh sửa tên bộ thẻ */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Đổi tên bộ thẻ</Text>
            <TextInput
              value={newDeckTitle}
              onChangeText={setNewDeckTitle}
              placeholder="Nhập tên mới"
              style={styles.modalInput}
              placeholderTextColor="#888"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#ccc" }]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text>Huỷ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#0163be" }]}
                onPress={handleConfirmEditTitle}
              >
                <Text style={{ color: "#fff" }}>Lưu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f9fc",
    padding: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0163be",
    marginBottom: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 12,
  },
  deckCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  deckHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deckTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 10,
    marginTop: 24,
    backgroundColor: "#fff",
  },
  addButton: {
    backgroundColor: "#0163be",
    padding: 14,
    borderRadius: 10,
    marginTop: 12,
  },
  addButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#999",
  },
  menuContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  menuButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  menuContent: {
    borderRadius: 8,
    marginTop: 10,
    marginLeft: -12,
  },
  menuItemText: {
    fontSize: 14,
  },
  refreshButton: {
    backgroundColor: "#4caf50",
    padding: 14,
    borderRadius: 10,
    marginTop: 12,
  },
  refreshButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  modalButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
  },
});
