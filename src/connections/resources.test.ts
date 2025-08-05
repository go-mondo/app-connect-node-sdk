import {
  type Mock,
  afterEach,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from 'vitest';
import { HttpError } from '../common/errors/http.js';
import type { Authorization } from '../common/resources/authorization.js';
import { MockHelpers, TestDataFactory, TestSetup } from '../common/test-utils.js';
import {
  ConnectionResources,
  associateConnection,
  dissociateConnection,
  listConnectionsBySource,
} from './resources.js';

describe('Connections Resources', () => {
  let mockFetch: Mock;
  let mockAuthorization: Mock<Authorization>;
  let mockInstance: any;
  let validSource: any;
  let validUpsertPayload: any;
  let validConnection: any;

  beforeEach(() => {
    const testEnv = TestSetup.createTestEnvironment();
    mockFetch = testEnv.mockFetch;
    mockAuthorization = testEnv.mockAuthorization;

    // Create mock MondoAppConnect instance
    mockInstance = {
      config: {
        host: 'https://api.test.example.com',
        accessToken: 'test-token',
      },
      authorizer: mockAuthorization,
    };

    // Test data
    validSource = {
      app: 'test-app',
      object: 'test-object',
      id: 'test-id-123',
    };

    validUpsertPayload = TestDataFactory.validUpsertConnectionPayload();
    validConnection = TestDataFactory.validConnection();
  });

  afterEach(() => {
    TestSetup.standardAfterEach();
  });

  describe('ConnectionResources class', () => {
    let connectionResources: ConnectionResources;

    beforeEach(() => {
      connectionResources = new ConnectionResources(mockInstance);
    });

    describe('buildPath static method', () => {
      test('should build correct path with source parameters', () => {
        const source = {
          app: 'my-app',
          object: 'my-object',
          id: 'my-id-456',
        };

        const result = ConnectionResources.buildPath(source);

        expect(result).toBe('/v1/connections/my-app/my-object/my-id-456');
      });

      test('should handle various source parameter formats', () => {
        const testCases = [
          {
            source: { app: 'simple-app', object: 'simple-object', id: 'simple-id' },
            expected: '/v1/connections/simple-app/simple-object/simple-id',
          },
          {
            source: { app: 'complex-app-name', object: 'complex-object-name', id: 'uuid-123e4567-e89b-12d3-a456-426614174000' },
            expected: '/v1/connections/complex-app-name/complex-object-name/uuid-123e4567-e89b-12d3-a456-426614174000',
          },
          {
            source: { app: 'a', object: 'b', id: 'c' },
            expected: '/v1/connections/a/b/c',
          },
        ];

        for (const { source, expected } of testCases) {
          const result = ConnectionResources.buildPath(source);
          expect(result).toBe(expected);
        }
      });

      test('should handle special characters in source parameters', () => {
        const source = {
          app: 'test-app',
          object: 'test-object',
          id: 'id-with-special@chars.123',
        };

        const result = ConnectionResources.buildPath(source);

        expect(result).toBe('/v1/connections/test-app/test-object/id-with-special@chars.123');
      });
    });

    describe('listItemsBySource method', () => {
      test('should call listConnectionsBySource function with correct parameters', async () => {
        const mockResponse = MockHelpers.createPaginatedResponse([validConnection]);
        mockFetch.mockResolvedValueOnce(MockHelpers.createMockResponse(mockResponse));

        const result = await connectionResources.listItemsBySource(validSource);

        expect(result.items).toHaveLength(1);
        expect(result.items[0]).toEqual(expect.objectContaining({
          app: validConnection.app,
          object: validConnection.object,
          id: validConnection.id,
          inferred: validConnection.inferred,
        }));
        expect(result.items[0].updatedAt).toBeInstanceOf(Date);
        expect(mockFetch).toHaveBeenCalledWith(
          new URL('/v1/connections/test-app/test-object/test-id-123', mockInstance.config.host),
          expect.objectContaining({
            method: 'GET',
            headers: expect.any(Headers),
          })
        );
      });

      test('should handle pagination parameters', async () => {
        const pagination = { nextToken: 'test-next-token', pageSize: 10 };
        const mockResponse = MockHelpers.createPaginatedResponse([validConnection], pagination.nextToken);
        mockFetch.mockResolvedValueOnce(MockHelpers.createMockResponse(mockResponse));

        const result = await connectionResources.listItemsBySource(validSource, pagination);

        expect(result.items).toHaveLength(1);
        expect(result.items[0]).toEqual(expect.objectContaining({
          app: validConnection.app,
          object: validConnection.object,
          id: validConnection.id,
        }));
        expect(result.items[0].updatedAt).toBeInstanceOf(Date);
        expect(result.pagination?.nextToken).toBeTypeOf('string');

        // Verify URL includes pagination parameters
        const fetchCall = mockFetch.mock.calls[0];
        const calledUrl = fetchCall[0] as URL;
        expect(calledUrl.searchParams.get('pagination[nextToken]')).toBe('test-next-token');
        expect(calledUrl.searchParams.get('pagination[pageSize]')).toBe('10');
      });

      test('should handle API errors', async () => {
        const errorResponse = MockHelpers.createApiErrorResponse(
          'not_found',
          'Source not found',
          404
        );
        mockFetch.mockResolvedValueOnce(errorResponse);

        await expect(
          connectionResources.listItemsBySource(validSource)
        ).rejects.toThrow(HttpError);
      });
    });

    describe('associateItem method', () => {
      test('should call associateConnection function with correct parameters', async () => {
        mockFetch.mockResolvedValueOnce(MockHelpers.createMockResponse(validConnection));

        const result = await connectionResources.associateItem(validSource, validUpsertPayload);

        expect(result).toEqual(expect.objectContaining({
          app: validConnection.app,
          object: validConnection.object,
          id: validConnection.id,
        }));

        expect(mockFetch).toHaveBeenCalledWith(
          new URL('/v1/connections/test-app/test-object/test-id-123', mockInstance.config.host),
          expect.objectContaining({
            method: 'PUT',
            headers: expect.any(Headers),
            body: JSON.stringify({
              app: { handle: validUpsertPayload.app },
              object: { handle: validUpsertPayload.object },
              id: validUpsertPayload.id,
            }),
          })
        );
      });

      test('should handle API errors during association', async () => {
        const errorResponse = MockHelpers.createApiErrorResponse(
          'conflict',
          'Connection already exists',
          409
        );
        mockFetch.mockResolvedValueOnce(errorResponse);

        await expect(
          connectionResources.associateItem(validSource, validUpsertPayload)
        ).rejects.toThrow(HttpError);
      });
    });

    describe('dissociateItem method', () => {
      test('should call dissociateConnection function with correct parameters', async () => {
        mockFetch.mockResolvedValueOnce(MockHelpers.createMockResponse(validConnection));

        const result = await connectionResources.dissociateItem(validSource, validUpsertPayload);

        expect(result).toEqual(expect.objectContaining({
          app: validConnection.app,
          object: validConnection.object,
          id: validConnection.id,
        }));

        expect(mockFetch).toHaveBeenCalledWith(
          new URL('/v1/connections/test-app/test-object/test-id-123', mockInstance.config.host),
          expect.objectContaining({
            method: 'DELETE',
            headers: expect.any(Headers),
            body: JSON.stringify({
              app: { handle: validUpsertPayload.app },
              object: { handle: validUpsertPayload.object },
              id: validUpsertPayload.id,
            }),
          })
        );
      });

      test('should handle API errors during dissociation', async () => {
        const errorResponse = MockHelpers.createApiErrorResponse(
          'not_found',
          'Connection not found',
          404
        );
        mockFetch.mockResolvedValueOnce(errorResponse);

        await expect(
          connectionResources.dissociateItem(validSource, validUpsertPayload)
        ).rejects.toThrow(HttpError);
      });
    });
  });

  describe('listConnectionsBySource function', () => {
    test('should successfully list connections with valid response', async () => {
      const mockConnections = [validConnection, { ...validConnection, id: 'another-id' }];
      const mockResponse = MockHelpers.createPaginatedResponse(mockConnections);
      mockFetch.mockResolvedValueOnce(MockHelpers.createMockResponse(mockResponse));

      const result = await listConnectionsBySource(mockInstance, validSource);

      expect(result.items).toHaveLength(2);
      expect(result.items[0]).toEqual(expect.objectContaining({
        app: validConnection.app,
        object: validConnection.object,
        id: validConnection.id,
      }));
      expect(result.items[0].updatedAt).toBeInstanceOf(Date);
      expect(result.items[1]).toEqual(expect.objectContaining({
        app: validConnection.app,
        object: validConnection.object,
        id: 'another-id',
      }));
      expect(result.items[1].updatedAt).toBeInstanceOf(Date);
    });

    test('should build correct URL with source parameters', async () => {
      const mockResponse = MockHelpers.createPaginatedResponse([]);
      mockFetch.mockResolvedValueOnce(MockHelpers.createMockResponse(mockResponse));

      await listConnectionsBySource(mockInstance, validSource);

      expect(mockFetch).toHaveBeenCalledWith(
        new URL('/v1/connections/test-app/test-object/test-id-123', mockInstance.config.host),
        expect.objectContaining({
          method: 'GET',
        })
      );
    });

    test('should handle pagination parameters correctly', async () => {
      const pagination = { nextToken: 'next-page-token', pageSize: 25 };
      const mockResponse = {
        items: [validConnection],
        pagination: { nextToken: 'another-page-token', pageSize: 25 }
      };
      mockFetch.mockResolvedValueOnce(MockHelpers.createMockResponse(mockResponse));

      const result = await listConnectionsBySource(mockInstance, validSource, pagination);

      expect(result.items).toHaveLength(1);
      expect(result.items[0]).toEqual(expect.objectContaining({
        app: validConnection.app,
        object: validConnection.object,
        id: validConnection.id,
      }));
      expect(result.items[0].updatedAt).toBeInstanceOf(Date);
      expect(result.pagination?.nextToken).toBeTypeOf('string');

      // Verify pagination parameters are added to URL
      const fetchCall = mockFetch.mock.calls[0];
      const calledUrl = fetchCall[0] as URL;
      expect(calledUrl.searchParams.get('pagination[nextToken]')).toBe('next-page-token');
      expect(calledUrl.searchParams.get('pagination[pageSize]')).toBe('25');
    });

    test('should handle empty pagination (no parameters)', async () => {
      const mockResponse = MockHelpers.createPaginatedResponse([validConnection]);
      mockFetch.mockResolvedValueOnce(MockHelpers.createMockResponse(mockResponse));

      await listConnectionsBySource(mockInstance, validSource);

      const fetchCall = mockFetch.mock.calls[0];
      const calledUrl = fetchCall[0] as URL;
      expect(calledUrl.searchParams.get('cursor')).toBeNull();
      expect(calledUrl.searchParams.get('limit')).toBeNull();
    });

    test('should apply authorization correctly', async () => {
      const mockResponse = MockHelpers.createPaginatedResponse([]);
      mockFetch.mockResolvedValueOnce(MockHelpers.createMockResponse(mockResponse));

      await listConnectionsBySource(mockInstance, validSource);

      expect(mockAuthorization).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          headers: expect.any(Headers),
        })
      );
    });

    test('should handle HTTP errors', async () => {
      const errorResponse = MockHelpers.createApiErrorResponse(
        'unauthorized',
        'Invalid token',
        401
      );
      mockFetch.mockResolvedValueOnce(errorResponse);

      await expect(
        listConnectionsBySource(mockInstance, validSource)
      ).rejects.toThrow(HttpError);
    });

    test('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(MockHelpers.createNetworkError());

      await expect(
        listConnectionsBySource(mockInstance, validSource)
      ).rejects.toThrow(HttpError);
    });

    test('should handle empty results', async () => {
      const emptyResponse = {
        items: [],
        pagination: {}
      };
      mockFetch.mockResolvedValueOnce(MockHelpers.createMockResponse(emptyResponse));

      const result = await listConnectionsBySource(mockInstance, validSource);

      expect(result.items).toHaveLength(0);
      expect(result.pagination?.nextToken).toBeFalsy();
    });
  });

  describe('associateConnection function', () => {
    test('should successfully associate connection with valid response', async () => {
      mockFetch.mockResolvedValueOnce(MockHelpers.createMockResponse(validConnection));

      const result = await associateConnection(mockInstance, validSource, validUpsertPayload);

      expect(result).toEqual(expect.objectContaining({
        app: validConnection.app,
        object: validConnection.object,
        id: validConnection.id,
      }));
    });

    test('should build correct URL and use PUT method', async () => {
      mockFetch.mockResolvedValueOnce(MockHelpers.createMockResponse(validConnection));

      await associateConnection(mockInstance, validSource, validUpsertPayload);

      expect(mockFetch).toHaveBeenCalledWith(
        new URL('/v1/connections/test-app/test-object/test-id-123', mockInstance.config.host),
        expect.objectContaining({
          method: 'PUT',
          headers: expect.any(Headers),
          body: JSON.stringify({
            app: { handle: validUpsertPayload.app },
            object: { handle: validUpsertPayload.object },
            id: validUpsertPayload.id,
          }),
        })
      );
    });

    test('should apply authorization correctly', async () => {
      mockFetch.mockResolvedValueOnce(MockHelpers.createMockResponse(validConnection));

      await associateConnection(mockInstance, validSource, validUpsertPayload);

      expect(mockAuthorization).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'PUT',
          headers: expect.any(Headers),
          body: JSON.stringify({
            app: { handle: validUpsertPayload.app },
            object: { handle: validUpsertPayload.object },
            id: validUpsertPayload.id,
          }),
        })
      );
    });

    test('should handle payload validation and transformation', async () => {
      const payloadWithExtraFields = {
        ...validUpsertPayload,
        extraField: 'should-be-removed',
        anotherExtra: 123,
      };

      mockFetch.mockResolvedValueOnce(MockHelpers.createMockResponse(validConnection));

      await associateConnection(mockInstance, validSource, payloadWithExtraFields);

      // Verify that extra fields are removed (onUndeclaredKey("delete"))
      const fetchCall = mockFetch.mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1].body);
      expect(requestBody).not.toHaveProperty('extraField');
      expect(requestBody).not.toHaveProperty('anotherExtra');
      expect(requestBody).toEqual({
        app: { handle: validUpsertPayload.app },
        object: { handle: validUpsertPayload.object },
        id: validUpsertPayload.id,
      });
    });

    test('should handle HTTP errors during association', async () => {
      const errorResponse = MockHelpers.createApiErrorResponse(
        'bad_request',
        'Invalid connection data',
        400
      );
      mockFetch.mockResolvedValueOnce(errorResponse);

      await expect(
        associateConnection(mockInstance, validSource, validUpsertPayload)
      ).rejects.toThrow(HttpError);
    });

    test('should handle conflict errors (connection already exists)', async () => {
      const errorResponse = MockHelpers.createApiErrorResponse(
        'conflict',
        'Connection already exists',
        409
      );
      mockFetch.mockResolvedValueOnce(errorResponse);

      await expect(
        associateConnection(mockInstance, validSource, validUpsertPayload)
      ).rejects.toThrow(HttpError);
    });

    test('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(MockHelpers.createNetworkError());

      await expect(
        associateConnection(mockInstance, validSource, validUpsertPayload)
      ).rejects.toThrow(HttpError);
    });
  });

  describe('dissociateConnection function', () => {
    test('should successfully dissociate connection with valid response', async () => {
      mockFetch.mockResolvedValueOnce(MockHelpers.createMockResponse(validConnection));

      const result = await dissociateConnection(mockInstance, validSource, validUpsertPayload);

      expect(result).toEqual(expect.objectContaining({
        app: validConnection.app,
        object: validConnection.object,
        id: validConnection.id,
      }));
    });

    test('should build correct URL and use DELETE method', async () => {
      mockFetch.mockResolvedValueOnce(MockHelpers.createMockResponse(validConnection));

      await dissociateConnection(mockInstance, validSource, validUpsertPayload);

      expect(mockFetch).toHaveBeenCalledWith(
        new URL('/v1/connections/test-app/test-object/test-id-123', mockInstance.config.host),
        expect.objectContaining({
          method: 'DELETE',
          headers: expect.any(Headers),
          body: JSON.stringify({
            app: { handle: validUpsertPayload.app },
            object: { handle: validUpsertPayload.object },
            id: validUpsertPayload.id,
          }),
        })
      );
    });

    test('should apply authorization correctly', async () => {
      mockFetch.mockResolvedValueOnce(MockHelpers.createMockResponse(validConnection));

      await dissociateConnection(mockInstance, validSource, validUpsertPayload);

      expect(mockAuthorization).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'DELETE',
          headers: expect.any(Headers),
          body: JSON.stringify({
            app: { handle: validUpsertPayload.app },
            object: { handle: validUpsertPayload.object },
            id: validUpsertPayload.id,
          }),
        })
      );
    });

    test('should handle payload validation and transformation', async () => {
      const payloadWithExtraFields = {
        ...validUpsertPayload,
        extraField: 'should-be-removed',
        anotherExtra: 123,
      };

      mockFetch.mockResolvedValueOnce(MockHelpers.createMockResponse(validConnection));

      await dissociateConnection(mockInstance, validSource, payloadWithExtraFields);

      // Verify that extra fields are removed (onUndeclaredKey("delete"))
      const fetchCall = mockFetch.mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1].body);
      expect(requestBody).not.toHaveProperty('extraField');
      expect(requestBody).not.toHaveProperty('anotherExtra');
      expect(requestBody).toEqual({
        app: { handle: validUpsertPayload.app },
        object: { handle: validUpsertPayload.object },
        id: validUpsertPayload.id,
      });
    });

    test('should handle HTTP errors during dissociation', async () => {
      const errorResponse = MockHelpers.createApiErrorResponse(
        'not_found',
        'Connection not found',
        404
      );
      mockFetch.mockResolvedValueOnce(errorResponse);

      await expect(
        dissociateConnection(mockInstance, validSource, validUpsertPayload)
      ).rejects.toThrow(HttpError);
    });

    test('should handle forbidden errors (insufficient permissions)', async () => {
      const errorResponse = MockHelpers.createApiErrorResponse(
        'forbidden',
        'Insufficient permissions',
        403
      );
      mockFetch.mockResolvedValueOnce(errorResponse);

      await expect(
        dissociateConnection(mockInstance, validSource, validUpsertPayload)
      ).rejects.toThrow(HttpError);
    });

    test('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(MockHelpers.createNetworkError());

      await expect(
        dissociateConnection(mockInstance, validSource, validUpsertPayload)
      ).rejects.toThrow(HttpError);
    });
  });

  describe('Integration tests', () => {
    let connectionResources: ConnectionResources;

    beforeEach(() => {
      connectionResources = new ConnectionResources(mockInstance);
    });

    test('should handle complete workflow: list, associate, list, dissociate', async () => {
      // Initial list (empty)
      const emptyResponse = MockHelpers.createPaginatedResponse([]);
      mockFetch.mockResolvedValueOnce(MockHelpers.createMockResponse(emptyResponse));

      let result = await connectionResources.listItemsBySource(validSource);
      expect(result.items).toHaveLength(0);

      // Associate connection
      mockFetch.mockResolvedValueOnce(MockHelpers.createMockResponse(validConnection));

      const associatedConnection = await connectionResources.associateItem(validSource, validUpsertPayload);
      expect(associatedConnection).toEqual(expect.objectContaining({
        app: validConnection.app,
        object: validConnection.object,
        id: validConnection.id,
      }));

      // List again (should have one item)
      const responseWithItem = MockHelpers.createPaginatedResponse([validConnection]);
      mockFetch.mockResolvedValueOnce(MockHelpers.createMockResponse(responseWithItem));

      result = await connectionResources.listItemsBySource(validSource);
      expect(result.items).toHaveLength(1);

      // Dissociate connection
      mockFetch.mockResolvedValueOnce(MockHelpers.createMockResponse(validConnection));

      const dissociatedConnection = await connectionResources.dissociateItem(validSource, validUpsertPayload);
      expect(dissociatedConnection).toEqual(expect.objectContaining({
        app: validConnection.app,
        object: validConnection.object,
        id: validConnection.id,
      }));
    });

    test('should handle different source entities correctly', async () => {
      const differentSources = [
        { app: 'app1', object: 'object1', id: 'id1' },
        { app: 'app2', object: 'object2', id: 'id2' },
        { app: 'complex-app-name', object: 'complex-object-name', id: 'uuid-123e4567-e89b-12d3-a456-426614174000' },
      ];

      for (const source of differentSources) {
        mockFetch.mockResolvedValueOnce(MockHelpers.createMockResponse(MockHelpers.createPaginatedResponse([])));

        await connectionResources.listItemsBySource(source);

        const expectedPath = `/v1/connections/${source.app}/${source.object}/${source.id}`;
        expect(mockFetch).toHaveBeenCalledWith(
          new URL(expectedPath, mockInstance.config.host),
          expect.any(Object)
        );

        vi.clearAllMocks();
      }
    });

    test('should handle authorization consistently across all operations', async () => {
      const operations = [
        () => connectionResources.listItemsBySource(validSource),
        () => connectionResources.associateItem(validSource, validUpsertPayload),
        () => connectionResources.dissociateItem(validSource, validUpsertPayload),
      ];

      for (const operation of operations) {
        if (operation.toString().includes('listItemsBySource')) {
          mockFetch.mockResolvedValueOnce(MockHelpers.createMockResponse(MockHelpers.createPaginatedResponse([])));
        } else {
          mockFetch.mockResolvedValueOnce(MockHelpers.createMockResponse(validConnection));
        }

        await operation();

        expect(mockAuthorization).toHaveBeenCalled();
        vi.clearAllMocks();
      }
    });
  });

  describe('Error handling edge cases', () => {
    test('should handle malformed API responses', async () => {
      mockFetch.mockResolvedValueOnce(MockHelpers.createMockResponseWithJsonError(200));

      await expect(
        listConnectionsBySource(mockInstance, validSource)
      ).rejects.toThrow();
    });

    test('should handle server errors (5xx)', async () => {
      const serverErrorResponse = MockHelpers.createApiErrorResponse(
        'internal_error',
        'Internal server error',
        500
      );
      mockFetch.mockResolvedValueOnce(serverErrorResponse);

      await expect(
        associateConnection(mockInstance, validSource, validUpsertPayload)
      ).rejects.toThrow(HttpError);
    });

    test('should handle timeout errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Request timeout'));

      await expect(
        dissociateConnection(mockInstance, validSource, validUpsertPayload)
      ).rejects.toThrow(HttpError);
    });
  });
});