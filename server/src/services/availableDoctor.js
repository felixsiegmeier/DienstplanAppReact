import { Plan, Doctor } from "../models/models.js";
import {availableForDutyLine, noDutyWish, noDutyOnDay, clinicNotToMany} from "./availableConditions.js"

const availableDoctorsForDuty = async (planId, clinicCheck=false, shortSwitchCheck=true) => {
    const doctors = await Doctor.find()
    const plan = await Plan.findById(planId)
    const dutyLines = ["emergencyDepartment", "house", "imc", "emergencyDoctor", "rescueHelicopter"]
    const available = []

    plan.days.map((day, index) => {
        available.push({
            emergencyDepartment: [], 
            house: [], 
            imc: [], 
            emergencyDoctor: [], 
            rescueHelicopter: []
        })
        dutyLines.map((dutyLine) => {
            doctors.map((doctor) => {
                const controller = (
                    availableForDutyLine(doctor, dutyLine) &&

                    noDutyWish(plan, String(doctor._id), (index+1)) &&

                    (shortSwitchCheck && plan.days[index-2] ? noDutyOnDay(String(doctor._id), plan.days[index-2]) : 1) &&
                    (plan.days[index-1] ? noDutyOnDay(String(doctor._id), plan.days[index-1]) : 1) &&
                    noDutyOnDay(String(doctor._id), day) &&
                    (plan.days[index+1] ? noDutyOnDay(String(doctor._id), plan.days[index+1]) : 1) &&
                    (shortSwitchCheck && plan.days[index+2] ? noDutyOnDay(String(doctor._id), plan.days[index+2]) : 1) &&

                    (clinicCheck ? clinicNotToMany(day, doctor.clinic) : 1)

                )
                //console.log(controller)

                controller && available[index][dutyLine].push(doctor._id)
            })
        })
    })


    return available
}

export {availableDoctorsForDuty}