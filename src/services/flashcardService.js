// services/flashCardService.js
import { getDatabase, ref, push, set, update, remove, get, child } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, query, where, doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

// ===========================
// ✅ Với Firestore
// ===========================

// Tạo flashcard mới trong Firestore (theo deckId)
export const createFlashcard = async (deckId, front, back) => {
  const userId = getAuth().currentUser?.uid;
  if (!userId) throw new Error('Chưa đăng nhập');

  const newRef = doc(collection(db, "flashcards"));

  const newCard = {
    id: newRef.id,
    front,
    back,
    createdAt: Date.now(),
    userId,
    deckId,
  };

  await setDoc(newRef, newCard);
  return newCard;
};

// Cập nhật flashcard Firestore
export const updateFlashcard = async (cardId, updatedData) => {
  const cardRef = doc(db, "flashcards", cardId);
  await updateDoc(cardRef, updatedData);
};

// Xoá flashcard khỏi Firestore
export const deleteFlashcard = async (cardId) => {
  const cardRef = doc(db, "flashcards", cardId);
  await deleteDoc(cardRef);
};

// Lấy flashcards theo deckId từ Firestore
export const getFlashcardsByDeck = async (deckId) => {
  const q = query(collection(db, "flashcards"), where("deckId", "==", deckId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// ===========================
// 🔄 Tuỳ chọn thêm: Realtime Database
// ===========================

// Lấy tất cả flashcards từ Realtime Database (nếu dùng)
export const getAllFlashcardsRealtime = async () => {
  const dbRef = ref(getDatabase());
  const userId = getAuth().currentUser?.uid;
  if (!userId) throw new Error('Chưa đăng nhập');

  const snapshot = await get(child(dbRef, `flashcards/${userId}`));

  if (!snapshot.exists()) return [];

  const data = snapshot.val();
  return Object.values(data);
};


// Tạo flashcard trong Realtime Database (không dùng nếu bạn dùng Firestore)
export const createFlashcardRealtime = async (front, back) => {
  const db = getDatabase();
  const userId = getAuth().currentUser?.uid;
  if (!userId) throw new Error('Chưa đăng nhập');

  const newRef = push(ref(db, `flashcards/${userId}`));

  const newCard = {
    id: newRef.key,
    front,
    back,
    createdAt: Date.now(),
    userId,
  };

  await set(newRef, newCard);
  return newCard;
};

// Cập nhật flashcard trong Realtime Database
export const updateFlashcardRealtime = async (cardId, updatedData) => {
  const db = getDatabase();
  const userId = getAuth().currentUser?.uid;
  if (!userId) throw new Error('Chưa đăng nhập');

  const cardRef = ref(db, `flashcards/${userId}/${cardId}`);
  await update(cardRef, updatedData);
};

// Xoá flashcard khỏi Realtime Database
export const deleteFlashcardRealtime = async (cardId) => {
  const db = getDatabase();
  const userId = getAuth().currentUser?.uid;
  if (!userId) throw new Error('Chưa đăng nhập');

  const cardRef = ref(db, `flashcards/${userId}/${cardId}`);
  await remove(cardRef);
};
