import { getFirestore, collection, getDocs, setDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Lấy danh sách bộ thẻ chia sẻ
export const getSharedDecks = async () => {
  const db = getFirestore();
  const sharedDecksRef = collection(db, "sharedDecks");
  const snapshot = await getDocs(sharedDecksRef);

  const decks = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return decks;
};

// Chia sẻ 1 bộ thẻ vào Firestore
export const shareDeckToFirestore = async (deck) => {
  const db = getFirestore();
  const auth = getAuth();

  const sharedDeck = {
    ...deck,
    sharedAt: new Date(),
    owner: auth.currentUser?.email || "Người dùng ẩn danh",
  };

  await setDoc(doc(db, "sharedDecks", deck.id), sharedDeck);
};
