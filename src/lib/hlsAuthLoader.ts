// ABOUTME: Custom HLS.js loader that adds NIP-98 auth headers to each request
// ABOUTME: Generates fresh signatures for each segment/manifest request

import Hls from 'hls.js';
import type { LoaderContext, LoaderConfiguration, LoaderCallbacks, Loader } from 'hls.js';

type AuthHeaderGenerator = (url: string, method?: string) => Promise<string | null>;

/**
 * Creates a custom HLS loader class that adds NIP-98 auth headers to each request
 */
export function createAuthLoader(getAuthHeader: AuthHeaderGenerator): typeof Loader {
  // Get the default loader class from HLS.js
  const DefaultLoader = Hls.DefaultConfig.loader;

  return class AuthLoader extends DefaultLoader {
    private authHeaderGenerator: AuthHeaderGenerator;

    constructor(config: LoaderConfiguration) {
      super(config);
      this.authHeaderGenerator = getAuthHeader;
    }

    async load(
      context: LoaderContext,
      config: LoaderConfiguration,
      callbacks: LoaderCallbacks<LoaderContext>
    ): Promise<void> {
      // Generate auth header for this specific URL
      try {
        const authHeader = await this.authHeaderGenerator(context.url, 'GET');
        if (authHeader) {
          // Add auth header to the request
          if (!context.headers) {
            context.headers = {};
          }
          context.headers['Authorization'] = authHeader;
        }
      } catch (error) {
        console.error('[AuthLoader] Failed to generate auth header:', error);
      }

      // Call the parent loader
      return super.load(context, config, callbacks);
    }
  } as unknown as typeof Loader;
}
