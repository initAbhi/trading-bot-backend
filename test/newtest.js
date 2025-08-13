const {
  getSymbols,
  getProductId,
  getOrders,
  placeOrder,
  cancelOrder,
  getOrderHistory,
  getOrderById,
} = require("./newfunctions");

(async () => {
  // Get symbols
  // const symbols = await getSymbols();
  // console.dir(symbols, { depth: null, maxArrayLength: null });

  // Get specific product ID
  const btcId = await getProductId("BTCUSD");
  console.log("BTC Product ID:", btcId);

  // Get open orders (should be empty if no pending orders)
  const openOrders = await getOrders();
  console.log("Open Orders:", openOrders);

  // Get order history (should show recent completed orders)
  const orderHistory = await getOrderHistory();
  console.log("Order History:", orderHistory);

  // Place a test order (uncomment to test)
  // const newOrder = await placeOrder({
  //   product_id: btcId,
  //   size: 1, // Changed from 0.01 to 1 (integer value)
  //   side: "buy",
  //   order_type: "market_order",
  // });
  // console.log("New Order:", newOrder);

  // If you want to see a specific order by ID (replace with actual order ID)
  // const specificOrder = await getOrderById(821239698);
  // console.log("Specific Order:", specificOrder);

  // Cancel order (only works for open/pending orders)
  // const cancelled = await cancelOrder(newOrder.result.id);
  // console.log("Cancelled:", cancelled);
})();

//working
