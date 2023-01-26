import getDaysFromDB from "../../services/getDaysFromDB";
import getDoctorsFromDB from "../../services/getDoctorsFromDB";
import getWishesFromDB from "../../services/getWishesFromDB";

/*
- Hole doctorData, wishData und daysData von der Datenbank
- Erzeuge aus doctorData und wishData einen Datensatz
- Erstelle eine Liste mit Objekten aller Dienste 
  {day, line, availableDoctors (direkt ermitteln), fitness}
- Verteile die only12-Ärzte (geht nur über Wünsche! Keine Zufallsvergabe)
- Trage die Wünsche wenn möglich ein
  - Ermittle nach jeder Eintragung neu, welche Ärzte verfügbar sind
- Ermittle für jeden Tag die Fittness
  Faktoren: Wochentag, Feiertagstatus, Anzahl verfügbarer Ärzte
- Sortiere die Dienste in umgekehrter Reihenfolge nach der Fitness
- Iteriere über die Dienste
  - Ermittle die Fitness aller Ärzte
    Faktoren: Dienstanzahl, Dienstpunkte, Wechselabstand, Wochenendanzahl, Wochenendabstand
  - Teile den Arzt mit der besten Fitness ein
    - wenn das nicht möglich ist
      - Merke dir, dass du einen Zufallsplan erstellst
      - Starte neu und wähle auf jeder Stufe wenn möglich zufällig zwischen den 2 (..3, ..4, ..5, ..6) besten Ärzten
      - Wenn Stufe 5 Erreicht ist dann akzeptiere "Offen"
  - entferne den Dienst aus der Liste
  - Ermittle erneut für jeden Dienst, welche Ärzte verfügbar sind
  - Ermittle erneut für jeden Tag die Fittness
  - Sortiere erneut die Dienste in ungekehrter Reihenfolge nach der Fitness
- Wenn du einen Zufallsplan erstellt hast
  - Wiederhole den Prozess, bis du 100 Dienste hast
  - Bewerte die Dienste nach ihrer Fitness und wähle den Besten aus
- Gib den Dienstplan aus
*/


const mergeDoctorsAndWishesData = async (doctorsData, wishesData) => {
  return doctorsData.map((doctorData) => {
    const doctor = { ...doctorData, dutys: [], dutyWish: [], noDutyWish: [] };
    const matchingWish = wishesData.find((wish) => wish.doctorId === doctor.id);
    if (matchingWish) {
      doctor.dutyWish = [...matchingWish.dutyWish];
      doctor.noDutyWish = [...matchingWish.noDutyWish];
    }
    return doctor;
  });
};

const calcAvailableDoctors = (daysData, day, line, doctors) => {
    let previousDay = daysData.find((d) => d.day === day.day - 1);
    let nextDay = daysData.find((d) => d.day === day.day + 1);

    return doctors.filter(
    (doctor) =>
    doctor[line] 
    && !doctor.only12
    && !(doctor.noDutyWish.includes(day.day)
    && !(day.imc.includes(doctor.id) || day.emergencyDepartment.includes(doctor.id) || day.house.includes(doctor.id))
    && !(previousDay && (previousDay.imc.includes(doctor.id) || previousDay.emergencyDepartment.includes(doctor.id) || previousDay.house.includes(doctor.id)))
    && !(nextDay && (nextDay.imc.includes(doctor.id) || nextDay.emergencyDepartment.includes(doctor.id) || nextDay.house.includes(doctor.id)))
    && !(!isBeforeWeekendOrHoliday(daysData, day) && clinicFrequency(day, doctors)[doctor.clinic] && clinicFrequency(day, doctors)[doctor.clinic] > 1)
    )
    );
    };

function isBeforeWeekendOrHoliday(daysData, day) {
  if (day.weekday === 5 || day.weekday === 6) {
    return true;
  }
  const nextDay = daysData.find((d) => d.day === day.day + 1);
  if (nextDay && nextDay.holiday) {
    return true;
  }
  return false;
}

