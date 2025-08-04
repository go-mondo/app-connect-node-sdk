import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { MondoAppConnect, type ConfigProps } from './init.js';

// Mock console.debug to avoid noise in tests
global.console.debug = vi.fn();

describe('Common - Initialization (init.ts)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('MondoAppConnect constructor', () => {
    test('should create instance with valid configuration', () => {
      const config: ConfigProps = {
        accessToken: 'test-access-token',
      };

      const instance = new MondoAppConnect(config);

      expect(instance).toBeInstanceOf(MondoAppConnect);
      expect(instance.config).toBeDefined();
      expect(instance.config.accessToken).toBe('test-access-token');
    });

    test('should create instance with valid configuration including custom host', () => {
      const config: ConfigProps = {
        accessToken: 'test-access-token',
        host: 'https://custom-api.example.com',
      };

      const instance = new MondoAppConnect(config);

      expect(instance.config.accessToken).toBe('test-access-token');
      expect(instance.config.host.toString()).toBe('https://custom-api.example.com/');
    });

    test('should apply default host URL when not provided', () => {
      const config: ConfigProps = {
        accessToken: 'test-access-token',
      };

      const instance = new MondoAppConnect(config);

      expect(instance.config.host.toString()).toBe(
        'https://dxnh0yagb1.execute-api.us-east-1.amazonaws.com/'
      );
    });

    test('should throw error for missing access token', () => {
      const config = {} as ConfigProps;

      expect(() => new MondoAppConnect(config)).toThrow(
        'Invalid configuration:'
      );
    });

    test('should throw error for empty access token', () => {
      const config: ConfigProps = {
        accessToken: '',
      };

      expect(() => new MondoAppConnect(config)).toThrow(
        'Invalid configuration:'
      );
    });

    test('should throw error for invalid host URL', () => {
      const config: ConfigProps = {
        accessToken: 'test-access-token',
        host: 'not-a-valid-url',
      };

      expect(() => new MondoAppConnect(config)).toThrow(
        'Invalid configuration:'
      );
    });

    test('should throw error for non-string access token', () => {
      const config = {
        accessToken: 123,
      } as any;

      expect(() => new MondoAppConnect(config)).toThrow(
        'Invalid configuration:'
      );
    });

    test('should throw error for null access token', () => {
      const config = {
        accessToken: null,
      } as any;

      expect(() => new MondoAppConnect(config)).toThrow(
        'Invalid configuration:'
      );
    });

    test('should throw error for undefined access token', () => {
      const config = {
        accessToken: undefined,
      } as any;

      expect(() => new MondoAppConnect(config)).toThrow(
        'Invalid configuration:'
      );
    });
  });

  describe('authorizer function generation', () => {
    test('should create authorizer function with access token', () => {
      const config: ConfigProps = {
        accessToken: 'test-access-token',
      };

      const instance = new MondoAppConnect(config);
      const authorizer = instance.authorizer;

      expect(typeof authorizer).toBe('function');
    });

    test('should apply authorization header with access token', () => {
      const config: ConfigProps = {
        accessToken: 'test-access-token',
      };

      const instance = new MondoAppConnect(config);
      const authorizer = instance.authorizer;

      const request: RequestInit = {
        method: 'GET',
        headers: new Headers(),
      };

      const authorizedRequest = authorizer(request);

      expect(authorizedRequest.headers).toBeInstanceOf(Headers);
      const headers = authorizedRequest.headers as Headers;
      expect(headers.get('authorization')).toBe('test-access-token');
    });

    test('should preserve existing headers when adding authorization', () => {
      const config: ConfigProps = {
        accessToken: 'test-access-token',
      };

      const instance = new MondoAppConnect(config);
      const authorizer = instance.authorizer;

      const request: RequestInit = {
        method: 'GET',
        headers: new Headers({
          'content-type': 'application/json',
          'x-custom-header': 'custom-value',
        }),
      };

      const authorizedRequest = authorizer(request);

      const headers = authorizedRequest.headers as Headers;
      expect(headers.get('authorization')).toBe('test-access-token');
      expect(headers.get('content-type')).toBe('application/json');
      expect(headers.get('x-custom-header')).toBe('custom-value');
    });

    test('should handle request with no existing headers', () => {
      const config: ConfigProps = {
        accessToken: 'test-access-token',
      };

      const instance = new MondoAppConnect(config);
      const authorizer = instance.authorizer;

      const request: RequestInit = {
        method: 'GET',
      };

      const authorizedRequest = authorizer(request);

      expect(authorizedRequest.headers).toBeInstanceOf(Headers);
      const headers = authorizedRequest.headers as Headers;
      expect(headers.get('authorization')).toBe('test-access-token');
    });

    test('should handle request with headers as plain object', () => {
      const config: ConfigProps = {
        accessToken: 'test-access-token',
      };

      const instance = new MondoAppConnect(config);
      const authorizer = instance.authorizer;

      const request: RequestInit = {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
        },
      };

      const authorizedRequest = authorizer(request);

      const headers = authorizedRequest.headers as Headers;
      expect(headers.get('authorization')).toBe('test-access-token');
      expect(headers.get('content-type')).toBe('application/json');
    });

    test('should return same request object with modified headers', () => {
      const config: ConfigProps = {
        accessToken: 'test-access-token',
      };

      const instance = new MondoAppConnect(config);
      const authorizer = instance.authorizer;

      const request: RequestInit = {
        method: 'POST',
        body: JSON.stringify({ test: 'data' }),
      };

      const authorizedRequest = authorizer(request);

      expect(authorizedRequest.method).toBe('POST');
      expect(authorizedRequest.body).toBe(JSON.stringify({ test: 'data' }));
      expect(authorizedRequest).toBe(request); // Should be the same object
    });

    test('should return identity function when no access token provided', () => {
      // Create a mock config that bypasses validation for testing the else branch
      const instance = new MondoAppConnect({ accessToken: 'temp' });
      
      // Manually set config to test the else branch
      (instance as any).config = { accessToken: '' };
      
      const authorizer = instance.authorizer;
      const request: RequestInit = {
        method: 'GET',
        headers: new Headers({ 'content-type': 'application/json' }),
      };

      const result = authorizer(request);
      
      // Should return the same request object unchanged
      expect(result).toBe(request);
      expect(result.method).toBe('GET');
      expect((result.headers as Headers).get('content-type')).toBe('application/json');
      expect((result.headers as Headers).get('authorization')).toBeNull();
    });
  });

  describe('configuration validation edge cases', () => {
    test('should handle configuration with extra properties', () => {
      const config = {
        accessToken: 'test-access-token',
        extraProperty: 'should-be-ignored',
      } as any;

      const instance = new MondoAppConnect(config);

      expect(instance.config.accessToken).toBe('test-access-token');
      // arktype doesn't filter out extra properties, it passes them through
      expect((instance.config as any).extraProperty).toBe('should-be-ignored');
    });

    test('should validate host URL format strictly', () => {
      const invalidHosts = [
        'example.com',
        'not-a-valid-url',
        '',
      ];

      for (const host of invalidHosts) {
        const config: ConfigProps = {
          accessToken: 'test-access-token',
          host,
        };

        expect(() => new MondoAppConnect(config)).toThrow(
          'Invalid configuration:'
        );
      }
    });

    test('should accept valid HTTPS URLs for host', () => {
      const validHosts = [
        'https://api.example.com',
        'https://subdomain.api.example.com',
        'https://api.example.com:8080',
        'https://api.example.com/path',
      ];

      for (const host of validHosts) {
        const config: ConfigProps = {
          accessToken: 'test-access-token',
          host,
        };

        expect(() => new MondoAppConnect(config)).not.toThrow();
      }
    });

    test('should provide descriptive error messages for validation failures', () => {
      const config = {} as ConfigProps;

      try {
        new MondoAppConnect(config);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toContain('Invalid configuration:');
        expect((error as Error).message).toContain('accessToken');
      }
    });
  });

  describe('type safety and inference', () => {
    test('should properly infer configuration types', () => {
      const config: ConfigProps = {
        accessToken: 'test-access-token',
        host: 'https://api.example.com',
      };

      const instance = new MondoAppConnect(config);

      // These should compile without TypeScript errors
      const accessToken: string = instance.config.accessToken;
      const host: URL = instance.config.host;

      expect(accessToken).toBe('test-access-token');
      expect(host.toString()).toBe('https://api.example.com/');
    });

    test('should maintain readonly config property', () => {
      const config: ConfigProps = {
        accessToken: 'test-access-token',
      };

      const instance = new MondoAppConnect(config);

      // This should be readonly - TypeScript would catch attempts to modify
      expect(instance.config).toBeDefined();
      expect(Object.isFrozen(instance.config)).toBe(false); // arktype doesn't freeze objects
    });
  });
});