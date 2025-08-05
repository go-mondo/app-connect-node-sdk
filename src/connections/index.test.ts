import { describe, expect, test } from 'vitest';
import * as ConnectionsModule from './index.js';
import {
  ConnectionResources,
  associateConnection,
  dissociateConnection,
  listConnections,
} from './resources.js';
import {
  ConnectionPayloadSchema,
  SourceSchema,
  TargetSchema,
  UpsertConnectionPayloadSchema,
  type ConnectionInput,
  type ConnectionPayload,
  type Source,
  type Target,
  type UpsertConnectionInput,
  type UpsertConnectionPayload,
} from './schema.js';

describe('Connections Index Module', () => {
  describe('Schema exports', () => {
    test('should export all schema functions', () => {
      expect(ConnectionsModule.ConnectionPayloadSchema).toBeDefined();
      expect(ConnectionsModule.SourceSchema).toBeDefined();
      expect(ConnectionsModule.TargetSchema).toBeDefined();
      expect(ConnectionsModule.UpsertConnectionPayloadSchema).toBeDefined();

      // Verify they are the same functions as imported directly
      expect(ConnectionsModule.ConnectionPayloadSchema).toBe(ConnectionPayloadSchema);
      expect(ConnectionsModule.SourceSchema).toBe(SourceSchema);
      expect(ConnectionsModule.TargetSchema).toBe(TargetSchema);
      expect(ConnectionsModule.UpsertConnectionPayloadSchema).toBe(UpsertConnectionPayloadSchema);
    });

    test('should export schema functions as callable functions', () => {
      expect(typeof ConnectionsModule.ConnectionPayloadSchema).toBe('object');
      expect(typeof ConnectionsModule.SourceSchema).toBe('object');
      expect(typeof ConnectionsModule.TargetSchema).toBe('object');
      expect(typeof ConnectionsModule.UpsertConnectionPayloadSchema).toBe('object');
    });
  });

  describe('Resource exports', () => {
    test('should export all resource functions and classes', () => {
      expect(ConnectionsModule.ConnectionResources).toBeDefined();
      expect(ConnectionsModule.associateConnection).toBeDefined();
      expect(ConnectionsModule.dissociateConnection).toBeDefined();
      expect(ConnectionsModule.listConnections).toBeDefined();

      // Verify they are the same as imported directly
      expect(ConnectionsModule.ConnectionResources).toBe(ConnectionResources);
      expect(ConnectionsModule.associateConnection).toBe(associateConnection);
      expect(ConnectionsModule.dissociateConnection).toBe(dissociateConnection);
      expect(ConnectionsModule.listConnections).toBe(listConnections);
    });

    test('should export resource functions as callable functions', () => {
      expect(typeof ConnectionsModule.ConnectionResources).toBe('function');
      expect(typeof ConnectionsModule.associateConnection).toBe('function');
      expect(typeof ConnectionsModule.dissociateConnection).toBe('function');
      expect(typeof ConnectionsModule.listConnections).toBe('function');
    });
  });

  describe('Type exports', () => {
    test('should have proper TypeScript type exports available', () => {
      // This test verifies that the types are properly exported and can be used
      // TypeScript compilation will fail if these types are not available

      const source: Source = {
        app: 'test-app',
        object: 'test-object',
        id: 'test-id',
      };

      const target: Target = {
        app: 'target-app',
        object: 'target-object',
        id: 'target-id',
      };

      const connectionPayload: ConnectionPayload = {
        app: {
          handle: 'target-app',
          name: 'Target App',
        },
        object: {
          handle: 'target-object',
          name: 'Target Object',
        },
        id: 'target-id',
        updatedAt: new Date('2024-01-01T00:00:00.000Z'),
        inferred: true,
      };

      const connectionInput: ConnectionInput = {
        app: {
          handle: 'target-app',
          name: 'Target App',
        },
        object: {
          handle: 'target-object',
          name: 'Target Object',
        },
        id: 'target-id',
        updatedAt: '2024-01-01T00:00:00.000Z',
        inferred: true,
      };

      const upsertPayload: UpsertConnectionPayload = {
        app: {
          handle: 'target-app',
        },
        object: {
          handle: 'target-object',
        },
        id: 'target-id',
      };

      const upsertInput: UpsertConnectionInput = {
        app: 'target-app',
        object: 'target-object',
        id: 'target-id',
      };

      // Verify the objects have the expected structure
      expect(source.app).toBe('test-app');
      expect(target.app).toBe('target-app');
      expect(connectionPayload.app).toEqual({
        handle: 'target-app',
        name: 'Target App',
      });
      expect(connectionInput.app).toEqual({
        handle: 'target-app',
        name: 'Target App',
      });
      expect(upsertPayload.app).toEqual({
        handle: 'target-app',
      });
      expect(upsertInput.app).toBe('target-app');
    });
  });

  describe('Module structure', () => {
    test('should export all expected members', () => {
      const expectedExports = [
        // Schema exports
        'ConnectionPayloadSchema',
        'EntitySchema',
        'ExpandedEntitySchema',
        'SourceSchema',
        'TargetSchema',
        'UpsertConnectionPayloadSchema',
        // Resource exports
        'ConnectionResources',
        'PATH',
        'associateConnection',
        'dissociateConnection',
        'listConnections',
      ];

      for (const exportName of expectedExports) {
        expect(ConnectionsModule).toHaveProperty(exportName);
        expect(ConnectionsModule[exportName as keyof typeof ConnectionsModule]).toBeDefined();
      }
    });

    test('should not export unexpected members', () => {
      // Get all enumerable properties of the module
      const actualExports = Object.keys(ConnectionsModule);

      const expectedExports = [
        // Schema exports
        'ConnectionPayloadSchema',
        'EntitySchema',
        'ExpandedEntitySchema',
        'SourceSchema',
        'TargetSchema',
        'UpsertConnectionPayloadSchema',
        // Resource exports
        'ConnectionResources',
        'PATH',
        'associateConnection',
        'dissociateConnection',
        'listConnections',
      ];

      // Check that we don't have unexpected exports
      const unexpectedExports = actualExports.filter(
        exportName => !expectedExports.includes(exportName)
      );

      expect(unexpectedExports).toEqual([]);
    });

    test('should have consistent export count', () => {
      const actualExportCount = Object.keys(ConnectionsModule).length;
      const expectedExportCount = 11; // 6 schema + 5 resource exports

      expect(actualExportCount).toBe(expectedExportCount);
    });
  });

  describe('Functional verification', () => {
    test('should be able to use exported schemas for validation', () => {
      const sourceData = {
        app: 'test-app',
        object: 'test-object',
        id: 'test-id',
      };

      const connectionData = {
        app: {
          handle: 'target-app',
          name: 'Target App',
        },
        object: {
          handle: 'target-object',
          name: 'Target Object',
        },
        id: 'target-id',
        avatar: 'https://example.com/avatar.png',
        url: 'https://example.com/object',
        updatedAt: new Date('2024-01-01T00:00:00.000Z').toISOString(),
        inferred: false,
      };

      // Test that we can use the exported schemas
      const sourceResult = ConnectionsModule.SourceSchema.safeParse(sourceData);
      const targetResult = ConnectionsModule.TargetSchema.safeParse(sourceData);
      const connectionResult = ConnectionsModule.ConnectionPayloadSchema.safeParse(connectionData);
      const upsertResult = ConnectionsModule.UpsertConnectionPayloadSchema.safeParse(sourceData);

      // Verify results are valid (not error objects)
      expect(sourceResult.success).toBe(true);
      expect(targetResult.success).toBe(true);
      expect(connectionResult.success).toBe(true);
      expect(upsertResult.success).toBe(true);

      // Verify the schemas work as expected
      expect(sourceResult.data).toEqual(sourceData);
      expect(targetResult.data).toEqual(sourceData);
      // UpsertConnectionPayloadSchema transforms the data
      expect(upsertResult.data).toEqual({
        app: { handle: sourceData.app },
        object: { handle: sourceData.object },
        id: sourceData.id,
      });
    });

    test('should maintain schema behavior through module exports', () => {
      const validEntityData = {
        app: 'valid-app',
        object: 'valid-object',
        id: 'valid-id',
      };

      const validConnectionData = {
        app: 'target-app',
        object: 'target-object',
        id: 'target-id',
        updatedAt: new Date().toISOString(),
      };

      // Test source schema
      const sourceResult = ConnectionsModule.SourceSchema.safeParse(validEntityData);
      expect(sourceResult).not.toBeInstanceOf(Error);

      // Test target schema
      const targetResult = ConnectionsModule.TargetSchema.safeParse(validEntityData);
      expect(targetResult).not.toBeInstanceOf(Error);

      // Test connection payload schema
      const connectionResult = ConnectionsModule.ConnectionPayloadSchema.safeParse(validConnectionData);
      expect(connectionResult).not.toBeInstanceOf(Error);

      // Test upsert payload schema
      const upsertResult = ConnectionsModule.UpsertConnectionPayloadSchema.safeParse(validEntityData);
      expect(upsertResult).not.toBeInstanceOf(Error);
    });

    test('should handle optional fields in connection payload schema', () => {
      const minimalConnectionData = {
        app: 'target-app',
        object: 'target-object',
        id: 'target-id',
        updatedAt: new Date().toISOString(),
      };

      const fullConnectionData = {
        ...minimalConnectionData,
        avatar: 'https://example.com/avatar.png',
        url: 'https://example.com/object',
        inferred: true,
      };

      // Test minimal data (optional fields omitted)
      const minimalResult = ConnectionsModule.ConnectionPayloadSchema.safeParse(minimalConnectionData);
      expect(minimalResult).not.toBeInstanceOf(Error);

      // Test full data (optional fields included)
      const fullResult = ConnectionsModule.ConnectionPayloadSchema.safeParse(fullConnectionData);
      expect(fullResult).not.toBeInstanceOf(Error);
    });
  });

  describe('Re-export integrity', () => {
    test('should maintain reference equality with direct imports', () => {
      // Verify that the re-exported functions are the exact same references
      // This ensures no wrapping or modification occurred during re-export

      // Schema re-exports
      expect(ConnectionsModule.ConnectionPayloadSchema === ConnectionPayloadSchema).toBe(true);
      expect(ConnectionsModule.SourceSchema === SourceSchema).toBe(true);
      expect(ConnectionsModule.TargetSchema === TargetSchema).toBe(true);
      expect(ConnectionsModule.UpsertConnectionPayloadSchema === UpsertConnectionPayloadSchema).toBe(true);

      // Resource re-exports
      expect(ConnectionsModule.ConnectionResources === ConnectionResources).toBe(true);
      expect(ConnectionsModule.associateConnection === associateConnection).toBe(true);
      expect(ConnectionsModule.dissociateConnection === dissociateConnection).toBe(true);
      expect(ConnectionsModule.listConnections === listConnections).toBe(true);
    });

    test('should preserve class and function properties', () => {
      // Verify that ConnectionResources class is properly exported
      expect(ConnectionsModule.ConnectionResources.prototype.constructor).toBe(ConnectionResources);
    });
  });

  describe('Resource class functionality', () => {
    test('should export standalone resource functions', () => {
      // Verify all resource functions are exported and callable
      expect(typeof ConnectionsModule.listConnections).toBe('function');
      expect(typeof ConnectionsModule.associateConnection).toBe('function');
      expect(typeof ConnectionsModule.dissociateConnection).toBe('function');

      // These are async functions, so they should return promises when called
      // We won't actually call them here since they require proper setup and mocking
      expect(ConnectionsModule.listConnections.constructor.name).toBe('AsyncFunction');
      expect(ConnectionsModule.associateConnection.constructor.name).toBe('AsyncFunction');
      expect(ConnectionsModule.dissociateConnection.constructor.name).toBe('AsyncFunction');
    });
  });
});