import { type } from 'arktype';
import { describe, expect, test } from 'vitest';
import * as ConfigurationsModule from './index.js';
import {
    ConfigurationIdentifiersSchema,
    ConfigurationPayloadSchema,
    ConfigurationSchema,
    ConfigurationStatus,
    JoinType,
    SourceSchema,
    TargetSchema,
    UpsertConfigurationPayloadSchema,
    type AnyConfigurationStatus,
    type AnyJoinType,
    type Configuration,
    type ConfigurationIdentifiersPayload,
    type ConfigurationPayload,
    type Source,
    type Target,
    type UpsertConfigurationPayload
} from './schema.js';

describe('Configurations Index Module', () => {
  describe('Schema exports', () => {
    test('should export all schema functions', () => {
      expect(ConfigurationsModule.ConfigurationSchema).toBeDefined();
      expect(ConfigurationsModule.ConfigurationPayloadSchema).toBeDefined();
      expect(ConfigurationsModule.UpsertConfigurationPayloadSchema).toBeDefined();
      expect(ConfigurationsModule.ConfigurationIdentifiersSchema).toBeDefined();
      expect(ConfigurationsModule.SourceSchema).toBeDefined();
      expect(ConfigurationsModule.TargetSchema).toBeDefined();
      
      // Verify they are the same functions as imported directly
      expect(ConfigurationsModule.ConfigurationSchema).toBe(ConfigurationSchema);
      expect(ConfigurationsModule.ConfigurationPayloadSchema).toBe(ConfigurationPayloadSchema);
      expect(ConfigurationsModule.UpsertConfigurationPayloadSchema).toBe(UpsertConfigurationPayloadSchema);
      expect(ConfigurationsModule.ConfigurationIdentifiersSchema).toBe(ConfigurationIdentifiersSchema);
      expect(ConfigurationsModule.SourceSchema).toBe(SourceSchema);
      expect(ConfigurationsModule.TargetSchema).toBe(TargetSchema);
    });

    test('should export schema functions as callable functions', () => {
      expect(typeof ConfigurationsModule.ConfigurationSchema).toBe('function');
      expect(typeof ConfigurationsModule.ConfigurationPayloadSchema).toBe('function');
      expect(typeof ConfigurationsModule.UpsertConfigurationPayloadSchema).toBe('function');
      expect(typeof ConfigurationsModule.ConfigurationIdentifiersSchema).toBe('function');
      expect(typeof ConfigurationsModule.SourceSchema).toBe('function');
      expect(typeof ConfigurationsModule.TargetSchema).toBe('function');
    });
  });

  describe('Enum exports', () => {
    test('should export JoinType enum', () => {
      expect(ConfigurationsModule.JoinType).toBeDefined();
      expect(ConfigurationsModule.JoinType).toBe(JoinType);
      expect(ConfigurationsModule.JoinType.ONE).toBe('one');
      expect(ConfigurationsModule.JoinType.MANY).toBe('many');
    });

    test('should export ConfigurationStatus enum', () => {
      expect(ConfigurationsModule.ConfigurationStatus).toBeDefined();
      expect(ConfigurationsModule.ConfigurationStatus).toBe(ConfigurationStatus);
      expect(ConfigurationsModule.ConfigurationStatus.ENABLED).toBe('enabled');
      expect(ConfigurationsModule.ConfigurationStatus.DISABLED).toBe('disabled');
    });

    test('should export enums as objects with correct properties', () => {
      expect(typeof ConfigurationsModule.JoinType).toBe('object');
      expect(typeof ConfigurationsModule.ConfigurationStatus).toBe('object');
      
      // Verify enum structure
      expect(Object.keys(ConfigurationsModule.JoinType)).toEqual(['ONE', 'MANY']);
      expect(Object.keys(ConfigurationsModule.ConfigurationStatus)).toEqual(['ENABLED', 'DISABLED']);
    });
  });

  describe('Type exports', () => {
    test('should have proper TypeScript type exports available', () => {
      // This test verifies that the types are properly exported and can be used
      // TypeScript compilation will fail if these types are not available
      
      const configuration: Configuration = {
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
        updatedAt: new Date(),
      };
      
      const configurationPayload: ConfigurationPayload = {
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
      };
      
      const upsertPayload = {
        source: {
          app: 'source-app',
          object: 'source-object',
          join: 'one' as const,
        },
        target: {
          app: 'target-app',
          object: 'target-object',
          join: 'many' as const,
        },
        status: 'disabled' as const,
      };
      
      const identifiers = {
        source: {
          app: 'source-app',
          object: 'source-object',
        },
        target: {
          app: 'target-app',
          object: 'target-object',
        },
      };
      
      const source: Source = {
        app: { handle: 'source-app', name: 'Source App' },
        object: { handle: 'source-object', name: 'Source Object' },
        join: 'one',
      };
      
      const target: Target = {
        app: { handle: 'target-app', name: 'Target App' },
        object: { handle: 'target-object', name: 'Target Object' },
        join: 'many',
      };
      
      const joinType: AnyJoinType = 'one';
      const status: AnyConfigurationStatus = 'enabled';
      
      // Verify the objects have the expected structure
      expect(configuration.source.app).toEqual({ handle: 'source-app', name: 'Source App' });
      expect(configurationPayload.target.join).toBe('many');
      expect(upsertPayload.status).toBe('disabled');
      expect(identifiers.source.object).toBe('source-object');
      expect(source.join).toBe('one');
      expect(target.join).toBe('many');
      expect(joinType).toBe('one');
      expect(status).toBe('enabled');
    });
  });

  describe('Module structure', () => {
    test('should export all expected members', () => {
      const expectedExports = [
        'ConfigurationSchema',
        'ConfigurationPayloadSchema',
        'UpsertConfigurationPayloadSchema',
        'ConfigurationIdentifiersSchema',
        'SourceSchema',
        'TargetSchema',
        'JoinType',
        'ConfigurationStatus',
      ];
      
      for (const exportName of expectedExports) {
        expect(ConfigurationsModule).toHaveProperty(exportName);
        expect(ConfigurationsModule[exportName as keyof typeof ConfigurationsModule]).toBeDefined();
      }
    });

    test('should not export unexpected members', () => {
      // Get all enumerable properties of the module
      const actualExports = Object.keys(ConfigurationsModule);
      
      const expectedExports = [
        'ConfigurationSchema',
        'ConfigurationPayloadSchema',
        'UpsertConfigurationPayloadSchema',
        'ConfigurationIdentifiersSchema',
        'SourceSchema',
        'TargetSchema',
        'JoinType',
        'ConfigurationStatus',
      ];
      
      // Check that we don't have unexpected exports
      const unexpectedExports = actualExports.filter(
        exportName => !expectedExports.includes(exportName)
      );
      
      expect(unexpectedExports).toEqual([]);
    });

    test('should have consistent export count', () => {
      const actualExportCount = Object.keys(ConfigurationsModule).length;
      const expectedExportCount = 8; // Based on the schema and enum exports
      
      expect(actualExportCount).toBe(expectedExportCount);
    });
  });

  describe('Functional verification', () => {
    test('should be able to use exported schemas for validation', () => {
      const testConfiguration = {
        source: {
          app: { handle: 'functional-test-source', name: 'Functional Test Source' },
          object: { handle: 'functional-test-source-object', name: 'Functional Test Source Object' },
          join: ConfigurationsModule.JoinType.ONE,
        },
        target: {
          app: { handle: 'functional-test-target', name: 'Functional Test Target' },
          object: { handle: 'functional-test-target-object', name: 'Functional Test Target Object' },
          join: ConfigurationsModule.JoinType.MANY,
        },
        status: ConfigurationsModule.ConfigurationStatus.ENABLED,
        updatedAt: new Date('2024-01-01T00:00:00.000Z').toISOString(),
      };
      
      // Test that we can use the exported schemas
      const configResult = ConfigurationsModule.ConfigurationSchema(testConfiguration);
      const payloadResult = ConfigurationsModule.ConfigurationPayloadSchema(testConfiguration);
      const sourceResult = ConfigurationsModule.SourceSchema(testConfiguration.source);
      const targetResult = ConfigurationsModule.TargetSchema(testConfiguration.target);
      
      // Verify results are valid (not error objects)
      expect(configResult).not.toBeInstanceOf(type.errors);
      expect(payloadResult).not.toBeInstanceOf(type.errors);
      expect(sourceResult).not.toBeInstanceOf(type.errors);
      expect(targetResult).not.toBeInstanceOf(type.errors);
    });

    test('should maintain schema behavior through module exports', () => {
      const validUpsertData = {
        source: {
          app: 'upsert-test-source',
          object: 'upsert-test-source-object',
          join: ConfigurationsModule.JoinType.ONE,
        },
        target: {
          app: 'upsert-test-target',
          object: 'upsert-test-target-object',
          join: ConfigurationsModule.JoinType.MANY,
        },
        status: ConfigurationsModule.ConfigurationStatus.DISABLED,
      };
      
      const validIdentifiersData = {
        source: {
          app: 'identifiers-test-source',
          object: 'identifiers-test-source-object',
        },
        target: {
          app: 'identifiers-test-target',
          object: 'identifiers-test-target-object',
        },
      };
      
      // Test upsert schema
      const upsertResult = ConfigurationsModule.UpsertConfigurationPayloadSchema(validUpsertData);
      expect(upsertResult).not.toBeInstanceOf(type.errors);
      
      // Test identifiers schema
      const identifiersResult = ConfigurationsModule.ConfigurationIdentifiersSchema(validIdentifiersData);
      expect(identifiersResult).not.toBeInstanceOf(type.errors);
    });

    test('should work with enum values from module exports', () => {
      const configurationWithModuleEnums = {
        source: {
          app: { handle: 'enum-test-source', name: 'Enum Test Source' },
          object: { handle: 'enum-test-source-object', name: 'Enum Test Source Object' },
          join: ConfigurationsModule.JoinType.MANY,
        },
        target: {
          app: { handle: 'enum-test-target', name: 'Enum Test Target' },
          object: { handle: 'enum-test-target-object', name: 'Enum Test Target Object' },
          join: ConfigurationsModule.JoinType.ONE,
        },
        status: ConfigurationsModule.ConfigurationStatus.DISABLED,
        updatedAt: new Date().toISOString(),
      };
      
      const result = ConfigurationsModule.ConfigurationSchema(configurationWithModuleEnums);
      expect(result).not.toBeInstanceOf(type.errors);
    });
  });

  describe('Re-export integrity', () => {
    test('should maintain reference equality with direct imports', () => {
      // Verify that the re-exported functions are the exact same references
      // This ensures no wrapping or modification occurred during re-export
      expect(ConfigurationsModule.ConfigurationSchema === ConfigurationSchema).toBe(true);
      expect(ConfigurationsModule.ConfigurationPayloadSchema === ConfigurationPayloadSchema).toBe(true);
      expect(ConfigurationsModule.UpsertConfigurationPayloadSchema === UpsertConfigurationPayloadSchema).toBe(true);
      expect(ConfigurationsModule.ConfigurationIdentifiersSchema === ConfigurationIdentifiersSchema).toBe(true);
      expect(ConfigurationsModule.SourceSchema === SourceSchema).toBe(true);
      expect(ConfigurationsModule.TargetSchema === TargetSchema).toBe(true);
      expect(ConfigurationsModule.JoinType === JoinType).toBe(true);
      expect(ConfigurationsModule.ConfigurationStatus === ConfigurationStatus).toBe(true);
    });

    test('should preserve enum object properties', () => {
      // Verify that enum objects maintain their structure
      expect(ConfigurationsModule.JoinType.ONE).toBe(JoinType.ONE);
      expect(ConfigurationsModule.JoinType.MANY).toBe(JoinType.MANY);
      expect(ConfigurationsModule.ConfigurationStatus.ENABLED).toBe(ConfigurationStatus.ENABLED);
      expect(ConfigurationsModule.ConfigurationStatus.DISABLED).toBe(ConfigurationStatus.DISABLED);
    });
  });

  describe('Default value behavior', () => {
    test('should apply default values through exported schemas', () => {
      const minimalConfiguration = {
        source: {
          app: { handle: 'default-test-source', name: 'Default Test Source' },
          object: { handle: 'default-test-source-object', name: 'Default Test Source Object' },
        },
        target: {
          app: { handle: 'default-test-target', name: 'Default Test Target' },
          object: { handle: 'default-test-target-object', name: 'Default Test Target Object' },
        },
        updatedAt: new Date().toISOString(),
      };
      
      const result = ConfigurationsModule.ConfigurationSchema(minimalConfiguration);
      expect(result).not.toBeInstanceOf(type.errors);
      
      if (result instanceof type.errors) return;
      
      // Verify default values are applied
      expect(result.source.join).toBe(ConfigurationsModule.JoinType.ONE);
      expect(result.target.join).toBe(ConfigurationsModule.JoinType.ONE);
      expect(result.status).toBe(ConfigurationsModule.ConfigurationStatus.ENABLED);
    });

    test('should respect explicit values over defaults through exported schemas', () => {
      const explicitConfiguration = {
        source: {
          app: { handle: 'explicit-test-source', name: 'Explicit Test Source' },
          object: { handle: 'explicit-test-source-object', name: 'Explicit Test Source Object' },
          join: ConfigurationsModule.JoinType.MANY,
        },
        target: {
          app: { handle: 'explicit-test-target', name: 'Explicit Test Target' },
          object: { handle: 'explicit-test-target-object', name: 'Explicit Test Target Object' },
          join: ConfigurationsModule.JoinType.MANY,
        },
        status: ConfigurationsModule.ConfigurationStatus.DISABLED,
        updatedAt: new Date().toISOString(),
      };
      
      const result = ConfigurationsModule.ConfigurationSchema(explicitConfiguration);
      expect(result).not.toBeInstanceOf(type.errors);
      
      if (result instanceof type.errors) return;
      
      // Verify explicit values are preserved
      expect(result.source.join).toBe(ConfigurationsModule.JoinType.MANY);
      expect(result.target.join).toBe(ConfigurationsModule.JoinType.MANY);
      expect(result.status).toBe(ConfigurationsModule.ConfigurationStatus.DISABLED);
    });
  });

  describe('Error handling through exports', () => {
    test('should properly handle validation errors through exported schemas', () => {
      const invalidConfiguration = {
        source: {
          app: { handle: 'Invalid App!', name: 'Invalid App' }, // Invalid handle format
          object: { handle: 'invalid-source-object', name: 'Invalid Source Object' },
          join: ConfigurationsModule.JoinType.ONE,
        },
        target: {
          app: { handle: 'invalid-target-app', name: 'Invalid Target App' },
          object: { handle: 'invalid-target-object', name: 'Invalid Target Object' },
          join: ConfigurationsModule.JoinType.MANY,
        },
        status: ConfigurationsModule.ConfigurationStatus.ENABLED,
        updatedAt: new Date().toISOString(),
      };
      
      const result = ConfigurationsModule.ConfigurationSchema(invalidConfiguration);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should handle invalid enum values through exported schemas', () => {
      const invalidEnumConfiguration = {
        source: {
          app: { handle: 'invalid-enum-source', name: 'Invalid Enum Source' },
          object: { handle: 'invalid-enum-source-object', name: 'Invalid Enum Source Object' },
          join: 'invalid-join-type', // Invalid enum value
        },
        target: {
          app: { handle: 'invalid-enum-target', name: 'Invalid Enum Target' },
          object: { handle: 'invalid-enum-target-object', name: 'Invalid Enum Target Object' },
          join: ConfigurationsModule.JoinType.MANY,
        },
        status: ConfigurationsModule.ConfigurationStatus.ENABLED,
        updatedAt: new Date().toISOString(),
      };
      
      const result = ConfigurationsModule.ConfigurationSchema(invalidEnumConfiguration);
      expect(result).toBeInstanceOf(type.errors);
    });
  });
});