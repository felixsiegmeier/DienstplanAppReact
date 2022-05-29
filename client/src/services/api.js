import axios from "axios"

const postDoctorAttrToDatabase = (doctorId, attr, value) => {
    axios.post("/doctors", {
        id: doctorId,
        attr: attr, 
        value: value
    })
}

const deleteDoctorFromDatabase = (doctorId) => {
    axios.delete("/doctors", {data :
        {id: doctorId}
    })
}

const deletePlanFromDatabase = (planId) => {
    axios.delete("/plans", {data :
        {id: planId}
    })
}

const createNewPlanInDatabase = async (name, year, month) => {
    const res = await axios.post("/plans/new", {
        name: name,
        year: year,
        month: month
    })
    return res.data
}

const getPlanById = async (id) => {
    const res = await axios.get("/plans/single", {params: {id: id}})
    return res
}

const getDoctorsForEmergencyDepartmentAndHouse = async () => {
    const res = await axios.get("/doctors")
    const doctors = res.data.doctors
    const emergencyDepartmentAndHouseDoctors = doctors.filter((doctor) => {
        return doctor.house || doctor.emergencyDepartment
    })
    return emergencyDepartmentAndHouseDoctors
}

const createNewWish = async (planId, doctorId, callback) => {
    await axios.post("/wish/new", {
        planId: planId,
        doctorId: doctorId
    })
    callback()
}

const updateWish = (planId, wishId, date, state) => {
    axios.post("/wish", {
        planId: planId,
        wishId: wishId,
        date: date,
        state: state
    })
}

const deleteWish = async (planId, wishId, callback) => {
    await axios.delete("/wish", {data :
        {planId: planId,
        wishId: wishId}
    })
    callback()
}

const getPlanAvailableById = async (id) => {
    const planAvailable = await axios.get("/plans/available", {params: {id: id}})
    return planAvailable
}

const getDoctorIdRegister = async () => {
    const doctorIdRegister = await axios.get("/doctors/idregister")
    return doctorIdRegister
}

const setDuty = async (planId, dateIndex, dutyLine, dutyIndex, doctorId, callback) => {
    await axios.post("/plans/duty", {
        planId: planId,
        dateIndex: dateIndex,
        dutyLine: dutyLine,
        dutyIndex: dutyIndex,
        doctorId: doctorId
    })
    callback()
}

const autoFillPlan = async (planId) => {
    const generatedPlan = await axios.get("/plans/autofill", {params: {planId: planId}})
    return generatedPlan
}

export {
    postDoctorAttrToDatabase, 
    deleteDoctorFromDatabase, 
    deletePlanFromDatabase, 
    createNewPlanInDatabase, 
    getPlanById, 
    getDoctorsForEmergencyDepartmentAndHouse,
    createNewWish,
    updateWish,
    deleteWish,
    getPlanAvailableById,
    getDoctorIdRegister,
    setDuty,
    autoFillPlan
}