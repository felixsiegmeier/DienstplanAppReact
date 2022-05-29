import React, {useEffect, useState} from "react";
import axios from "axios"
import Doctor from "./Doctor"
import "./DoctorStyles.css"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Input } from "@mui/material";

function DoctorList(){
    const [data, setData] = useState({
        clinics: [],
        doctorAttrs: [],
        doctors: []
    })

    useEffect(() =>{
    axios.get("/doctors")
    .then(res => {
        setData(res.data)
    })},[]
    )

    function deleteDoctor(id){
        const newDoctors = data.doctors.filter((doctor) => {
            return doctor._id !== id
        })
        setData((prev) => {
            return({
            ...prev,
            doctors: newDoctors
        })
        })
    }

    function createTableHead(data, index){
        return(
            <TableCell align="center" key={index}><h3>{data}</h3></TableCell>
        )
    }

    function createDoctors(doctor, index){
        return(
            <Doctor 
                key={index}
                doctor={doctor}
                clinics={data.clinics}
                deleteDoctor={deleteDoctor}
            />
        )
    }

    function addNewDoctor(e){
        axios.post("/doctors/new", {
            name: e.target.value
        })
        .then(() => {
            axios.get("/doctors")
                .then(res => {
                    setData(res.data)
                    e.target.value=""
            })
        })
    }

    function handleKeyDown(e){
        e.key === "Enter" && e.target.blur()
    }
        
    return(
        <div className="doctors-table">
            <h1>Ärzte verwalten</h1>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} size="small" arial-label="simple table">
                    <TableHead>
                        <TableRow>
                            {data.doctorAttrs.map(createTableHead)}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.doctors.map(createDoctors)}
                        <TableRow>
                            <TableCell align="center"><Input name="name" onKeyDown={handleKeyDown} onBlur={addNewDoctor} sx={{input: {textAlign: "center"}}} placeholder="Neuer Arzt"/></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default DoctorList