function clinicFrequency(day, doctors) {
  const clinicFrequency = {};
  const propertiesToCheck = ["imc", "emergencyDepartment", "house"];
  propertiesToCheck.forEach((property) => {
    if (day[property]) {
      day[property].forEach((id) => {
        const doctor = doctors.find((doc) => doc.id === id);
        if (doctor) {
          clinicFrequency[doctor.clinic] =
            (clinicFrequency[doctor.clinic] || 0) + 1;
        }
      });
    }
  });
  return clinicFrequency;
}

const calcDayFitness = (daysData, day, line, doctors, availableDoctors) => {
  const WEEKDAY_FACTOR = 1;
  const HOLIDAY_FACTOR = 1;
  const NOT_AVAILABLE_DOCTORS_FACTOR = 1;

  let fitness = 1;

  if (day.weekday === 6) {
    fitness += 2 * WEEKDAY_FACTOR;
  }
  if (day.weekday === 5 || day.weekday === 0) {
    fitness += 1 * WEEKDAY_FACTOR;
  }
  if (day.holiday) {
    fitness += 1 * HOLIDAY_FACTOR;
  }
  fitness +=
    (doctors.length-availableDoctors.length) * NOT_AVAILABLE_DOCTORS_FACTOR;

  return fitness;
};

const calcDutys = async (daysData, doctors, lines) => {
  const dutys = []
  daysData.forEach(day => {
    lines.forEach(line => {
      const availableDoctors = calcAvailableDoctors(daysData, day, line, doctors)
      dutys.push({
        day: day,
        line: line,
        availableDoctors: availableDoctors,
        fitness: calcDayFitness(daysData, day, line, doctors, availableDoctors)
      })
    })
  })

  return dutys.filter(duty => 
    duty.day[duty.line].length === 0
    || (duty.day[duty.line].length === 1 && doctors.find(doctor => doctor.id === duty.day[duty.line][0]).only12)
  ).sort((a,b) => a.availableDoctors.length - b.availableDoctors.length)
};

const reCalcDutys = (dutys, daysData, doctors) => {
  dutys.forEach(duty => {
    const availableDoctors = calcAvailableDoctors(daysData, duty.day, duty.line, doctors);
    duty.availableDoctors = availableDoctors;
    duty.fitness = calcDayFitness(daysData, duty.day, duty.line, doctors, availableDoctors);
  });
  return dutys;
};

async function assignOnly12(dutys, doctors){
  const docs = doctors.filter(doc => doc.only12)
  docs.forEach(doc => {
    doc.dutyWish.forEach(wish => {
      dutys.find(duty => duty.line==="emergencyDepartment" && duty.day.day === wish).day.emergencyDepartment.push(doc.id)
    })
  })
}

async function assignWishes(dutys,daysData, doctors, wishesData){
  wishesData.forEach(wish => {
    const {dutyWish, doctorId} = wish
    dutyWish.forEach(day => {
      let duty = dutys.find(duty => duty.day.day === day)
      duty && duty.availableDoctors.some(d => d.id === doctorId) && duty.day[duty.line].push(doctorId)
      && (dutys = dutys.filter(d => d === duty))
      reCalcDutys(dutys, daysData, doctors)
    })
  })
}

export default async function autofillPlan(planId, setProgress) {
  const daysData = await getDaysFromDB(planId);
  const doctorsData = await getDoctorsFromDB();
  const wishesData = await getWishesFromDB(planId);

  const doctors = await mergeDoctorsAndWishesData(doctorsData, wishesData);
  const dutys = await calcDutys(daysData, doctors, ["emergencyDepartment", "house"])
  await assignOnly12(dutys, doctors)
  await assignWishes(dutys,daysData, doctors, wishesData)

  console.log(daysData);

  setProgress(100);
  return true;
} 
