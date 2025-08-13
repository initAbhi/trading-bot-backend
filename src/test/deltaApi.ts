import DeltaRestClient from '../index';
import { OrderData, SwaggerClient } from '../types';

const API_KEY = 'zULeVyHoGfLG1IJqSm4mEPuJ3PBEsC';
const API_SECRET = 'vVIUddVz5a4xWeFeVyrWBj5JyP3JhviqcKe0MkLMGwMoXLm8DMyMjBuhk8xI';

// Create Delta API client instance
async function createClient(): Promise<SwaggerClient> {
  return await DeltaRestClient(API_KEY, API_SECRET);
}

/**
 * Get all tradable symbols with product_id and current price
 */
export async function getSymbols(): Promise<Array<{ symbol: string; product_id: number; price?: number }>> {
  const client = await createClient();
  try {
    const res = await client.apis.Products.getProducts();
    const products = res.body.result.map((p: any) => ({
      symbol: p.symbol,
      product_id: p.id,
      price: p.mark_price || p.spot_index?.current_price || p.underlying_asset?.spot_price
    }));
    return products;
  } catch (err: any) {
    console.error('Error fetching symbols:', err);
    throw err;
  }
}

export async function getSymbolPrices(): Promise<Array<{ symbol: string; product_id: number; price?: number }>> {
  const client = await createClient();
  const res = await client.apis.Products.getProducts();
  
  const symbols = await Promise.all(res.body.result.map(async (p: any) => {
    let price = p.mark_price;

    if (!price) {
      try {
        const orderbookRes = await (client as any).apis.Orderbook.getL2Orderbook({
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
 * @param pageSize - Number of orders to fetch
 */
export async function getOrders(pageSize: number = 10): Promise<any[]> {
  const client = await createClient();
  try {
    const res = await client.apis.Orders.getOrders({ page_size: pageSize });
    return res.body.result;
  } catch (err: any) {
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
export async function placeOrder(orderData: OrderData): Promise<any> {
  const client = await createClient();
  try {
    const res = await client.apis.Orders.placeOrder({ order: orderData });
    return res.body;
  } catch (err: any) {
    console.error('Error placing order:', err);
    throw err;
  }
}

/**
 * Cancel an order
 * @param orderId - The order ID to cancel
 */
export async function cancelOrder(orderId: number): Promise<any> {
  const client = await createClient();
  try {
    const res = await client.apis.Orders.cancelOrder({ 
      id: orderId,
      product_symbol: 'BTCUSD' // Default product symbol, should be configurable
    });
    return res.body;
  } catch (err: any) {
    console.error('Error canceling order:', err);
    throw err;
  }
}
