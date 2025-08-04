import { z } from 'zod';
import { describe, expect, test } from 'vitest';
import { optionallyNullish, optionallyNullishToUndefined, optionallyUndefined } from './schema.js';

describe('Common Schema', () => {
  describe('optionallyNullishToUndefined', () => {
    test('should parse null string successfully', async () => {
      const Schema = z.object({
        foo: optionallyNullishToUndefined(z.string()),
      });

      const result = Schema.safeParse({
        foo: null,
      });

      if (!result.success) {
        console.log(result.error);
      }

      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data.foo).toBeUndefined();
    });

    test('should parse undefined string successfully', async () => {
      const Schema = z.object({
        foo: optionallyNullishToUndefined(z.string()),
      });

      const result = Schema.safeParse({
        foo: undefined,
      });

      if (!result.success) {
        console.log(result.error);
      }

      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data.foo).toBeUndefined();
    });

    test('should parse valid string successfully', async () => {
      const Schema = z.object({
        foo: optionallyNullishToUndefined(z.string()),
      });

      const result = Schema.safeParse({
        foo: 'valid-string',
      });

      if (!result.success) {
        console.log(result.error);
      }

      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data.foo).toBe('valid-string');
    });
  });

  describe('optionallyNullish', () => {
    test('should handle null values', () => {
      const Schema = z.object({
        foo: optionallyNullish(z.string()),
      });

      const result = Schema.safeParse({
        foo: null,
      });

      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data.foo).toBeNull();
    });

    test('should handle undefined values', () => {
      const Schema = z.object({
        foo: optionallyNullish(z.string()),
      });

      const result = Schema.safeParse({
        foo: undefined,
      });

      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data.foo).toBeUndefined();
    });
  });

  describe('optionallyUndefined', () => {
    test('should handle undefined values', () => {
      const Schema = z.object({
        foo: optionallyUndefined(z.string()),
      });

      const result = Schema.safeParse({
        foo: undefined,
      });

      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data.foo).toBeUndefined();
    });

    test('should handle valid string values', () => {
      const Schema = z.object({
        foo: optionallyUndefined(z.string()),
      });

      const result = Schema.safeParse({
        foo: 'test',
      });

      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data.foo).toBe('test');
    });
  });
});
