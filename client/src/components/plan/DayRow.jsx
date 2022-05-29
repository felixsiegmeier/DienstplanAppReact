import React from "react";
import { TableCell, TableRow } from "@mui/material";
import DutyPlanCell from "./DutyPlanCell";

export default function DayRow(props){
    const available = props.available
    const day = props.day
    const dayIndex = props.dayIndex
    const fetchData = props.fetchData
    const doctorIdRegister = props.doctorIdRegister
    const planId = props.planId

    return (
        <TableRow sx={day.noWorkingDay && {backgroundColor: "lightgray"}}>
            <TableCell>{dayIndex+1}</TableCell>
            <DutyPlanCell 
                doctors={day.emergencyDepartment}
                available={available.emergencyDepartment}
                dutyLine="emergencyDepartment"
                doctorIdRegister={doctorIdRegister}
                dayIndex={dayIndex}
                fetchData = {fetchData}
                planId = {planId}
                noWorkingDay = {day.noWorkingDay}
            />
            <DutyPlanCell 
                doctors={day.house}
                available={available.house}
                dutyLine="house"
                doctorIdRegister={doctorIdRegister}
                dayIndex={dayIndex}
                fetchData = {fetchData}
                planId = {planId}
                noWorkingDay = {day.noWorkingDay}
            />
            <DutyPlanCell 
                doctors={day.imc}
                available={available.imc}
                dutyLine="imc"
                doctorIdRegister={doctorIdRegister}
                dayIndex={dayIndex}
                fetchData = {fetchData}
                planId = {planId}
            />
            <DutyPlanCell 
                doctors={day.emergencyDoctor}
                available={available.emergencyDoctor}
                dutyLine="emergencyDoctor"
                doctorIdRegister={doctorIdRegister}
                dayIndex={dayIndex}
                fetchData = {fetchData}
                planId = {planId}
            />
            <DutyPlanCell 
                doctors={day.rescueHelicopter}
                available={available.rescueHelicopter}
                dutyLine="rescueHelicopter"
                doctorIdRegister={doctorIdRegister}
                dayIndex={dayIndex}
                fetchData = {fetchData}
                planId = {planId}
            />
        </TableRow>
    )
}