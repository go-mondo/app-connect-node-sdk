import { z } from 'zod';
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
      
      const result = SourceSchema.safeParse(validSource);
      
      expect(result.success).toBe(true);
      if (!result.success) return;
      
      expect(result.data.app).toEqual(validSource.app);
      expect(result.data.object).toEqual(validSource.object);
      expect(result.data.join).toBe(JoinType.ONE); // Default value
    });

    test('should validate valid source entity with explicit join', () => {
      const validSource = {
        app: { handle: 'source-app', name: 'Source App' },
        object: { handle: 'source-object', name: 'Source Object' },
        join: JoinType.MANY,
      };
      
      const result = SourceSchema.safeParse(validSource);
      
      expect(result.success).toBe(true);
      if (!result.success) return;
      
      expect(result.data.app).toEqual(validSource.app);
      expect(result.data.object).toEqual(validSource.object);
      expect(result.data.join).toBe(JoinType.MANY);
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
      
      const resultOne = SourceSchema.safeParse(sourceWithOne);
      const resultMany = SourceSchema.safeParse(sourceWithMany);
      
      expect(resultOne.success).toBe(true);
      expect(resultMany.success).toBe(true);
      
      if (!resultOne.success || !resultMany.success) return;
      
      expect(resultOne.data.join).toBe(JoinType.ONE);
      expect(resultMany.data.join).toBe(JoinType.MANY);
    });

    test('should reject invalid join type', () => {
      const invalidSource = {
        app: { handle: 'source-app', name: 'Source App' },
        object: { handle: 'source-object', name: 'Source Object' },
        join: 'invalid-join-type',
      };
      
      const result = SourceSchema.safeParse(invalidSource);
      expect(result.success).toBe(false);
    });

    test('should reject missing required app field', () => {
      const invalidSource = {
        object: { handle: 'source-object', name: 'Source Object' },
        join: JoinType.ONE,
      };
      
      const result = SourceSchema.safeParse(invalidSource);
      expect(result.success).toBe(false);
    });

    test('should reject missing required object field', () => {
      const invalidSource = {
        app: { handle: 'source-app', name: 'Source App' },
        join: JoinType.ONE,
      };
      
      const result = SourceSchema.safeParse(invalidSource);
      expect(result.success).toBe(false);
    });

    test('should reject invalid app handle format', () => {
      const invalidSource = {
        app: { handle: 'Invalid App!', name: 'Invalid App' }, // Invalid handle format
        object: { handle: 'source-object', name: 'Source Object' },
        join: JoinType.ONE,
      };
      
      const result = SourceSchema.safeParse(invalidSource);
      expect(result.success).toBe(false);
    });

    test('should reject invalid object handle format', () => {
      const invalidSource = {
        app: { handle: 'source-app', name: 'Source App' },
        object: { handle: 'Invalid Object!', name: 'Invalid Object' }, // Invalid handle format
        join: JoinType.ONE,
      };
      
      const result = SourceSchema.safeParse(invalidSource);
      expect(result.success).toBe(false);
    });
  });

  describe('TargetSchema', () => {
    test('should validate valid target entity with default join', () => {
      const validTarget = {
        app: { handle: 'target-app', name: 'Target App' },
        object: { handle: 'target-object', name: 'Target Object' },
      };
      
      const result = TargetSchema.safeParse(validTarget);
      
      expect(result.success).toBe(true);
      if (!result.success) return;
      
      expect(result.data.app).toEqual(validTarget.app);
      expect(result.data.object).toEqual(validTarget.object);
      expect(result.data.join).toBe(JoinType.ONE); // Default value
    });

    test('should validate valid target entity with explicit join', () => {
      const validTarget = {
        app: { handle: 'target-app', name: 'Target App' },
        object: { handle: 'target-object', name: 'Target Object' },
        join: JoinType.MANY,
      };
      
      const result = TargetSchema.safeParse(validTarget);
      
      expect(result.success).toBe(true);
      if (!result.success) return;
      
      expect(result.data.app).toEqual(validTarget.app);
      expect(result.data.object).toEqual(validTarget.object);
      expect(result.data.join).toBe(JoinType.MANY);
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
      
      const resultOne = TargetSchema.safeParse(targetWithOne);
      const resultMany = TargetSchema.safeParse(targetWithMany);
      
      expect(resultOne.success).toBe(true);
      expect(resultMany.success).toBe(true);
      
      if (!resultOne.success || !resultMany.success) return;
      
      expect(resultOne.data.join).toBe(JoinType.ONE);
      expect(resultMany.data.join).toBe(JoinType.MANY);
    });

    test('should reject invalid join type', () => {
      const invalidTarget = {
        app: { handle: 'target-app', name: 'Target App' },
        object: { handle: 'target-object', name: 'Target Object' },
        join: 'invalid-join-type',
      };
      
      const result = TargetSchema.safeParse(invalidTarget);
      expect(result.success).toBe(false);
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
      
      const resultMissingApp = TargetSchema.safeParse(invalidTargetMissingApp);
      const resultMissingObject = TargetSchema.safeParse(invalidTargetMissingObject);
      
      expect(resultMissingApp.success).toBe(false);
      expect(resultMissingObject.success).toBe(false);
    });
  });

  describe('ConfigurationSchema', () => {
    test('should validate complete valid configuration data', () => {
      const validConfiguration = TestDataFactory.validConfiguration();
      const result = ConfigurationSchema.safeParse(validConfiguration);
      
      expect(result.success).toBe(true);
      if (!result.success) return;
      
      expect(result.data.source.app).toEqual(validConfiguration.source.app);
      expect(result.data.source.object).toEqual(validConfiguration.source.object);
      expect(result.data.source.join).toBe(validConfiguration.source.join);
      expect(result.data.target.app).toEqual(validConfiguration.target.app);
      expect(result.data.target.object).toEqual(validConfiguration.target.object);
      expect(result.data.target.join).toBe(validConfiguration.target.join);
      expect(result.data.status).toBe(validConfiguration.status);
      expect(result.data.updatedAt).toBeInstanceOf(Date);
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
      
      const result = ConfigurationSchema.safeParse(configurationWithoutStatus);
      
      expect(result.success).toBe(true);
      if (!result.success) return;
      
      expect(result.data.status).toBe(ConfigurationStatus.ENABLED); // Default value
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
      
      const result = ConfigurationSchema.safeParse(disabledConfiguration);
      
      expect(result.success).toBe(true);
      if (!result.success) return;
      
      expect(result.data.status).toBe(ConfigurationStatus.DISABLED);
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
      
      const result = ConfigurationSchema.safeParse(configurationWithDateObject);
      
      expect(result.success).toBe(true);
      if (!result.success) return;
      
      expect(result.data.updatedAt).toBeInstanceOf(Date);
      expect(result.data.updatedAt.toISOString()).toBe('2024-01-01T00:00:00.000Z');
    });

    test('should reject configuration with invalid status', () => {
      const invalidConfiguration = InvalidDataFactory.invalidConfigurationBadStatus();
      const result = ConfigurationSchema.safeParse(invalidConfiguration);
      expect(result.success).toBe(false);
    });

    test('should reject configuration with invalid join type', () => {
      const invalidConfiguration = InvalidDataFactory.invalidConfigurationBadJoin();
      const result = ConfigurationSchema.safeParse(invalidConfiguration);
      expect(result.success).toBe(false);
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
      
      const result = ConfigurationSchema.safeParse(invalidConfigurationMissingSource);
      expect(result.success).toBe(false);
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
      
      const result = ConfigurationSchema.safeParse(invalidConfiguration);
      expect(result.success).toBe(false);
    });
  });

  describe('ConfigurationPayloadSchema', () => {
    test('should validate complete valid configuration payload', () => {
      const validConfiguration = TestDataFactory.validConfiguration();
      const result = ConfigurationPayloadSchema.safeParse(validConfiguration);
      
      expect(result.success).toBe(true);
      if (!result.success) return;
      
      expect(result.data.source.app).toEqual(validConfiguration.source.app);
      expect(result.data.source.object).toEqual(validConfiguration.source.object);
      expect(result.data.source.join).toBe(validConfiguration.source.join);
      expect(result.data.target.app).toEqual(validConfiguration.target.app);
      expect(result.data.target.object).toEqual(validConfiguration.target.object);
      expect(result.data.target.join).toBe(validConfiguration.target.join);
      expect(result.data.status).toBe(validConfiguration.status);
      expect(result.data.updatedAt).toBe(validConfiguration.updatedAt);
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
      
      const result = ConfigurationPayloadSchema.safeParse(configurationWithDateObject);
      
      expect(result.success).toBe(true);
      if (!result.success) return;
      
      expect(result.data.updatedAt).toBe('2024-01-01T00:00:00.000Z');
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
      
      const result = ConfigurationPayloadSchema.safeParse(minimalConfiguration);
      
      expect(result.success).toBe(true);
      if (!result.success) return;
      
      expect(result.data.source.join).toBe(JoinType.ONE); // Default
      expect(result.data.target.join).toBe(JoinType.ONE); // Default
      expect(result.data.status).toBe(ConfigurationStatus.ENABLED); // Default
    });

    test('should reject payload with invalid status', () => {
      const invalidPayload = InvalidDataFactory.invalidConfigurationBadStatus();
      const result = ConfigurationPayloadSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    test('should reject payload with invalid join type', () => {
      const invalidPayload = InvalidDataFactory.invalidConfigurationBadJoin();
      const result = ConfigurationPayloadSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });
  });

  describe('UpsertConfigurationPayloadSchema', () => {
    test('should validate complete valid upsert configuration payload', () => {
      const validUpsertPayload = TestDataFactory.validUpsertConfigurationPayload();
      const result = UpsertConfigurationPayloadSchema.safeParse(validUpsertPayload);
      
      expect(result.success).toBe(true);
      if (!result.success) return;
      
      expect(result.data.source.app).toEqual({ handle: 'source-app' });
      expect(result.data.source.object).toEqual({ handle: 'source-object' });
      expect(result.data.source.join).toBe(validUpsertPayload.source.join);
      expect(result.data.target.app).toEqual({ handle: 'target-app' });
      expect(result.data.target.object).toEqual({ handle: 'target-object' });
      expect(result.data.target.join).toBe(validUpsertPayload.target.join);
      expect(result.data.status).toBe(validUpsertPayload.status);
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
      
      const result = UpsertConfigurationPayloadSchema.safeParse(upsertPayloadWithoutDate);
      
      expect(result.success).toBe(true);
      if (!result.success) return;
      
      expect(result.data.source.app).toEqual({ handle: 'source-app' });
      expect(result.data.target.join).toBe(upsertPayloadWithoutDate.target.join);
      expect(result.data.status).toBe(upsertPayloadWithoutDate.status);
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
      
      const result = UpsertConfigurationPayloadSchema.safeParse(minimalUpsertPayload);
      
      expect(result.success).toBe(true);
      if (!result.success) return;
      
      expect(result.data.source.join).toBe(JoinType.ONE); // Default
      expect(result.data.target.join).toBe(JoinType.ONE); // Default
      expect(result.data.status).toBe(ConfigurationStatus.ENABLED); // Default
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
      
      const result = UpsertConfigurationPayloadSchema.safeParse(invalidUpsertPayload);
      expect(result.success).toBe(false);
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
      
      const result = UpsertConfigurationPayloadSchema.safeParse(invalidUpsertPayload);
      expect(result.success).toBe(false);
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
      
      const result = UpsertConfigurationPayloadSchema.safeParse(invalidUpsertPayloadMissingTarget);
      expect(result.success).toBe(false);
    });
  });

  describe('ConfigurationIdentifiersSchema', () => {
    test('should validate valid configuration identifiers', () => {
      const validIdentifiers = TestDataFactory.validConfigurationIdentifiers();
      const result = ConfigurationIdentifiersSchema.safeParse(validIdentifiers);
      
      expect(result.success).toBe(true);
      if (!result.success) return;
      
      expect(result.data.source.app).toEqual({ handle: 'source-app' });
      expect(result.data.source.object).toEqual({ handle: 'source-object' });
      expect(result.data.target.app).toEqual({ handle: 'target-app' });
      expect(result.data.target.object).toEqual({ handle: 'target-object' });
      
      // Should not have join fields (omitted)
      expect('join' in result.data.source).toBe(false);
      expect('join' in result.data.target).toBe(false);
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
      
      const result = ConfigurationIdentifiersSchema.safeParse(identifiersWithoutJoin);
      
      expect(result.success).toBe(true);
      if (!result.success) return;
      
      expect(result.data.source.app).toEqual({ handle: 'source-app' });
      expect(result.data.source.object).toEqual({ handle: 'source-object' });
      expect(result.data.target.app).toEqual({ handle: 'target-app' });
      expect(result.data.target.object).toEqual({ handle: 'target-object' });
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
      
      const result = ConfigurationIdentifiersSchema.safeParse(invalidIdentifiersMissingSourceApp);
      expect(result.success).toBe(false);
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
      
      const result = ConfigurationIdentifiersSchema.safeParse(invalidIdentifiersBadHandle);
      expect(result.success).toBe(false);
    });

    test('should reject identifiers missing target', () => {
      const invalidIdentifiersMissingTarget = {
        source: {
          app: { handle: 'source-app', name: 'Source App' },
          object: { handle: 'source-object', name: 'Source Object' },
        },
      };
      
      const result = ConfigurationIdentifiersSchema.safeParse(invalidIdentifiersMissingTarget);
      expect(result.success).toBe(false);
    });

    test('should reject identifiers missing source', () => {
      const invalidIdentifiersMissingSource = {
        target: {
          app: { handle: 'target-app', name: 'Target App' },
          object: { handle: 'target-object', name: 'Target Object' },
        },
      };
      
      const result = ConfigurationIdentifiersSchema.safeParse(invalidIdentifiersMissingSource);
      expect(result.success).toBe(false);
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
      
      const result = ConfigurationSchema.safeParse(configurationWithComplexNesting);
      
      expect(result.success).toBe(true);
      if (!result.success) return;
      
      // Verify nested source validation
      expect(result.data.source.app).toEqual({ handle: 'complex-source-app', name: 'Complex Source App' });
      expect(result.data.source.object).toEqual({ handle: 'complex-source-object', name: 'Complex Source Object' });
      expect(result.data.source.join).toBe(JoinType.MANY);
      
      // Verify nested target validation
      expect(result.data.target.app).toEqual({ handle: 'complex-target-app', name: 'Complex Target App' });
      expect(result.data.target.object).toEqual({ handle: 'complex-target-object', name: 'Complex Target Object' });
      expect(result.data.target.join).toBe(JoinType.ONE);
      
      expect(result.data.status).toBe(ConfigurationStatus.DISABLED);
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
      
      const result = ConfigurationSchema.safeParse(configurationWithInvalidSource);
      expect(result.success).toBe(false);
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
      
      const result = ConfigurationSchema.safeParse(configurationWithInvalidTarget);
      expect(result.success).toBe(false);
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
      
      const result = ConfigurationSchema.safeParse(configurationWithoutSourceJoin);
      
      expect(result.success).toBe(true);
      if (!result.success) return;
      
      expect(result.data.source.join).toBe(JoinType.ONE); // Default value
      expect(result.data.target.join).toBe(JoinType.MANY); // Explicit value
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
      
      const result = ConfigurationSchema.safeParse(configurationWithoutTargetJoin);
      
      expect(result.success).toBe(true);
      if (!result.success) return;
      
      expect(result.data.source.join).toBe(JoinType.MANY); // Explicit value
      expect(result.data.target.join).toBe(JoinType.ONE); // Default value
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
      
      const result = ConfigurationSchema.safeParse(configurationWithoutStatus);
      
      expect(result.success).toBe(true);
      if (!result.success) return;
      
      expect(result.data.status).toBe(ConfigurationStatus.ENABLED); // Default value
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
      
      const result = ConfigurationSchema.safeParse(minimalConfiguration);
      
      expect(result.success).toBe(true);
      if (!result.success) return;
      
      expect(result.data.source.join).toBe(JoinType.ONE); // Default
      expect(result.data.target.join).toBe(JoinType.ONE); // Default
      expect(result.data.status).toBe(ConfigurationStatus.ENABLED); // Default
    });
  });

  describe('Type inference validation', () => {
    test('should properly infer types for ConfigurationSchema', () => {
      const validConfiguration = TestDataFactory.validConfiguration();
      const result = ConfigurationSchema.safeParse(validConfiguration);
      
      expect(result.success).toBe(true);
      if (!result.success) return;
      
      // TypeScript type checking - these should not cause compilation errors
      const sourceApp: { handle: string; name: string } = result.data.source.app;
      const sourceObject: { handle: string; name: string } = result.data.source.object;
      const sourceJoin: 'one' | 'many' = result.data.source.join;
      const targetApp: { handle: string; name: string } = result.data.target.app;
      const targetObject: { handle: string; name: string } = result.data.target.object;
      const targetJoin: 'one' | 'many' = result.data.target.join;
      const status: 'enabled' | 'disabled' = result.data.status;
      const updatedAt: Date = result.data.updatedAt;
      
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
      const result = UpsertConfigurationPayloadSchema.safeParse(validPayload);
      
      expect(result.success).toBe(true);
      if (!result.success) return;
      
      // TypeScript type checking
      const sourceApp: { handle: string } = result.data.source.app;
      const sourceJoin: 'one' | 'many' = result.data.source.join;
      const status: 'enabled' | 'disabled' = result.data.status;
      
      expect(typeof sourceApp).toBe('object');
      expect(sourceApp).toHaveProperty('handle');
      expect(['one', 'many']).toContain(sourceJoin);
      expect(['enabled', 'disabled']).toContain(status);
    });

    test('should properly infer types for ConfigurationIdentifiersSchema', () => {
      const validIdentifiers = TestDataFactory.validConfigurationIdentifiers();
      const result = ConfigurationIdentifiersSchema.safeParse(validIdentifiers);
      
      expect(result.success).toBe(true);
      if (!result.success) return;
      
      // TypeScript type checking
      const sourceApp: { handle: string } = result.data.source.app;
      const sourceObject: { handle: string } = result.data.source.object;
      const targetApp: { handle: string } = result.data.target.app;
      const targetObject: { handle: string } = result.data.target.object;
      
      expect(typeof sourceApp).toBe('object');
      expect(sourceApp).toHaveProperty('handle');
      expect(typeof sourceObject).toBe('object');
      expect(sourceObject).toHaveProperty('handle');
      expect(typeof targetApp).toBe('object');
      expect(targetApp).toHaveProperty('handle');
      expect(typeof targetObject).toBe('object');
      expect(targetObject).toHaveProperty('handle');
      
      // Should not have join properties
      expect('join' in result.data.source).toBe(false);
      expect('join' in result.data.target).toBe(false);
    });
  });
});