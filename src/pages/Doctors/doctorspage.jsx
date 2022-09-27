import React from "react";

import {
  collection,
  getDocs,
  updateDoc,
  doc,
  addDoc,
  query,
  orderBy,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Checkbox, IconButton, Input, MenuItem, Select } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const clinics = [
  "Kardiologie",
  "Gastroenterologie",
  "Rhythmologie",
  "Geriatrie",
  "Ohne",
];

// big function which basically creates a table of all doctors and their attributes (for display and change)
// this table if the only content of this entire page
const DoctorsTable = () => {
  // request data of doctors from db
  const doctorsRef = collection(db, "doctors");
  const orderedDoctors = query(doctorsRef, orderBy("createdAt"));

  // state to save all doctors-data (state is required because it can be changed)
  const [doctors, setDoctors] = React.useState([]);
  // state fo input-field for a new doctor
  const [newDoctor, setNewDoctor] = React.useState("");
  // state to refresh the page. this is called down in the components to make the page refresh in den following useEffect
  // this is required if a doctor gets added or deleted
  const [refresh, doRefresh] = React.useState(false);

  React.useEffect(() => {
    const getData = async () => {
      const data = await getDocs(orderedDoctors);
      setDoctors(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getData();
  }, [refresh]);

  // react-component for every doctor = every table-row
  const Doctor = (props) => {
    const doctor = props.doctor;
    const id = props.doctor.id;
    const [name, setName] = React.useState(doctor.name);
    const [clinic, setClinic] = React.useState(doctor.clinic);
    const [maximum, setMaximum] = React.useState(doctor.maximum);

    // sub-component to create a checkbox for every attribute (emergencydepartment, house, imc, nfa, etc...)
    const DoctorCheckBox = (props) => {
      const attr = props.attr;
      const [state, setState] = React.useState(doctor[attr]);
      return (
        <Checkbox
          color="success"
          checked={state}
          onChange={(e) => {
            const updateFields = {};
            updateFields[attr] = !state;
            updateDoc(doc(db, "doctors", id), updateFields);
            setState(!state);
          }}
        />
      );
    };

    //sub-component to delete a doctor
    const deleteDoctor = async () => {
      await deleteDoc(doc(db, "doctors", id));
      doRefresh(!refresh);
    };

    // actual component-return of the doctor
    return (
      <TableRow>
        <TableCell>
          <Input
            defaultValue={name}
            onChange={(e) => {
              setName(e.target.value);
              updateDoc(doc(db, "doctors", id), { name: e.target.value });
            }}
          ></Input>
        </TableCell>

        <TableCell>
          <Select
            value={clinic}
            onChange={(e) => {
              setClinic(e.target.value);
              updateDoc(doc(db, "doctors", id), { clinic: e.target.value });
            }}
          >
            {clinics.map((clin, index) => (
              <MenuItem key={index} value={clin}>{clin}</MenuItem>
            ))}
          </Select>
        </TableCell>
        <TableCell>
          <DoctorCheckBox attr="emergencyDepartment" />
        </TableCell>
        <TableCell>
          <DoctorCheckBox attr="house" />
        </TableCell>
        <TableCell>
          <DoctorCheckBox attr="imc" />
        </TableCell>
        <TableCell>
          <DoctorCheckBox attr="emergencyDoctor" />
        </TableCell>
        <TableCell>
          <DoctorCheckBox attr="rescueHelicopter" />
        </TableCell>
        <TableCell>
          <DoctorCheckBox attr="only12" />
        </TableCell>
        <TableCell>
          <Select
            value={maximum}
            onChange={(e) => {
              setMaximum(e.target.value);
              updateDoc(doc(db, "doctors", id), {
                maximum: Number(e.target.value),
              });
            }}
          >
            {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8].map(
              (max, index) => (
                <MenuItem key={index} value={max}>{max}</MenuItem>
              )
            )}
          </Select>
        </TableCell>
        <TableCell>
          <DeleteForeverIcon
            className="delete-icon"
            fontSize="large"
            onClick={deleteDoctor}
          />
        </TableCell>
      </TableRow>
    );
  };

  // react-component for the last entry in the table. This is basically an empty Input to create a new doctor.
  const createNewDoctor = async () => {
    await addDoc(doctorsRef, {
      name: newDoctor,
      clinic: "Ohne",
      emergencyDepartment: false,
      house: false,
      imc: false,
      emergencyDoctor: false,
      rescueHelicopter: false,
      only12: false,
      maximum: 8,
      createdAt: serverTimestamp(),
      uid: "",
    });
    doRefresh(!refresh);
    setNewDoctor("");
  };

  // the entire table, containing all doctors (mapping through the entire data-set of them) and the last row to add a new doctor.
  return (
    <div className="doctors-table">
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Klinik</TableCell>
              <TableCell>NFA</TableCell>
              <TableCell>Haus</TableCell>
              <TableCell>IMC</TableCell>
              <TableCell>Notarzt</TableCell>
              <TableCell>RTH</TableCell>
              <TableCell>nur 12 h</TableCell>
              <TableCell>Maximum</TableCell>
              <TableCell>Löschen</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {doctors.map((doctor) => {
              return <Doctor key={doctor.id} doctor={doctor} />;
            })}
            <TableRow>
              <TableCell>
                <Input
                  value={newDoctor}
                  onChange={(e) => {
                    setNewDoctor(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      createNewDoctor();
                    }
                  }}
                ></Input>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default function DoctorsPage(props) {
  return (
    <div className="body">
      <h1>Ärzte verwalten</h1>
      <DoctorsTable />
      <IconButton
        sx={{ position: "absolute", top: "10px", left: "30px" }}
        onClick={() => {
          props.setPage("landingPage");
        }}
      >
        <ArrowBackIcon fontSize="large" /> Startseite
      </IconButton>
    </div>
  );
}
