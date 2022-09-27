import {
    Button,
    IconButton,
  } from "@mui/material";
  import ArrowBackIcon from "@mui/icons-material/ArrowBack";
  import {
    collection,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    updateDoc,
    where,
  } from "firebase/firestore";
  import React from "react";
  import { db } from "../../firebase";
  import DoctorSelectPopover from "./doctorselectpopover";
  import AutofillModal from "./autofillmodal";
  
  const DUTY_LINES = [
    "emergencyDepartment",
    "house",
    "imc",
    "emergencyDoctor",
    "rescueHelicopter",
  ];
  
  export default function PlanPage(props) {
    const [autofillModal, setAutofillModal] = React.useState(false)
    const [oldDays, setOldDays] = React.useState(null)
  
    const [plan, setPlan] = React.useState({});
    const planRef = doc(db, "plans", props.planId);
  
    const [wishes, setWishes] = React.useState([]);
    const wishesRef = collection(db, "wishes");
    const qWishes = query(wishesRef, where("planId", "==", props.planId));
  
    const [days, setDays] = React.useState([]);
    const daysRef = collection(db, "days");
    const qDays = query(
      daysRef,
      where("planId", "==", props.planId),
      orderBy("day", "asc")
    );
  
    const [doctors, setDoctors] = React.useState([]);
    const doctorsRef = collection(db, "doctors");
    const qDoctors = query(
      doctorsRef,
      orderBy("rescueHelicopter", "asc"),
      orderBy("emergencyDoctor", "asc"),
      orderBy("imc", "asc"),
      orderBy("name", "asc")
    );
  
    const [refresh, setRefresh] = React.useState(false);
  
    const doRefresh = () => {
      setRefresh(!refresh);
    };
  
    React.useEffect(() => {
      const getData = async () => {
        const planData = await getDoc(planRef);
        const wishesData = await getDocs(qWishes);
        const daysData = await getDocs(qDays);
        const doctorsData = await getDocs(qDoctors);
  
        setPlan(planData.data());
        setWishes(wishesData.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        setDays(daysData.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        setDoctors(
          doctorsData.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
      };
      getData();
    }, [refresh]);
  
  // ######################### Plan Grid View #########################
  
  // square-like field, that represents a duty in the grid view
  // can be clicked to change between "assigned" = blue and "not assigned" = default
    const RepresentingField = (props) => {
      const day = props.day;
      const doctor = props.doctor;
      const doctorId = props.doctor.id;
  
      // checks if the doctor is assigned to the duty in any of the 5 lines
      const initDuty = () => {
        if (
          day.emergencyDepartment.includes(doctorId) ||
          day.house.includes(doctorId) ||
          day.imc.includes(doctorId) ||
          day.emergencyDoctor.includes(doctorId) ||
          day.rescueHelicopter.includes(doctorId)
        )
          return true;
        return false;
      };
  
      const [duty, setDuty] = React.useState(initDuty());
  
      // checks if the doctor has a dutywish or a nodutywish for that day
      // this affects the default color of the Field (dutywish = green, nodutywish = red, none: white)
      const findings = wishes.filter((wish) => {
        return wish.doctorId === doctorId;
      });
      var noDutyWish = false;
      var dutyWish = false;
      findings.forEach((finding) => {
        noDutyWish =
          finding.noDutyWish && finding.noDutyWish.includes(day.day) && true;
        dutyWish = finding.dutyWish && finding.dutyWish.includes(day.day) && true;
      });
  
      // change Field-color and updates database on click
      const handleClick = async () => {
        const dayObj = { ...day };
  
        if (duty) {
          await DUTY_LINES.forEach(async (line) => {
            const newDutyList = day[line].filter((i) => {
              return i !== doctorId;
            });
            dayObj[line] = newDutyList;
          });
        }
  
        if (!duty) {
          if (doctor.emergencyDoctor) {
            dayObj.emergencyDoctor = [...dayObj.emergencyDoctor, doctor.id];
          } else if (doctor.imc) {
            dayObj.imc = [...dayObj.imc, doctor.id];
          } else if (
            doctor.emergencyDepartment &&
            dayObj.emergencyDepartment.length < 1
          ) {
            dayObj.emergencyDepartment = [
              ...dayObj.emergencyDepartment,
              doctor.id,
            ];
          } else if (doctor.house) {
            dayObj.house = [...dayObj.house, doctor.id];
          }
        }
        setDuty(!duty);
        await updateDoc(doc(db, "days", day.id), dayObj);
        doRefresh();
      };
  
      const styleLogic = (dutyState) => {
        if (dutyState) return "field duty";
        if (noDutyWish) return "field no-duty-wish";
        if (dutyWish) return "field duty-wish";
        return "field";
      };
  
      const [style, setStyle] = React.useState(styleLogic(duty));
  
      return <div className={style} onClick={handleClick} />;
    };
  
    // check if day is Sa, Su or Holiday = table-column-background grey
    const isFreeDay = (day) => {
      if (day.weekday === 0) return " free-day";
      if (day.weekday === 6) return " free-day";
      if (day.holiday) return " free-day";
      return "";
    };
  
    // complete Grid-View, uses RepresentingField and the logic above
    const PlanGrid = () => {
      return (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              {days.map((day, index) => {
                return (
                  <th key={index} align="center" className={isFreeDay(day)}>
                    {index + 1}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor, doctorIndex) => {
              return (
                <tr key={doctorIndex} className="doctor-grid-table-row">
                  <td className="doctor-name-cell">{doctor.name}</td>
                  {days.map((day, dayIndex) => {
                    return (
                      <td
                        key={dayIndex}
                        className={"representing-field-cell" + isFreeDay(day)}
                        align="center"
                      >
                        <RepresentingField day={day} doctor={doctor} />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    };
  
  // ######################### Plan Table View #########################
  
    // returns an object with arrays of doctor-names for every dutyline for a specific day
    const doctorNamesForTableCellByDay = async (day) => {
      const names = {};
      await DUTY_LINES.forEach((line) => {
        day[line].forEach((doctorId) => {
          const doctor = doctors.find((doc) => doc.id === doctorId);
          if (names[line]) {
            names[line] = names[line] + "/" + doctor.name;
          } else {
            names[line] = doctor.name;
          }
        });
      });
      return names;
    };
  
    // Component for a single Row of the Plan, containing Date and assigned Doctors
    const DayRow = (props) => {
      const day = props.day;
      const [names, setNames] = React.useState({
        emergencyDepartment: "",
        house: "",
        imc: "",
        emergencyDoctor: "",
        rescueHelicopter: "",
      });
  
      React.useEffect(() => {
        const getNames = async () => {
          const data = await doctorNamesForTableCellByDay(day);
          setNames(data);
        };
        getNames();
      }, []);
  
      return (
        // row Color is grey if its Sa, Su or Holiday (reuse of function from Grid View)
        <tr className={isFreeDay(day)}>
          <td>{day.day}</td>
        {/*
          Creates a Cell for every duty, showing the Names of assigned doctors
          the cell is clickable, opening a DoctorSelectPopover to select from all available Doctors for that duty
        */}
          {DUTY_LINES.map((line, index) => {
            const DoctorCell = () => {
              const [anchorEl, setAnchorEl] = React.useState(null);
  
              const openPopover = (event) => {
                if (!anchorEl) setAnchorEl(event.currentTarget);
              };
  
              const closePopover = () => {
                setAnchorEl(null);
              };
  
              const open = Boolean(anchorEl);
              const id = open ? "simple-popover" : undefined;
  
              return (
                <td className="plan-table-cell" onClick={openPopover}>
                  <div>
                    {names[line]}{" "}
                    <DoctorSelectPopover
                      id={id}
                      open={open}
                      closePopover={closePopover}
                      anchorEl={anchorEl}
                      wishes={wishes}
                      days={days}
                      day={day}
                      doctors={doctors}
                      line={line}
                      doRefresh={doRefresh}
                    />
                  </div>
                </td>
              );
            };
  
            return <DoctorCell key={index} />;
          })}
        </tr>
      );
    };
  
    const PlanTable = () => {
      return (
        <table>
          <thead>
            <tr>
              <th>Datum</th>
              <th>NFA</th>
              <th>Haus</th>
              <th>IMC</th>
              <th>NA</th>
              <th>RTH</th>
            </tr>
          </thead>
          <tbody>
            {days.map((day, index) => {
              return <DayRow key={index} day={day} />;
            })}
          </tbody>
        </table>
      );
    };
  
  // ######################### Plan Summary Table #########################
  
    const SummaryTableRow = (props) => {
      const doctor = props.doctor;
      const [points, setPoints] = React.useState(0);
      const [dutyCount, setDutyCount] = React.useState(0);
      const [dutys, setDutys] = React.useState([]);
  
      React.useEffect(() => {
        days.forEach((day) => {
          DUTY_LINES.forEach((line) => {
            if (day[line].includes(doctor.id)) {
              let value = day.value;
              let count = 1;
              if (day[line].length > 1) {
                value = value / 2;
                count = 0.5;
              }
              setDutyCount((oldCount) => oldCount + count);
              setPoints((oldPoints) => oldPoints + value);
              if (!dutys.includes(day.day)) {
                setDutys((oldDutys) => [...oldDutys, day.day]);
              }
            }
          });
        });
      }, []);
  
      return (
        <tr>
          <td className="summary-table-cell">{doctor.name}</td>
          <td className="summary-table-cell">{dutyCount}</td>
          <td className="summary-table-cell">{points}</td>
          <td className="summary-table-cell">{dutys.join(", ")}</td>
        </tr>
      );
    };
  
    const SummaryTable = () => {
      return (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Dienstanzahl</th>
              <th>Dienstpunkte</th>
              <th>Dienste</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor, index) => {
              return <SummaryTableRow key={index} doctor={doctor} />;
            })}
          </tbody>
        </table>
      );
    };
  
  // ######################### Auto Fill Logic #########################
  
    const openAutofillModal = () => {
      setAutofillModal(true)
    }
  
    const closeAutofillModal = () => {
      setAutofillModal(false)
    }
  
    const restorePrevDays = async () => {
      await oldDays.forEach(async (dayObj) => {
        await updateDoc(doc(db, "days", dayObj.id), dayObj);
      })
      setOldDays(null)
      doRefresh()
      
    }
  
  // ######################### Actual Page-Export #########################
  
    return (
      <div className="body">
        <h1>Dienstplan</h1>
        <h2 className="plan-page-h2">Gridansicht</h2>
        <h2 className="plan-page-h2">{plan.name}</h2>
        <PlanGrid />
        <br /> <br />
        <h2 className="plan-page-h2">Tabellenansicht</h2>
        <h2 className="plan-page-h2">{plan.name}</h2>
        <PlanTable />
        <br /> <br />
        <h2 className="plan-page-h2">Zusammenfassung</h2>
        <SummaryTable />
        <IconButton
          sx={{ position: "absolute", top: "10px", left: "30px" }}
          onClick={() => {
            props.setPage("landingPage");
          }}
        >
          {/* back Button to LandingPage */}
          <ArrowBackIcon fontSize="large" /> Startseite
        </IconButton>
        <IconButton
          sx={{ position: "absolute", top: "60px", left: "30px" }}
          onClick={() => {
            props.setPage("wishPage");
          }}
        >
        {/* back Button to WishList */}
          <ArrowBackIcon fontSize="large" /> Wunschliste
        </IconButton>
        {/* Button to open AutofillModal */}
        <Button variant="contained" sx={{ position: "absolute", top: "30px", right: "30px" }} onClick={openAutofillModal}>Plan automatisch füllen</Button>
        {oldDays && <Button variant="outlined" sx={{ position: "absolute", top: "80px", right: "30px" }}  onClick={restorePrevDays}>Zurücksetzen</Button>}
        <AutofillModal doRefresh={doRefresh} planId={props.planId} open={autofillModal} closeAutofillModal={closeAutofillModal} saveOldDays={() => setOldDays(days)} />
      </div>
    );
  }
