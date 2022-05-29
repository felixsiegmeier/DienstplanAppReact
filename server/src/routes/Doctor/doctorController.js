import { Doctor } from "../../models/models.js"

const getDoctors = async (req, res) => {
	const doctorAttrs = ["Name", "Klinik", "NFA", "Haus", "IMC", "12 h", "Max", "NA", "RTH", "Löschen"]
	const clinics = ["Kardiologie", "Gastroenterologie", "Geriatrie", "Rhythmologie", "Ohne"]
	const doctors = await Doctor.find()
	res.send({doctorAttrs: doctorAttrs, doctors : doctors, clinics: clinics})
}

const updateDoctors = async (req, res) => {
	const id = req.body.id
	const attr = req.body.attr
	const value = req.body.value
	Doctor.findByIdAndUpdate(id, {[attr]: value}, () => {
		res.sendStatus(200)
	})
}

const deleteDoctor = async (req, res) => {
	Doctor.deleteOne({_id: req.body.id}, () => {
		res.sendStatus(200)
	})
}

const newDoctor = (req, res) => {
	const doctor = new Doctor({
		name: req.body.name,
		clinic: "Ohne",
		only12: false,
		house: true,
		emergencyDepartment: false,
		imc: false,
		emergencyDoctor: false,
		rescueHelicopter: false,
		maximumDutys: 7
	})
	doctor.save((err, ) => {
		res.sendStatus(200)
	})
}

const getDoctorIdRegister = async (req, res) => {
	const doctors = await Doctor.find()
	const doctorIdRegister = []
	doctors.map(doctor => {
		doctorIdRegister.push([String(doctor._id), doctor.name])
	})
	res.send(doctorIdRegister)
}

export  {
	getDoctors,
	updateDoctors,
	deleteDoctor,
	newDoctor,
	getDoctorIdRegister
}