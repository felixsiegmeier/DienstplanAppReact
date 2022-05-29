import { Input, TableCell, TableRow, MenuItem, FormControl, Select } from "@mui/material";
import React from "react";
import { createNewWish } from "../../services/api";

function AddWishRow(props){

    const doctors = props.doctors

    const createOptions = (doctor, index) =>{
        return(
            <MenuItem value={doctor._id} key={index}>{doctor.name}</MenuItem>
        )
    };

    const handleChange = (event) => {
        createNewWish(props.planId, event.target.value, props.fetchData)
    };

    return(
        <TableRow>
            <TableCell />
            <TableCell>
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <Select
                    labelId="addWishRow"
                    id="addWishRow"
                    value={""}
                    onChange={handleChange}
                >
            {doctors.map(createOptions)}
        </Select>
        </FormControl>
            </TableCell>
        </TableRow>
    )
}

export default AddWishRow