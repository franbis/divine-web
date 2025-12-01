// ABOUTME: Tests for Divine REST Gateway client
// ABOUTME: Verifies gateway detection and query encoding

import { describe, it, expect } from 'vitest';
import { shouldUseGateway, encodeFilter } from './gatewayClient';

describe('shouldUseGateway', () => {
  it('returns true for relay.divine.video', () => {
    expect(shouldUseGateway('wss://relay.divine.video')).toBe(true);
    expect(shouldUseGateway('wss://relay.divine.video/')).toBe(true);
  });

  it('returns false for other relays', () => {
    expect(shouldUseGateway('wss://relay.damus.io')).toBe(false);
    expect(shouldUseGateway('wss://relay.nostr.band')).toBe(false);
  });
});

describe('encodeFilter', () => {
  it('encodes filter to base64url format', () => {
    const filter = { kinds: [1], limit: 10 };
    const encoded = encodeFilter(filter);

    // Should be base64url (no +, /, or = characters)
    expect(encoded).not.toMatch(/[+/=]/);

    // Should decode back to original
    const decoded = JSON.parse(atob(encoded.replace(/-/g, '+').replace(/_/g, '/')));
    expect(decoded).toEqual(filter);
  });
});
