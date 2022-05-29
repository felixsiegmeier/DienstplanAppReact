import { Plan, Day, Clinic, Wish, Doctor } from "../../models/models.js"

const getWishListByPlanId = async (req, res) => {
    const planId = req.query.id
    const plan = await Plan.findById(planId)
    const wishList = plan.wishList
    res.send(wishList)
}

const createNewWishInPlanById = async (req, res) => {
    const newWish = new Wish()
    newWish.doctorId = req.body.doctorId
    const doctor = await Doctor.findById(req.body.doctorId)
    newWish.doctorName = doctor.name
    const plan = await Plan.findById(req.body.planId)
    plan.wishList.push(newWish)
    await plan.save()
    res.sendStatus(200)
}

const updateWishByPlanIdAndWishId = async (req, res) => {
    const date = req.body.date
    const state = req.body.state
    const wishId = req.body.wishId
    const planId = req.body.planId

    const plan = await Plan.findById(planId)
    const wishList = plan.wishList
    const wish = wishList.find((wish) => {
        return (String(wish._id) === wishId)
    })
    
    if(state === "noDutyWish"){
        wish.noDutyWish.push(date)
        wish.dutyWish = wish.dutyWish.filter((wish) => {
            return wish != date
        })
    }

    if(state === "dutyWish"){
        wish.dutyWish.push(date)
        wish.noDutyWish = wish.noDutyWish.filter((wish) => {
            return wish != date
        })
    }

    if(state === "noWish"){
        wish.noDutyWish = wish.noDutyWish.filter((wish) => {
            return wish != date
        })
        wish.dutyWish = wish.dutyWish.filter((wish) => {
            return wish != date
        })
    }

    plan.save()
    res.sendStatus(200)
}

const deleteWishByPlanIdAndWishId = async (req, res) => {
    const planId = req.body.planId
    const wishId = req.body.wishId

    const plan = await Plan.findById(planId)
    plan.wishList = plan.wishList.filter((wish) => {
        return wish._id != wishId
    })

    await plan.save()
    res.sendStatus(200)
}

export {getWishListByPlanId, createNewWishInPlanById, updateWishByPlanIdAndWishId, deleteWishByPlanIdAndWishId}