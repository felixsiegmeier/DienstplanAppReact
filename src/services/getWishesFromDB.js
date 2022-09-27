import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

export default async function getWishesFromDB(planId) {
  const wishesRef = collection(db, "wishes");
  const qWishes = query(wishesRef, where("planId", "==", planId));

  const wishesData = await getDocs(qWishes);
  const wishes = wishesData.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

  return wishes;
}
