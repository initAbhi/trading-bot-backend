import DeltaRestClient from '../../index';
import { Product, OrderData, Order, SwaggerClient } from '../../types';

const API_KEY = 'zULeVyHoGfLG1IJqSm4mEPuJ3PBEsC';
const API_SECRET = 'vVIUddVz5a4xWeFeVyrWBj5JyP3JhviqcKe0MkLMGwMoXLm8DMyMjBuhk8xI';

async function createClient(): Promise<SwaggerClient> {
  return await DeltaRestClient(API_KEY, API_SECRET);
}

// ✅ Get all symbols with guaranteed price (falls back to ticker call)
export async function getSymbols(): Promise<Array<{ symbol: string; product_id: number; price?: number }>> {
  const client = await createClient();
  const res = await client.apis.Products.getProducts();

  const symbols = await Promise.all(
    res.body.result.map(async (p: Product) => {
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
export async function getProductId(symbolName: string): Promise<number | null> {
  const client = await createClient();
  const res = await client.apis.Products.getProducts();
  const product = res.body.result.find((p: Product) => p.symbol === symbolName);
  return product ? product.id : null;
}

// ✅ Get current orders
export async function getOrders(pageSize: number = 10): Promise<Order[]> {
  const client = await createClient();
  const res = await client.apis.Orders.getOrders({ page_size: pageSize });
  return res.body.result;
}

// ✅ Place order
export async function placeOrder(orderData: OrderData): Promise<any> {
  const client = await createClient();
  const res = await client.apis.Orders.placeOrder({ order: orderData });
  return res.body;
}

// ✅ Cancel order
export async function cancelOrder(orderId: number): Promise<any> {
  const client = await createClient();
  try {
    // The API expects product_symbol for cancellation
    const res = await client.apis.Orders.cancelOrder({
      product_symbol: 'BTCUSD',
      id: orderId,
    });
    return res.body;
  } catch (error: any) {
    console.log('Error cancelling order:', error.message);
    throw error;
  }
}

// ✅ Get order history (filled/completed orders)
export async function getOrderHistory(pageSize: number = 10): Promise<Order[]> {
  const client = await createClient();
  // Try different endpoint names that might exist
  try {
    const res = await client.apis.Orders.getOrders({
      page_size: pageSize,
      state: 'closed', // Filter for closed/completed orders
    });
    return res.body.result;
  } catch (error: any) {
    console.log('Error getting order history:', error.message);
    return [];
  }
}

// ✅ Get specific order by ID
export async function getOrderById(orderId: number): Promise<Order> {
  const client = await createClient();
  const res = await client.apis.Orders.getOrder({ id: orderId });
  return res.body.result;
}
