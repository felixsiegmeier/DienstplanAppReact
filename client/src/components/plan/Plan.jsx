import { Button, FormControl, Table, TableCell, TableHead, TableRow } from "@mui/material";
import React from "react";
import "./Plan.css"
import styled from "@emotion/styled";
import { getPlanAvailableById, getPlanById, getDoctorIdRegister, autoFillPlan } from "../../services/api";
import { useParams } from "react-router";
import DayRow from "./DayRow";
import { useNavigate } from 'react-router';

const Body = styled.div`
width: 80%;
margin: auto;
`

export default function Plan(){
    const navigate = useNavigate()
    const [plan, setPlan] = React.useState({
        days: []
    })
    const [available, setAvailable] = React.useState({
        emergenceDepartment: [],
        house: [],
        imc: [],
        rescueHelicopter: [],
        emergencyDoctor: []
    })
    const [doctorIdRegister, setDoctorIdRegister] = React.useState([])
    const params = useParams()

    const fetchData = async () => {
        const planData = await getPlanById(params.planId)
        const availableData = await getPlanAvailableById(params.planId)
        const doctorIdRegisterData = await getDoctorIdRegister()
        setPlan(planData.data)
        setAvailable(availableData.data)
        setDoctorIdRegister(doctorIdRegisterData.data)
    }

    React.useEffect(() =>{
        fetchData()
    },[]
    )

    const handleClick = (e) => {
        e.target.name === "wish" && navigate("/wishmatrix/"+params.planId)
        e.target.name === "fill" && autoFillPlan(params.planId)
    }

    return(
        <Body>
            <h1>Plan</h1>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Datum</TableCell>
                        <TableCell>Notaufnahme</TableCell>
                        <TableCell>Haus-Dienst</TableCell>
                        <TableCell>IMC-Dienst</TableCell>
                        <TableCell>Notarzt</TableCell>
                        <TableCell>Rettungshubschrauber</TableCell>
                    </TableRow>
                    {plan.days.map((day, index) => <DayRow 
                        key={index}
                        day={day}
                        available={available[index]}
                        dayIndex={index}
                        fetchData={fetchData}
                        doctorIdRegister={doctorIdRegister}
                        planId = {params.planId}
                    />)}
                </TableHead>
            </Table>
            <br/><br/>
            <FormControl sx={{ m: 1, minWidth: 250 }} size="small">
            <Button variant="outlined" color="success" onClick={handleClick} name="wish">Zur Wunschmatrix</Button>
            <br/><br/>
            <Button variant="outlined" color="warning" onClick={handleClick} name="fill">Automatisch Auffüllen</Button>
            </FormControl>
        </Body>
    )
}