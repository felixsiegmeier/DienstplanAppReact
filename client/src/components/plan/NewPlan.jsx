import React from "react";
import axios from "axios";
import { Input, Select, MenuItem, FormControl, Button } from "@mui/material";
import "./Plan.css"
import { createNewPlanInDatabase, getPlanById } from "../../services/api";
import { useNavigate } from 'react-router';

export default function NewPlan(){
    const navigate = useNavigate()
    const [name, setName] = React.useState("Version 1")
    const [year, setYear] = React.useState(2022)
    const [monthIndex, setMonthIndex] = React.useState(0)
    const years = [2022, 2023, 2024, 2025, 2026]
    const months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"]

    const createOptions = (year, index) => {
        return <MenuItem value={year} key={index}>{year}</MenuItem>
    }

    const handleChangeName = (e) => {
        setName(e.target.value)
    }

    const handleChangeYear = (e) => {
        setYear(e.target.value)
    }

    const handleChangemonth = (e) => {
        setMonthIndex(months.indexOf(e.target.value))
    }

    const handleClick = async (e) => {
        const id = await createNewPlanInDatabase(name, year, monthIndex+1)
        e.target.name === "wish" && navigate("/wishmatrix/"+id)
        e.target.name === "plan" && navigate("/plan/"+id)

    }

    return (
        <>
            <h1>Neuen Plan erstellen</h1>
            <div className="new-plan-body">
            <FormControl sx={{ m: 1, minWidth: 250 }} size="small">
                <Input placeholder="Bezeichnung" value={name} onChange={handleChangeName}></Input>
            </FormControl>
                <br/><br/>
            <FormControl sx={{ m: 1, minWidth: 250 }} size="small">
                <Select
                    labelId="demo-select-small"
                    id="demo-select-small"
                    value={year}
                    onChange={handleChangeYear}
                >
                    {years.map(createOptions)}
                </Select>
            </FormControl>
                <br/><br/>
                <FormControl sx={{ m: 1, minWidth: 250 }} size="small">
                <Select
                    labelId="demo-select-small"
                    id="demo-select-small"
                    value={months[monthIndex]}
                    onChange={handleChangemonth}
                >
                    {months.map(createOptions)}
                </Select>
            </FormControl>
            <br/><br/>
            <FormControl sx={{ m: 1, minWidth: 250 }} size="small">
            <Button variant="outlined" color="warning" onClick={handleClick} name="plan">Weiter in Plan</Button>
            <br/><br/>
            <Button variant="outlined" color="warning" onClick={handleClick} name="wish">Weiter in Wunschmatrix</Button>
            </FormControl>
            </div>
        </>
    )
}