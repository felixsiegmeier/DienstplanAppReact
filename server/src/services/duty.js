import { Doctor, Plan } from "../models/models.js";

export default async function saveDuty(planId, dateIndex, dutyLine, dutyIndex, doctorId){
    const plan = await Plan.findById(planId)
    const newDoctor = await Doctor.findById(doctorId)
    const oldDoctor = plan.days[dateIndex][dutyLine][dutyIndex] ? await Doctor.findById(plan.days[dateIndex][dutyLine][dutyIndex]) : false
    let oldClinic = false
    const newClinic = newDoctor.clinic

    const setOldClinic = (doctor) => {
        oldClinic = doctor.clinic
        return true
    }

    const decrementClinic = (clinic) => {
        if (dutyLine === "rescueHelicopter"){
            plan.days[dateIndex-1] && (plan.days[dateIndex-1].clinics[clinic] -= 1)
        }else{
            plan.days[dateIndex].clinics[clinic] -= 1
        }
        return true
    }

    const incrementClinic = (clinic) => {
        if (dutyLine === "rescueHelicopter"){
            plan.days[dateIndex-1] && (plan.days[dateIndex-1].clinics[clinic] += 1)
        }else{
            plan.days[dateIndex].clinics[clinic] += 1
        }
    }

    oldDoctor && setOldClinic(oldDoctor) && decrementClinic(oldClinic)
    incrementClinic(newClinic)
    plan.days[dateIndex][dutyLine][dutyIndex] = doctorId
    plan.save()
}