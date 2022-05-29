import * as React from 'react';
import Box from '@mui/material/Box';
import { List, ListItemButton, ListItemText } from '@mui/material';
import { setDuty } from '../../services/api';

export default function DoctorPopoverSelection(props) {
    const available = props.available
    const doctorIdRegister = props.doctorIdRegister
    const dutyLine = props.dutyLine
    const dutyIndex = props.dutyIndex
    const fetchData = props.fetchData
    const dayIndex = props.dayIndex
    const planId = props.planId
    const closePopover = props.closePopover

    const nameOfDoctorId = (id) => {
        const data = doctorIdRegister.find(doctorSet => {
            return doctorSet.includes(id)
        })
        return data ? data[1] : 0
    }

    const handleClick = async (event) => {
        const doctorId = event.currentTarget.getAttribute("data-doctorId")
        closePopover()
        await setDuty(planId, dayIndex, dutyLine, dutyIndex, doctorId, fetchData)
    }

    const createOptions = (options) => {
        return(
            options.map(option => {
                return (
                    <ListItemButton data-doctorId={option} onClick={handleClick}>
                        <ListItemText>{nameOfDoctorId(option)}</ListItemText>
                    </ListItemButton>
                )
            })
        )
    }

    return (
        <Box sx={{ minWidth: 120 }}>
        <List fullWidth>
            {createOptions(available)}
        </List>
        </Box>
    )
}