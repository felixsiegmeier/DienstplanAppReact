import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../firebase";

export default async function getDaysFromDB(planId) {
  const daysRef = collection(db, "days");
  const qDays = query(
    daysRef,
    where("planId", "==", planId),
    orderBy("day", "asc")
  );

  const daysData = await getDocs(qDays);
  const days = daysData.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

  return days;
}
