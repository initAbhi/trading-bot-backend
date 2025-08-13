const {
  getSymbols,
  getOrders,
  placeOrder,
  cancelOrder,
  getSymbolPrices,
} = require("./deltaApi");

(async () => {
  // Get all symbols with product_id and price
  //   const symbols = await getSymbols();
  //   console.log("Symbols:", symbols);

  const symbolPrices = await getSymbolPrices();
  console.dir(symbolPrices, { depth: null, maxArrayLength: null });

    // Get orders
    const orders = await getOrders(5);
    console.log("Orders:", orders);

  // Place an order
  //   const newOrder = await placeOrder({
  //     product_id: 13,
  //     size: 100,
  //     side: "buy",
  //     limit_price: "7000",
  //     order_type: "limit_order"
  //   });
  //   console.log("New Order:", newOrder);

  //   // Cancel an order
  //   const cancelled = await cancelOrder(newOrder.result.id);
  //   console.log("Cancelled:", cancelled);
})();
