import getDaysFromDB from "../../services/getDaysFromDB";
import getDoctorsFromDB from "../../services/getDoctorsFromDB";
import getWishesFromDB from "../../services/getWishesFromDB";

const mergeDoctorsAndWishesData = (doctorsData, wishesData) => {
  // map over the doctorsData and for each doctorData,
  return doctorsData.map((doctorData) => {
    // create a new object with the properties of the doctorData and additional properties
    const doctor = { ...doctorData, dutys: [], dutyWish: [], noDutyWish: [] };
    // find the matching wish for the doctorData based on id
    const matchingWish = wishesData.find((wish) => wish.doctorId === doctor.id);
    // if there is a matching wish, assign the wish values to the doctor
    if (matchingWish) {
      doctor.dutyWish = [...matchingWish.dutyWish];
      doctor.noDutyWish = [...matchingWish.noDutyWish];
    }
    return doctor;
  });
};

// ##################################### Diese Funktion funktioniert noch nicht ########################################
const calcNotAvailableDoctors = (daysData, day, line, doctors) => {
  // Find the previous day
  let previousDay = daysData.find((d) => d.day === day.day - 1);
  // Find the next day
  let nextDay = daysData.find((d) => d.day === day.day + 1);
  // filter the doctors array based on conditions,
  // where the doctor should have at least one of the properties "emergencyDepartment" and "house" set to true and "only12" should be set to false
  // or the noDutyWish property of the doctor should include the day represented by the day argument or
  // the id of the doctor should be in the imc, emergencyDepartment or house array of the previous or next day
  console.log(day.day)
  console.log(line)
  console.info(doctors.filter(
    (doctor) =>
    ((doctor.emergencyDepartment || doctor.house) && !doctor.only12)
    || doctor.noDutyWish.includes(day.day)
    || !doctor[line]
    || (previousDay && (previousDay.imc.includes(doctor.id) || previousDay.emergencyDepartment.includes(doctor.id) || previousDay.house.includes(doctor.id)))
    || (nextDay && (nextDay.imc.includes(doctor.id) || nextDay.emergencyDepartment.includes(doctor.id) || nextDay.house.includes(doctor.id)))
    ))
  return doctors.filter(
  (doctor) =>
  ((doctor.emergencyDepartment || doctor.house) && !doctor.only12)
  || doctor.noDutyWish.includes(day.day)
  || (previousDay && (previousDay.imc.includes(doctor.id) || previousDay.emergencyDepartment.includes(doctor.id) || previousDay.house.includes(doctor.id)))
  || (nextDay && (nextDay.imc.includes(doctor.id) || nextDay.emergencyDepartment.includes(doctor.id) || nextDay.house.includes(doctor.id)))
  ).length;
  };

function isBeforeWeekendOrHoliday(daysData, day) {
  // check if the day is a weekend day
  if (day.weekday === 5 || day.weekday === 6) {
    return true;
  }
  // find the next day in the daysData array
  const nextDay = daysData.find((d) => d.day === day.day + 1);
  // if the next day exists and is a holiday, return true
  if (nextDay && nextDay.holiday) {
    return true;
  }
  // otherwise, return false
  return false;
}

function mostFrequentClinic(day, doctors) {
  // create an empty object to store clinic frequencies
  const clinicFrequency = {};
  const propertiesToCheck = ["imc", "emergencyDepartment", "house"];
  propertiesToCheck.forEach((property) => {
    if (day[property]) {
      day[property].forEach((id) => {
        // find the corresponding doctor object in the "doctors" array
        const doctor = doctors.find((doc) => doc.id === id);
        // if the doctor object exists
        if (doctor) {
          // increment the frequency of the clinic in the clinicFrequency object
          clinicFrequency[doctor.clinic] =
            (clinicFrequency[doctor.clinic] || 0) + 1;
        }
      });
    }
  });
  if (Object.keys(clinicFrequency).length > 0) {
    // find the clinic with the highest frequency
    const mostFrequentClinic = Object.keys(clinicFrequency).reduce((a, b) => 
      clinicFrequency[a] > clinicFrequency[b] ? a : b
    );
    // return the frequency of the most frequent clinic
    return clinicFrequency[mostFrequentClinic];
  } else {
    return 0;
  }
}

const calcDayFitness = (daysData, day, line, doctors) => {
  const WEEKDAY_FACTOR = 1;
  const HOLIDAY_FACTOR = 1;
  const NOT_AVAILABLE_DOCTORS_FACTOR = 1;
  const CLINIC_STACKING_FACTOR = 1;

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
    calcNotAvailableDoctors(daysData, day, line, doctors) * NOT_AVAILABLE_DOCTORS_FACTOR;

  if (!isBeforeWeekendOrHoliday(daysData, day)) {
    fitness += mostFrequentClinic(day, doctors) * CLINIC_STACKING_FACTOR;
  }

  return fitness;
};

const calcDutyAssignmentPrioList = (daysData, doctors) => {
  // create a new array of dutyAssignmentFitnessList by mapping over the daysData array
  // and calling calcDayFitness twice for each dayData element,
  // once for emergencyDepartment and once for house
  const dutyAssignmentFitnessList = [
    ...daysData.map((day) => [
      day,
      calcDayFitness(daysData, day, "emergencyDepartment", doctors),
    ]),
    ...daysData.map((day) => [day, calcDayFitness(daysData, day, "house", doctors)]),
  ];
  // sort the dutyAssignmentFitnessList array in descending order based on the second element of each subarray
  return dutyAssignmentFitnessList.sort((a, b) => b[1] - a[1]);
};

export default async function autofillPlan(planId, setProgress) {
  const daysData = await getDaysFromDB(planId);
  const doctorsData = await getDoctorsFromDB();
  const wishesData = await getWishesFromDB(planId);

  const doctors = mergeDoctorsAndWishesData(doctorsData, wishesData);

  const dutyAssignmentPrioList = calcDutyAssignmentPrioList(daysData, doctors);
  console.log(dutyAssignmentPrioList);

  setProgress(100);
  return true;
} 
