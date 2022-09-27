import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";

export default async function getDoctorsFromDB(){
    const doctorsRef = collection(db, "doctors");
    const qDoctors = query(
      doctorsRef,
      orderBy("rescueHelicopter", "asc"),
      orderBy("emergencyDoctor", "asc"),
      orderBy("imc", "asc"),
      orderBy("name", "asc")
    );
  
  
    const doctorsData = await getDocs(qDoctors);
    const doctors = doctorsData.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      dutys: [],
      points: 0,
    }))

    return doctors
}


  