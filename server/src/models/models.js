import mongoose from "mongoose"

const DoctorSchema = new mongoose.Schema({
	name: String,
	clinic: String,
	only12: Boolean,
	house: Boolean,
	emergencyDepartment: Boolean,
	imc: Boolean,
	emergencyDoctor: Boolean,
	rescueHelicopter: Boolean,
	maximumDutys: Number
})

const ClinicSchema = new mongoose.Schema({
	Kardiologie: {
		type: Number,
		default: 0
	},
	Gastroenterologie: {
		type: Number,
		default: 0
	},
	Rhythmologie: {
		type: Number,
		default: 0
	},
	Geriatrie: {
		type: Number,
		default: 0
	},
	Ohne: {
		type: Number,
		default: 0
	}
}) 

const DaySchema = new mongoose.Schema({
	date: Date,
	noWorkingDay: {
		type: Boolean,
		default: false},
	pointValue: {
		type: Number,
		default: 1},
	house: {
		type: [String],
		default: []
	},
	emergencyDepartment: {
		type: [String],
		default: []
	},
	imc: {
		type: [String],
		default: []
	},
	emergencyDoctor: {
		type: [String],
		default: []
	},
	rescueHelicopter: {
		type: [String],
		default: []
	},
	clinics : ClinicSchema
})

const WishSchema = new mongoose.Schema({
	doctorId: String,
	doctorName: String,
	dutyWish: [Number],
	noDutyWish: [Number]
})

const PlanSchema = new mongoose.Schema({
	name: String,
	month: Number,
	year: Number,
	wishList: [WishSchema],
	days: [DaySchema]
})

const Doctor = mongoose.model("Doctor", DoctorSchema)
const Clinic = mongoose.model("Clinic", ClinicSchema)
const Plan = mongoose.model("Plan", PlanSchema)
const Wish = mongoose.model("Wish", WishSchema)
const Day = mongoose.model("Day", DaySchema)

export {Doctor, Clinic, Plan, Wish, Day}