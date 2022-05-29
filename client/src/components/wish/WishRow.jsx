import React from "react";
import WishSquare from "./WishSquare";
import { TableCell, TableRow } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteWish } from "../../services/api";

export default function WishRow(props){

    const handleDelete = () => {
        deleteWish(props.planId, props.wish._id, props.fetchData)
    }

    return (
        <>
        <TableRow>
        <TableCell align="center"><IconButton onClick={handleDelete}><DeleteIcon /></IconButton></TableCell>
        <TableCell>{props.wish.doctorName}</TableCell>
            {props.days.map((day, index) => {
                return (
                    <WishSquare 
                    key={index} 
                    wishId={props.wish._id} 
                    planId={props.planId} 
                    dutyWish={props.wish.dutyWish} 
                    noDutyWish={props.wish.noDutyWish}
                    noWorkingDay = {day.noWorkingDay}
                    date={index+1}
                    />
                )
                })
            }
        </TableRow>
        </>
        
    )
    
}