import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {postDoctorAttrToDatabase} from "../../services/api"

export default function DutySelect(props) {
    const [clinic, setDutys] = React.useState(props.doctor.maximumDutys);

    const handleChange = (event) => {
        setDutys(event.target.value);
        const id = props.doctor._id
        const attr = "maximumDutys"
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
            {[0,1,2,3,4,5,6,7].map(createOptions)}
        </Select>
        </FormControl>
    );
}