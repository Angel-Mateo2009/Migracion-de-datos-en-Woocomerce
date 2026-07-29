Guía de Uso e Instrucciones para el
Cliente
¡Hola! Muchas gracias por confiar en mis servicios para este proyecto de migración y
desarrollo. A continuación, encontrarás una guía sumamente sencilla de cómo funciona el
sistema que he implementado y cómo puedes volver a ejecutar la migración de productos en el
futuro si así lo requieres.

1. Resumen de lo que se ha entregado
● Frontend Interactivo en Bolt.new: Un catálogo de productos totalmente moderno,
responsive y conectado en tiempo real con Supabase.
● Base de Datos y Almacenamiento en Supabase: Las tablas y relaciones creadas para
guardar información de productos (nombre, precio, SKU, stock, categorías, variantes)
junto con un bucket de almacenamiento (Storage) donde se guardan todas las imágenes
de manera independiente y optimizada.
● Script Automatizado de Migración (Node.js): Un script profesional que se conecta a la
API de WooCommerce, extrae los productos, descarga las imágenes de manera binaria,
las sube al Storage de Supabase y registra toda la información en la base de datos.

2. Cómo volver a ejecutar la migración en el futuro
Si añades nuevos productos en WooCommerce o deseas actualizar la información en
Supabase, puedes volver a correr el script de migración siguiendo estos sencillos pasos:
Paso 1: Requisitos previos
Asegúrate de tener instalado Node.js en tu computadora (se descarga gratis desde
nodejs.org).
Paso 2: Configuración de Variables de Entorno
En la carpeta del script que te he entregado, verás un archivo llamado .env. Ábrelo con
cualquier editor de texto y rellena tus credenciales:
# WooCommerce API
WOOCOMMERCE_URL=https://tu-tienda-woocommerce.com
WOOCOMMERCE_CONSUMER_KEY=ck_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
WOOCOMMERCE_CONSUMER_SECRET=cs_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
X
# Supabase API

SUPABASE_URL=https://tu-proyecto-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
Nota importante: En la plataforma de visualización web Bolt.new no es necesario configurar
ningún archivo .env, ya que el frontend se conecta de manera directa y segura para consumir
únicamente los datos públicos que ya fueron migrados. El archivo .env es exclusivo de tu script
local para realizar el proceso de escritura y subida de imágenes.
paso 3 supabase

PASO A:en la parte de sql editor pega este codigo
create table products (
  id bigint primary key,
  name text not null,
  description text,
  sku text,
  price numeric,
  stock numeric default 0,
  categories jsonb,
  variants jsonb,
  images text[]
);
dale en run y listo
PASO B: Ve a Storage en la barra lateral izquierda de Supabase.

Crea un nuevo Bucket público llamado exactamente: products. (Esto es indispensable para que el script pueda subir y almacenar las imágenes de tus productos).

Paso 4: Instalación y Ejecución
Abre una terminal o consola en la carpeta del script y ejecuta los siguientes dos comandos:
1. Instalar dependencias necesarias:
npm install
2. Iniciar el proceso de migración:
npm start
¡Y listo! El script se encargará automáticamente de sincronizar todo de nuevo en Supabase y
se verá reflejado inmediatamente en tu catálogo web de Bolt.new.
Ante cualquier duda o si necesitas un soporte adicional, estoy totalmente a tu disposición. ¡Ha
sido un placer trabajar en tu proyecto!
acceso directo de bolt.new
https://bolt.new/p/68441735