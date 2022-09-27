import getDaysFromDB from "../../services/getDaysFromDB";
import getDoctorsFromDB from "../../services/getDoctorsFromDB";
import getWishesFromDB from "../../services/getWishesFromDB";

const mergeDoctorsAndWishesData = (doctorsData, wishesData) => {
  const doctors = [];
  doctorsData.forEach((doctorData) => {
    const { id, name, clinic, emergencyDepartment, house, only12, maximum } =
      doctorData;
    const doctor = {
      id: id,
      name: name,
      clinic: clinic,
      emergencyDepartment: emergencyDepartment,
      house: house,
      only12: only12,
      maximum: maximum,
      dutys: [],
      dutyWish: [],
      noDutyWish: [],
    };
    wishesData.forEach((wish) => {
      if (wish.doctorId === doctor.id) {
        doctor.dutyWish = [...wish.dutyWish];
        doctor.noDutyWish = [...wish.noDutyWish];
      }
    });
    doctors.push(doctor);
  });
  return doctors;
};

const calcEmergencyDepartmentFitness = (day) => {
  const WEEKDAY_FACTOR = 1
  const HOLIDAY_FACTOR = 1
  const AVAILABLE_DOCTORS_FACTOR = 1
  const DOCTORS_MEAN_FITTNESS_FACTOR = 1
  const CLINIC_STACKING_FACTOR = 1

  let fitness = 1;

  if(day.weekday === 6){fitness += 2*WEEKDAY_FACTOR}
  if(day.weekday === 5 || day.weekday === 0){fitness += 1*WEEKDAY_FACTOR}
  if(day.holiday){fitness += 1*HOLIDAY_FACTOR}

  return fitness;
};

const calcHouseFitness = (day) => {
  let fitness = 1;
  return fitness;
};

const calcDutyAssignmentPrioList = (daysData, doctors) => {
  const dutyAssignmentFitnessList = [];
  daysData.forEach((day) => {
    dutyAssignmentFitnessList.push([day, calcEmergencyDepartmentFitness(day)]);
    dutyAssignmentFitnessList.push([day, calcHouseFitness(day)]);
  });
  return dutyAssignmentFitnessList.sort((a, b) => a[1] - b[1]);
};

export default async function autofillPlan(planId, setProgress) {
  const daysData = await getDaysFromDB(planId);
  const doctorsData = await getDoctorsFromDB();
  const wishesData = await getWishesFromDB(planId);

  const doctors = mergeDoctorsAndWishesData(doctorsData, wishesData);

  const DutyAssignmentPrioList = calcDutyAssignmentPrioList(daysData, doctors);
  console.log(DutyAssignmentPrioList);

  setProgress(100);
  return true;
}
