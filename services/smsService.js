const axios = require("axios");
const FormData = require("form-data");

async function sendSms(kixieCredentials, kixieTemplate, tableData) {
	const smsPromises = tableData.map(async ({ Name, Phone }) => {
		const form = new FormData();
		const formData = {
			call: "sendsms",
			businessid: kixieCredentials.businessId,
			userid: kixieCredentials.kixieUserId,
			apiKey: kixieCredentials.apiKey,
		};

		Object.keys(formData).forEach((key) => {
			form.append(key, formData[key]);
		});

		const personalizedMessage = kixieTemplate.content.replace(/\$\{name\}/g, Name);
		form.append("number", `+1${Phone}`);
		form.append("message", personalizedMessage);

		try {
			const res = await axios.post("https://apig.kixie.com/itn/sendmms", form, { headers: { ...form.getHeaders() } });
			console.log(res)
			if(res.data.error){
				  throw new Error(res.data.error);  
			}else if(res.data.success){
				return { Name, Phone, status: "Success" };
			}else{
				throw new Error("Something went wrong try again");  
			}
			
		} catch (error) {
			console.error("SMS Error:", error);
			return { Name, Phone, status: "Failed", reason: error.message };
		}
	});

	return await Promise.allSettled(smsPromises);
}

module.exports = sendSms;
