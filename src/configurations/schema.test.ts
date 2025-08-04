import { type } from 'arktype';
import { describe, expect, test } from 'vitest';
import { InvalidDataFactory, TestDataFactory } from '../common/test-utils.js';
import {
    ConfigurationIdentifiersSchema,
    ConfigurationPayloadSchema,
    ConfigurationSchema,
    ConfigurationStatus,
    JoinType,
    SourceSchema,
    TargetSchema,
    UpsertConfigurationPayloadSchema,
} from './schema.js';

describe('Configurations Schema Validation', () => {
  describe('JoinType enum', () => {
    test('should have correct enum values', () => {
      expect(JoinType.ONE).toBe('one');
      expect(JoinType.MANY).toBe('many');
    });
  });

  describe('ConfigurationStatus enum', () => {
    test('should have correct enum values', () => {
      expect(ConfigurationStatus.ENABLED).toBe('enabled');
      expect(ConfigurationStatus.DISABLED).toBe('disabled');
    });
  });

  describe('SourceSchema', () => {
    test('should validate valid source entity with default join', () => {
      const validSource = {
        app: { handle: 'source-app', name: 'Source App' },
        object: { handle: 'source-object', name: 'Source Object' },
      };
      
      const result = SourceSchema(validSource);
      
      expect(result).not.toBeInstanceOf(type.errors);
      if (result instanceof type.errors) return;
      
      expect(result.app).toEqual(validSource.app);
      expect(result.object).toEqual(validSource.object);
      expect(result.join).toBe(JoinType.ONE); // Default value
    });

    test('should validate valid source entity with explicit join', () => {
      const validSource = {
        app: { handle: 'source-app', name: 'Source App' },
        object: { handle: 'source-object', name: 'Source Object' },
        join: JoinType.MANY,
      };
      
      const result = SourceSchema(validSource);
      
      expect(result).not.toBeInstanceOf(type.errors);
      if (result instanceof type.errors) return;
      
      expect(result.app).toEqual(validSource.app);
      expect(result.object).toEqual(validSource.object);
      expect(result.join).toBe(JoinType.MANY);
    });

    test('should validate both join type values', () => {
      const sourceWithOne = {
        app: { handle: 'source-app', name: 'Source App' },
        object: { handle: 'source-object', name: 'Source Object' },
        join: JoinType.ONE,
      };
      
      const sourceWithMany = {
        app: { handle: 'source-app', name: 'Source App' },
        object: { handle: 'source-object', name: 'Source Object' },
        join: JoinType.MANY,
      };
      
      const resultOne = SourceSchema(sourceWithOne);
      const resultMany = SourceSchema(sourceWithMany);
      
      expect(resultOne).not.toBeInstanceOf(type.errors);
      expect(resultMany).not.toBeInstanceOf(type.errors);
      
      if (resultOne instanceof type.errors || resultMany instanceof type.errors) return;
      
      expect(resultOne.join).toBe(JoinType.ONE);
      expect(resultMany.join).toBe(JoinType.MANY);
    });

    test('should reject invalid join type', () => {
      const invalidSource = {
        app: { handle: 'source-app', name: 'Source App' },
        object: { handle: 'source-object', name: 'Source Object' },
        join: 'invalid-join-type',
      };
      
      const result = SourceSchema(invalidSource);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject missing required app field', () => {
      const invalidSource = {
        object: { handle: 'source-object', name: 'Source Object' },
        join: JoinType.ONE,
      };
      
      const result = SourceSchema(invalidSource);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject missing required object field', () => {
      const invalidSource = {
        app: { handle: 'source-app', name: 'Source App' },
        join: JoinType.ONE,
      };
      
      const result = SourceSchema(invalidSource);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject invalid app handle format', () => {
      const invalidSource = {
        app: { handle: 'Invalid App!', name: 'Invalid App' }, // Invalid handle format
        object: { handle: 'source-object', name: 'Source Object' },
        join: JoinType.ONE,
      };
      
      const result = SourceSchema(invalidSource);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject invalid object handle format', () => {
      const invalidSource = {
        app: { handle: 'source-app', name: 'Source App' },
        object: { handle: 'Invalid Object!', name: 'Invalid Object' }, // Invalid handle format
        join: JoinType.ONE,
      };
      
      const result = SourceSchema(invalidSource);
      expect(result).toBeInstanceOf(type.errors);
    });
  });

  describe('TargetSchema', () => {
    test('should validate valid target entity with default join', () => {
      const validTarget = {
        app: { handle: 'target-app', name: 'Target App' },
        object: { handle: 'target-object', name: 'Target Object' },
      };
      
      const result = TargetSchema(validTarget);
      
      expect(result).not.toBeInstanceOf(type.errors);
      if (result instanceof type.errors) return;
      
      expect(result.app).toEqual(validTarget.app);
      expect(result.object).toEqual(validTarget.object);
      expect(result.join).toBe(JoinType.ONE); // Default value
    });

    test('should validate valid target entity with explicit join', () => {
      const validTarget = {
        app: { handle: 'target-app', name: 'Target App' },
        object: { handle: 'target-object', name: 'Target Object' },
        join: JoinType.MANY,
      };
      
      const result = TargetSchema(validTarget);
      
      expect(result).not.toBeInstanceOf(type.errors);
      if (result instanceof type.errors) return;
      
      expect(result.app).toEqual(validTarget.app);
      expect(result.object).toEqual(validTarget.object);
      expect(result.join).toBe(JoinType.MANY);
    });

    test('should validate both join type values', () => {
      const targetWithOne = {
        app: { handle: 'target-app', name: 'Target App' },
        object: { handle: 'target-object', name: 'Target Object' },
        join: JoinType.ONE,
      };
      
      const targetWithMany = {
        app: { handle: 'target-app', name: 'Target App' },
        object: { handle: 'target-object', name: 'Target Object' },
        join: JoinType.MANY,
      };
      
      const resultOne = TargetSchema(targetWithOne);
      const resultMany = TargetSchema(targetWithMany);
      
      expect(resultOne).not.toBeInstanceOf(type.errors);
      expect(resultMany).not.toBeInstanceOf(type.errors);
      
      if (resultOne instanceof type.errors || resultMany instanceof type.errors) return;
      
      expect(resultOne.join).toBe(JoinType.ONE);
      expect(resultMany.join).toBe(JoinType.MANY);
    });

    test('should reject invalid join type', () => {
      const invalidTarget = {
        app: { handle: 'target-app', name: 'Target App' },
        object: { handle: 'target-object', name: 'Target Object' },
        join: 'invalid-join-type',
      };
      
      const result = TargetSchema(invalidTarget);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject missing required fields', () => {
      const invalidTargetMissingApp = {
        object: { handle: 'target-object', name: 'Target Object' },
        join: JoinType.ONE,
      };
      
      const invalidTargetMissingObject = {
        app: { handle: 'target-app', name: 'Target App' },
        join: JoinType.ONE,
      };
      
      const resultMissingApp = TargetSchema(invalidTargetMissingApp);
      const resultMissingObject = TargetSchema(invalidTargetMissingObject);
      
      expect(resultMissingApp).toBeInstanceOf(type.errors);
      expect(resultMissingObject).toBeInstanceOf(type.errors);
    });
  });

  describe('ConfigurationSchema', () => {
    test('should validate complete valid configuration data', () => {
      const validConfiguration = TestDataFactory.validConfiguration();
      const result = ConfigurationSchema(validConfiguration);
      
      expect(result).not.toBeInstanceOf(type.errors);
      if (result instanceof type.errors) return;
      
      expect(result.source.app).toEqual(validConfiguration.source.app);
      expect(result.source.object).toEqual(validConfiguration.source.object);
      expect(result.source.join).toBe(validConfiguration.source.join);
      expect(result.target.app).toEqual(validConfiguration.target.app);
      expect(result.target.object).toEqual(validConfiguration.target.object);
      expect(result.target.join).toBe(validConfiguration.target.join);
      expect(result.status).toBe(validConfiguration.status);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });

    test('should validate configuration with default status', () => {
      const configurationWithoutStatus = {
        source: {
          app: { handle: 'source-app', name: 'Source App' },
          object: { handle: 'source-object', name: 'Source Object' },
          join: JoinType.ONE,
        },
        target: {
          app: { handle: 'target-app', name: 'Target App' },
          object: { handle: 'target-object', name: 'Target Object' },
          join: JoinType.MANY,
        },
        updatedAt: new Date('2024-01-01T00:00:00.000Z').toISOString(),
      };
      
      const result = ConfigurationSchema(configurationWithoutStatus);
      
      expect(result).not.toBeInstanceOf(type.errors);
      if (result instanceof type.errors) return;
      
      expect(result.status).toBe(ConfigurationStatus.ENABLED); // Default value
    });

    test('should validate configuration with explicit disabled status', () => {
      const disabledConfiguration = {
        source: {
          app: { handle: 'source-app', name: 'Source App' },
          object: { handle: 'source-object', name: 'Source Object' },
          join: JoinType.ONE,
        },
        target: {
          app: { handle: 'target-app', name: 'Target App' },
          object: { handle: 'target-object', name: 'Target Object' },
          join: JoinType.MANY,
        },
        status: ConfigurationStatus.DISABLED,
        updatedAt: new Date('2024-01-01T00:00:00.000Z').toISOString(),
      };
      
      const result = ConfigurationSchema(disabledConfiguration);
      
      expect(result).not.toBeInstanceOf(type.errors);
      if (result instanceof type.errors) return;
      
      expect(result.status).toBe(ConfigurationStatus.DISABLED);
    });

    test('should handle Date objects for updatedAt field', () => {
      const configurationWithDateObject = {
        source: {
          app: { handle: 'source-app', name: 'Source App' },
          object: { handle: 'source-object', name: 'Source Object' },
          join: JoinType.ONE,
        },
        target: {
          app: { handle: 'target-app', name: 'Target App' },
          object: { handle: 'target-object', name: 'Target Object' },
          join: JoinType.MANY,
        },
        status: ConfigurationStatus.ENABLED,
        updatedAt: new Date('2024-01-01T00:00:00.000Z'),
      };
      
      const result = ConfigurationSchema(configurationWithDateObject);
      
      expect(result).not.toBeInstanceOf(type.errors);
      if (result instanceof type.errors) return;
      
      expect(result.updatedAt).toBeInstanceOf(Date);
      expect(result.updatedAt.toISOString()).toBe('2024-01-01T00:00:00.000Z');
    });

    test('should reject configuration with invalid status', () => {
      const invalidConfiguration = InvalidDataFactory.invalidConfigurationBadStatus();
      const result = ConfigurationSchema(invalidConfiguration);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject configuration with invalid join type', () => {
      const invalidConfiguration = InvalidDataFactory.invalidConfigurationBadJoin();
      const result = ConfigurationSchema(invalidConfiguration);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject configuration with missing required fields', () => {
      const invalidConfigurationMissingSource = {
        target: {
          app: { handle: 'target-app', name: 'Target App' },
          object: { handle: 'target-object', name: 'Target Object' },
          join: JoinType.MANY,
        },
        status: ConfigurationStatus.ENABLED,
        updatedAt: new Date().toISOString(),
      };
      
      const result = ConfigurationSchema(invalidConfigurationMissingSource);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject configuration with invalid date format', () => {
      const invalidConfiguration = {
        source: {
          app: { handle: 'source-app', name: 'Source App' },
          object: { handle: 'source-object', name: 'Source Object' },
          join: JoinType.ONE,
        },
        target: {
          app: { handle: 'target-app', name: 'Target App' },
          object: { handle: 'target-object', name: 'Target Object' },
          join: JoinType.MANY,
        },
        status: ConfigurationStatus.ENABLED,
        updatedAt: 'invalid-date',
      };
      
      const result = ConfigurationSchema(invalidConfiguration);
      expect(result).toBeInstanceOf(type.errors);
    });
  });

  describe('ConfigurationPayloadSchema', () => {
    test('should validate complete valid configuration payload', () => {
      const validConfiguration = TestDataFactory.validConfiguration();
      const result = ConfigurationPayloadSchema(validConfiguration);
      
      expect(result).not.toBeInstanceOf(type.errors);
      if (result instanceof type.errors) return;
      
      expect(result.source.app).toEqual(validConfiguration.source.app);
      expect(result.source.object).toEqual(validConfiguration.source.object);
      expect(result.source.join).toBe(validConfiguration.source.join);
      expect(result.target.app).toEqual(validConfiguration.target.app);
      expect(result.target.object).toEqual(validConfiguration.target.object);
      expect(result.target.join).toBe(validConfiguration.target.join);
      expect(result.status).toBe(validConfiguration.status);
      expect(result.updatedAt).toBe(validConfiguration.updatedAt);
    });

    test('should convert Date objects to ISO strings for updatedAt', () => {
      const configurationWithDateObject = {
        source: {
          app: { handle: 'source-app', name: 'Source App' },
          object: { handle: 'source-object', name: 'Source Object' },
          join: JoinType.ONE,
        },
        target: {
          app: { handle: 'target-app', name: 'Target App' },
          object: { handle: 'target-object', name: 'Target Object' },
          join: JoinType.MANY,
        },
        status: ConfigurationStatus.ENABLED,
        updatedAt: new Date('2024-01-01T00:00:00.000Z'),
      };
      
      const result = ConfigurationPayloadSchema(configurationWithDateObject);
      
      expect(result).not.toBeInstanceOf(type.errors);
      if (result instanceof type.errors) return;
      
      expect(result.updatedAt).toBe('2024-01-01T00:00:00.000Z');
    });

    test('should apply default values for status and join fields', () => {
      const minimalConfiguration = {
        source: {
          app: { handle: 'source-app', name: 'Source App' },
          object: { handle: 'source-object', name: 'Source Object' },
        },
        target: {
          app: { handle: 'target-app', name: 'Target App' },
          object: { handle: 'target-object', name: 'Target Object' },
        },
        updatedAt: new Date('2024-01-01T00:00:00.000Z'),
      };
      
      const result = ConfigurationPayloadSchema(minimalConfiguration);
      
      expect(result).not.toBeInstanceOf(type.errors);
      if (result instanceof type.errors) return;
      
      expect(result.source.join).toBe(JoinType.ONE); // Default
      expect(result.target.join).toBe(JoinType.ONE); // Default
      expect(result.status).toBe(ConfigurationStatus.ENABLED); // Default
    });

    test('should reject payload with invalid status', () => {
      const invalidPayload = InvalidDataFactory.invalidConfigurationBadStatus();
      const result = ConfigurationPayloadSchema(invalidPayload);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject payload with invalid join type', () => {
      const invalidPayload = InvalidDataFactory.invalidConfigurationBadJoin();
      const result = ConfigurationPayloadSchema(invalidPayload);
      expect(result).toBeInstanceOf(type.errors);
    });
  });

  describe('UpsertConfigurationPayloadSchema', () => {
    test('should validate complete valid upsert configuration payload', () => {
      const validUpsertPayload = TestDataFactory.validUpsertConfigurationPayload();
      const result = UpsertConfigurationPayloadSchema(validUpsertPayload);
      
      expect(result).not.toBeInstanceOf(type.errors);
      if (result instanceof type.errors) return;
      
      expect(result.source.app).toEqual({ handle: 'source-app' });
      expect(result.source.object).toEqual({ handle: 'source-object' });
      expect(result.source.join).toBe(validUpsertPayload.source.join);
      expect(result.target.app).toEqual({ handle: 'target-app' });
      expect(result.target.object).toEqual({ handle: 'target-object' });
      expect(result.target.join).toBe(validUpsertPayload.target.join);
      expect(result.status).toBe(validUpsertPayload.status);
    });

    test('should validate upsert payload without updatedAt field', () => {
      const upsertPayloadWithoutDate = {
        source: {
          app: { handle: 'source-app', name: 'Source App' },
          object: { handle: 'source-object', name: 'Source Object' },
          join: JoinType.ONE,
        },
        target: {
          app: { handle: 'target-app', name: 'Target App' },
          object: { handle: 'target-object', name: 'Target Object' },
          join: JoinType.MANY,
        },
        status: ConfigurationStatus.DISABLED,
      };
      
      const result = UpsertConfigurationPayloadSchema(upsertPayloadWithoutDate);
      
      expect(result).not.toBeInstanceOf(type.errors);
      if (result instanceof type.errors) return;
      
      expect(result.source.app).toEqual({ handle: 'source-app' });
      expect(result.target.join).toBe(upsertPayloadWithoutDate.target.join);
      expect(result.status).toBe(upsertPayloadWithoutDate.status);
    });

    test('should apply default values for status and join fields', () => {
      const minimalUpsertPayload = {
        source: {
          app: { handle: 'source-app', name: 'Source App' },
          object: { handle: 'source-object', name: 'Source Object' },
        },
        target: {
          app: { handle: 'target-app', name: 'Target App' },
          object: { handle: 'target-object', name: 'Target Object' },
        },
      };
      
      const result = UpsertConfigurationPayloadSchema(minimalUpsertPayload);
      
      expect(result).not.toBeInstanceOf(type.errors);
      if (result instanceof type.errors) return;
      
      expect(result.source.join).toBe(JoinType.ONE); // Default
      expect(result.target.join).toBe(JoinType.ONE); // Default
      expect(result.status).toBe(ConfigurationStatus.ENABLED); // Default
    });

    test('should reject upsert payload with invalid status', () => {
      const invalidUpsertPayload = {
        source: {
          app: { handle: 'source-app', name: 'Source App' },
          object: { handle: 'source-object', name: 'Source Object' },
          join: JoinType.ONE,
        },
        target: {
          app: { handle: 'target-app', name: 'Target App' },
          object: { handle: 'target-object', name: 'Target Object' },
          join: JoinType.MANY,
        },
        status: 'invalid-status',
      };
      
      const result = UpsertConfigurationPayloadSchema(invalidUpsertPayload);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject upsert payload with invalid join type', () => {
      const invalidUpsertPayload = {
        source: {
          app: { handle: 'source-app', name: 'Source App' },
          object: { handle: 'source-object', name: 'Source Object' },
          join: 'invalid-join',
        },
        target: {
          app: { handle: 'target-app', name: 'Target App' },
          object: { handle: 'target-object', name: 'Target Object' },
          join: JoinType.MANY,
        },
        status: ConfigurationStatus.ENABLED,
      };
      
      const result = UpsertConfigurationPayloadSchema(invalidUpsertPayload);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject upsert payload with missing required fields', () => {
      const invalidUpsertPayloadMissingTarget = {
        source: {
          app: { handle: 'source-app', name: 'Source App' },
          object: { handle: 'source-object', name: 'Source Object' },
          join: JoinType.ONE,
        },
        status: ConfigurationStatus.ENABLED,
      };
      
      const result = UpsertConfigurationPayloadSchema(invalidUpsertPayloadMissingTarget);
      expect(result).toBeInstanceOf(type.errors);
    });
  });

  describe('ConfigurationIdentifiersSchema', () => {
    test('should validate valid configuration identifiers', () => {
      const validIdentifiers = TestDataFactory.validConfigurationIdentifiers();
      const result = ConfigurationIdentifiersSchema(validIdentifiers);
      
      expect(result).not.toBeInstanceOf(type.errors);
      if (result instanceof type.errors) return;
      
      expect(result.source.app).toEqual({ handle: 'source-app' });
      expect(result.source.object).toEqual({ handle: 'source-object' });
      expect(result.target.app).toEqual({ handle: 'target-app' });
      expect(result.target.object).toEqual({ handle: 'target-object' });
      
      // Should not have join fields (omitted)
      expect('join' in result.source).toBe(false);
      expect('join' in result.target).toBe(false);
    });

    test('should validate identifiers without requiring join fields', () => {
      const identifiersWithoutJoin = {
        source: {
          app: { handle: 'source-app', name: 'Source App' },
          object: { handle: 'source-object', name: 'Source Object' },
          // No join field provided
        },
        target: {
          app: { handle: 'target-app', name: 'Target App' },
          object: { handle: 'target-object', name: 'Target Object' },
          // No join field provided
        },
      };
      
      const result = ConfigurationIdentifiersSchema(identifiersWithoutJoin);
      
      expect(result).not.toBeInstanceOf(type.errors);
      if (result instanceof type.errors) return;
      
      expect(result.source.app).toEqual({ handle: 'source-app' });
      expect(result.source.object).toEqual({ handle: 'source-object' });
      expect(result.target.app).toEqual({ handle: 'target-app' });
      expect(result.target.object).toEqual({ handle: 'target-object' });
    });

    test('should reject identifiers with missing required fields', () => {
      const invalidIdentifiersMissingSourceApp = {
        source: {
          object: { handle: 'source-object', name: 'Source Object' },
        },
        target: {
          app: { handle: 'target-app', name: 'Target App' },
          object: { handle: 'target-object', name: 'Target Object' },
        },
      };
      
      const result = ConfigurationIdentifiersSchema(invalidIdentifiersMissingSourceApp);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject identifiers with invalid handle formats', () => {
      const invalidIdentifiersBadHandle = {
        source: {
          app: 'Invalid App!', // Invalid handle format
          object: { handle: 'source-object', name: 'Source Object' },
        },
        target: {
          app: { handle: 'target-app', name: 'Target App' },
          object: { handle: 'target-object', name: 'Target Object' },
        },
      };
      
      const result = ConfigurationIdentifiersSchema(invalidIdentifiersBadHandle);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject identifiers missing target', () => {
      const invalidIdentifiersMissingTarget = {
        source: {
          app: { handle: 'source-app', name: 'Source App' },
          object: { handle: 'source-object', name: 'Source Object' },
        },
      };
      
      const result = ConfigurationIdentifiersSchema(invalidIdentifiersMissingTarget);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject identifiers missing source', () => {
      const invalidIdentifiersMissingSource = {
        target: {
          app: { handle: 'target-app', name: 'Target App' },
          object: { handle: 'target-object', name: 'Target Object' },
        },
      };
      
      const result = ConfigurationIdentifiersSchema(invalidIdentifiersMissingSource);
      expect(result).toBeInstanceOf(type.errors);
    });
  });

  describe('Nested schema validation', () => {
    test('should validate nested source and target schemas in configuration', () => {
      const configurationWithComplexNesting = {
        source: {
          app: { handle: 'complex-source-app', name: 'Complex Source App' },
          object: { handle: 'complex-source-object', name: 'Complex Source Object' },
          join: JoinType.MANY,
        },
        target: {
          app: { handle: 'complex-target-app', name: 'Complex Target App' },
          object: { handle: 'complex-target-object', name: 'Complex Target Object' },
          join: JoinType.ONE,
        },
        status: ConfigurationStatus.DISABLED,
        updatedAt: new Date('2024-01-01T00:00:00.000Z').toISOString(),
      };
      
      const result = ConfigurationSchema(configurationWithComplexNesting);
      
      expect(result).not.toBeInstanceOf(type.errors);
      if (result instanceof type.errors) return;
      
      // Verify nested source validation
      expect(result.source.app).toEqual({ handle: 'complex-source-app', name: 'Complex Source App' });
      expect(result.source.object).toEqual({ handle: 'complex-source-object', name: 'Complex Source Object' });
      expect(result.source.join).toBe(JoinType.MANY);
      
      // Verify nested target validation
      expect(result.target.app).toEqual({ handle: 'complex-target-app', name: 'Complex Target App' });
      expect(result.target.object).toEqual({ handle: 'complex-target-object', name: 'Complex Target Object' });
      expect(result.target.join).toBe(JoinType.ONE);
      
      expect(result.status).toBe(ConfigurationStatus.DISABLED);
    });

    test('should reject configuration with invalid nested source', () => {
      const configurationWithInvalidSource = {
        source: {
          app: { handle: 'Invalid Source!', name: 'Invalid Source' }, // Invalid handle
          object: { handle: 'source-object', name: 'Source Object' },
          join: JoinType.ONE,
        },
        target: {
          app: { handle: 'target-app', name: 'Target App' },
          object: { handle: 'target-object', name: 'Target Object' },
          join: JoinType.MANY,
        },
        status: ConfigurationStatus.ENABLED,
        updatedAt: new Date().toISOString(),
      };
      
      const result = ConfigurationSchema(configurationWithInvalidSource);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject configuration with invalid nested target', () => {
      const configurationWithInvalidTarget = {
        source: {
          app: { handle: 'source-app', name: 'Source App' },
          object: { handle: 'source-object', name: 'Source Object' },
          join: JoinType.ONE,
        },
        target: {
          app: { handle: 'target-app', name: 'Target App' },
          object: { handle: 'Invalid Target!', name: 'Invalid Target' }, // Invalid handle
          join: JoinType.MANY,
        },
        status: ConfigurationStatus.ENABLED,
        updatedAt: new Date().toISOString(),
      };
      
      const result = ConfigurationSchema(configurationWithInvalidTarget);
      expect(result).toBeInstanceOf(type.errors);
    });
  });

  describe('Default value application', () => {
    test('should apply default join value to source when not provided', () => {
      const configurationWithoutSourceJoin = {
        source: {
          app: { handle: 'source-app', name: 'Source App' },
          object: { handle: 'source-object', name: 'Source Object' },
          // join not provided - should default to 'one'
        },
        target: {
          app: { handle: 'target-app', name: 'Target App' },
          object: { handle: 'target-object', name: 'Target Object' },
          join: JoinType.MANY,
        },
        status: ConfigurationStatus.ENABLED,
        updatedAt: new Date().toISOString(),
      };
      
      const result = ConfigurationSchema(configurationWithoutSourceJoin);
      
      expect(result).not.toBeInstanceOf(type.errors);
      if (result instanceof type.errors) return;
      
      expect(result.source.join).toBe(JoinType.ONE); // Default value
      expect(result.target.join).toBe(JoinType.MANY); // Explicit value
    });

    test('should apply default join value to target when not provided', () => {
      const configurationWithoutTargetJoin = {
        source: {
          app: { handle: 'source-app', name: 'Source App' },
          object: { handle: 'source-object', name: 'Source Object' },
          join: JoinType.MANY,
        },
        target: {
          app: { handle: 'target-app', name: 'Target App' },
          object: { handle: 'target-object', name: 'Target Object' },
          // join not provided - should default to 'one'
        },
        status: ConfigurationStatus.ENABLED,
        updatedAt: new Date().toISOString(),
      };
      
      const result = ConfigurationSchema(configurationWithoutTargetJoin);
      
      expect(result).not.toBeInstanceOf(type.errors);
      if (result instanceof type.errors) return;
      
      expect(result.source.join).toBe(JoinType.MANY); // Explicit value
      expect(result.target.join).toBe(JoinType.ONE); // Default value
    });

    test('should apply default status value when not provided', () => {
      const configurationWithoutStatus = {
        source: {
          app: { handle: 'source-app', name: 'Source App' },
          object: { handle: 'source-object', name: 'Source Object' },
          join: JoinType.ONE,
        },
        target: {
          app: { handle: 'target-app', name: 'Target App' },
          object: { handle: 'target-object', name: 'Target Object' },
          join: JoinType.MANY,
        },
        // status not provided - should default to 'enabled'
        updatedAt: new Date().toISOString(),
      };
      
      const result = ConfigurationSchema(configurationWithoutStatus);
      
      expect(result).not.toBeInstanceOf(type.errors);
      if (result instanceof type.errors) return;
      
      expect(result.status).toBe(ConfigurationStatus.ENABLED); // Default value
    });

    test('should apply all default values when minimal data provided', () => {
      const minimalConfiguration = {
        source: {
          app: { handle: 'source-app', name: 'Source App' },
          object: { handle: 'source-object', name: 'Source Object' },
        },
        target: {
          app: { handle: 'target-app', name: 'Target App' },
          object: { handle: 'target-object', name: 'Target Object' },
        },
        updatedAt: new Date().toISOString(),
      };
      
      const result = ConfigurationSchema(minimalConfiguration);
      
      expect(result).not.toBeInstanceOf(type.errors);
      if (result instanceof type.errors) return;
      
      expect(result.source.join).toBe(JoinType.ONE); // Default
      expect(result.target.join).toBe(JoinType.ONE); // Default
      expect(result.status).toBe(ConfigurationStatus.ENABLED); // Default
    });
  });

  describe('Type inference validation', () => {
    test('should properly infer types for ConfigurationSchema', () => {
      const validConfiguration = TestDataFactory.validConfiguration();
      const result = ConfigurationSchema(validConfiguration);
      
      expect(result).not.toBeInstanceOf(type.errors);
      if (result instanceof type.errors) return;
      
      // TypeScript type checking - these should not cause compilation errors
      const sourceApp: { handle: string; name: string } = result.source.app;
      const sourceObject: { handle: string; name: string } = result.source.object;
      const sourceJoin: 'one' | 'many' = result.source.join;
      const targetApp: { handle: string; name: string } = result.target.app;
      const targetObject: { handle: string; name: string } = result.target.object;
      const targetJoin: 'one' | 'many' = result.target.join;
      const status: 'enabled' | 'disabled' = result.status;
      const updatedAt: Date = result.updatedAt;
      
      expect(typeof sourceApp).toBe('object');
      expect(typeof sourceObject).toBe('object');
      expect(sourceApp).toHaveProperty('handle');
      expect(sourceApp).toHaveProperty('name');
      expect(['one', 'many']).toContain(sourceJoin);
      expect(typeof targetApp).toBe('object');
      expect(typeof targetObject).toBe('object');
      expect(targetApp).toHaveProperty('handle');
      expect(targetApp).toHaveProperty('name');
      expect(['one', 'many']).toContain(targetJoin);
      expect(['enabled', 'disabled']).toContain(status);
      expect(updatedAt).toBeInstanceOf(Date);
    });

    test('should properly infer types for payload schemas', () => {
      const validPayload = TestDataFactory.validUpsertConfigurationPayload();
      const result = UpsertConfigurationPayloadSchema(validPayload);
      
      expect(result).not.toBeInstanceOf(type.errors);
      if (result instanceof type.errors) return;
      
      // TypeScript type checking
      const sourceApp: { handle: string } = result.source.app;
      const sourceJoin: 'one' | 'many' = result.source.join;
      const status: 'enabled' | 'disabled' = result.status;
      
      expect(typeof sourceApp).toBe('object');
      expect(sourceApp).toHaveProperty('handle');
      expect(['one', 'many']).toContain(sourceJoin);
      expect(['enabled', 'disabled']).toContain(status);
    });

    test('should properly infer types for ConfigurationIdentifiersSchema', () => {
      const validIdentifiers = TestDataFactory.validConfigurationIdentifiers();
      const result = ConfigurationIdentifiersSchema(validIdentifiers);
      
      expect(result).not.toBeInstanceOf(type.errors);
      if (result instanceof type.errors) return;
      
      // TypeScript type checking
      const sourceApp: { handle: string } = result.source.app;
      const sourceObject: { handle: string } = result.source.object;
      const targetApp: { handle: string } = result.target.app;
      const targetObject: { handle: string } = result.target.object;
      
      expect(typeof sourceApp).toBe('object');
      expect(sourceApp).toHaveProperty('handle');
      expect(typeof sourceObject).toBe('object');
      expect(sourceObject).toHaveProperty('handle');
      expect(typeof targetApp).toBe('object');
      expect(targetApp).toHaveProperty('handle');
      expect(typeof targetObject).toBe('object');
      expect(targetObject).toHaveProperty('handle');
      
      // Should not have join properties
      expect('join' in result.source).toBe(false);
      expect('join' in result.target).toBe(false);
    });
  });
});