// deltaApi.js
const DeltaRestClient = require("../utils/client");
const api_key = "YOUR_API_KEY";
const api_secret = "YOUR_API_SECRET";

//live account
const API_KEY = "zULeVyHoGfLG1IJqSm4mEPuJ3PBEsC";
const API_SECRET =
  "vVIUddVz5a4xWeFeVyrWBj5JyP3JhviqcKe0MkLMGwMoXLm8DMyMjBuhk8xI";

// const API_KEY = "BvOe6GhK3aVrDRxbifLXKjQKENtlAH";
// const API_SECRET =
//   "1qZkjGPYNNSgW9ocQ7hGRpIMzj0cb1pqUWsyGZmBQwpnPkHWYTy9fnIL8fxS";

async function createClient() {
  return await new DeltaRestClient(API_KEY, API_SECRET);
}

// ✅ Get all symbols with guaranteed price (falls back to ticker call)
async function getSymbols() {
  const client = await createClient();
  const res = await client.apis.Products.getProducts();

  const symbols = await Promise.all(
    res.body.result.map(async (p) => {
      let price = p.mark_price;

      // If no mark_price, try to get ticker price
      if (!price) {
        try {
          const tickerRes = await client.apis.MarketData.getTicker({
            product_id: p.id,
          });
          price =
            tickerRes.body.result?.mark_price ||
            tickerRes.body.result?.last_price;
        } catch (err) {
          // Ignore if ticker fails
        }
      }

      return {
        symbol: p.symbol,
        product_id: p.id,
        price,
      };
    })
  );

  return symbols;
}

// ✅ Get product ID for a specific symbol
async function getProductId(symbolName) {
  const client = await createClient();
  const res = await client.apis.Products.getProducts();
  const product = res.body.result.find((p) => p.symbol === symbolName);
  return product ? product.id : null;
}

// ✅ Get current orders
async function getOrders(pageSize = 10) {
  const client = await createClient();
  const res = await client.apis.Orders.getOrders({ page_size: pageSize });
  return res.body.result;
}

// ✅ Place order
async function placeOrder(orderData) {
  const client = await createClient();
  const res = await client.apis.Orders.placeOrder({ order: orderData });
  return res.body;
}

// ✅ Cancel order
// ✅ Cancel order (fixed for Swagger client)
async function cancelOrder(orderId, productId = null, clientOrderId = null) {
  const client = await createClient();
  try {
    const body = {
      id: orderId, // required
    };

    // Optional parameters if available
    if (productId) body.product_id = productId;
    if (clientOrderId) body.client_order_id = clientOrderId;

    // Swagger expects { order: body }
    const res = await client.apis.Orders.cancelOrder({ order: body });
    return res.body;
  } catch (error) {
    console.error("Error cancelling order:", error.message);
    throw error;
  }
}


// ✅ Get order history (filled/completed orders)
async function getOrderHistory(pageSize = 10) {
  const client = await createClient();
  // Try different endpoint names that might exist
  try {
    const res = await client.apis.Orders.getOrders({
      page_size: pageSize,
      state: "closed", // Filter for closed/completed orders
    });
    return res.body.result;
  } catch (error) {
    console.log("Error getting order history:", error.message);
    return [];
  }
}

// ✅ Get specific order by ID
async function getOrderById(orderId) {
  const client = await createClient();
  const res = await client.apis.Orders.getOrder({ id: orderId });
  return res.body.result;
}

module.exports = {
  getSymbols,
  getProductId,
  getOrders,
  placeOrder,
  cancelOrder,
  getOrderHistory,
  getOrderById,
};
