"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeltaAPIKeyAuthorization = void 0;
const R = __importStar(require("ramda"));
const crypto = __importStar(require("crypto"));
const url = __importStar(require("url"));
/**
 * Handles HMAC signing for Delta Exchange API
 */
class DeltaAPIKeyAuthorization {
    constructor(apiKey, apiSecret) {
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
    }
    apply(obj) {
        const timestamp = Math.floor(new Date().getTime() / 1000);
        const parsedURL = url.parse(obj.url);
        const path = parsedURL.pathname + (parsedURL.search || '');
        const signature = this.sign(obj.method?.toUpperCase() || 'GET', path, timestamp, obj.body);
        obj.headers['api-key'] = this.apiKey;
        obj.headers['signature'] = signature;
        obj.headers['timestamp'] = timestamp.toString();
        return true;
    }
    sign(verb, url, timestamp, data) {
        if (!data || R.isEmpty(data)) {
            data = '';
        }
        else if (R.is(Object, data)) {
            data = JSON.stringify(data);
        }
        const message = verb + timestamp + url + data;
        return crypto
            .createHmac('sha256', this.apiSecret)
            .update(message)
            .digest('hex');
    }
}
exports.DeltaAPIKeyAuthorization = DeltaAPIKeyAuthorization;
//# sourceMappingURL=DeltaAPIKeyAuthorization.js.map