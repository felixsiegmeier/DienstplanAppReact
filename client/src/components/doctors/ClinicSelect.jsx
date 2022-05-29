import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {postDoctorAttrToDatabase} from "../../services/api"

export default function ClinicSelect(props) {
    const [clinic, setClinic] = React.useState(props.doctor.clinic);

    const handleChange = (event) => {
        setClinic(event.target.value);
        const id = props.doctor._id
        const attr = "clinic"
        const value = event.target.value

        postDoctorAttrToDatabase(id, attr, value)
    };

    const createOptions = (clinic, index) =>{
        return(
            <MenuItem value={clinic} key={index}>{clinic}</MenuItem>
        )
    };

    return (
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
        <Select
            labelId="demo-select-small"
            id="demo-select-small"
            value={clinic}
            onChange={handleChange}
        >
            {props.clinics.map(createOptions)}
        </Select>
        </FormControl>
    );
}