import express from "express"
import {getWishListByPlanId, createNewWishInPlanById, updateWishByPlanIdAndWishId, deleteWishByPlanIdAndWishId} from "./wishController.js"

const router = express.Router()

router.get("/", getWishListByPlanId)
router.post("/new", createNewWishInPlanById)
router.post("/", updateWishByPlanIdAndWishId)
router.delete("/", deleteWishByPlanIdAndWishId)

export default router