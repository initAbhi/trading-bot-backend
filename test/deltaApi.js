// deltaApi.js
const DeltaRestClient = require("../index"); // Path to Delta API client
const api_key = "YOUR_API_KEY";
const api_secret = "YOUR_API_SECRET";

const API_KEY = "zULeVyHoGfLG1IJqSm4mEPuJ3PBEsC";
const API_SECRET =
  "vVIUddVz5a4xWeFeVyrWBj5JyP3JhviqcKe0MkLMGwMoXLm8DMyMjBuhk8xI";
// Create Delta API client instance
async function createClient() {
  return await new DeltaRestClient(API_KEY, API_SECRET);
}

/**
 * Get all tradable symbols with product_id and current price
 */
async function getSymbols() {
  const client = await createClient();
  try {
    const res = await client.apis.Products.getProducts();
    const products = res.body.result.map(p => ({
      symbol: p.symbol,
      product_id: p.id,
      price: p.mark_price || p.spot_index?.current_price || p.underlying_asset?.spot_price
    }));
    return products;
  } catch (err) {
    console.error("Error fetching symbols:", err);
    throw err;
  }
}

async function getSymbolPrices() {
    const client = await createClient();
    const res = await client.apis.Products.getProducts();
    
    const symbols = await Promise.all(res.body.result.map(async (p) => {
      let price = p.mark_price;
  
      if (!price) {
        try {
          const orderbookRes = await client.apis.Orderbook.getL2Orderbook({
            product_id: p.id
          });
          // Mid price between best bid and ask
          const bids = orderbookRes.body.result.bids;
          const asks = orderbookRes.body.result.asks;
          if (bids.length && asks.length) {
            price = (parseFloat(bids[0][0]) + parseFloat(asks[0][0])) / 2;
          }
        } catch (err) {
          // If orderbook fails, leave price as undefined
        }
      }
  
      return { symbol: p.symbol, product_id: p.id, price };
    }));
  
    return symbols;
  }

/**
 * Get current orders
 * @param {number} pageSize - Number of orders to fetch
 */
async function getOrders(pageSize = 10) {
  const client = await createClient();
  try {
    const res = await client.apis.Orders.getOrders({ page_size: pageSize });
    return res.body.result;
  } catch (err) {
    console.error("Error fetching orders:", err);
    throw err;
  }
}

/**
 * Place a new order
 * @param {Object} orderData - Order details
 * Example:
 * {
 *   product_id: 13,
 *   size: 100,
 *   side: "buy",
 *   limit_price: "7000",
 *   order_type: "limit_order"
 * }
 */
async function placeOrder(orderData) {
  const client = await createClient();
  try {
    const res = await client.apis.Orders.placeOrder({ order: orderData });
    return res.body;
  } catch (err) {
    console.error("Error placing order:", err);
    throw err;
  }
}

/**
 * Cancel an order
 * @param {string} orderId - The order ID to cancel
 */
async function cancelOrder(orderId) {
  const client = await createClient();
  try {
    const res = await client.apis.Orders.cancelOrder({ id: orderId });
    return res.body;
  } catch (err) {
    console.error("Error canceling order:", err);
    throw err;
  }
}

module.exports = {
  getSymbols,
  getOrders,
  placeOrder,
  cancelOrder,
  getSymbolPrices
};
