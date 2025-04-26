import React, { useState } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { signUp } from '../services/authService';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      Alert.alert('❌ Lỗi', 'Mật khẩu xác nhận không khớp.');
      return;
    }

    try {
      await signUp(email, password);

      await signOut(auth);

      Alert.alert(
        '✅ Đăng ký thành công',
        'Hệ thống đã gửi email xác nhận. Vui lòng xác minh email trước khi đăng nhập.'
      );

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
          📝 Đăng ký
        </Text>

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          mode="outlined"
          theme={{ colors: { primary: '#0163be' } }}
        />

        <TextInput
          label="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          mode="outlined"
          theme={{ colors: { primary: '#0163be' } }}
        />

        <TextInput
          label="Xác nhận mật khẩu"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={styles.input}
          mode="outlined"
          theme={{ colors: { primary: '#0163be' } }}
        />

        <Button
          mode="contained"
          onPress={handleSignup}
          style={styles.button}
          contentStyle={styles.buttonContent}
          buttonColor="#0163be"
          textColor="white"
        >
          Đăng ký
        </Button>

        <Button
          onPress={() => navigation.navigate('Login')}
          style={styles.link}
          labelStyle={styles.linkText}
        >
          Đã có tài khoản? Đăng nhập
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
