"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.example = example;
const index_1 = __importDefault(require("./index"));
const customs_1 = require("./prod/packages/customs");
// Example usage of the TypeScript client
async function example() {
    try {
        // Create client directly
        const client = await (0, index_1.default)('your_api_key', 'your_api_secret');
        // Get products using the client
        const products = await client.apis.Products.getProducts();
        console.log('Products:', products.body.result.length);
        // Use the convenience functions
        const symbols = await (0, customs_1.getSymbols)();
        console.log('Symbols:', symbols.length);
        const btcId = await (0, customs_1.getProductId)('BTCUSD');
        if (btcId) {
            console.log('BTC Product ID:', btcId);
            // Get orders
            const orders = await (0, customs_1.getOrders)(5);
            console.log('Recent orders:', orders.length);
            // Note: Uncomment the following lines to actually place/cancel orders
            // const newOrder = await placeOrder({
            //   product_id: btcId,
            //   size: 1,
            //   side: 'buy',
            //   order_type: 'market_order'
            // });
            // console.log('New Order:', newOrder);
            // await cancelOrder(newOrder.result.id);
        }
    }
    catch (error) {
        console.error('Error:', error);
    }
}
// Run example if this file is executed directly
if (require.main === module) {
    example();
}
//# sourceMappingURL=example.js.map