import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

export default async function deletePlan(planId)  {
    await deleteDoc(doc(db, "plans", planId));

    const daysRef = collection(db, "days");
    const qDays = query(
      daysRef,
      where("planId", "==", planId)
    );
    const dataDays = await getDocs(qDays);
    const days = dataDays.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    days.forEach(async (day) => {
      await deleteDoc(doc(db, "days", day.id));
    });

    const wishesRef = collection(db, "wishes");
    const qWishes = query(
      wishesRef,
      where("planId", "==", planId)
    );
    const dataWishes = await getDocs(qWishes);
    const wishes = dataWishes.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    wishes.forEach(async (wish) => {
      await deleteDoc(doc(db, "wishes", wish.id));
    });
    return true
  }