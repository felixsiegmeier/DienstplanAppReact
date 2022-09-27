import { db } from "../../firebase";
import { serverTimestamp, addDoc, collection } from "firebase/firestore";

const plansRef = collection(db, "plans");
const daysRef = collection(db, "days");

export default async function createNewPlan(month, year, name) {
  const rawData = await fetch(
    "https://feiertage-api.de/api/?jahr=" + year + "&nur_land=MV",
    { method: "GET" }
  );
  const data = await rawData.json();
  const allHolidayNames = Object.keys(data);
  const allHolidays = allHolidayNames.map((holidayName) => {
    return data[holidayName].datum;
  });
  const holidayObj = {};
  allHolidays.forEach((element) => {
    const [year, month, date] = element.split("-");
    holidayObj[month]
      ? (holidayObj[month] = [...holidayObj[month], Number(date)])
      : (holidayObj[month] = [Number(date)]);
  });
  const daysOfMonth = new Date(year, month + 1, 0).getDate();

  const newPlan = await addDoc(plansRef, {
    createdAt: serverTimestamp(),
    month: month + 1,
    year: year,
    name: name,
    openForWishes: false,
    public: false
  });
  const newPlanId = await newPlan.id;

  for (var i = 0; i < daysOfMonth; i++) {
    const day = {
      day: i + 1,
      planId: newPlanId,
      holiday: holidayObj[month + 1]
        ? holidayObj[month + 1].includes(i + 1)
        : false,
      weekday: new Date(year, month, i + 1).getDay(),
      emergencyDepartment: [],
      emergencyDoctor: [],
      house: [],
      rescueHelicopter: [],
      imc: [],
      value: 1,
    };
    const calcValue = async (index) => {
      if (day.weekday === 0 || day.weekday === 5) day.value += 1;
      if (day.weekday === 6) day.value += 2;
      if (day.holiday) {
        day.value += 1;
      }
      if (holidayObj[month + 1] && holidayObj[month + 1].includes(index + 2)) day.value += 1;
      if (day.value > 3) day.value = 3;
    };

    await calcValue(i);
    await addDoc(daysRef, day);
  }
}
