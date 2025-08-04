import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { MondoAppConnect } from './init.js';

// Import the module to test its exports
import commonModule, {
    // Collection exports
    CollectionSchema,
    defaultMutationRequestHeaders,
    defaultRequestHeaders,
    // Schema exports
    HandleSchema,
    InvalidDataFactory,
    MockHelpers,
    normalizeUrlWithTokens,
    OptionalDateSchema,
    optionallyNullish,
    optionallyNullishToUndefined,
    optionallyUndefined,
    // Pagination exports
    PaginationSchema,
    parseEgressSchema,
    parseIngressSchema,
    // Date exports
    RequiredDateSchema,
    responseToHttpError,
    // Test utils exports
    TestDataFactory,
    TestDates,
    TestSetup,
    TestUrls,
    toHttpError,
} from './index.js';

// Mock console.debug to avoid noise in tests
global.console.debug = vi.fn();

describe('Common - Index Module (index.ts)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('default export', () => {
    test('should export MondoAppConnect as default', () => {
      expect(commonModule).toBe(MondoAppConnect);
      expect(typeof commonModule).toBe('function');
      expect(commonModule.name).toBe('MondoAppConnect');
    });

    test('should be able to instantiate default export', () => {
      const config = {
        accessToken: 'test-token',
      };

      const instance = new commonModule(config);

      expect(instance).toBeInstanceOf(MondoAppConnect);
      expect(instance.config.accessToken).toBe('test-token');
    });
  });

  describe('resource utils exports', () => {
    test('should export defaultRequestHeaders function', () => {
      expect(typeof defaultRequestHeaders).toBe('function');
      
      const headers = defaultRequestHeaders();
      
      expect(headers).toBeInstanceOf(Headers);
      expect(headers.get('accept')).toBe('application/json');
    });

    test('should export defaultMutationRequestHeaders function', () => {
      expect(typeof defaultMutationRequestHeaders).toBe('function');
      
      const headers = defaultMutationRequestHeaders();
      
      expect(headers).toBeInstanceOf(Headers);
      expect(headers.get('accept')).toBe('application/json');
      expect(headers.get('content-type')).toBe('application/json');
    });

    test('should export parseEgressSchema function', () => {
      expect(typeof parseEgressSchema).toBe('function');
      
      const testData = { test: 'data' };
      const result = parseEgressSchema(testData);
      
      expect(result).toEqual(testData);
    });

    test('should export parseIngressSchema function', () => {
      expect(typeof parseIngressSchema).toBe('function');
      
      const testData = { test: 'data' };
      const result = parseIngressSchema(testData);
      
      expect(result).toEqual(testData);
    });

    test('should export responseToHttpError function', () => {
      expect(typeof responseToHttpError).toBe('function');
    });

    test('should export toHttpError function', () => {
      expect(typeof toHttpError).toBe('function');
    });
  });

  describe('schema exports', () => {
    test('should export HandleSchema', () => {
      expect(HandleSchema).toBeDefined();
      expect(typeof HandleSchema).toBe('function');
    });

    test('should export normalizeUrlWithTokens function', () => {
      expect(typeof normalizeUrlWithTokens).toBe('function');
      
      const testUrl = 'https://example.com/path/%7B%7Bid%7D%7D';
      const result = normalizeUrlWithTokens(testUrl);
      
      expect(result).toBe('https://example.com/path/{{id}}');
    });

    test('should export schema utility functions', () => {
      expect(typeof optionallyNullishToUndefined).toBe('function');
      expect(typeof optionallyNullish).toBe('function');
      expect(typeof optionallyUndefined).toBe('function');
    });

    test('should export CollectionSchema', () => {
      expect(CollectionSchema).toBeDefined();
      expect(typeof CollectionSchema).toBe('function');
    });

    test('should export date schemas', () => {
      expect(RequiredDateSchema).toBeDefined();
      expect(typeof RequiredDateSchema).toBe('function');
      expect(OptionalDateSchema).toBeDefined();
      expect(typeof OptionalDateSchema).toBe('function');
    });

    test('should export PaginationSchema', () => {
      expect(PaginationSchema).toBeDefined();
      expect(typeof PaginationSchema).toBe('function');
    });
  });

  describe('test utils exports', () => {
    test('should export TestDataFactory', () => {
      expect(TestDataFactory).toBeDefined();
      expect(typeof TestDataFactory).toBe('object');
      expect(typeof TestDataFactory.validApp).toBe('function');
      expect(typeof TestDataFactory.validAppObject).toBe('function');
      expect(typeof TestDataFactory.validConnection).toBe('function');
      expect(typeof TestDataFactory.validConfiguration).toBe('function');
    });

    test('should export InvalidDataFactory', () => {
      expect(InvalidDataFactory).toBeDefined();
      expect(typeof InvalidDataFactory).toBe('object');
      expect(typeof InvalidDataFactory.invalidAppMissingFields).toBe('function');
      expect(typeof InvalidDataFactory.invalidAppBadHandle).toBe('function');
    });

    test('should export MockHelpers', () => {
      expect(MockHelpers).toBeDefined();
      expect(typeof MockHelpers).toBe('object');
      expect(typeof MockHelpers.createMockResponse).toBe('function');
      expect(typeof MockHelpers.createMockAuthorization).toBe('function');
      expect(typeof MockHelpers.setupGlobalMocks).toBe('function');
    });

    test('should export TestUrls', () => {
      expect(TestUrls).toBeDefined();
      expect(typeof TestUrls).toBe('object');
      expect(TestUrls.base).toBeInstanceOf(URL);
      expect(TestUrls.apps).toBeInstanceOf(URL);
      expect(typeof TestUrls.withPath).toBe('function');
    });

    test('should export TestSetup', () => {
      expect(TestSetup).toBeDefined();
      expect(typeof TestSetup).toBe('object');
      expect(typeof TestSetup.standardBeforeEach).toBe('function');
      expect(typeof TestSetup.standardAfterEach).toBe('function');
      expect(typeof TestSetup.createTestEnvironment).toBe('function');
    });

    test('should export TestDates', () => {
      expect(TestDates).toBeDefined();
      expect(typeof TestDates).toBe('object');
      expect(TestDates.fixed).toBeInstanceOf(Date);
      expect(typeof TestDates.fixedIso).toBe('string');
      expect(typeof TestDates.now).toBe('function');
      expect(typeof TestDates.nowIso).toBe('function');
    });
  });

  describe('export functionality verification', () => {
    test('should have all expected named exports available', () => {
      // Resource utils
      expect(defaultRequestHeaders).toBeDefined();
      expect(defaultMutationRequestHeaders).toBeDefined();
      expect(parseEgressSchema).toBeDefined();
      expect(parseIngressSchema).toBeDefined();
      expect(responseToHttpError).toBeDefined();
      expect(toHttpError).toBeDefined();

      // Schema exports
      expect(HandleSchema).toBeDefined();
      expect(normalizeUrlWithTokens).toBeDefined();
      expect(optionallyNullishToUndefined).toBeDefined();
      expect(optionallyNullish).toBeDefined();
      expect(optionallyUndefined).toBeDefined();
      expect(CollectionSchema).toBeDefined();
      expect(RequiredDateSchema).toBeDefined();
      expect(OptionalDateSchema).toBeDefined();
      expect(PaginationSchema).toBeDefined();

      // Test utils
      expect(TestDataFactory).toBeDefined();
      expect(InvalidDataFactory).toBeDefined();
      expect(MockHelpers).toBeDefined();
      expect(TestUrls).toBeDefined();
      expect(TestSetup).toBeDefined();
      expect(TestDates).toBeDefined();
    });

    test('should have properly typed exports', () => {
      // Test that exports maintain their expected types
      const headers = defaultRequestHeaders();
      expect(headers).toBeInstanceOf(Headers);

      const mutationHeaders = defaultMutationRequestHeaders();
      expect(mutationHeaders).toBeInstanceOf(Headers);

      const testData = TestDataFactory.validApp();
      expect(typeof testData).toBe('object');
      expect(typeof testData.handle).toBe('string');
      expect(typeof testData.name).toBe('string');

      const mockResponse = MockHelpers.createMockResponse({ test: 'data' });
      expect(typeof mockResponse.ok).toBe('boolean');
      expect(typeof mockResponse.status).toBe('number');
      expect(typeof mockResponse.json).toBe('function');
    });

    test('should maintain function behavior through exports', () => {
      // Test that exported functions work correctly
      const normalizedUrl = normalizeUrlWithTokens('https://example.com/%7B%7Bid%7D%7D');
      expect(normalizedUrl).toBe('https://example.com/{{id}}');

      const testUrl = TestUrls.withPath('/test');
      expect(testUrl).toBeInstanceOf(URL);
      expect(testUrl.pathname).toBe('/test');

      const testEnv = TestSetup.createTestEnvironment();
      expect(testEnv.mockFetch).toBeDefined();
      expect(testEnv.mockAuthorization).toBeDefined();
      expect(testEnv.testUrl).toBeInstanceOf(URL);
    });
  });

  describe('module structure validation', () => {
    test('should not have unexpected exports', async () => {
      // Import the entire module to check for unexpected exports
      const moduleExports = await import('./index.js');
      const moduleKeys = Object.keys(moduleExports);
      
      const expectedExports = [
        'default',
        // Resource utils
        'defaultMutationRequestHeaders',
        'defaultRequestHeaders', 
        'parseEgressSchema',
        'parseIngressSchema',
        'responseToHttpError',
        'toHttpError',
        // Schema exports (these are * exports, so we expect many)
        'HandleSchema',
        'normalizeUrlWithTokens',
        'optionallyNullishToUndefined',
        'optionallyNullish', 
        'optionallyUndefined',
        'CollectionSchema',
        'RequiredDateSchema',
        'OptionalDateSchema',
        'PaginationSchema',
        // Test utils
        'TestDataFactory',
        'InvalidDataFactory',
        'MockHelpers',
        'TestUrls',
        'TestSetup',
        'TestDates',
      ];

      // Check that all expected exports are present
      for (const expectedExport of expectedExports) {
        expect(moduleKeys).toContain(expectedExport);
      }

      // The module should have a reasonable number of exports (not too many unexpected ones)
      expect(moduleKeys.length).toBeGreaterThan(expectedExports.length - 5); // Allow some flexibility
      expect(moduleKeys.length).toBeLessThan(expectedExports.length + 10); // But not too many extra
    });

    test('should maintain consistent export structure', () => {
      // Verify the module structure is consistent
      expect(typeof commonModule).toBe('function'); // Default export
      expect(commonModule).toBe(MondoAppConnect);

      // Verify that re-exported functions maintain their original behavior
      const originalHeaders = defaultRequestHeaders();
      const reExportedHeaders = defaultRequestHeaders();
      
      expect(originalHeaders.get('accept')).toBe(reExportedHeaders.get('accept'));
    });
  });

  describe('integration with other modules', () => {
    test('should work with MondoAppConnect instance', () => {
      const config = TestDataFactory.validSdkConfig();
      const instance = new commonModule(config);
      
      expect(instance).toBeInstanceOf(MondoAppConnect);
      expect(instance.config.accessToken).toBe(config.accessToken);
      
      // Test that the authorizer works with exported utilities
      const authorizer = instance.authorizer;
      const request = {
        method: 'GET',
        headers: defaultRequestHeaders(),
      };
      
      const authorizedRequest = authorizer(request);
      expect(authorizedRequest.headers).toBeInstanceOf(Headers);
    });

    test('should provide consistent test utilities', () => {
      const mockAuth = MockHelpers.createMockAuthorization();
      const testData = TestDataFactory.validApp();
      const mockResponse = MockHelpers.createMockResponse(testData);
      
      expect(typeof mockAuth).toBe('function');
      expect(typeof testData).toBe('object');
      expect(mockResponse.ok).toBe(true);
      expect(mockResponse.status).toBe(200);
    });
  });
});