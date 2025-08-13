# Delta Exchange REST Client

A TypeScript-based REST client for the Delta Exchange API.

## Features

- Full TypeScript support with type definitions
- HMAC signature authentication
- Swagger-based API client generation
- Comprehensive trading functions
- Order management
- Market data retrieval

## Installation

```bash
npm install
```

## Development

Install TypeScript dependencies:
```bash
npm install
```

Build the project:
```bash
npm run build
```

Development mode with watch:
```bash
npm run dev
```

## Usage

### Basic Setup

```typescript
import DeltaRestClient from './dist/index';

const client = await new DeltaRestClient(API_KEY, API_SECRET);
```

### Trading Functions

```typescript
import {
  getSymbols,
  getProductId,
  getOrders,
  placeOrder,
  cancelOrder
} from './dist/prod/packages/customs';

// Get all symbols
const symbols = await getSymbols();

// Get product ID for a symbol
const btcId = await getProductId('BTCUSD');

// Place an order
const order = await placeOrder({
  product_id: btcId!,
  size: 1,
  side: 'buy',
  order_type: 'market_order'
});

// Cancel an order
await cancelOrder(order.result.id);
```

### API Client Direct Usage

```typescript
import DeltaRestClient from './dist/index';

const client = await new DeltaRestClient(API_KEY, API_SECRET);

// Get products
const products = await client.apis.Products.getProducts();

// Get market data
const ticker = await client.apis.MarketData.getTicker({
  product_id: 13
});

// Manage orders
const orders = await client.apis.Orders.getOrders();
```

## Configuration

Set your API credentials in the relevant files or use environment variables:

```typescript
const API_KEY = process.env.DELTA_API_KEY || 'your_api_key';
const API_SECRET = process.env.DELTA_API_SECRET || 'your_api_secret';
```

## Project Structure

```
src/
├── types/           # TypeScript type definitions
├── lib/            # Core library files
├── prod/           # Production application
│   ├── app/        # Main application
│   ├── packages/   # Trading functions
│   └── utils/      # Utility functions
└── test/           # Test files
```

## Building

The project compiles to the `dist/` directory. Make sure to run `npm run build` before using the compiled JavaScript files.

## License

[Your License Here]
