const {
  getSymbols,
  getProductId,
  getOrders,
  placeOrder,
  cancelOrder,
} = require("./newfunctions");

(async () => {
  // Get symbols
  // const symbols = await getSymbols();
  // console.dir(symbols, { depth: null, maxArrayLength: null });

  // Get specific product ID
  const btcId = await getProductId("INJUSD");
  console.log("BTC Product ID:", btcId);

  // Get open orders
  // const orders = await getOrders();
  // console.log("Orders:", orders);

  // Place a test order
  const newOrder = await placeOrder({
    product_id: btcId,
    size: 1,
    side: "buy",
    order_type: "market_order",
  });
  console.log("New Order:", newOrder);

  // // Cancel order
  // setTimeout(async () => {
  //   const cancelled = await cancelOrder(newOrder.result.id,btcId);
  // }, 3000)
  // const sell = await placeOrder({
  //   product_id: btcId,
  //   size: 1,
  //   side: "sell",
  //   order_type: "market_order",
  // });
  // console.log("New Order:", sell);
  // console.log("Cancelled:", cancelled);
})();
