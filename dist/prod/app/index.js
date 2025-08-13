"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const customs_1 = require("../packages/customs");
(async () => {
    // Get symbols
    // const symbols = await getSymbols();
    // console.dir(symbols, { depth: null, maxArrayLength: null });
    // Get specific product ID
    const btcId = await (0, customs_1.getProductId)('BTCUSD');
    console.log('BTC Product ID:', btcId);
    // Get open orders
    // const orders = await getOrders();
    // console.log('Orders:', orders);
    // Place a test order
    const newOrder = await (0, customs_1.placeOrder)({
        product_id: btcId,
        size: 1,
        side: 'buy',
        order_type: 'market_order',
    });
    console.log('New Order:', newOrder);
    // Cancel order
    const cancelled = await (0, customs_1.cancelOrder)(newOrder.result.id);
    console.log('Cancelled:', cancelled);
})();
//# sourceMappingURL=index.js.map