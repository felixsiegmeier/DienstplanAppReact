import getDaysFromDB from "../services/getDaysFromDB";
import getDoctorsFromDB from "../services/getDoctorsFromDB";
import getWishesFromDB from "../services/getWishesFromDB";

export default async function autofillPlan(planId) {
  
  const days = getDaysFromDB(planId)
  const doctors = getDoctorsFromDB()
  const wishes = getWishesFromDB(planId)

  console.log(days)

}
