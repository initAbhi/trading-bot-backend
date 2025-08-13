import * as R from 'ramda';
import * as crypto from 'crypto';
import * as url from 'url';
import { RequestObject } from '../types';

/**
 * Handles HMAC signing for Delta Exchange API
 */
export class DeltaAPIKeyAuthorization {
  private apiKey: string;
  private apiSecret: string;

  constructor(apiKey: string, apiSecret: string) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
  }

  apply(obj: RequestObject): boolean {
    const timestamp = Math.floor(new Date().getTime() / 1000);
    const parsedURL = url.parse(obj.url);
    const path = parsedURL.pathname + (parsedURL.search || '');

    const signature = this.sign(
      obj.method?.toUpperCase() || 'GET',
      path,
      timestamp,
      obj.body
    );
    
    obj.headers['api-key'] = this.apiKey;
    obj.headers['signature'] = signature;
    obj.headers['timestamp'] = timestamp.toString();
    return true;
  }

  private sign(verb: string, url: string, timestamp: number, data: any): string {
    if (!data || R.isEmpty(data)) {
      data = '';
    } else if (R.is(Object, data)) {
      data = JSON.stringify(data);
    }

    const message = verb + timestamp + url + data;
    return crypto
      .createHmac('sha256', this.apiSecret)
      .update(message)
      .digest('hex');
  }
}
