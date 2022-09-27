import getDaysFromDB from "../../services/getDaysFromDB";
import getDoctorsFromDB from "../../services/getDoctorsFromDB";
import getWishesFromDB from "../../services/getWishesFromDB";

export default async function autofillPlan(planId) {
  
  const days = await getDaysFromDB(planId)
  const doctors = await getDoctorsFromDB()
  const wishes = await getWishesFromDB(planId)

  console.log(days)
  return true

}
