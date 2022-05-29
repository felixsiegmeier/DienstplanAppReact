import "./Wish.css"
import React from "react"
import {useParams} from "react-router-dom"
import {getPlanById, getDoctorsForEmergencyDepartmentAndHouse} from "../../services/api.js"
import { Button, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material"
import AddWishRow from "./AddWishRow"
import WishRow from "./WishRow"
import { useNavigate } from 'react-router';

function WishMatrix(){
    const navigate = useNavigate()
    const params = useParams()
    const [plan, updatePlan] = React.useState({
        _id: "",
        wishList: [],
        days: []
    })
    const [doctors, setDoctors] = React.useState([])

    const fetchData = async () => {
        const res = await getPlanById(params.planId)
        const doctors = await getDoctorsForEmergencyDepartmentAndHouse()
        updatePlan(res.data)
        setDoctors(doctors)
    }

    React.useEffect(() =>{
        fetchData() 
    }, [])

    const handleClick = (e) => {
        navigate("/plan/"+plan._id)
    }

    return (
        <>
            <h1>Wunschliste</h1>
            <Table>
                <TableHead>
                    <TableRow>
                    <TableCell>Löschen</TableCell>
                    <TableCell>Name</TableCell>
                        {plan.days.map((day, index) => {return <TableCell key={index}>{index+1}</TableCell>
                        })}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {plan.wishList.map((wish, index) => <WishRow key={index} fetchData={fetchData} wish={wish} days={plan.days} planId={plan._id} />)}
                    <AddWishRow planId={plan._id} doctors={doctors} fetchData={fetchData} />
                </TableBody>
            </Table>
            <Button onClick={handleClick}>Plan aufrufen</Button>
        </>
    )


}

export default WishMatrix