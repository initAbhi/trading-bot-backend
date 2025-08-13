import { OrderData } from '../types';
/**
 * Get all tradable symbols with product_id and current price
 */
export declare function getSymbols(): Promise<Array<{
    symbol: string;
    product_id: number;
    price?: number;
}>>;
export declare function getSymbolPrices(): Promise<Array<{
    symbol: string;
    product_id: number;
    price?: number;
}>>;
/**
 * Get current orders
 * @param pageSize - Number of orders to fetch
 */
export declare function getOrders(pageSize?: number): Promise<any[]>;
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
export declare function placeOrder(orderData: OrderData): Promise<any>;
/**
 * Cancel an order
 * @param orderId - The order ID to cancel
 */
export declare function cancelOrder(orderId: number): Promise<any>;
//# sourceMappingURL=deltaApi.d.ts.map