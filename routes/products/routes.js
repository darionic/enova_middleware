'use strict'

const axios = require('axios');
const errorCodes = require('fastify').errorCodes

async function getProduct(id = undefined){

  if ((!id) || (isNaN(id)) || (id < 0))
    return false;
  
  try{
    const axios_res = await axios.get("https://dummyjson.com/products/"+id);
    return axios_res;
  } catch(err){
    return false;
  }
  
}

async function downloadImage(url = undefined){

  if (!url)
    return false

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'arraybuffer'
  })

  //let data = "data:" + response.headers["content-type"] + ";base64," + Buffer.from(response.data, "binary").toString('base64');
  let base64 = Buffer.from(response.data, "binary").toString('base64');
  return base64
  console.log(data);
  console.log(response.data)
}

function discountedPriceEUR(item_price, discount_perc, n_items = 1){

  let item_discount_in_eur = item_price - (item_price * (discount_perc/100));
  let total_discount = item_discount_in_eur * n_items;

  return Number(total_discount.toFixed(2));

}

module.exports = async function (fastify, opts) {

  fastify.get('/raw/:id', async function (request, reply) {
    const { id } = request.params;
    let product_res = undefined;

    product_res = await getProduct(id);
    if (!product_res){
      reply.status(500).send({ status: "FAIL" })
    }
    
    if (product_res.status === 200){
      return {
        status: "ok",
        data: product_res.data
      }

    } else if ((product_res.status >= 400) && (product_res.status < 500)){ 
      reply.status(product_res.status).send({
        status: "FAIL",
        error: product_res.statusText
      })

    } else if ((axios_res.status >= 500) && (axios_res.status < 600)){ 
      reply.status(product_res.status).send({
        status: "ERROR",
        error: product_res.statusText
      })

    } else {
      reply.status(product_res.status).send({
        status: "ERROR",
        error: product_res.statusText
      })
    }

  })

  fastify.get('/proc/:id', async function (request, reply) {
    const { id } = request.params;
    let product_res = undefined;

    product_res = await getProduct(id);
    if (!product_res){
      reply.status(500).send({ status: "FAIL" })
    }

    if (product_res.status === 200){
      //initialize with static data
      const data = {};

      data.id = product_res.data.id;
      data.price = product_res.data.price;

      data.priceSell = discountedPriceEUR (product_res.data.price, product_res.data.discountPercentage, 1);
      data.totalStockValue = product_res.data.price * product_res.data.stock
      data.totalStockValueSell = discountedPriceEUR (product_res.data.price, product_res.data.discountPercentage, product_res.data.stock);

      return {
        status: "ok",
        data: data
      }

    } else if ((product_res.status >= 400) && (product_res.status < 500)){ 
      reply.status(product_res.status).send({
        status: "FAIL",
        error: product_res.statusText
      })

    } else if ((axios_res.status >= 500) && (axios_res.status < 600)){ 
      reply.status(product_res.status).send({
        status: "ERROR",
        error: product_res.statusText
      })

    } else {
      reply.status(product_res.status).send({
        status: "ERROR",
        error: product_res.statusText
      })
    }

  })

  fastify.get('/download/:id', async function (request, reply) {
    const { id } = request.params;
    let product_res = undefined;

    product_res = await getProduct(id);
    if (!product_res){
      reply.status(500).send({ status: "FAIL" })
    }

    if (product_res.status === 200){

      let url = undefined;
      const data = {
        images: []
      };

      for (url of product_res.data.images){
        data.images.push(await downloadImage(url));
      }

      return {
        status: "ok",
        data: data
      }
      
    } else if ((product_res.status >= 400) && (product_res.status < 500)){ 
      reply.status(product_res.status).send({
        status: "FAIL",
        error: product_res.statusText
      })

    } else if ((axios_res.status >= 500) && (axios_res.status < 600)){ 
      reply.status(product_res.status).send({
        status: "ERROR",
        error: product_res.statusText
      })

    } else {
      reply.status(product_res.status).send({
        status: "ERROR",
        error: product_res.statusText
      })
    }

  })


}
