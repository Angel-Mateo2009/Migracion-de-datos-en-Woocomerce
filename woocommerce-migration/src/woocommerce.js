const axios = require("axios");
require("dotenv").config();


const woocommerce = axios.create({

    baseURL: `${process.env.WOOCOMMERCE_URL}/wp-json/wc/v3`,

    auth: {
        username: process.env.WC_KEY,
        password: process.env.WC_SECRET
    }

});


module.exports = woocommerce;