const availableForDutyLine = (doctor, position) => {
    return doctor[position] === true ? true : false
}

const noDutyWish = (plan, doctorId, date) => {
    const wishList = plan.wishList
    let available = true
    const doctorsWishes = wishList.filter(wish => wish.doctorId === doctorId)
    doctorsWishes.map(wish => {
        if(wish.noDutyWish.includes(date)){
            available = false
        }
    })
    return available
}

const noDutyOnDay = (doctorId, day) => {
    const dutyLines = ["emergencyDepartment", "house", "imc", "emergencyDoctor", "rescueHelicopter"]
    let available = true
    dutyLines.map(dutyLine => {
        if (day[dutyLine].includes(doctorId)){
            available = false
        }
    })
    return available
}

const clinicNotToMany = (day, doctorClinic) => {
    let available = true
    const maximumForClinics = {
        Rhythmologie: 1, 
        Kardiologie: 2, 
        Gastroenterologie: 2, 
        Geriatrie: 1, 
        Ohne: 10
    }

    if(!(day.clinics[doctorClinic] < maximumForClinics[doctorClinic])){
        available = false
    }

    return available
}


export {
    availableForDutyLine,
    noDutyWish,
    noDutyOnDay,
    clinicNotToMany
}