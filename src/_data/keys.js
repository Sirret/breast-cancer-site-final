require('dotenv').config();

module.exports = {
	paypal: process.env.PAYPAL_CLIENT_ID, //set to test?
	modempay: process.env.MODEMPAY_PUBLIC_KEY,
};
