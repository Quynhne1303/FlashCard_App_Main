// src/screens/AddDeckScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { db, auth } from '../firebase/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const AddDeckScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');

  const addDeck = async () => {
    if (!title.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên bộ thẻ.");
      return;
    }

    try {
      await addDoc(collection(db, 'decks'), {
        userId: auth.currentUser.uid,
        title,
        cards: [],
      });
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert("Lỗi lưu bộ thẻ", error.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Tên bộ thẻ" value={title} onChangeText={setTitle} style={{ borderWidth: 1, marginBottom: 10 }} />
      <Button title="Lưu" onPress={addDeck} />
    </View>
  );
};

export default AddDeckScreen;
