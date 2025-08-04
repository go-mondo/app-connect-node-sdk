import { z } from 'zod';
import { describe, expect, test } from 'vitest';
import { OptionalDatePayloadSchema, RequiredDatePayloadSchema, RequiredDateSchema } from './dates.js';

describe('Common - Dates', () => {
  describe('Date Schema', () => {
    test('should accept an iso string', async () => {
      const result = RequiredDateSchema.safeParse(
        new Date().toISOString()
      );

      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data).toBeInstanceOf(Date);
    });

    test('should accept a Date object', async () => {
      const result = RequiredDateSchema.safeParse(
        new Date()
      );

      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data).toBeInstanceOf(Date);
    });
  });

  describe('Payload Schema', () => {
    test('should parse a Date to an ISO string', async () => {
      const iso = new Date().toISOString();

      const result = RequiredDatePayloadSchema.safeParse(
        new Date(iso)
      );

      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data).toBe(iso);
    });

    test('should parse an ISO to an ISO string', async () => {
      const iso = new Date().toISOString();

      const result = RequiredDatePayloadSchema.safeParse(
        iso
      );

      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data).toBe(iso);
    });

    test('should handle undefined in OptionalDatePayloadSchema', async () => {
      const result = OptionalDatePayloadSchema.safeParse(
        undefined
      );

      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data).toBeUndefined();
    });

    test('should handle valid date in OptionalDatePayloadSchema', async () => {
      const testDate = new Date('2024-01-01T00:00:00.000Z');
      const result = OptionalDatePayloadSchema.safeParse(
        testDate
      );

      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data).toBe('2024-01-01T00:00:00.000Z');
    });
  });
});
