import { type } from 'arktype';
import { describe, expect, test } from 'vitest';
import * as ObjectsModule from './index.js';
import {
  AppObjectHandleSchema,
  AppObjectPayloadSchema,
  AppObjectSchema,
  AppObjectUrlSchema,
  AppObjectUrlStringSchema,
  InsertAppObjectPayloadSchema,
  UpdateAppObjectPayloadSchema,
  type AppObject,
  type AppObjectHandle,
  type AppObjectPayload,
  type InsertAppObjectPayload,
  type UpdateAppObjectPayload,
} from './schema.js';

describe('Objects Index Module', () => {
  describe('Schema exports', () => {
    test('should export all schema functions', () => {
      expect(ObjectsModule.AppObjectSchema).toBeDefined();
      expect(ObjectsModule.AppObjectPayloadSchema).toBeDefined();
      expect(ObjectsModule.InsertAppObjectPayloadSchema).toBeDefined();
      expect(ObjectsModule.UpdateAppObjectPayloadSchema).toBeDefined();
      expect(ObjectsModule.AppObjectUrlSchema).toBeDefined();
      expect(ObjectsModule.AppObjectUrlStringSchema).toBeDefined();
      expect(ObjectsModule.AppObjectHandleSchema).toBeDefined();

      // Verify they are the same functions as imported directly
      expect(ObjectsModule.AppObjectSchema).toBe(AppObjectSchema);
      expect(ObjectsModule.AppObjectPayloadSchema).toBe(AppObjectPayloadSchema);
      expect(ObjectsModule.InsertAppObjectPayloadSchema).toBe(InsertAppObjectPayloadSchema);
      expect(ObjectsModule.UpdateAppObjectPayloadSchema).toBe(UpdateAppObjectPayloadSchema);
      expect(ObjectsModule.AppObjectUrlSchema).toBe(AppObjectUrlSchema);
      expect(ObjectsModule.AppObjectUrlStringSchema).toBe(AppObjectUrlStringSchema);
      expect(ObjectsModule.AppObjectHandleSchema).toBe(AppObjectHandleSchema);
    });

    test('should export schema functions as callable functions', () => {
      expect(typeof ObjectsModule.AppObjectSchema).toBe('function');
      expect(typeof ObjectsModule.AppObjectPayloadSchema).toBe('function');
      expect(typeof ObjectsModule.InsertAppObjectPayloadSchema).toBe('function');
      expect(typeof ObjectsModule.UpdateAppObjectPayloadSchema).toBe('function');
      expect(typeof ObjectsModule.AppObjectUrlSchema).toBe('function');
      expect(typeof ObjectsModule.AppObjectUrlStringSchema).toBe('function');
      expect(typeof ObjectsModule.AppObjectHandleSchema).toBe('function');
    });
  });

  describe('Type exports', () => {
    test('should have proper TypeScript type exports available', () => {
      // This test verifies that the types are properly exported and can be used
      // TypeScript compilation will fail if these types are not available

      const appObject: AppObject = {
        handle: 'test-object',
        name: 'Test Object',
        app: { handle: 'test-app', name: 'Test App' },
        url: new URL('https://example.com/object/{{id}}'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const appObjectPayload: AppObjectPayload = {
        handle: 'test-object',
        name: 'Test Object',
        app: { handle: 'test-app', name: 'Test App' },
        url: 'https://example.com/object/{{id}}',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
      };

      const insertPayload: InsertAppObjectPayload = {
        handle: 'new-object',
        name: 'New Object',
        url: 'https://example.com/new-object/{{id}}',
      };

      const updatePayload: UpdateAppObjectPayload = {
        name: 'Updated Object',
        url: 'https://example.com/updated-object/{{id}}',
      };

      const handle: AppObjectHandle = 'test-handle';

      // Verify the objects have the expected structure
      expect(appObject.handle).toBe('test-object');
      expect(appObjectPayload.handle).toBe('test-object');
      expect(insertPayload.handle).toBe('new-object');
      expect(updatePayload.name).toBe('Updated Object');
      expect(handle).toBe('test-handle');
    });
  });

  describe('Module structure', () => {
    test('should export all expected members', () => {
      const expectedExports = [
        'AppObjectSchema',
        'AppObjectPayloadSchema',
        'InsertAppObjectPayloadSchema',
        'UpdateAppObjectPayloadSchema',
        'AppObjectUrlSchema',
        'AppObjectUrlStringSchema',
        'AppObjectHandleSchema',
        'NullableAppObjectUrlStringSchema',
        'AppObjectReferenceSchema',
      ];

      for (const exportName of expectedExports) {
        expect(ObjectsModule).toHaveProperty(exportName);
        expect(ObjectsModule[exportName as keyof typeof ObjectsModule]).toBeDefined();
      }
    });

    test('should not export unexpected members', () => {
      // Get all enumerable properties of the module
      const actualExports = Object.keys(ObjectsModule);

      const expectedExports = [
        'AppObjectSchema',
        'AppObjectPayloadSchema',
        'InsertAppObjectPayloadSchema',
        'UpdateAppObjectPayloadSchema',
        'AppObjectUrlSchema',
        'AppObjectUrlStringSchema',
        'AppObjectHandleSchema',
        'NullableAppObjectUrlStringSchema',
        'AppObjectReferenceSchema',
      ];

      // Check that we don't have unexpected exports
      const unexpectedExports = actualExports.filter(
        exportName => !expectedExports.includes(exportName)
      );

      expect(unexpectedExports).toEqual([]);
    });

    test('should have consistent export count', () => {
      const actualExportCount = Object.keys(ObjectsModule).length;
      const expectedExportCount = 9; // Based on the schema exports

      expect(actualExportCount).toBe(expectedExportCount);
    });
  });

  describe('Functional verification', () => {
    test('should be able to use exported schemas for validation', () => {
      const testData = {
        handle: 'functional-test',
        name: 'Functional Test Object',
        app: { handle: 'test-app', name: 'Test App' },
        url: 'https://example.com/test-object/{{id}}',
        createdAt: new Date('2024-01-01T00:00:00.000Z').toISOString(),
        updatedAt: new Date('2024-01-02T00:00:00.000Z').toISOString(),
      };

      // Test that we can use the exported schemas
      const appObjectResult = ObjectsModule.AppObjectSchema(testData);
      const payloadResult = ObjectsModule.AppObjectPayloadSchema(testData);
      const handleResult = ObjectsModule.AppObjectHandleSchema(testData.handle);

      // Verify results are valid (not error objects)
      expect(appObjectResult).not.toBeInstanceOf(Error);
      expect(payloadResult).not.toBeInstanceOf(Error);
      expect(handleResult).not.toBeInstanceOf(Error);

      // Verify the schemas work as expected
      expect(handleResult).toBe(testData.handle);
    });

    test('should maintain schema behavior through module exports', () => {
      const validInsertData = {
        handle: 'insert-test',
        name: 'Insert Test Object',
      };

      const validUpdateData = {
        name: 'Updated Test Object',
      };

      // Test insert schema
      const insertResult = ObjectsModule.InsertAppObjectPayloadSchema(validInsertData);
      expect(insertResult).not.toBeInstanceOf(Error);

      // Test update schema  
      const updateResult = ObjectsModule.UpdateAppObjectPayloadSchema(validUpdateData);
      expect(updateResult).not.toBeInstanceOf(Error);

      // Test URL schemas
      const urlResult = ObjectsModule.AppObjectUrlSchema('https://example.com/test/{{id}}');
      expect(urlResult).not.toBeInstanceOf(Error);

      const urlStringResult = ObjectsModule.AppObjectUrlStringSchema('https://example.com/test/{{id}}');
      expect(urlStringResult).not.toBeInstanceOf(Error);
    });
  });

  describe('Re-export integrity', () => {
    test('should maintain reference equality with direct imports', () => {
      // Verify that the re-exported functions are the exact same references
      // This ensures no wrapping or modification occurred during re-export
      expect(ObjectsModule.AppObjectSchema === AppObjectSchema).toBe(true);
      expect(ObjectsModule.AppObjectPayloadSchema === AppObjectPayloadSchema).toBe(true);
      expect(ObjectsModule.InsertAppObjectPayloadSchema === InsertAppObjectPayloadSchema).toBe(true);
      expect(ObjectsModule.UpdateAppObjectPayloadSchema === UpdateAppObjectPayloadSchema).toBe(true);
      expect(ObjectsModule.AppObjectUrlSchema === AppObjectUrlSchema).toBe(true);
      expect(ObjectsModule.AppObjectUrlStringSchema === AppObjectUrlStringSchema).toBe(true);
      expect(ObjectsModule.AppObjectHandleSchema === AppObjectHandleSchema).toBe(true);
    });

    test('should preserve function properties and metadata', () => {
      // Verify that functions maintain their callable nature
      expect(typeof ObjectsModule.AppObjectSchema).toBe('function');
      expect(typeof ObjectsModule.AppObjectPayloadSchema).toBe('function');
      expect(typeof ObjectsModule.InsertAppObjectPayloadSchema).toBe('function');
      expect(typeof ObjectsModule.UpdateAppObjectPayloadSchema).toBe('function');

      // Verify functions are the same references
      expect(ObjectsModule.AppObjectSchema).toBe(AppObjectSchema);
      expect(ObjectsModule.AppObjectPayloadSchema).toBe(AppObjectPayloadSchema);
      expect(ObjectsModule.InsertAppObjectPayloadSchema).toBe(InsertAppObjectPayloadSchema);
      expect(ObjectsModule.UpdateAppObjectPayloadSchema).toBe(UpdateAppObjectPayloadSchema);
    });
  });

  describe('URL handling through module exports', () => {
    test('should handle URL transformations correctly through exports', () => {
      const testUrl = 'https://example.com/object/{{id}}';
      const testUrlObject = new URL(testUrl);

      // Test URL to URL object conversion
      const urlResult = ObjectsModule.AppObjectUrlSchema(testUrl);
      expect(urlResult).not.toBeInstanceOf(Error);
      expect(urlResult).toBeInstanceOf(URL);

      // Test URL object to string conversion
      const urlStringResult = ObjectsModule.AppObjectUrlStringSchema(testUrlObject);
      expect(urlStringResult).not.toBeInstanceOf(Error);
      expect(typeof urlStringResult).toBe('string');

      // Test URL normalization with tokens
      const encodedUrl = 'https://example.com/object/%7B%7Bid%7D%7D';
      const normalizedResult = ObjectsModule.AppObjectUrlStringSchema(encodedUrl);
      expect(normalizedResult).not.toBeInstanceOf(Error);
      expect(normalizedResult).toBe(testUrl);
    });

    test('should handle undefined URLs correctly through exports', () => {
      const urlResult = ObjectsModule.AppObjectUrlSchema(undefined);
      expect(urlResult).not.toBeInstanceOf(Error);
      expect(urlResult).toBeUndefined();

      const urlStringResult = ObjectsModule.AppObjectUrlStringSchema(undefined);
      expect(urlStringResult).not.toBeInstanceOf(Error);
      expect(urlStringResult).toBeUndefined();
    });
  });

  describe('App handle reference validation through exports', () => {
    test('should validate app handle references correctly through exports', () => {
      const validAppObjectData = {
        handle: 'test-object',
        name: 'Test Object',
        app: { handle: 'valid-app-handle', name: 'Valid App Handle' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const result = ObjectsModule.AppObjectSchema(validAppObjectData);
      expect(result).not.toBeInstanceOf(Error);

      const invalidAppObjectData = {
        handle: 'test-object',
        name: 'Test Object',
        app: { handle: 'Invalid App Handle!', name: 'Invalid App Handle' }, // Invalid app handle format
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const invalidResult = ObjectsModule.AppObjectSchema(invalidAppObjectData);
      expect(invalidResult).toBeInstanceOf(type.errors);
    });
  });

  describe('Integration with test utilities', () => {
    test('should work with test data factories', () => {
      // This test ensures the module exports work with the test utilities
      const testObjectData = {
        handle: 'integration-test',
        name: 'Integration Test Object',
        app: { handle: 'test-app', name: 'Test App' },
        url: 'https://example.com/integration/{{id}}',
        createdAt: new Date('2024-01-01T00:00:00.000Z').toISOString(),
        updatedAt: new Date('2024-01-02T00:00:00.000Z').toISOString(),
      };

      // Test all major schemas work with realistic data
      const schemas = [
        ObjectsModule.AppObjectSchema,
        ObjectsModule.AppObjectPayloadSchema,
      ];

      for (const schema of schemas) {
        const result = schema(testObjectData);
        expect(result).not.toBeInstanceOf(Error);
      }

      // Test partial schemas work
      const insertData = {
        handle: 'insert-integration',
        name: 'Insert Integration Test',
        url: 'https://example.com/insert/{{id}}',
      };

      const insertResult = ObjectsModule.InsertAppObjectPayloadSchema(insertData);
      expect(insertResult).not.toBeInstanceOf(Error);

      const updateData = {
        name: 'Updated Integration Test',
      };

      const updateResult = ObjectsModule.UpdateAppObjectPayloadSchema(updateData);
      expect(updateResult).not.toBeInstanceOf(Error);
    });
  });
});