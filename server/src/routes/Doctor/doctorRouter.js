import express from "express"
import {getDoctors, updateDoctors, deleteDoctor, newDoctor, getDoctorIdRegister} from "./doctorController.js"
const router = express.Router()

router.get("/", getDoctors)
router.post("/", updateDoctors)
router.delete("/", deleteDoctor)
router.post("/new", newDoctor)
router.get("/idregister", getDoctorIdRegister)

export default router