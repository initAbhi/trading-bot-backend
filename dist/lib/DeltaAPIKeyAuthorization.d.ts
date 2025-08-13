import { RequestObject } from '../types';
/**
 * Handles HMAC signing for Delta Exchange API
 */
export declare class DeltaAPIKeyAuthorization {
    private apiKey;
    private apiSecret;
    constructor(apiKey: string, apiSecret: string);
    apply(obj: RequestObject): boolean;
    private sign;
}
//# sourceMappingURL=DeltaAPIKeyAuthorization.d.ts.map