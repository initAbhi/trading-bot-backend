import { OrderData, Order } from '../../types';
export declare function getSymbols(): Promise<Array<{
    symbol: string;
    product_id: number;
    price?: number;
}>>;
export declare function getProductId(symbolName: string): Promise<number | null>;
export declare function getOrders(pageSize?: number): Promise<Order[]>;
export declare function placeOrder(orderData: OrderData): Promise<any>;
export declare function cancelOrder(orderId: number): Promise<any>;
export declare function getOrderHistory(pageSize?: number): Promise<Order[]>;
export declare function getOrderById(orderId: number): Promise<Order>;
//# sourceMappingURL=customs.d.ts.map