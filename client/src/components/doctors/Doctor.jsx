import React from "react";
import ClinicSelect from "./ClinicSelect"
import DutySelect from "./DutySelect";
import Checkbox from '@mui/material/Checkbox';
import { Input } from "@mui/material";
import {postDoctorAttrToDatabase, deleteDoctorFromDatabase} from "../../services/api"
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

function Doctor(props){
    const doctor = props.doctor

    const handleChange = (e) => {
        const id = doctor._id
        const attr = e.target.name
        const value = attr === "name" ?  e.target.value : e.target.checked 
        postDoctorAttrToDatabase(id, attr, value)
    }

    const handleDelete = (e) => {
        props.deleteDoctor(doctor._id)
        deleteDoctorFromDatabase(doctor._id)
    }

    const handleKeyDown = (e) => {
        e.key === "Enter" && e.target.blur()
    }

    return(
        <TableRow key={doctor._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell align="center"><Input name="name" onKeyDown={handleKeyDown} onBlur={handleChange} sx={{input: {textAlign: "center"}}} defaultValue={doctor.name}/></TableCell>
            <TableCell align="center"><ClinicSelect 
                doctor={doctor}
                clinics={props.clinics}
            /></TableCell>
            <TableCell align="center"><Checkbox onChange={handleChange} name="emergencyDepartment" defaultChecked={doctor.emergencyDepartment} /></TableCell>
            <TableCell align="center"><Checkbox onChange={handleChange} name="house" defaultChecked={doctor.house} /></TableCell>
            <TableCell align="center"><Checkbox onChange={handleChange} name="imc" defaultChecked={doctor.imc} /></TableCell>
            <TableCell align="center"><Checkbox onChange={handleChange} name="only12" defaultChecked={doctor.only12} /></TableCell>
            <TableCell align="center"><DutySelect doctor={doctor} /></TableCell>
            <TableCell align="center"><Checkbox onChange={handleChange} name="emergencyDoctor" defaultChecked={doctor.emergencyDoctor} /></TableCell>
            <TableCell align="center"><Checkbox onChange={handleChange} name="rescueHelicopter" defaultChecked={doctor.rescueHelicopter} /></TableCell>
            <TableCell align="center"><IconButton onClick={handleDelete}><DeleteIcon /></IconButton></TableCell>
        </TableRow>
    )
}

export default Doctor