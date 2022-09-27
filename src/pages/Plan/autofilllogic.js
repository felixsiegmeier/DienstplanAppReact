import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";

export default async function autofillPlan(data) {
  const {
    planId,
    setProgress,
    noShortSwitches,
    no2SaInMonth,
    no2SaInRow,
    no2WeInRow,
    iterations,
    respectClinic,
    doRefresh,
  } = data;

  const wishesRef = collection(db, "wishes");
  const qWishes = query(wishesRef, where("planId", "==", planId));

  const daysRef = collection(db, "days");
  const qDays = query(
    daysRef,
    where("planId", "==", planId),
    orderBy("day", "asc")
  );

  const doctorsRef = collection(db, "doctors");
  const qDoctors = query(
    doctorsRef,
    orderBy("rescueHelicopter", "asc"),
    orderBy("emergencyDoctor", "asc"),
    orderBy("imc", "asc"),
    orderBy("name", "asc")
  );

  const wishesData = await getDocs(qWishes);
  const wishes = wishesData.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

  const daysData = await getDocs(qDays);
  const days = daysData.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

  const doctorsData = await getDocs(qDoctors);
  const doctors = doctorsData.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
    dutys: [],
    points: 0,
  }));

  const allPlans = []; // big array which will contain all iterations = variantions of the dutyroster after calculation

  // calculates
  /// doctor.dutys (array of all dates)
  /// doctor.points (number)
  /// day.numberOfNotAwailableDoctors (number)
  /// day.clinics (object)
  days.forEach((day, index) => {
    day.clinics = {
      Kardiologie: 0,
      Gastroenterologie: 0,
      Rhythmologie: 0,
      Geriatrie: 0,
      Ohne: 0,
    };

    day.numberOfNotAwailableDoctors = 0;

    const duty_lines = [
      "emergencyDepartment",
      "house",
      "imc",
      "emergencyDoctor",
    ];

    // adds and calculates
    //// doctor.points
    //// doctor.dutys
    //// day.clinics
    duty_lines.forEach((line) => {
      // counts the clinics per day
      day[line].forEach((doctorId) => {
        const doctor = doctors.find((d) => d.id === doctorId);
        doctor.dutys.push(day.day);
        doctor.points = doctor.points + day.value;
        day.clinics[doctor.clinic] = day.clinics[doctor.clinic] + 1;
      });
    });

    // day.clinics for rescueHelicopter is counted separate (since doctor is missing same and not next day)
    day["rescueHelicopter"].forEach((doctorId) => {
      const doctor = doctors.find((d) => d.id === doctorId);
      doctor.dutys.push(day.day);
      doctor.points = doctor.points + day.value;
      if (days[index - 1])
        days[index - 1].clinics[doctor.clinic] =
          days[index - 1].clinics[doctor.clinic] + 1;
    });

    // calculates day.numberOfNotAwailableDoctors
    wishes.forEach((wishObj) => {
      if (wishObj.noDutyWish.includes(day.day)) {
        day.numberOfNotAwailableDoctors = day.numberOfNotAwailableDoctors + 1;
      }
    });
  });

  // rates a plan and returns its rating
  const evaluate = (days, allDoctors) => {
    let rating = 0;
    const UNASSIGNED_MALUS = -60
    const SHORT_SWITCH_MALUS = -30
    const MEAN_DEVIATION_FACTOR = 30
    const INTERVALL_FACTOR = 10
    const doctors = allDoctors.filter(
      (doctor) => doctor.emergencyDepartment || doctor.house
    );

    // checks for unassigned dutys
    days.forEach((day) => {
      if (day.house.length === 0) rating = rating + UNASSIGNED_MALUS;
      if (day.emergencyDepartment.length === 0) rating = rating + UNASSIGNED_MALUS;
    });

    // checks duty-intervalls for every doctor and adds the mean * INTERVALL_FACTOR to the Rating
    doctors.forEach((doctor) => {
      const dutysSorted = doctor.dutys.sort();
      let dutyIntervallSum = 0;
      for (var i = 0; i < dutysSorted.length - 1; i++) {
        dutyIntervallSum += dutysSorted[i - 1] - dutysSorted[i];
      }
      const dutyIntervallMean = dutyIntervallSum / (dutysSorted.length - 1);
      if (dutyIntervallMean) rating += dutyIntervallMean * INTERVALL_FACTOR;
    });

    // checks for short switches
    doctors.forEach((doctor) => {
      const dutysSorted = doctor.dutys.sort();
      for (var i = 0; i < dutysSorted.length - 1; i++) {
        const dutyIntervall = dutysSorted[i - 1] - dutysSorted[i];
        if (dutyIntervall === 2) rating += SHORT_SWITCH_MALUS
      }
    });

    // checks meandeviation of the amount of dutys and adds its value * MEAN_DEVIATION_FACTOR to the rating
    const dutysPerDoctorMean = days.length / doctors.length; 
    let dutysDeviationSum = 0;
    doctors.forEach((doctor) => {
      dutysDeviationSum += Math.abs(doctor.dutys.length - dutysPerDoctorMean);
    });
    const dutysDeviationMean = dutysDeviationSum / doctors.length;
    rating -= dutysDeviationMean * MEAN_DEVIATION_FACTOR;

    // checks meandeviation of the amount of points and adds its value * MEAN_DEVIATION_FACTOR to the rating
    let pointsOfAllDoctors = 0;
    let pointsDeviationSum = 0;
    doctors.forEach((doctor) => {
      pointsOfAllDoctors += doctor.points;
    });
    const pointsOfAllDoctorsMean = pointsOfAllDoctors / doctors.length;
    doctors.forEach((doctor) => {
      pointsDeviationSum += Math.abs(pointsOfAllDoctorsMean - doctor.points);
    });
    const pointsDeviationMean = pointsDeviationSum / doctors.length;
    rating -= pointsDeviationMean * MEAN_DEVIATION_FACTOR;

    return rating;
  };

  // main function to calculate the plan
  // gets called X times, depending on choosen number of plan-iterations
  // result gets stored with its rating in allPlans [[[days], rating], ...]
  const calculate = () => {
    const newDays = JSON.parse(JSON.stringify(days)); // deep copy
    const newDoctors = JSON.parse(JSON.stringify(doctors)); // deep copy

    // loops through all wishlists and tries to assign duty
    const setDutyWishes = (data) => {
      const { dayNum, doctorId } = data;
      const day = newDays.find((d) => d.day === dayNum);
      const doctor = newDoctors.find((d) => d.id === doctorId);
      const duty_lines = ["imc", "emergencyDepartment", "house"];

      // get called for every line in a loop, tries to assign the duty
      // if duty is assigned in one line, the loop breaks
      const assignDutyWish = (line) => {
        // checks for clinic if not friday or saturday
        if (respectClinic)
          if (day.clinics[doctor.clinic] > 2)
            if (day.weekday !== 5 || day.weekday !== 6) return false;

        // checks for line
        if (!doctor[line]) return false;

        // checks if duty is already assigned to a doctor before
        if (newDays[dayNum - 1][line].length > 0) return false;

        // if no false up until now => assign duty & return true
        newDays[dayNum - 1][line].push(doctorId);
        doctor.dutys = [...doctor.dutys, dayNum];
        doctor.points = doctor.points + day.value;
        return true;
      };

      // loop through all lines (imc > emergencyDepartment > house) and try to assign duty
      // disrupts the loop when assignDutyWish() returns true
      for (var i = 0; i < duty_lines.length; i++) {
        if (doctor[duty_lines[i]]) {
          if (assignDutyWish(duty_lines[i])) {
            break;
          }
        }
      }
    };

    // loops over wishList and assignes if possible
    // setDutyWishes for checking
    const serveWishes = () => {
      wishes.forEach((wishObj) => {
        const doctorId = wishObj.doctorId;
        wishObj.dutyWish.forEach((wish) => {
          setDutyWishes({ dayNum: wish, doctorId: doctorId });
        });
      });
    };

    // returns array of days, sorted by assignment-order
    // sa > fr/so > rest & ordered by number of avaiable doctors from low to high
    const sortDays = () => {
      const shuffled = newDays.sort(() => Math.random() - 0.5);
      const saturdays = shuffled.filter((day) => day.weekday === 6);
      saturdays.sort((day1, day2) =>
        day1.numberOfNotAwailableDoctors > day2.numberOfNotAwailableDoctors
          ? -1
          : 1
      );
      const otherWeekendDays = shuffled.filter(
        (day) => day.weekday === 0 || day.weekday === 5
      );
      otherWeekendDays.sort((day1, day2) =>
        day1.numberOfNotAwailableDoctors > day2.numberOfNotAwailableDoctors
          ? -1
          : 1
      );
      const otherDays = shuffled.filter(
        (day) => day.weekday !== 0 && day.weekday !== 5 && day.weekday !== 6
      );
      otherDays.sort((day1, day2) =>
        day1.numberOfNotAwailableDoctors > day2.numberOfNotAwailableDoctors
          ? -1
          : 1
      );
      return [...saturdays, ...otherWeekendDays, ...otherDays];
    };

    // return array of doctors, sorted by dutys > points
    // gets called in every single assignment-loop to refresh it's data
    const sortDoctors = () => {
      const shuffled = newDoctors
        .sort(() => Math.random() - 0.5)
        .filter((doctor) => doctor.emergencyDepartment || doctor.house);
      const sortedDoctors = shuffled.sort((doc1, doc2) => {
        if (doc1.dutys.length === doc2.dutys.length) {
          return doc1.points < doc2.points ? -1 : 1;
        } else {
          return doc1.dutys.length < doc2.dutys.length ? -1 : 1;
        }
      });

      return sortedDoctors;
    };

    // does the actual check if doctor can be applied to duty
    // if not returns false, else applies doctor to duty and return true
    // gets called by fillPlan()
    const assignDuty = (data) => {
      // returns false if
      //// clinic > 2 and day is not friday or saturday
      //// doctor cant apply to duty-line
      //// doctor already has duty +1, same day or -1
      //// day is in noDutyWish of doctor
      //// noShortSwitches checked and there would be
      //// no2WeInRow checked and would be
      //// no2SaInRow checked and would be
      //// no2SaInMonth checked and would be
      // else apply doctor to the duty and return true

      // check clinic
      const { day, line, doctor } = data;
      if (respectClinic) {
        if (day.clinics[doctor.clinic] > 1) {
          if (day.weekday !== 5 || day.weekday !== 6) {
            return false;
          }
        }
      }

      // check line-capability
      if (!doctor[line]) {
        return false;
      }

      // checks for proximity = day before
      if (doctor.dutys.includes(day.day - 1)) {
        return false;
      }
      // checks for proximity = day after
      if (doctor.dutys.includes(day.day + 1)) {
        return false;
      }
      // checks for proximity = same day
      if (doctor.dutys.includes(day.day)) {
        return false;
      }

      // checks if its in "noDutyWish" of doctor
      const doctorsWishes = wishes.filter(
        (wish) => wish.doctorId === doctor.id
      );
      const check = doctorsWishes.map((wishObj) => {
        if (wishObj.noDutyWish.includes(day.day)) {
          return false;
        }
        return true;
      });
      if (check.includes(false)) return false;

      // checks for short switches in both directions
      if (noShortSwitches) {
        if (
          doctor.dutys.includes(day.day - 2) ||
          doctor.dutys.includes(day.day + 2)
        ) {
          return false;
        }
      }

      // checks for 2 Weekends in row if day = friday
      if (no2WeInRow) {
        if (day.weekday === 5) {
          [7, 8, 9, -7, -6, -5].forEach((interval) => {
            if (doctor.dutys.includes(day.day + interval)) {
              return false;
            }
          });
        }

        // checks for 2 Weekends in row if day = saturday
        if (day.weekday === 6) {
          [6, 7, 8, -8, -7, -6].forEach((interval) => {
            if (doctor.dutys.includes(day.day + interval)) {
              return false;
            }
          });
        }

        // checks for 2 Weekends in row if day = sunday
        if (day.weekday === 0) {
          [5, 6, 7, -9, -8, -7].forEach((interval) => {
            if (doctor.dutys.includes(day.day + interval)) {
              return false;
            }
          });
        }
      }

      // checks for 2 saturdays in row
      if (no2SaInRow)
        if (day.weekday === 6) {
          [7, -7].forEach((interval) => {
            if (doctor.dutys.includes(day.day + interval)) {
              return false;
            }
          });
        }

      // checks for 2 saturdays in month
      if (no2SaInMonth)
        [-28, -21, -14, -7, 7, 14, 21, 28].forEach((interval) => {
          if (doctor.dutys.includes(day.day + interval)) {
            return false;
          }
        });

      // checks if maximum of dutys for doctor is reached
      if (doctor.dutys.length >= doctor.maximum) {
        return false;
      }

      // apply doctor to duty, add duty to dutylist of doctor, add points to point-attribute of doctor
      // return true to break the loop of fillPlan()
      day[line] = [...day[line], doctor.id];
      doctor.dutys = [...doctor.dutys, day.day];
      doctor.points = doctor.points + day.value;
      return true;
    };

    // gets called by calculate() after wished got assigned
    // calls assignDuty() for checking
    const fillPlan = (days) => {
      // takes in day and line and tries to fill the duty by looping through all doctors
      const fillLine = (day, line) => {
        const doctors = sortDoctors();

        // only try to assign if duty is empty or 1 doctor is assigned which does only 12h-dutys
        if (
          day[line].length === 0 ||
          (day[line].length === 1 &&
            doctors.find((doc) => doc.id === day[line][0]).only12)
        ) {
          // actual loop over doctors, breaks if assignment return true
          for (var i = 0; i < doctors.length; i++) {
            const tryToApplyDuty = assignDuty({
              day: day,
              line: line,
              doctor: doctors[i],
            });
            if (tryToApplyDuty) {
              break;
            }
          }
        }
      };

      days.forEach((day) => {
        fillLine(day, "emergencyDepartment");
        fillLine(day, "house");
      });
    };

    serveWishes();
    const newDaysSorted = sortDays();
    fillPlan(newDaysSorted);

    allPlans.push({ plan: newDays, rating: evaluate(newDays, newDoctors) });
    return 0;
  };

  // sorts all plan-variations (arrays of days) by rating and returns the best
  const getBestPlan = () => {
    allPlans.sort((a, b) => (a.rating > b.rating ? -1 : 1));
    return allPlans[0].plan;
  };

  // pushes the plan to the database and calles refresh of the planPage (which calls the useEffect which loads from database to Frontend)
  const publish = async () => {
    const newPlan = getBestPlan();
    // hier muss noch der push in die datenbank rein
    await newPlan.forEach(async (dayObj) => {
      await updateDoc(doc(db, "days", dayObj.id), dayObj);
    });
    doRefresh();
    return true;
  };

  // calculates the roster
  // number of iterations depends on choice in popover
  for (var i = 1; i < iterations + 1; i++) {
    await new Promise((resolve) => setTimeout(resolve, 0)); // empty timeout is needed for updating status on page
    if (i === iterations) {
      await publish();
      setProgress(100);
    } else {
      calculate();
      setProgress(((100 / iterations) * i).toFixed(2));
    }
  }
  return true;
}
