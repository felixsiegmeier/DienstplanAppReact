import { Chip, TableCell, Popover, Typography, Fab} from "@mui/material"
import AddIcon from '@mui/icons-material/Add'
import React from "react"
import DoctorPopoverSelection from "./DoctorPopoverSelection"
import { getDoctorIdRegister } from "../../services/api.js"

export default function DutyPlanCell(props){
    const doctors = props.doctors
    const dutyLine = props.dutyLine
    const available = props.available
    const fetchData = props.fetchData
    const dayIndex = props.dayIndex
    const planId = props.planId
    const doctorIdRegister = props.doctorIdRegister
    const noWorkingDay = props.noWorkingDay
    const [anchorEl, setAnchorEl] = React.useState(null)
    const [dutyIndex, setDutyIndex] = React.useState(null)

    const nameOfDoctorId = (id) => {
        const data = doctorIdRegister.find(doctorSet => {
            return doctorSet.includes(id)
        })
        return data ? data[1] : 0
    }

    const handleClick = (event) => {
        setDutyIndex(event.currentTarget.getAttribute("data-index"))
        anchorEl != null ? setAnchorEl(null) : setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null);
    }
    
    const cell = Boolean(anchorEl);
    const id = cell ? 'simple-popover' : undefined;

    return(
        <TableCell>
            {/* <Chip variant="outlined" label="Test" /> */}
            {doctors.length === 0 && <Chip variant="outlined" label={"__________"} data-index={0} onClick={handleClick}/>}
            {doctors.map((doctor, index) => {
                return <Chip variant="outlined" label={nameOfDoctorId(doctor)} key={index} data-index={index} onClick={handleClick}/>
            })}
            {doctors.length === 1 && 
            noWorkingDay && 
            (<Fab sx={{transform: 'scale(0.65)'}} data-index={1} onClick={handleClick}>
                <AddIcon />
            </Fab>)}
            <Popover
                id={id}
                open={cell}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
                }}
            >
                <Typography sx={{ p: 2 }}>
                    <DoctorPopoverSelection 
                        available={available}
                        doctorIdRegister={doctorIdRegister}
                        dutyLine = {dutyLine}
                        fetchData = {fetchData}
                        dutyIndex = {dutyIndex}
                        dayIndex = {dayIndex}
                        planId = {planId}
                        closePopover = {handleClose}
                    />
                </Typography>
            </Popover>
        </TableCell>
    )
}