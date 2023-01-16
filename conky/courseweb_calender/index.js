const cookie = ""

const axios = require('axios');
const https = require('https');

const instance = axios.create({
	httpsAgent: new https.Agent({
		rejectUnauthorized: false
	})
});

const getSessKey = async () => { 
	try {
		let res = await instance({
			method: 'GET',
			url: 'https://courseweb.sliit.lk/calendar/view.php?view=upcoming&course=1',
			headers: {
				"Cookie": cookie
			}
		});
		let re = /\"sesskey\":\"([^"]+)/g;
		let sesskey = re.exec(res.data)[1];
		return sesskey;

	} catch (err) {
		console.log("No connection or cookie expired.");
		return null;
	}
}

(async () => {
	try {
		let sessKey = await getSessKey();
		if (!(sessKey)) { return null; }
		let today = await new Date();
		let res = await instance({
			method: 'POST',
			url: 'https://courseweb.sliit.lk/lib/ajax/service.php?sesskey=' + sessKey + '&info=core_calendar_get_calendar_monthly_view',
			headers: {
				"Cookie": cookie,
				"Content-Type": "application/json",
			},
			data: [{
					index: 0, 
					methodname: 'core_calendar_get_calendar_monthly_view',
					args: {
						year: today.getFullYear(),
						month: today.getMonth() + 1,
						courseid: 1,
						categoryid: 0,
						includenavigation: false,
						mini: true,
						day: 1
					}
				}]
		});
		res.data[0].data.weeks.map((week) => {
			week.days.map((day) => {
				if (day.events.length) {
					console.log("\${font Fira Code:style=Bold:size=14}\${color0}" + day.daytitle);
					day.events.map((eve) => {
						console.log("\${font Fira Code:style=Bold:size=12}  ▕▁" + eve.name);
					})
					console.log("\n");
				}
			})
		});	
	} catch(err) {
		console.error(err);
	}
})();
