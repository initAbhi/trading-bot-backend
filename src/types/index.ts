export interface DeltaRestClientConfig {
  api_key: string;
  api_secret: string;
}

export interface RequestObject {
  method?: string;
  url: string;
  headers: Record<string, string>;
  body?: any;
}

export interface Product {
  id: number;
  symbol: string;
  mark_price?: number;
  last_price?: number;
}

export interface TickerResult {
  mark_price?: number;
  last_price?: number;
}

export interface TickerResponse {
  body: {
    result: TickerResult;
  };
}

export interface ProductsResponse {
  body: {
    result: Product[];
  };
}

export interface OrderData {
  product_id: number;
  size: number;
  side: 'buy' | 'sell';
  order_type: string;
}

export interface Order {
  id: number;
  product_id: number;
  size: number;
  side: string;
  order_type: string;
  state: string;
}

export interface OrdersResponse {
  body: {
    result: Order[];
  };
}

export interface OrderResponse {
  body: {
    result: Order;
  };
}

export interface PlaceOrderRequest {
  order: OrderData;
}

export interface CancelOrderRequest {
  product_symbol: string;
  id: number;
}

export interface ApiResponse {
  body: any;
  result?: any;
}

export interface SwaggerClient {
  apis: {
    Products: {
      getProducts(): Promise<ProductsResponse>;
    };
    MarketData: {
      getTicker(params: { product_id: number }): Promise<TickerResponse>;
    };
    Orders: {
      getOrders(params?: { page_size?: number; state?: string }): Promise<OrdersResponse>;
      getOrder(params: { id: number }): Promise<OrderResponse>;
      placeOrder(params: PlaceOrderRequest): Promise<ApiResponse>;
      cancelOrder(params: CancelOrderRequest): Promise<ApiResponse>;
    };
  };
}
