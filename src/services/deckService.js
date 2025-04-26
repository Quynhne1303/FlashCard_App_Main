// services/deckService.js
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  serverTimestamp,
  doc,
  deleteDoc,
  updateDoc,
  getFirestore,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { getAuth } from "firebase/auth";

// ✅ Thêm bộ thẻ mới kèm các cards
export const saveDeckWithCards = async (title, cards) => {
  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("Người dùng chưa đăng nhập.");

  const deckRef = await addDoc(collection(db, "decks"), {
    title,
    userId,
    createdAt: serverTimestamp(),
  });

  for (const card of cards) {
    await addDoc(collection(db, `decks/${deckRef.id}/cards`), {
      question: card.question,
      answer: card.answer,
      createdAt: serverTimestamp(),
    });
  }
};

// ✅ Lấy danh sách các bộ thẻ
export const getDecks = async () => {
  const userId = getAuth().currentUser?.uid;
  if (!userId) throw new Error("Chưa đăng nhập");

  const q = query(collection(db, "decks"), where("userId", "==", userId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// ✅ Thêm 1 bộ thẻ mới (không card)
export const saveDeckTitle = async (title) => {
  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("Người dùng chưa đăng nhập.");

  const newDeck = {
    title,
    userId,
    createdAt: serverTimestamp(),
  };

  await addDoc(collection(db, "decks"), newDeck);
};

// ✅ Xoá bộ thẻ
export const deleteDeck = async (deckId) => {
  const userId = getAuth().currentUser?.uid;
  if (!userId) throw new Error("Chưa đăng nhập");

  const deckRef = doc(db, "decks", deckId);
  await deleteDoc(deckRef);
};

// ✅ Cập nhật tiêu đề bộ thẻ (Update Title)
export const updateDeckTitle = async (deckId, newTitle) => {
  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("Người dùng chưa đăng nhập.");

  const deckRef = doc(db, "decks", deckId);
  await updateDoc(deckRef, {
    title: newTitle,
    updatedAt: serverTimestamp(),
  });
};
