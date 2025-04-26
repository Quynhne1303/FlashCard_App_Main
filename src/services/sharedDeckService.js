import { getFirestore, collection, getDocs, setDoc, doc, updateDoc } from "firebase/firestore";
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

// Chia sẻ bộ thẻ vào Firestore
export const shareDeckToFirestore = async (deck) => {
  const db = getFirestore();
  const auth = getAuth();

  const sharedDeck = {
    ...deck,
    sharedAt: new Date(),
    owner: auth.currentUser?.email || "Người dùng ẩn danh",
    ownerId: auth.currentUser?.uid,
  };

  await setDoc(doc(db, "sharedDecks", deck.id), sharedDeck);
};

// Cập nhật ownerId cho tất cả bộ thẻ đã chia sẻ trước đó
export const updateOldSharedDecks = async () => {
  const db = getFirestore();
  const auth = getAuth();

  const user = auth.currentUser;
  if (!user) throw new Error("Bạn chưa đăng nhập");

  const sharedDecksRef = collection(db, "sharedDecks");
  const snapshot = await getDocs(sharedDecksRef);

  const updatePromises = [];

  snapshot.docs.forEach((docSnap) => {
    const data = docSnap.data();
    if (!data.ownerId && data.owner === user.email) {
      updatePromises.push(
        updateDoc(doc(db, "sharedDecks", docSnap.id), {
          ownerId: user.uid,
        })
      );
    }
  });

  await Promise.all(updatePromises);
  return updatePromises.length;
};
