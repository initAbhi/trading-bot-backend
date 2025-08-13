"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSymbols = getSymbols;
exports.getSymbolPrices = getSymbolPrices;
exports.getOrders = getOrders;
exports.placeOrder = placeOrder;
exports.cancelOrder = cancelOrder;
const index_1 = __importDefault(require("../index"));
const API_KEY = 'zULeVyHoGfLG1IJqSm4mEPuJ3PBEsC';
const API_SECRET = 'vVIUddVz5a4xWeFeVyrWBj5JyP3JhviqcKe0MkLMGwMoXLm8DMyMjBuhk8xI';
// Create Delta API client instance
async function createClient() {
    return await (0, index_1.default)(API_KEY, API_SECRET);
}
/**
 * Get all tradable symbols with product_id and current price
 */
async function getSymbols() {
    const client = await createClient();
    try {
        const res = await client.apis.Products.getProducts();
        const products = res.body.result.map((p) => ({
            symbol: p.symbol,
            product_id: p.id,
            price: p.mark_price || p.spot_index?.current_price || p.underlying_asset?.spot_price
        }));
        return products;
    }
    catch (err) {
        console.error('Error fetching symbols:', err);
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
            }
            catch (err) {
                // If orderbook fails, leave price as undefined
            }
        }
        return { symbol: p.symbol, product_id: p.id, price };
    }));
    return symbols;
}
/**
 * Get current orders
 * @param pageSize - Number of orders to fetch
 */
async function getOrders(pageSize = 10) {
    const client = await createClient();
    try {
        const res = await client.apis.Orders.getOrders({ page_size: pageSize });
        return res.body.result;
    }
    catch (err) {
        console.error('Error fetching orders:', err);
        throw err;
    }
}
/**
 * Place a new order
 * @param orderData - Order details
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
    }
    catch (err) {
        console.error('Error placing order:', err);
        throw err;
    }
}
/**
 * Cancel an order
 * @param orderId - The order ID to cancel
 */
async function cancelOrder(orderId) {
    const client = await createClient();
    try {
        const res = await client.apis.Orders.cancelOrder({
            id: orderId,
            product_symbol: 'BTCUSD' // Default product symbol, should be configurable
        });
        return res.body;
    }
    catch (err) {
        console.error('Error canceling order:', err);
        throw err;
    }
}
//# sourceMappingURL=deltaApi.js.map