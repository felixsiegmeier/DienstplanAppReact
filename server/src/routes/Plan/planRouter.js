import express from "express"
import {getPlans, getPlan, updatePlan, createPlan, deletePlan, getPlanAvailableById, setDuty, autoFillPlan} from "./planController.js"
const router = express.Router()

router.get("/", getPlans)
router.get("/single", getPlan)
router.post("/", updatePlan)
router.delete("/", deletePlan)
router.post("/new", createPlan)
router.get("/available", getPlanAvailableById)
router.post("/duty", setDuty)
router.get("/autofill", autoFillPlan)

export default router