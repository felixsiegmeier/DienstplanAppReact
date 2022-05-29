import React from "react";
import styled from "@emotion/styled";
import { TableCell } from "@mui/material";
import { updateWish } from "../../services/api";

function WishSquare(props){

    const defaultColor = "#e6e1c3"
    const noDutyWish = "#a62f26"
    const dutyWish = "#538525"

    let renderColor = defaultColor

    if(props.dutyWish.includes(props.date)){
        renderColor = dutyWish
}

    if(props.noDutyWish.includes(props.date)){
        renderColor = noDutyWish
    }

    const [bgColor, setbgColor] = React.useState(renderColor)

    const Square = styled.div`
    display: inline-block;
    width: 30px;
    height: 30px;
    background-color: ${bgColor};
    border-radius: 5px;
    box-shadow: 2px 2px grey;
    &:hover {
        border: 2px solid lightblue;
        width: 26px;
        height: 26px;
        cursor: pointer;
    }
`

    const handleClick = (e) => {
        if(bgColor === defaultColor){
            setbgColor(noDutyWish)
            updateWish(props.planId, props.wishId, props.date, "noDutyWish")

        }
        if(bgColor === noDutyWish){
            setbgColor(dutyWish)
            updateWish(props.planId, props.wishId, props.date, "dutyWish")

        }
        if(bgColor === dutyWish){
            setbgColor(defaultColor)
            updateWish(props.planId, props.wishId, props.date, "noWish")
        }
    }

    return <TableCell sx={props.noWorkingDay && {backgroundColor: "lightgray"}}><Square onClick={handleClick} /></TableCell>
}

export default WishSquare