import React, { useState } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { resetPassword } from '../services/authService';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');

  const handleReset = async () => {
    try {
      await resetPassword(email);
      Alert.alert('✅ Thành công', 'Email khôi phục đã được gửi!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('❌ Lỗi', error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        <Text variant="headlineMedium" style={styles.title}>
          🔑 Khôi phục mật khẩu
        </Text>

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          mode="outlined"
          style={styles.input}
          theme={{ colors: { primary: '#0163be' } }}
        />

        <Button
          mode="contained"
          onPress={handleReset}
          style={styles.button}
          contentStyle={styles.buttonContent}
          buttonColor="#0163be"
          textColor="white"
        >
          Gửi email khôi phục
        </Button>

        <Button
          onPress={() => navigation.goBack()}
          style={styles.link}
          labelStyle={styles.linkText}
        >
          Quay lại đăng nhập
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0163be',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#0163be',
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 8,
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  link: {
    marginTop: 16,
  },
  linkText: {
    color: '#0163be',
    textAlign: 'center',
  },
});
