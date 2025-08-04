import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { MondoAppConnect } from './init.js';
import {
  InvalidDataFactory,
  MockHelpers,
  TestDataFactory,
  TestDates,
  TestSetup,
  TestUrls,
} from './test-utils.js';

describe('Test Utilities', () => {
  beforeEach(() => {
    TestSetup.standardBeforeEach();
  });

  afterEach(() => {
    TestSetup.standardAfterEach();
  });

  describe('TestDataFactory', () => {
    test('should create valid app data', () => {
      const app = TestDataFactory.validApp();
      
      expect(app).toEqual({
        handle: 'test-app',
        name: 'Test App',
        avatar: 'https://example.com/avatar.png',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
      });
    });

    test('should create valid app object data', () => {
      const appObject = TestDataFactory.validAppObject();
      
      expect(appObject).toEqual({
        handle: 'test-object',
        name: 'Test Object',
        app: { handle: 'test-app', name: 'Test App' },
        url: 'https://example.com/object/{{id}}',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
      });
    });

    test('should create valid connection data', () => {
      const connection = TestDataFactory.validConnection();
      
      expect(connection).toEqual({
        app: {
          handle: 'test-app',
          name: 'Test App',
        },
        object: {
          handle: 'test-object',
          name: 'Test Object',
        },
        id: 'test-id-123',
        avatar: 'https://example.com/avatar.png',
        url: 'https://example.com/connection/{{id}}',
        updatedAt: '2024-01-01T00:00:00.000Z',
        inferred: false,
      });
    });

    test('should create valid configuration data', () => {
      const configuration = TestDataFactory.validConfiguration();
      
      expect(configuration).toEqual({
        source: {
          app: { handle: 'source-app', name: 'Source App' },
          object: { handle: 'source-object', name: 'Source Object' },
          join: 'one',
        },
        target: {
          app: { handle: 'target-app', name: 'Target App' },
          object: { handle: 'target-object', name: 'Target Object' },
          join: 'many',
        },
        status: 'enabled',
        updatedAt: '2024-01-01T00:00:00.000Z',
      });
    });

    test('should create valid SDK config', () => {
      const config = TestDataFactory.validSdkConfig();
      
      expect(config).toEqual({
        accessToken: 'test-access-token-123',
        host: 'https://api.test.example.com',
      });
    });

    test('should create minimal SDK config', () => {
      const config = TestDataFactory.minimalSdkConfig();
      
      expect(config).toEqual({
        accessToken: 'test-token',
      });
    });
  });

  describe('InvalidDataFactory', () => {
    test('should create invalid app data with missing fields', () => {
      const invalidApp = InvalidDataFactory.invalidAppMissingFields();
      
      expect(invalidApp).toEqual({
        avatar: 'not-a-url',
      });
      expect(invalidApp).not.toHaveProperty('handle');
      expect(invalidApp).not.toHaveProperty('name');
    });

    test('should create invalid app data with bad handle', () => {
      const invalidApp = InvalidDataFactory.invalidAppBadHandle();
      
      expect(invalidApp.handle).toBe('Invalid Handle!');
      expect(invalidApp.name).toBe('Test App');
    });

    test('should create invalid app data with bad URL', () => {
      const invalidApp = InvalidDataFactory.invalidAppBadUrl();
      
      expect(invalidApp).toEqual({
        handle: 'test-app',
        name: 'Test App',
        avatar: 'not-a-valid-url',
      });
    });

    test('should create invalid SDK config with missing token', () => {
      const invalidConfig = InvalidDataFactory.invalidSdkConfigMissingToken();
      
      expect(invalidConfig).toEqual({
        host: 'https://api.example.com',
      });
      expect(invalidConfig).not.toHaveProperty('accessToken');
    });

    test('should create invalid SDK config with empty token', () => {
      const invalidConfig = InvalidDataFactory.invalidSdkConfigEmptyToken();
      
      expect(invalidConfig).toEqual({
        accessToken: '',
        host: 'https://api.example.com',
      });
    });

    test('should create invalid SDK config with bad host', () => {
      const invalidConfig = InvalidDataFactory.invalidSdkConfigBadHost();
      
      expect(invalidConfig).toEqual({
        accessToken: 'test-token',
        host: 'not-a-valid-url',
      });
    });

    test('should create invalid app object with missing app', () => {
      const invalidAppObject = InvalidDataFactory.invalidAppObjectMissingApp();
      
      expect(invalidAppObject).toEqual({
        handle: 'test-object',
        name: 'Test Object',
      });
      expect(invalidAppObject).not.toHaveProperty('app');
    });

    test('should create invalid connection with bad enum', () => {
      const invalidConnection = InvalidDataFactory.invalidConnectionBadEnum();
      
      expect(invalidConnection).toEqual({
        app: 'test-app',
        object: 'test-object',
        id: 'test-id',
        inferred: 'not-a-boolean',
      });
    });

    test('should create invalid configuration with bad join type', () => {
      const invalidConfig = InvalidDataFactory.invalidConfigurationBadJoin();
      
      expect(invalidConfig.source.join).toBe('invalid-join-type');
      expect(invalidConfig.target.join).toBe('many');
    });

    test('should create invalid configuration with bad status', () => {
      const invalidConfig = InvalidDataFactory.invalidConfigurationBadStatus();
      
      expect(invalidConfig.status).toBe('invalid-status');
    });
  });

  describe('MockHelpers', () => {
    test('should create mock response with success status', () => {
      const data = { test: 'data' };
      const response = MockHelpers.createMockResponse(data, 200);
      
      expect(response.ok).toBe(true);
      expect(response.status).toBe(200);
      expect(response.json()).resolves.toEqual(data);
    });

    test('should create mock response with error status', () => {
      const data = { error: 'test error' };
      const response = MockHelpers.createMockResponse(data, 400);
      
      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);
      expect(response.json()).resolves.toEqual(data);
    });

    test('should create mock authorization function', () => {
      const mockAuth = MockHelpers.createMockAuthorization();
      const request: RequestInit = {
        method: 'GET',
        headers: new Headers(),
      };
      
      const result = mockAuth(request);
      
      expect(mockAuth).toHaveBeenCalledWith(request);
      expect(result.headers).toBeInstanceOf(Headers);
      expect((result.headers as Headers).get('authorization')).toBe('Bearer test-token');
    });

    test('should create mock authorization function with custom token', () => {
      const customToken = 'Bearer custom-token-123';
      const mockAuth = MockHelpers.createMockAuthorizationWithToken(customToken);
      const request: RequestInit = {
        method: 'GET',
        headers: new Headers(),
      };
      
      const result = mockAuth(request);
      
      expect(mockAuth).toHaveBeenCalledWith(request);
      expect(result.headers).toBeInstanceOf(Headers);
      expect((result.headers as Headers).get('authorization')).toBe(customToken);
    });

    test('should create mock authorization function with custom headers', () => {
      const customHeaders = {
        'x-custom-header': 'custom-value',
        'x-another-header': 'another-value',
      };
      const mockAuth = MockHelpers.createMockAuthorizationWithHeaders(customHeaders);
      const request: RequestInit = {
        method: 'GET',
        headers: new Headers(),
      };
      
      const result = mockAuth(request);
      
      expect(mockAuth).toHaveBeenCalledWith(request);
      expect(result.headers).toBeInstanceOf(Headers);
      expect((result.headers as Headers).get('x-custom-header')).toBe('custom-value');
      expect((result.headers as Headers).get('x-another-header')).toBe('another-value');
    });

    test('should handle request with no headers in mock authorization', () => {
      const mockAuth = MockHelpers.createMockAuthorization();
      const request: RequestInit = {
        method: 'GET',
        // No headers property
      };
      
      const result = mockAuth(request);
      
      expect(mockAuth).toHaveBeenCalledWith(request);
      expect(result.headers).toBeInstanceOf(Headers);
      expect((result.headers as Headers).get('authorization')).toBe('Bearer test-token');
    });

    test('should handle request with undefined headers in mock authorization with token', () => {
      const customToken = 'Bearer custom-token-123';
      const mockAuth = MockHelpers.createMockAuthorizationWithToken(customToken);
      const request: RequestInit = {
        method: 'GET',
        headers: undefined,
      };
      
      const result = mockAuth(request);
      
      expect(mockAuth).toHaveBeenCalledWith(request);
      expect(result.headers).toBeInstanceOf(Headers);
      expect((result.headers as Headers).get('authorization')).toBe(customToken);
    });

    test('should handle request with null headers in mock authorization with custom headers', () => {
      const customHeaders = {
        'x-test-header': 'test-value',
      };
      const mockAuth = MockHelpers.createMockAuthorizationWithHeaders(customHeaders);
      const request: RequestInit = {
        method: 'GET',
        headers: null as any,
      };
      
      const result = mockAuth(request);
      
      expect(mockAuth).toHaveBeenCalledWith(request);
      expect(result.headers).toBeInstanceOf(Headers);
      expect((result.headers as Headers).get('x-test-header')).toBe('test-value');
    });

    test('should create mock response with JSON error', () => {
      const response = MockHelpers.createMockResponseWithJsonError(500);
      
      expect(response.ok).toBe(false);
      expect(response.status).toBe(500);
      expect(response.json()).rejects.toThrow('Invalid JSON');
    });

    test('should create mock MondoAppConnect instance', () => {
      const mockSdk = MockHelpers.createMockMondoAppConnect();
      
      expect(mockSdk).toBeInstanceOf(MondoAppConnect);
      expect(mockSdk.config.accessToken).toBe('test-access-token-123');
      expect(mockSdk.config.host).toBeInstanceOf(URL);
    });

    test('should create API error response', () => {
      const errorResponse = MockHelpers.createApiErrorResponse(
        'not_found',
        'Resource not found',
        404
      );
      
      expect(errorResponse.ok).toBe(false);
      expect(errorResponse.status).toBe(404);
      expect(errorResponse.json()).resolves.toEqual({
        error: 'not_found',
        error_description: 'Resource not found',
      });
    });

    test('should create paginated response', () => {
      const items = [{ id: 1 }, { id: 2 }];
      const response = MockHelpers.createPaginatedResponse(items, 'next-cursor-token');
      
      expect(response).toEqual({
        items,
        pagination: {
          nextToken: 'next-cursor-token',
        },
      });
    });

    test('should create paginated response without more items', () => {
      const items = [{ id: 1 }];
      const response = MockHelpers.createPaginatedResponse(items, undefined);
      
      expect(response).toEqual({
        items,
        pagination: {},
      });
    });
  });

  describe('TestUrls', () => {
    test('should provide consistent test URLs', () => {
      expect(TestUrls.base.toString()).toBe('https://api.test.example.com/');
      expect(TestUrls.apps.toString()).toBe('https://api.test.example.com/apps');
      expect(TestUrls.objects.toString()).toBe('https://api.test.example.com/objects');
      expect(TestUrls.connections.toString()).toBe('https://api.test.example.com/connections');
      expect(TestUrls.configurations.toString()).toBe('https://api.test.example.com/configurations');
    });

    test('should create URLs with custom paths', () => {
      const customUrl = TestUrls.withPath('/custom/path');
      expect(customUrl.toString()).toBe('https://api.test.example.com/custom/path');
    });
  });

  describe('TestSetup', () => {
    test('should create test environment with mocks', () => {
      const env = TestSetup.createTestEnvironment();
      
      expect(env.mockFetch).toBeDefined();
      expect(env.mockAuthorization).toBeDefined();
      expect(env.testUrl).toBeInstanceOf(URL);
      expect(env.testUrl.toString()).toBe('https://api.test.example.com/');
    });
  });

  describe('TestDates', () => {
    test('should provide consistent test dates', () => {
      expect(TestDates.fixed).toEqual(new Date('2024-01-01T00:00:00.000Z'));
      expect(TestDates.fixedIso).toBe('2024-01-01T00:00:00.000Z');
      expect(TestDates.fixedUpdated).toEqual(new Date('2024-01-02T00:00:00.000Z'));
      expect(TestDates.fixedUpdatedIso).toBe('2024-01-02T00:00:00.000Z');
    });

    test('should provide current date functions', () => {
      const now = TestDates.now();
      const nowIso = TestDates.nowIso();
      
      expect(now).toBeInstanceOf(Date);
      expect(typeof nowIso).toBe('string');
      expect(nowIso).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });
  });

  describe('Global mocks setup', () => {
    test('should mock console.debug', () => {
      console.debug('test message');
      expect(console.debug).toHaveBeenCalledWith('test message');
    });

    test('should mock fetch globally', () => {
      expect(global.fetch).toBeDefined();
      expect(vi.isMockFunction(global.fetch)).toBe(true);
    });
  });
});