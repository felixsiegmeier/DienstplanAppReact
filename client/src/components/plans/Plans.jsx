import * as React from 'react';
import "./Plans.css"
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { deletePlanFromDatabase } from '../../services/api';
import { useNavigate } from 'react-router';

export default function Plans() {
    const navigate = useNavigate()
    const [plans, setPlans] = React.useState([])
    const months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"]

    React.useEffect(() =>{
        axios.get("/plans")
        .then(res => {
            setPlans(res.data)
        })},[]
    )
    
    const createTableHead = (attr, index) => {
        return <TableCell align="center" key={index}><h3>{attr}</h3></TableCell>
    }

    const deletePlan = (id) => {
        const newPlans = plans.filter((plan) => {
            return plan._id !== id
        })
        setPlans(newPlans)
        deletePlanFromDatabase(id)
    }


    const createTableBody = (plan, index) => {
      
        const handleDelete = () => {
            deletePlan(plan._id)
        }

        const handleClick = () => {
            navigate("/plan/"+plan._id)
        }

        return (
            <TableRow className='plan-row' key={plan._id}>
                <TableCell onClick={handleClick} align="center">{plan.name}</TableCell>
                <TableCell onClick={handleClick} align="center">{plan.year}</TableCell>
                <TableCell onClick={handleClick} align="center">{months[plan.month-1]}</TableCell>
                <TableCell align="center"><IconButton onClick={handleDelete}><DeleteIcon /></IconButton></TableCell>
            </TableRow>
        )
    }

  return (
      <div className='plans-page'>
      <h1>Alle Dienstpläne</h1>
      <TableContainer>
        <Table sx={{minWidth: 650}} size="small" arial-label="simple table">
            <TableHead>
                <TableRow>
                    {["Bezeichnung", "Jahr", "Monat", "Löschen"].map(createTableHead)}
                </TableRow>
            </TableHead>
            <TableBody>
                {plans.map(createTableBody)}
            </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
