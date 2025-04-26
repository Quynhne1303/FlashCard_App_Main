import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { updateFlashcard } from '../services/flashcardService';

const EditCardScreen = ({ route, navigation }) => {
  const { card } = route.params;
  const [front, setFront] = useState(card.front);
  const [back, setBack] = useState(card.back);

  const handleUpdate = async () => {
    if (!front.trim() || !back.trim()) {
      Alert.alert('Vui lòng điền đầy đủ mặt trước và sau của thẻ.');
      return;
    }

    try {
      await updateFlashcard(card.id, { front, back });
      Alert.alert('Cập nhật thành công!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Lỗi khi cập nhật thẻ', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Mặt trước (Front)</Text>
      <TextInput
        value={front}
        onChangeText={setFront}
        style={styles.input}
        placeholder="Nhập mặt trước"
      />

      <Text style={styles.label}>Mặt sau (Back)</Text>
      <TextInput
        value={back}
        onChangeText={setBack}
        style={styles.input}
        placeholder="Nhập mặt sau"
      />

      <Button title="💾 Lưu thay đổi" onPress={handleUpdate} />
      <View style={{ height: 10 }} />
      <Button title="❌ Huỷ bỏ" color="gray" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
});

export default EditCardScreen;
