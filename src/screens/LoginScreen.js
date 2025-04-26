import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { signIn, resendVerification } from "../services/authService";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const handleLogin = async () => {
    try {
      const userCredential = await signIn(email, password);
      const signedInUser = userCredential.user;

      if (signedInUser.emailVerified) {
        Alert.alert("✅ Đăng nhập thành công!");
      } else {
        setUser(signedInUser);
        Alert.alert("⚠️ Email chưa xác minh", "Vui lòng kiểm tra hộp thư của bạn.");
      }
    } catch (error) {
      Alert.alert("❌ Lỗi", error.message);
    }
  };

  const handleResendVerification = async () => {
    try {
      await resendVerification();
      Alert.alert("📧 Đã gửi lại email xác minh!");
    } catch (error) {
      Alert.alert("Lỗi", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text variant="headlineMedium" style={styles.title}>
          🔐 Đăng nhập
        </Text>

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
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

        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.button}
          contentStyle={styles.buttonContent}
          buttonColor="#0163be"
          textColor="white"
        >
          Đăng nhập
        </Button>

        <Button
          onPress={() => navigation.navigate("Signup")}
          style={styles.link}
          labelStyle={styles.linkText}
        >
          Chưa có tài khoản? Đăng ký
        </Button>

        <Button
          onPress={() => navigation.navigate("ForgotPassword")}
          style={styles.link}
          labelStyle={styles.linkText}
        >
          Quên mật khẩu?
        </Button>

        {user && !user.emailVerified && (
          <Button
            mode="outlined"
            onPress={handleResendVerification}
            style={styles.resendBtn}
            contentStyle={{ paddingVertical: 4 }}
            textColor="#0163be"
          >
            Gửi lại email xác minh
          </Button>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0163be",
    justifyContent: "center",
    padding: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    textAlign: "center",
    marginBottom: 24,
    color: "#0163be",
    fontWeight: "bold",
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  button: {
    marginTop: 8,
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  link: {
    marginTop: 12,
  },
  linkText: {
    color: "#0163be",
    textAlign: "center",
    fontSize: 14,
  },
  resendBtn: {
    marginTop: 16,
    borderRadius: 12,
    borderColor: "#0163be",
    borderWidth: 1,
  },
});
