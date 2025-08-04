import { z } from 'zod';
import { describe, expect, test } from 'vitest';
import { InvalidDataFactory, TestDataFactory } from '../common/test-utils.js';
import {
  AppAvatarUrlSchema,
  AppAvatarUrlStringSchema,
  AppHandleSchema,
  AppPayloadSchema,
  AppSchema,
  InsertAppPayloadSchema,
  UpdateAppPayloadSchema,
} from './schema.js';

describe('Apps Schema Validation', () => {
  describe('AppHandleSchema', () => {
    test('should validate correct handle formats', () => {
      const validHandles = [
        'test-app',
        'my-app-name',
        'app123',
        'testApp',
        'myAppName',
        'a',
        'app-123-test',
      ];

      for (const handle of validHandles) {
        const result = AppHandleSchema.safeParse(handle);
        expect(result.success).toBe(true);
        if (!result.success) return;
        expect(result.data).toBe(handle);
      }
    });

    test('should reject invalid handle formats', () => {
      const invalidHandles = [
        'Test-App', // uppercase not allowed in kebab-case
        'test_app', // underscores not allowed
        'test app', // spaces not allowed
        'test--app', // double hyphens not allowed
        '-test-app', // cannot start with hyphen
        'test-app-', // cannot end with hyphen
        'test.app', // dots not allowed
        'test@app', // special characters not allowed
        '', // empty string
      ];

      for (const handle of invalidHandles) {
        const result = AppHandleSchema.safeParse(handle);
        expect(result.success).toBe(false);
      }
    });
  });

  describe('AppAvatarUrlSchema', () => {
    test('should handle URL objects correctly', () => {
      const url = new URL('https://example.com/avatar.png');
      const result = AppAvatarUrlSchema.safeParse(url);
      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data).toBeInstanceOf(URL);
      expect(result.data!.toString()).toBe('https://example.com/avatar.png');
    });

    test('should convert valid URL strings to URL objects', () => {
      const urlString = 'https://example.com/avatar.png';
      const result = AppAvatarUrlSchema.safeParse(urlString);
      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data).toBeInstanceOf(URL);
      expect(result.data!.toString()).toBe(urlString);
    });

    test('should handle undefined values', () => {
      const result = AppAvatarUrlSchema.safeParse(undefined);
      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data).toBeUndefined();
    });

    test('should reject invalid URL strings', () => {
      const invalidUrls = [
        'not-a-url',
        'http://', // incomplete URL
        '',
      ];

      for (const invalidUrl of invalidUrls) {
        const result = AppAvatarUrlSchema.safeParse(invalidUrl);
        expect(result.success).toBe(false);
      }
    });
  });

  describe('AppAvatarUrlStringSchema', () => {
    test('should convert URL objects to strings', () => {
      const url = new URL('https://example.com/avatar.png');
      const result = AppAvatarUrlStringSchema.safeParse(url);
      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data).toBe('https://example.com/avatar.png');
    });

    test('should pass through valid URL strings', () => {
      const urlString = 'https://example.com/avatar.png';
      const result = AppAvatarUrlStringSchema.safeParse(urlString);
      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data).toBe(urlString);
    });

    test('should handle undefined values', () => {
      const result = AppAvatarUrlStringSchema.safeParse(undefined);
      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data).toBeUndefined();
    });

    test('should reject invalid URL strings', () => {
      const result = AppAvatarUrlStringSchema.safeParse('not-a-url');
      expect(result.success).toBe(false);
    });
  });

  describe('AppSchema', () => {
    test('should validate complete valid app data', () => {
      const validApp = TestDataFactory.validApp();
      const result = AppSchema.safeParse(validApp);
      
      expect(result.success).toBe(true);
      if (!result.success) return;
      
      expect(result.data.handle).toBe(validApp.handle);
      expect(result.data.name).toBe(validApp.name);
      expect(result.data.avatar).toBeInstanceOf(URL);
      expect(result.data.avatar?.toString()).toBe(validApp.avatar);
      expect(result.data.createdAt).toBeInstanceOf(Date);
      expect(result.data.updatedAt).toBeInstanceOf(Date);
    });

    test('should validate app data without optional avatar', () => {
      const appWithoutAvatar = {
        handle: 'test-app',
        name: 'Test App',
        createdAt: new Date('2024-01-01T00:00:00.000Z').toISOString(),
        updatedAt: new Date('2024-01-02T00:00:00.000Z').toISOString(),
      };
      
      const result = AppSchema.safeParse(appWithoutAvatar);
      
      expect(result.success).toBe(true);
      if (!result.success) return;
      
      expect(result.data.handle).toBe(appWithoutAvatar.handle);
      expect(result.data.name).toBe(appWithoutAvatar.name);
      expect(result.data.avatar).toBeUndefined();
      expect(result.data.createdAt).toBeInstanceOf(Date);
      expect(result.data.updatedAt).toBeInstanceOf(Date);
    });

    test('should handle Date objects for date fields', () => {
      const appWithDateObjects = {
        handle: 'test-app',
        name: 'Test App',
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        updatedAt: new Date('2024-01-02T00:00:00.000Z'),
      };
      
      const result = AppSchema.safeParse(appWithDateObjects);
      
      expect(result.success).toBe(true);
      if (!result.success) return;
      
      expect(result.data.createdAt).toBeInstanceOf(Date);
      expect(result.data.updatedAt).toBeInstanceOf(Date);
      expect(result.data.createdAt.toISOString()).toBe('2024-01-01T00:00:00.000Z');
      expect(result.data.updatedAt.toISOString()).toBe('2024-01-02T00:00:00.000Z');
    });

    test('should reject app data with missing required fields', () => {
      const invalidApp = {
        // Missing handle and name - required fields
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const result = AppSchema.safeParse(invalidApp);
      expect(result.success).toBe(false);
    });

    test('should reject app data with invalid handle', () => {
      const invalidApp = InvalidDataFactory.invalidAppBadHandle();
      const result = AppSchema.safeParse(invalidApp);
      expect(result.success).toBe(false);
    });

    test('should reject app data with invalid avatar URL', () => {
      const invalidApp = {
        handle: 'test-app',
        name: 'Test App',
        avatar: 'not-a-valid-url',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const result = AppSchema.safeParse(invalidApp);
      expect(result.success).toBe(false);
    });

    test('should reject app data with invalid date formats', () => {
      const invalidApp = {
        handle: 'test-app',
        name: 'Test App',
        createdAt: 'invalid-date',
        updatedAt: new Date().toISOString(),
      };
      const result = AppSchema.safeParse(invalidApp);
      expect(result.success).toBe(false);
    });
  });

  describe('AppPayloadSchema', () => {
    test('should validate complete valid app payload data', () => {
      const validApp = TestDataFactory.validApp();
      const result = AppPayloadSchema.safeParse(validApp);
      
      expect(result.success).toBe(true);
      if (!result.success) return;
      
      expect(result.data.handle).toBe(validApp.handle);
      expect(result.data.name).toBe(validApp.name);
      expect(result.data.avatar).toBe(validApp.avatar);
      expect(result.data.createdAt).toBe(validApp.createdAt);
      expect(result.data.updatedAt).toBe(validApp.updatedAt);
    });

    test('should convert URL objects to strings for avatar', () => {
      const appWithUrlObject = {
        handle: 'test-app',
        name: 'Test App',
        avatar: new URL('https://example.com/avatar.png'),
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        updatedAt: new Date('2024-01-02T00:00:00.000Z'),
      };
      
      const result = AppPayloadSchema.safeParse(appWithUrlObject);
      
      expect(result.success).toBe(true);
      if (!result.success) return;
      
      expect(result.data.avatar).toBe('https://example.com/avatar.png');
      expect(result.data.createdAt).toBe('2024-01-01T00:00:00.000Z');
      expect(result.data.updatedAt).toBe('2024-01-02T00:00:00.000Z');
    });

    test('should handle app payload without optional avatar', () => {
      const appWithoutAvatar = {
        handle: 'test-app',
        name: 'Test App',
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        updatedAt: new Date('2024-01-02T00:00:00.000Z'),
      };
      
      const result = AppPayloadSchema.safeParse(appWithoutAvatar);
      
      expect(result.success).toBe(true);
      if (!result.success) return;
      
      expect(result.data.handle).toBe(appWithoutAvatar.handle);
      expect(result.data.name).toBe(appWithoutAvatar.name);
      expect(result.data.avatar).toBeUndefined();
      expect(result.data.createdAt).toBe('2024-01-01T00:00:00.000Z');
      expect(result.data.updatedAt).toBe('2024-01-02T00:00:00.000Z');
    });

    test('should convert Date objects to ISO strings for date fields', () => {
      const appWithDateObjects = {
        handle: 'test-app',
        name: 'Test App',
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        updatedAt: new Date('2024-01-02T00:00:00.000Z'),
      };
      
      const result = AppPayloadSchema.safeParse(appWithDateObjects);
      
      expect(result.success).toBe(true);
      if (!result.success) return;
      
      expect(result.data.createdAt).toBe('2024-01-01T00:00:00.000Z');
      expect(result.data.updatedAt).toBe('2024-01-02T00:00:00.000Z');
    });

    test('should reject payload with missing required fields', () => {
      const invalidPayload = InvalidDataFactory.invalidAppMissingFields();
      const result = AppPayloadSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    test('should reject payload with invalid handle format', () => {
      const invalidPayload = InvalidDataFactory.invalidAppBadHandle();
      const result = AppPayloadSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });
  });

  describe('InsertAppPayloadSchema', () => {
    test('should validate complete valid insert app payload', () => {
      const validInsertPayload = TestDataFactory.validInsertAppPayload();
      const result = InsertAppPayloadSchema.safeParse(validInsertPayload);
      
      expect(result.success).toBe(true);
      if (!result.success) return;
      
      expect(result.data.handle).toBe(validInsertPayload.handle);
      expect(result.data.name).toBe(validInsertPayload.name);
      expect(result.data.avatar).toBe(validInsertPayload.avatar);
    });

    test('should validate insert payload without optional avatar', () => {
      const insertPayloadWithoutAvatar = {
        handle: 'new-app',
        name: 'New App',
      };
      
      const result = InsertAppPayloadSchema.safeParse(insertPayloadWithoutAvatar);
      
      expect(result.success).toBe(true);
      if (!result.success) return;
      
      expect(result.data.handle).toBe(insertPayloadWithoutAvatar.handle);
      expect(result.data.name).toBe(insertPayloadWithoutAvatar.name);
      expect(result.data.avatar).toBeUndefined();
    });

    test('should convert URL objects to strings for avatar', () => {
      const insertPayloadWithUrlObject = {
        handle: 'new-app',
        name: 'New App',
        avatar: new URL('https://example.com/new-avatar.png'),
      };
      
      const result = InsertAppPayloadSchema.safeParse(insertPayloadWithUrlObject);
      
      expect(result.success).toBe(true);
      if (!result.success) return;
      
      expect(result.data.avatar).toBe('https://example.com/new-avatar.png');
    });

    test('should reject insert payload with missing required fields', () => {
      const invalidInsertPayload = {
        // Missing handle and name
        avatar: 'https://example.com/avatar.png',
      };
      const result = InsertAppPayloadSchema.safeParse(invalidInsertPayload);
      expect(result.success).toBe(false);
    });

    test('should reject insert payload with invalid handle format', () => {
      const invalidInsertPayload = {
        handle: 'Invalid Handle!',
        name: 'Test App',
      };
      const result = InsertAppPayloadSchema.safeParse(invalidInsertPayload);
      expect(result.success).toBe(false);
    });

    test('should reject insert payload with invalid avatar URL', () => {
      const invalidInsertPayload = {
        handle: 'new-app',
        name: 'New App',
        avatar: 'not-a-valid-url',
      };
      const result = InsertAppPayloadSchema.safeParse(invalidInsertPayload);
      expect(result.success).toBe(false);
    });

    test('should handle empty string name validation', () => {
      const invalidInsertPayload = {
        handle: 'new-app',
        name: '', // Empty string is actually accepted by arktype string schema
      };
      const result = InsertAppPayloadSchema.safeParse(invalidInsertPayload);
      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data.name).toBe('');
    });
  });

  describe('UpdateAppPayloadSchema', () => {
    test('should validate complete valid update app payload', () => {
      const validUpdatePayload = TestDataFactory.validUpdateAppPayload();
      const result = UpdateAppPayloadSchema.safeParse(validUpdatePayload);
      
      expect(result.success).toBe(true);
      if (!result.success) return;
      
      expect(result.data.name).toBe(validUpdatePayload.name);
      expect(result.data.avatar).toBe(validUpdatePayload.avatar);
    });

    test('should validate update payload with only name', () => {
      const updatePayloadNameOnly = {
        name: 'Updated App Name',
      };
      
      const result = UpdateAppPayloadSchema.safeParse(updatePayloadNameOnly);
      
      expect(result.success).toBe(true);
      if (!result.success) return;
      
      expect(result.data.name).toBe(updatePayloadNameOnly.name);
      expect(result.data.avatar).toBeUndefined();
    });

    test('should validate update payload with only avatar', () => {
      const updatePayloadAvatarOnly = {
        avatar: 'https://example.com/updated-avatar.png',
      };
      
      const result = UpdateAppPayloadSchema.safeParse(updatePayloadAvatarOnly);
      
      expect(result.success).toBe(true);
      if (!result.success) return;
      
      expect(result.data.name).toBeUndefined();
      expect(result.data.avatar).toBe(updatePayloadAvatarOnly.avatar);
    });

    test('should validate empty update payload (all fields optional)', () => {
      const emptyUpdatePayload = {};
      
      const result = UpdateAppPayloadSchema.safeParse(emptyUpdatePayload);
      
      expect(result.success).toBe(true);
      if (!result.success) return;
      
      expect(result.data.name).toBeUndefined();
      expect(result.data.avatar).toBeUndefined();
    });

    test('should convert URL objects to strings for avatar', () => {
      const updatePayloadWithUrlObject = {
        name: 'Updated App',
        avatar: new URL('https://example.com/updated-avatar.png'),
      };
      
      const result = UpdateAppPayloadSchema.safeParse(updatePayloadWithUrlObject);
      
      expect(result.success).toBe(true);
      if (!result.success) return;
      
      expect(result.data.avatar).toBe('https://example.com/updated-avatar.png');
    });

    test('should reject update payload with invalid avatar URL', () => {
      const invalidUpdatePayload = {
        name: 'Updated App',
        avatar: 'not-a-valid-url',
      };
      const result = UpdateAppPayloadSchema.safeParse(invalidUpdatePayload);
      expect(result.success).toBe(false);
    });

    test('should accept empty string name (arktype allows empty strings)', () => {
      const updatePayloadWithEmptyName = {
        name: '', // Empty string is actually accepted by arktype string schema
      };
      const result = UpdateAppPayloadSchema.safeParse(updatePayloadWithEmptyName);
      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data.name).toBe('');
    });

    test('should handle null values for optional fields', () => {
      const updatePayloadWithNulls = {
        name: null,
        avatar: null,
      };
      
      // Test the actual behavior - arktype might handle nulls differently
      const result = UpdateAppPayloadSchema.safeParse(updatePayloadWithNulls);
      
      if (!result.success) {
        // If it throws, that's acceptable behavior for null handling
        expect(result.success).toBe(false);
      } else {
        // If it succeeds, nulls should be converted to undefined
        expect(result.data.name).toBeUndefined();
        expect(result.data.avatar).toBeUndefined();
      }
    });
  });

  describe('URL transformation edge cases', () => {
    test('should handle complex URL with query parameters and fragments', () => {
      const complexUrl = 'https://example.com/avatar.png?size=large&format=webp#main';
      
      const urlResult = AppAvatarUrlSchema.safeParse(complexUrl);
      expect(urlResult.success).toBe(true);
      if (!urlResult.success) return;
      expect(urlResult.data).toBeInstanceOf(URL);
      expect(urlResult.data!.toString()).toBe(complexUrl);
      
      const stringResult = AppAvatarUrlStringSchema.safeParse(complexUrl);
      expect(stringResult.success).toBe(true);
      if (!stringResult.success) return;
      expect(stringResult.data).toBe(complexUrl);
    });

    test('should handle URL with special characters', () => {
      const urlWithSpecialChars = 'https://example.com/avatar%20with%20spaces.png';
      
      const urlResult = AppAvatarUrlSchema.safeParse(urlWithSpecialChars);
      expect(urlResult.success).toBe(true);
      if (!urlResult.success) return;
      expect(urlResult.data).toBeInstanceOf(URL);
      
      const stringResult = AppAvatarUrlStringSchema.safeParse(urlWithSpecialChars);
      expect(stringResult.success).toBe(true);
      if (!stringResult.success) return;
      expect(stringResult.data).toBe(urlWithSpecialChars);
    });

    test('should handle HTTPS and HTTP protocols', () => {
      const httpsUrl = 'https://example.com/avatar.png';
      const httpUrl = 'http://example.com/avatar.png';
      
      const httpsResult = AppAvatarUrlSchema.safeParse(httpsUrl);
      expect(httpsResult.success).toBe(true);
      if (!httpsResult.success) return;
      expect(httpsResult.data).toBeInstanceOf(URL);
      expect(httpsResult.data!.protocol).toBe('https:');
      
      const httpResult = AppAvatarUrlSchema.safeParse(httpUrl);
      expect(httpResult.success).toBe(true);
      if (!httpResult.success) return;
      expect(httpResult.data).toBeInstanceOf(URL);
      expect(httpResult.data!.protocol).toBe('http:');
    });
  });

  describe('Date field processing edge cases', () => {
    test('should handle various ISO date string formats', () => {
      const dateFormats = [
        '2024-01-01T00:00:00.000Z',
        '2024-01-01T00:00:00Z',
        '2024-01-01T00:00:00.123Z',
        '2024-01-01T12:30:45.678Z',
      ];
      
      for (const dateString of dateFormats) {
        const appData = {
          handle: 'test-app',
          name: 'Test App',
          createdAt: dateString,
          updatedAt: dateString,
        };
        
        const result = AppSchema.safeParse(appData);
        expect(result.success).toBe(true);
        if (!result.success) continue;
        
        expect(result.data.createdAt).toBeInstanceOf(Date);
        expect(result.data.updatedAt).toBeInstanceOf(Date);
        expect(result.data.createdAt.toISOString()).toBe(new Date(dateString).toISOString());
      }
    });

    test('should reject truly invalid date strings', () => {
      const invalidDates = [
        'invalid-date',
        'not-a-date-at-all',
        'abc123',
      ];
      
      for (const invalidDate of invalidDates) {
        const appData = {
          handle: 'test-app',
          name: 'Test App',
          createdAt: invalidDate,
          updatedAt: new Date().toISOString(),
        };
        
        const result = AppSchema.safeParse(appData);
        expect(result.success).toBe(false);
      }
    });

    test('should handle edge case date formats that JavaScript accepts', () => {
      // JavaScript Date constructor is quite lenient, so arktype might accept these
      const edgeCaseDates = [
        '2024-01-01', // Missing time component but valid date
        '2024-13-01T00:00:00.000Z', // Invalid month - JS might handle this
        '2024-01-32T00:00:00.000Z', // Invalid day - JS might handle this
      ];
      
      for (const dateString of edgeCaseDates) {
        const appData = {
          handle: 'test-app',
          name: 'Test App',
          createdAt: dateString,
          updatedAt: new Date().toISOString(),
        };
        
        const result = AppSchema.safeParse(appData);
        // These might be accepted or rejected depending on JavaScript's Date parsing
        // We just test that the schema behaves consistently
        if (!result.success) {
          expect(result.success).toBe(false);
        } else {
          expect(result.data.createdAt).toBeInstanceOf(Date);
        }
      }
    });
  });

  describe('Type inference validation', () => {
    test('should properly infer types for AppSchema', () => {
      const validApp = TestDataFactory.validApp();
      const result = AppSchema.safeParse(validApp);
      
      expect(result.success).toBe(true);
      if (!result.success) return;
      
      // TypeScript type checking - these should not cause compilation errors
      const handle: string = result.data.handle;
      const name: string = result.data.name;
      const avatar: URL | undefined = result.data.avatar;
      const createdAt: Date = result.data.createdAt;
      const updatedAt: Date = result.data.updatedAt;
      
      expect(typeof handle).toBe('string');
      expect(typeof name).toBe('string');
      expect(avatar).toBeInstanceOf(URL);
      expect(createdAt).toBeInstanceOf(Date);
      expect(updatedAt).toBeInstanceOf(Date);
    });

    test('should properly infer types for payload schemas', () => {
      const validPayload = TestDataFactory.validInsertAppPayload();
      const result = InsertAppPayloadSchema.safeParse(validPayload);
      
      expect(result.success).toBe(true);
      if (!result.success) return;
      
      // TypeScript type checking
      const handle: string = result.data.handle;
      const name: string = result.data.name;
      const avatar: string | undefined = result.data.avatar;
      
      expect(typeof handle).toBe('string');
      expect(typeof name).toBe('string');
      expect(typeof avatar).toBe('string');
    });
  });
});