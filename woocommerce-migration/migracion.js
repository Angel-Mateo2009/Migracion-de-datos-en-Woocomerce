import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import WooCommerceRestApi from "woocommerce-rest-api";
import fetch from 'node-fetch';

// ===================================================
// CONFIGURACIÓN DINÁMICA DE ENTORNO (.env)
// ===================================================
let SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const WooCommerce = new WooCommerceRestApi({
  url: process.env.WOOCOMMERCE_URL, 
  consumerKey: process.env.WC_KEY,         
  consumerSecret: process.env.WC_SECRET,   
  version: "wc/v3"
});

// Validación de seguridad para la URL de Supabase
if (SUPABASE_URL && SUPABASE_URL.endsWith('/')) {
  SUPABASE_URL = SUPABASE_URL.slice(0, -1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ===================================================
// FUNCIONES DE MIGRACIÓN
// ===================================================
async function uploadImageToSupabase(imageUrl, sku, index) {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error(`No se pudo descargar de WooCommerce`);
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const extension = imageUrl.split('.').pop().split(/\#|\?/)[0] || 'jpg';
    const safeSku = (sku || 'prod').toString().replace(/[^a-zA-Z0-9]/g, '-');
    const fileName = `${safeSku}-img-${index}-${Date.now()}.${extension}`;
    
    const { data, error } = await supabase.storage
      .from('products')
      .upload(fileName, buffer, {
        contentType: `image/${extension === 'png' ? 'png' : 'jpeg'}`,
        upsert: true
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.log(`  ⚠️ No se pudo subir al Storage, usando URL original de WooCommerce.`);
    return imageUrl;
  }
}

async function startMigration() {
  try {
    console.log("⏳ Conectando con WooCommerce para traer los productos...");
    
    const response = await WooCommerce.get("products", { per_page: 100 });
    const wooProducts = response.data;
    
    console.log(`📦 ¡Conexión exitosa! Se encontraron ${wooProducts.length} productos para migrar.`);
    for (const product of wooProducts) {
      console.log(`\nProcesando: ${product.name}`);

      const uploadedImages = [];
      if (product.images && product.images.length > 0) {
        for (let i = 0; i < product.images.length; i++) {
          console.log(`  📸 Procesando imagen ${i + 1}/${product.images.length}...`);
          const publicUrl = await uploadImageToSupabase(product.images[i].src, product.sku, i);
          if (publicUrl) uploadedImages.push(publicUrl);
        }
      }

      const variants = product.attributes ? product.attributes.map(attr => ({
        name: attr.name,
        options: attr.options
      })) : [];

      const productData = {
        name: product.name,
        description: product.description ? product.description.replace(/<[^>]*>/g, '') : '', 
        sku: product.sku || `SKU-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        price: parseFloat(product.price) || 0.00,
        stock: product.stock_quantity || 0,
        categories: product.categories ? product.categories.map(cat => cat.name) : [],
        variants: variants,
        images: uploadedImages
      };

      // Guardamos en la tabla
      const { error } = await supabase
        .from('products')
        .upsert(productData, { onConflict: 'sku' });

      if (error) {
        console.error(`❌ Error de Supabase Database al guardar:`, error.message);
      } else {
        console.log(`✅ Migrado correctamente: ${product.name}`);
      }
    }

    console.log("\n🚀 ¡MIGRACIÓN COMPLETADA CON ÉXITO!");

  } catch (error) {
    console.error("🔴 Hubo un error crítico en la migración:", error.message);
  }
}

startMigration();