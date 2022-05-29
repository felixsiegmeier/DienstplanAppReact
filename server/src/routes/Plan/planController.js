import { Plan, Day, Clinic, Doctor } from "../../models/models.js"
import getDaysInMonth from "../../services/daysinmonth.js"
import getHolidays from "../../services/holidays.js"
import { availableDoctorsForDuty } from "../../services/availableDoctor.js"
import saveDuty from "../../services/duty.js"
import generatePlan from "../../services/planGenerator.js"


const getPlans = async (req, res) => {
	const plans = await Plan.find()
	res.send(plans)
}

const getPlan = async (req, res) => {
	const planId = req.query.id
    const plan = await Plan.findById(planId)
    res.send(plan)
}

const updatePlan = (req, res) => {

}

const deletePlan = async (req, res) => {
	Plan.deleteOne({_id: req.body.id}, () => {
		res.sendStatus(200)
	})
}


const createPlan = async (req, res) => {
	const newPlan = new Plan({
		name: req.body.name,
		year: req.body.year,
		month: req.body.month
	})
	const allDays = await getDaysInMonth(newPlan.month, newPlan.year)

	const holidays = await getHolidays(newPlan.year, newPlan.month)
	allDays.forEach(day => {
		const newDay = new Day({
			date: day
		})
		// Sa, So
		if([6,0].includes(day.getDay())){
			newDay.noWorkingDay = true
			newDay.pointValue += 1
		}
		// Fr
		if(day.getDay() === 5){
			newDay.pointValue += 1
		}
		// Holiday
		if(holidays.includes(day.getDate())){
			newDay.noWorkingDay = true
			newDay.pointValue += 1
		}
		// 31.12.
		if((newPlan.month === 12) & (day.getDate() === 31)){
			newDay.pointValue += 1
		}
		// 30.04.
		if((newPlan.month === 4) & (day.getDate() === 30)){
			newDay.pointValue += 1
		}
		// Samstag
		if(day.getDay() === 6){
			newDay.pointValue += 1
		}
		// Folgetag ist Feiertag
		if (holidays.includes(day.getDate()+1)){
			newDay.pointValue += 1
		}
		// 3 is maximum
		if (newDay.pointValue > 3){
			newDay.pointValue = 3
		}
		newDay.clinics = new Clinic()
		newPlan.days.push(newDay)
	})
	newPlan.save(() => {
		res.send(newPlan._id)
	})
}

const getPlanAvailableById = async (req, res) => {
	const id = req.query.id
	const availableData = await availableDoctorsForDuty(id)
	res.send(availableData)

}

const setDuty = async (req, res) => {
	const planId = req.body.planId
	const dateIndex = req.body.dateIndex
    const dutyLine = req.body.dutyLine
    const dutyIndex = req.body.dutyIndex
    const doctorId = req.body.doctorId
	await saveDuty(planId, dateIndex, dutyLine, dutyIndex, doctorId)
	res.sendStatus(200)
}

const autoFillPlan = async(req, res) => {
	const planId = req.query.planId
	const plan = await generatePlan(planId)
	res.sendStatus(200)
}


export  {
	getPlans,
	getPlan,
	updatePlan,
	createPlan,
	deletePlan,
	getPlanAvailableById,
	setDuty,
	autoFillPlan
}