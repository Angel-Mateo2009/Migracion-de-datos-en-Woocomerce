const woo = require("./woocommerce");


async function test(){

    try {

        const response = await woo.get("/products");

        console.log("✅ Conexión exitosa con WooCommerce");

        console.log(response.data);

    } catch(error){

        console.log("❌ Error de conexión:");

        console.log(
            error.response?.data || error.message
        );

    }

}


test();