import { Button, MenuItem, Popover, Select } from "@mui/material";
import { updateDoc, doc } from "firebase/firestore";
import React from "react";
import { db } from "../../firebase";

export default function DoctorSelectPopover(props) {
  const days = props.days;
  const day = props.day;
  const line = props.line;
  const wishes = props.wishes;
  const anchorEl = props.anchorEl;
  const closePopover = props.closePopover;
  const open = props.open;
  const doctors = props.doctors;
  const id = props.id;
  const doRefresh = props.doRefresh;

  const [doctor1, setDoctor1] = React.useState(day[line][0] || "");
  const [doctor2, setDoctor2] = React.useState(day[line][1] || "");

  const calcAvailableDoctors = () => {
    const doctorCanDoClinic = doctors.filter((doc) => {
      return doc[line];
    });

    const doctorNoDutyWish = doctorCanDoClinic.filter((doc) => {
      let res = false;
      const doctorWishes = wishes.filter((wish) => {
        return wish.doctorId === doc.id;
      });
      doctorWishes.forEach((wish) => {
        if (wish.noDutyWish.includes(day.day)) {
          res = true;
        }
      });
      return res;
    });

    const doctorDutyWish = doctorCanDoClinic.filter((doc) => {
      let res = false;
      const doctorWishes = wishes.filter((wish) => {
        return wish.doctorId === doc.id;
      });
      doctorWishes.forEach((wish) => {
        if (wish.dutyWish.includes(day.day)) {
          res = true;
        }
      });
      return res;
    });

    let dutyInProximity = doctorCanDoClinic.filter(
      (doctor) => {
        if (days[day.day-2] && days[day.day-2].emergencyDepartment.includes(doctor.id)) return true
        if (days[day.day-2] && days[day.day-2].house.includes(doctor.id)) return true
        if (days[day.day-2] && days[day.day-2].imc.includes(doctor.id)) return true
        if (days[day.day] && days[day.day].emergencyDepartment.includes(doctor.id)) return true
        if (days[day.day] && days[day.day].house.includes(doctor.id)) return true
        if (days[day.day] && days[day.day].imc.includes(doctor.id)) return true

        if (line === "emergencyDepartment" && days[day.day-1].house.includes(doctor.id)) return true
        if (line === "emergencyDepartment" && days[day.day-1].imc.includes(doctor.id)) return true

        if (line === "house" && days[day.day-1].emergencyDepartment.includes(doctor.id)) return true
        if (line === "house" && days[day.day-1].imc.includes(doctor.id)) return true

        if (line === "imc" && days[day.day-1].house.includes(doctor.id)) return true
        if (line === "imc" && days[day.day-1].emergencyDepartment.includes(doctor.id)) return true
        return false
      }
    )

    let dutyInShortSwitch = doctorCanDoClinic.filter(
      (doctor) => {
        if (days[day.day-3] && days[day.day-3].emergencyDepartment.includes(doctor.id)) return true
        if (days[day.day-3] && days[day.day-3].house.includes(doctor.id)) return true
        if (days[day.day-3] && days[day.day-3].imc.includes(doctor.id)) return true
        if (days[day.day+1] && days[day.day+1].emergencyDepartment.includes(doctor.id)) return true
        if (days[day.day+1] && days[day.day+1].house.includes(doctor.id)) return true
        if (days[day.day+1] && days[day.day+1].imc.includes(doctor.id)) return true
        return false
      }
    )

    const doctorWithoutWish = doctorCanDoClinic.filter(
      (doctor) => {
        if (doctorDutyWish.includes(doctor)) return false
        if (doctorNoDutyWish.includes(doctor)) return false
        if (dutyInProximity.includes(doctor)) return false
        if (dutyInShortSwitch.includes(doctor)) return false
        return true
      }
    );

    const dutyInProximityFiltered = dutyInProximity.filter((doctor) => {
      if(doctorNoDutyWish.includes(doctor)) return false
      return true
    })

    const dutyInShortSwitchFiltered = dutyInShortSwitch.filter((doctor) => {
      if(doctorNoDutyWish.includes(doctor)) return false
      if(dutyInProximityFiltered.includes(doctor)) return false
      return true
    })

    return [doctorDutyWish, doctorWithoutWish, dutyInShortSwitchFiltered, dutyInProximityFiltered, doctorNoDutyWish];
  };

  const availableDoctors = calcAvailableDoctors();

  const label = () => {
    switch (line) {
      case "emergencyDepartment":
        return "Notaufnahme";
        break;
      case "house":
        return "Hausdienst";
        break;
      case "imc":
        return "IMC";
        break;
      case "emergencyDoctor":
        return "Notarzt";
        break;
      case "rescueHelicopter":
        return "RTH";
        break;
      default:
        return "Error";
    }
  };

  const handleChangeDoctor1 = (e) => {
    setDoctor1(e.target.value);
  };

  const handleChangeDoctor2 = (e) => {
    setDoctor2(e.target.value);
  };

  const saveSelection = async () => {
    const dayObj = { ...day };
    if (doctor1 === "" && doctor2 === "") {
      dayObj[line] = [];
    }
    if (doctor1 !== "" && doctor2 !== "") {
      dayObj[line] = [doctor1, doctor2];
    }
    if (doctor1 !== "" && doctor2 === "") {
      dayObj[line] = [doctor1];
    }
    if (doctor1 === "" && doctor2 !== "") {
      dayObj[line] = [doctor2];
    }
    await updateDoc(doc(db, "days", day.id), dayObj);
    closePopover();
    doRefresh();
  };

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={closePopover}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
    >
      <div className="doctor-select-popover">
        <h3>
          {label()} am {day.day}.{day.month}
        </h3>
        <Select
          sx={{ minWidth: 120, marginBottom: "30px", marginRight: "2.5px" }}
          value={doctor1}
          onChange={handleChangeDoctor1}
        >
          <MenuItem value={""}>LEER</MenuItem>
          {availableDoctors[0].map((doc, index) => {
            return (
              <MenuItem key={index} value={doc.id} sx={{ color: "green" }}>
                {doc.name}
              </MenuItem>
            );
          })}
          {availableDoctors[1].map((doc, index) => {
            return (
              <MenuItem key={index} value={doc.id}>
                {doc.name}
              </MenuItem>
            );
          })}
          {availableDoctors[2].map((doc, index) => {
            return (
              <MenuItem key={index} value={doc.id} sx={{ color: "#ebba34" }}>
                {doc.name}
              </MenuItem>
            );
          })}
          {availableDoctors[3].map((doc, index) => {
            return (
              <MenuItem key={index} value={doc.id} sx={{ color: "#eb7134" }}>
                {doc.name}
              </MenuItem>
            );
          })}
          {availableDoctors[4].map((doc, index) => {
            return (
              <MenuItem key={index} value={doc.id} sx={{ color: "#eb3434", textDecoration:"line-through" }}>
                {doc.name}
              </MenuItem>
            );
          })}
        </Select>
        <Select
          sx={{ minWidth: 120, marginBottom: "30px", marginLeft: "2.5px" }}
          value={doctor2}
          onChange={handleChangeDoctor2}
        >
          <MenuItem value={""}>LEER</MenuItem>
          {availableDoctors[0].map((doc, index) => {
            return (
              <MenuItem key={index} value={doc.id} sx={{ color: "green" }}>
                {doc.name}
              </MenuItem>
            );
          })}
          {availableDoctors[1].map((doc, index) => {
            return (
              <MenuItem key={index} value={doc.id}>
                {doc.name}
              </MenuItem>
            );
          })}
          {availableDoctors[2].map((doc, index) => {
            return (
              <MenuItem key={index} value={doc.id} sx={{ color: "#ebba34" }}>
                {doc.name}
              </MenuItem>
            );
          })}
          {availableDoctors[3].map((doc, index) => {
            return (
              <MenuItem key={index} value={doc.id} sx={{ color: "#eb7134" }}>
                {doc.name}
              </MenuItem>
            );
          })}
          {availableDoctors[4].map((doc, index) => {
            return (
              <MenuItem key={index} value={doc.id} sx={{ color: "#eb3434", textDecoration:"line-through" }}>
                {doc.name}
              </MenuItem>
            );
          })}
        </Select>
        <Button
          variant="contained"
          color="success"
          sx={{ minWidth: 120, marginRight: "2.5px" }}
          onClick={saveSelection}
        >
          Speichern
        </Button>
        <Button
          variant="contained"
          color="warning"
          sx={{ minWidth: 120, marginLeft: "2.5px" }}
          onClick={closePopover}
        >
          Abbrechen
        </Button>
      </div>
    </Popover>
  );
}
