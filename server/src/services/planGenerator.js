import { Doctor, Plan } from "../models/models.js";
import saveDuty from "./duty.js";
import { availableDoctorsForDuty } from "./availableDoctor.js";
import mongoose from "mongoose";

export default async function generatePlan(planId){
    const iterations = 10
    const rawPlan = await Plan.findById(planId)
    const doctors = await Doctor.find()

    const bestPlan = {
        plan: false,
        value: false
    }

    for(var i = 0; i < iterations; i++){
        const plan = calculatePlan(rawPlan)
        const value = ratePlan(plan)

        if (bestPlan.value && value < bestPlan.value){
            bestPlan.plan = plan
            bestPlan.value = value
        }
    }
}

const calculatePlan = (plan) => {
    const planWithWishes = fulfillWishes(plan)
    //console.log(plan.wishList)
    return plan
}

const fulfillWishes = async (plan) => {
    plan.wishList.map(async (wish, index) => {
        const availableDoctors = await availableDoctorsForDuty(plan._id, true)
        wish.dutyWish.map(dutyWish => {
            // console.log(dutyWish-1)
            console.log(typeof wish.doctorId)
            // console.log(availableDoctors[dutyWish-1].emergencyDepartment)
            availableDoctors[dutyWish-1].emergencyDepartment.map(id => {
                console.log(typeof id)
            })
        })
    })
}

const ratePlan = (plan) => {
    return 1
}