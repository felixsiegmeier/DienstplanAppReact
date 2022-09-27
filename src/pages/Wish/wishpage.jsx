import React from "react";

import { db } from "../../firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  addDoc,
  query,
  orderBy,
  serverTimestamp,
  where,
  deleteDoc,
} from "firebase/firestore";

import { FormControl, IconButton, InputLabel, MenuItem, Select } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

// component: square-like button which can be clicked to change between white (no wish), red (no-duty-wish) and green (duty-wish)
const RepresentingField = (props) => {
  const [style, setStyle] = React.useState(
    props.wish.noDutyWish.includes(props.day) ? "field no-duty-wish" : 
    (props.wish.dutyWish.includes(props.day) ? ("field duty-wish") : "field"))

  const updateWish = async () => {
    if (style === "field") {
      setStyle("field no-duty-wish");
      await updateDoc(doc(db, "wishes", props.wish.id), {
        noDutyWish: [...props.wish.noDutyWish, ...[props.day]],
      });
    }
    if (style === "field no-duty-wish") {
      setStyle("field duty-wish");
      const newNoDutyWish = props.wish.noDutyWish.filter((i) => {
        return i !== props.day;
      });
      await updateDoc(doc(db, "wishes", props.wish.id), {
        noDutyWish: newNoDutyWish,
        dutyWish: [...props.wish.dutyWish, ...[props.day]],
      });
    }
    if (style === "field duty-wish") {
      setStyle("field");
      const newDutyWish = props.wish.dutyWish.filter((i) => {
        return i !== props.day;
      });
      await updateDoc(doc(db, "wishes", props.wish.id), { dutyWish: newDutyWish });
    }
    props.doReload(!props.reload)
  };

  return <div className={style} onClick={updateWish}></div>;
};


export default function WishPage(props) {
  const planId = props.planId;
  const wishesRef = collection(db, "wishes");
  const daysRef = collection(db, "days");
  const doctorsRef = collection(db, "doctors");
  const qWishes = query(
    wishesRef,
    where("planId", "==", planId),
    orderBy("createdAt")
  );
  const qDays = query(daysRef, where("planId", "==", planId), orderBy("day", "asc"));
  const qDoctorsEmergencyDepartment = query(
    doctorsRef,
    where("emergencyDepartment", "==", true)
  );
  const qDoctorsHouse = query(
    doctorsRef,
    where("house", "==", true),
    where("emergencyDepartment", "!=", true)
  );
  const [wishes, setWishes] = React.useState([]);
  const [days, setDays] = React.useState([]);
  const [doctors, setDoctors] = React.useState([]);
  const [reload, doReload] = React.useState(false);

  React.useEffect(() => {
    const getData = async () => {
      const wishData = await getDocs(qWishes);
      setWishes(wishData.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      const dayData = await getDocs(qDays);
      setDays(dayData.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      const doctorsEmergencyDepartmentData = await getDocs(
        qDoctorsEmergencyDepartment
      );
      const doctorsHouseData = await getDocs(qDoctorsHouse);
      const doctorsEmergencyDepartment =
        doctorsEmergencyDepartmentData.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
      const doctorsHouse = doctorsHouseData.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setDoctors([...doctorsEmergencyDepartment, ...doctorsHouse]);
    };
    getData();
  }, [reload]);

  // creates a new wish-row for that doctor selected in the dropdown select
  const createNewWish = async (e) => {
    await addDoc(wishesRef, {
      doctorId: e.target.value[0],
      doctorName: e.target.value[1],
      planId: planId,
      createdAt: serverTimestamp(),
      dutyWish: [],
      noDutyWish: [],
    });
    doReload(!reload);
  };

  // free days get dark background for visualisation (saturday, sunday, holidays)
  // this function returns the coresponding css-class
  const isFreeDay = (day) => {
    if (day.weekday === 0) return " free-day"
    if (day.weekday === 6) return " free-day"
    if (day.holiday) return " free-day"
    return ""
  }

  return (
    <div className="body">
      <h1>Wünsche eintragen</h1>
      <br/>
      <table>
      <thead>
          <tr>
            <th></th>
            <th>Name</th>
            {days.map((day, index) => {
              return <th key={index} className={isFreeDay(day)} align="center">{index + 1}</th>;
            })}
          </tr>
          </thead>
          <tbody>
          {wishes.map((wish, trIndex) => {
            return (
              <tr key={trIndex}>
              <td className="doctor-delete-cell"><IconButton onClick={async () => {
                  await deleteDoc(doc(db, "wishes", wish.id));
                  doReload(!reload);
              }}><DeleteForeverIcon /></IconButton></td>
                <td className="doctor-name-cell">{wish.doctorName}</td>
                {days.map((day, tdIndex) => {
                  return (
                    <td key={tdIndex} className={isFreeDay(day)} align="center">
                      <RepresentingField day={tdIndex + 1} wish={wish} doReload={doReload} reload={reload}/>
                    </td>
                  );
                })}
              </tr>
            );
          })}
          </tbody>
      </table>
      <div className="new-wish-dropdown">
              <FormControl fullWidth>
                <InputLabel id="input-label">Neu</InputLabel>
                <Select
                  labelId="input-label"
                  label="Neuer Wunsch"
                  value=''
                  onChange={(e) => {
                    createNewWish(e);
                  }}
                >
                  {doctors.map((doc, index) => {
                    return (
                      <MenuItem key={index} value={[doc.id, doc.name]}>{doc.name}</MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              </div>
      <IconButton
        sx={{ position: "absolute", top: "10px", left: "30px" }}
        onClick={() => {
          props.setPage("landingPage");
        }}
      >
        <ArrowBackIcon fontSize="large" /> Startseite
      </IconButton>
      <IconButton
        sx={{ position: "absolute", top: "10px", right: "30px" }}
        onClick={() => {
          props.setPage("planPage");
        }}
      >
        Plan <ArrowForwardIcon fontSize="large" />
      </IconButton>
    </div>
  );
}