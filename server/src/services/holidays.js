import https from "https"

const getHolidays = async function(year, month){ // returns a Promise, resolving an Array of all holidays in germany, MV (as Number) of the month (cave: not month-index!) in year
	return new Promise((resolve, reject) =>{
		const holidayList = []
	https.get("https://feiertage-api.de/api/?jahr="+year+"&nur_land=MV", (res) =>{
		res.on("data", (d) => {
			const jsonFormat = JSON.parse(d)
			const keys = Object.keys(jsonFormat)
			keys.forEach(key => {
				const arrayFormat = jsonFormat[key].datum.split("-").map(Number)
				holidayList.push(arrayFormat)
			})
			const monthlyHolidays = []
			holidayList.forEach(holiday => {
				if (holiday[1] === month){
					monthlyHolidays.push(holiday[2])
				}
			})
			resolve(monthlyHolidays)
		})
	})
	})
}

export default getHolidays