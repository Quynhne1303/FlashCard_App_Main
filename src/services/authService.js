//services/authService.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
} from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

// Đăng ký và gửi email xác minh
export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCredential.user);
    return userCredential;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Đăng nhập (kèm kiểm tra email đã xác minh)
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // Nếu bạn muốn ngăn user chưa xác minh đăng nhập vào app:
    if (!userCredential.user.emailVerified) {
      throw new Error('Email chưa được xác minh. Vui lòng kiểm tra hộp thư.');
    }

    return userCredential;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Gửi lại email xác minh
export const resendVerification = async () => {
  try {
    if (auth.currentUser && !auth.currentUser.emailVerified) {
      await sendEmailVerification(auth.currentUser);
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

// Gửi email đặt lại mật khẩu
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw new Error(error.message);
  }
};

// Đăng xuất
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(error.message);
  }
};
