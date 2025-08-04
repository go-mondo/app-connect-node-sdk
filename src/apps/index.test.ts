import { describe, expect, test } from 'vitest';
import * as AppsModule from './index.js';
import {
  AppAvatarUrlSchema,
  AppAvatarUrlStringSchema,
  AppHandleSchema,
  AppPayloadSchema,
  AppSchema,
  InsertAppPayloadSchema,
  UpdateAppPayloadSchema,
  type App,
  type AppHandle,
  type AppPayload,
  type InsertAppPayload,
  type UpdateAppPayload,
} from './schema.js';

describe('Apps Index Module', () => {
  describe('Schema exports', () => {
    test('should export all schema functions', () => {
      expect(AppsModule.AppSchema).toBeDefined();
      expect(AppsModule.AppPayloadSchema).toBeDefined();
      expect(AppsModule.InsertAppPayloadSchema).toBeDefined();
      expect(AppsModule.UpdateAppPayloadSchema).toBeDefined();
      expect(AppsModule.AppAvatarUrlSchema).toBeDefined();
      expect(AppsModule.AppAvatarUrlStringSchema).toBeDefined();
      expect(AppsModule.AppHandleSchema).toBeDefined();
      
      // Verify they are the same functions as imported directly
      expect(AppsModule.AppSchema).toBe(AppSchema);
      expect(AppsModule.AppPayloadSchema).toBe(AppPayloadSchema);
      expect(AppsModule.InsertAppPayloadSchema).toBe(InsertAppPayloadSchema);
      expect(AppsModule.UpdateAppPayloadSchema).toBe(UpdateAppPayloadSchema);
      expect(AppsModule.AppAvatarUrlSchema).toBe(AppAvatarUrlSchema);
      expect(AppsModule.AppAvatarUrlStringSchema).toBe(AppAvatarUrlStringSchema);
      expect(AppsModule.AppHandleSchema).toBe(AppHandleSchema);
    });

    test('should export schema functions as callable functions', () => {
      expect(typeof AppsModule.AppSchema).toBe('function');
      expect(typeof AppsModule.AppPayloadSchema).toBe('function');
      expect(typeof AppsModule.InsertAppPayloadSchema).toBe('function');
      expect(typeof AppsModule.UpdateAppPayloadSchema).toBe('function');
      expect(typeof AppsModule.AppAvatarUrlSchema).toBe('function');
      expect(typeof AppsModule.AppAvatarUrlStringSchema).toBe('function');
      expect(typeof AppsModule.AppHandleSchema).toBe('function');
    });
  });

  describe('Type exports', () => {
    test('should have proper TypeScript type exports available', () => {
      // This test verifies that the types are properly exported and can be used
      // TypeScript compilation will fail if these types are not available
      
      const app: App = {
        handle: 'test-app',
        name: 'Test App',
        avatar: new URL('https://example.com/avatar.png'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const appPayload: AppPayload = {
        handle: 'test-app',
        name: 'Test App',
        avatar: 'https://example.com/avatar.png',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
      };
      
      const insertPayload: InsertAppPayload = {
        handle: 'new-app',
        name: 'New App',
        avatar: 'https://example.com/new-avatar.png',
      };
      
      const updatePayload: UpdateAppPayload = {
        name: 'Updated App',
        avatar: 'https://example.com/updated-avatar.png',
      };
      
      const handle: AppHandle = 'test-handle';
      
      // Verify the objects have the expected structure
      expect(app.handle).toBe('test-app');
      expect(appPayload.handle).toBe('test-app');
      expect(insertPayload.handle).toBe('new-app');
      expect(updatePayload.name).toBe('Updated App');
      expect(handle).toBe('test-handle');
    });
  });

  describe('Module structure', () => {
    test('should export all expected members', () => {
      const expectedExports = [
        'AppSchema',
        'AppPayloadSchema', 
        'InsertAppPayloadSchema',
        'UpdateAppPayloadSchema',
        'AppAvatarUrlSchema',
        'AppAvatarUrlStringSchema',
        'AppHandleSchema',
        'NullableAppAvatarUrlStringSchema',
        'AppReferenceSchema',
      ];
      
      for (const exportName of expectedExports) {
        expect(AppsModule).toHaveProperty(exportName);
        expect(AppsModule[exportName as keyof typeof AppsModule]).toBeDefined();
      }
    });

    test('should not export unexpected members', () => {
      // Get all enumerable properties of the module
      const actualExports = Object.keys(AppsModule);
      
      const expectedExports = [
        'AppSchema',
        'AppPayloadSchema',
        'InsertAppPayloadSchema', 
        'UpdateAppPayloadSchema',
        'AppAvatarUrlSchema',
        'AppAvatarUrlStringSchema',
        'AppHandleSchema',
        'NullableAppAvatarUrlStringSchema',
        'AppReferenceSchema',
      ];
      
      // Check that we don't have unexpected exports
      const unexpectedExports = actualExports.filter(
        exportName => !expectedExports.includes(exportName)
      );
      
      expect(unexpectedExports).toEqual([]);
    });

    test('should have consistent export count', () => {
      const actualExportCount = Object.keys(AppsModule).length;
      const expectedExportCount = 9; // Based on the schema exports
      
      expect(actualExportCount).toBe(expectedExportCount);
    });
  });

  describe('Functional verification', () => {
    test('should be able to use exported schemas for validation', () => {
      const testData = {
        handle: 'functional-test',
        name: 'Functional Test App',
        avatar: 'https://example.com/test-avatar.png',
        createdAt: new Date('2024-01-01T00:00:00.000Z').toISOString(),
        updatedAt: new Date('2024-01-02T00:00:00.000Z').toISOString(),
      };
      
      // Test that we can use the exported schemas
      const appResult = AppsModule.AppSchema(testData);
      const payloadResult = AppsModule.AppPayloadSchema(testData);
      const handleResult = AppsModule.AppHandleSchema(testData.handle);
      
      // Verify results are valid (not error objects)
      expect(appResult).not.toBeInstanceOf(Error);
      expect(payloadResult).not.toBeInstanceOf(Error);
      expect(handleResult).not.toBeInstanceOf(Error);
      
      // Verify the schemas work as expected
      expect(handleResult).toBe(testData.handle);
    });

    test('should maintain schema behavior through module exports', () => {
      const validInsertData = {
        handle: 'insert-test',
        name: 'Insert Test App',
      };
      
      const validUpdateData = {
        name: 'Updated Test App',
      };
      
      // Test insert schema
      const insertResult = AppsModule.InsertAppPayloadSchema(validInsertData);
      expect(insertResult).not.toBeInstanceOf(Error);
      
      // Test update schema  
      const updateResult = AppsModule.UpdateAppPayloadSchema(validUpdateData);
      expect(updateResult).not.toBeInstanceOf(Error);
      
      // Test URL schemas
      const urlResult = AppsModule.AppAvatarUrlSchema('https://example.com/test.png');
      expect(urlResult).not.toBeInstanceOf(Error);
      
      const urlStringResult = AppsModule.AppAvatarUrlStringSchema('https://example.com/test.png');
      expect(urlStringResult).not.toBeInstanceOf(Error);
    });
  });

  describe('Re-export integrity', () => {
    test('should maintain reference equality with direct imports', () => {
      // Verify that the re-exported functions are the exact same references
      // This ensures no wrapping or modification occurred during re-export
      expect(AppsModule.AppSchema === AppSchema).toBe(true);
      expect(AppsModule.AppPayloadSchema === AppPayloadSchema).toBe(true);
      expect(AppsModule.InsertAppPayloadSchema === InsertAppPayloadSchema).toBe(true);
      expect(AppsModule.UpdateAppPayloadSchema === UpdateAppPayloadSchema).toBe(true);
      expect(AppsModule.AppAvatarUrlSchema === AppAvatarUrlSchema).toBe(true);
      expect(AppsModule.AppAvatarUrlStringSchema === AppAvatarUrlStringSchema).toBe(true);
      expect(AppsModule.AppHandleSchema === AppHandleSchema).toBe(true);
    });

    test('should preserve function properties and metadata', () => {
      // Verify that functions maintain their callable nature
      expect(typeof AppsModule.AppSchema).toBe('function');
      expect(typeof AppsModule.AppPayloadSchema).toBe('function');
      expect(typeof AppsModule.InsertAppPayloadSchema).toBe('function');
      expect(typeof AppsModule.UpdateAppPayloadSchema).toBe('function');
      
      // Verify functions are the same references
      expect(AppsModule.AppSchema).toBe(AppSchema);
      expect(AppsModule.AppPayloadSchema).toBe(AppPayloadSchema);
      expect(AppsModule.InsertAppPayloadSchema).toBe(InsertAppPayloadSchema);
      expect(AppsModule.UpdateAppPayloadSchema).toBe(UpdateAppPayloadSchema);
    });
  });
});