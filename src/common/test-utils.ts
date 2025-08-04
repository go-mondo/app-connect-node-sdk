import type { Mock } from "vitest";
import { vi } from "vitest";
import type { ConfigProps } from "./init.js";
import { MondoAppConnect } from "./init.js";
import type { Authorization } from "./resources/authorization.js";

// Mock response interface
export interface MockResponse {
	ok: boolean;
	status: number;
	json: () => Promise<unknown>;
}

/**
 * Test Data Factory for creating consistent test data across all test files
 */
export const TestDataFactory = {
	/**
	 * Valid App data factory
	 */
	validApp: () => ({
		handle: "test-app",
		name: "Test App",
		avatar: "https://example.com/avatar.png",
		createdAt: new Date("2024-01-01T00:00:00.000Z").toISOString(),
		updatedAt: new Date("2024-01-02T00:00:00.000Z").toISOString(),
	}),

	/**
	 * Valid App Object data factory
	 */
	validAppObject: () => ({
		handle: "test-object",
		name: "Test Object",
		app: { handle: "test-app", name: "Test App" },
		url: "https://example.com/object/{{id}}",
		createdAt: new Date("2024-01-01T00:00:00.000Z").toISOString(),
		updatedAt: new Date("2024-01-02T00:00:00.000Z").toISOString(),
	}),

	/**
	 * Valid Connection data factory
	 */
	validConnection: () => ({
		app: {
			handle: "test-app",
			name: "Test App",
		},
		object: {
			handle: "test-object",
			name: "Test Object",
		},
		id: "test-id-123",
		avatar: "https://example.com/avatar.png",
		url: "https://example.com/connection/{{id}}",
		updatedAt: new Date("2024-01-01T00:00:00.000Z").toISOString(),
		inferred: false,
	}),

	/**
	 * Valid Configuration data factory
	 */
	validConfiguration: () => ({
		source: {
			app: { handle: "source-app", name: "Source App" },
			object: { handle: "source-object", name: "Source Object" },
			join: "one" as const,
		},
		target: {
			app: { handle: "target-app", name: "Target App" },
			object: { handle: "target-object", name: "Target Object" },
			join: "many" as const,
		},
		status: "enabled" as const,
		updatedAt: new Date("2024-01-01T00:00:00.000Z").toISOString(),
	}),

	/**
	 * Valid Insert App Payload data factory
	 */
	validInsertAppPayload: () => ({
		handle: "new-app",
		name: "New App",
		avatar: "https://example.com/new-avatar.png",
	}),

	/**
	 * Valid Update App Payload data factory
	 */
	validUpdateAppPayload: () => ({
		name: "Updated App Name",
		avatar: "https://example.com/updated-avatar.png",
	}),

	/**
	 * Valid Insert App Object Payload data factory
	 */
	validInsertAppObjectPayload: () => ({
		handle: "new-object",
		name: "New Object",
		url: "https://example.com/new-object/{{id}}",
	}),

	/**
	 * Valid Update App Object Payload data factory
	 */
	validUpdateAppObjectPayload: () => ({
		name: "Updated Object Name",
		url: "https://example.com/updated-object/{{id}}",
	}),

	/**
	 * Valid Upsert Connection Payload data factory
	 */
	validUpsertConnectionPayload: () => ({
		app: "target-app",
		object: "target-object",
		id: "target-id-456",
	}),

	/**
	 * Valid Upsert Configuration Payload data factory
	 */
	validUpsertConfigurationPayload: () => ({
		source: {
			app: "source-app",
			object: "source-object",
			join: "one" as const,
		},
		target: {
			app: "target-app",
			object: "target-object",
			join: "many" as const,
		},
		status: "enabled" as const,
	}),

	/**
	 * Valid Configuration Identifiers data factory
	 */
	validConfigurationIdentifiers: () => ({
		source: {
			app: "source-app",
			object: "source-object",
		},
		target: {
			app: "target-app",
			object: "target-object",
		},
	}),

	/**
	 * Valid SDK Configuration data factory
	 */
	validSdkConfig: (): ConfigProps => ({
		accessToken: "test-access-token-123",
		host: "https://api.test.example.com",
	}),

	/**
	 * Minimal SDK Configuration data factory
	 */
	minimalSdkConfig: (): ConfigProps => ({
		accessToken: "test-token",
	}),
};

/**
 * Invalid Data Factory for creating invalid test data for negative testing
 */
export const InvalidDataFactory = {
	/**
	 * Invalid App data with missing required fields
	 */
	invalidAppMissingFields: () => ({
		// Missing handle and name
		avatar: "not-a-url",
	}),

	/**
	 * Invalid App data with invalid handle format
	 */
	invalidAppBadHandle: () => ({
		handle: "Invalid Handle!", // Contains invalid characters
		name: "Test App",
	}),

	/**
	 * Invalid App data with invalid URL
	 */
	invalidAppBadUrl: () => ({
		handle: "test-app",
		name: "Test App",
		avatar: "not-a-valid-url",
	}),

	/**
	 * Invalid App Object data with missing app reference
	 */
	invalidAppObjectMissingApp: () => ({
		handle: "test-object",
		name: "Test Object",
		// Missing app field
	}),

	/**
	 * Invalid Connection data with invalid enum values
	 */
	invalidConnectionBadEnum: () => ({
		app: "test-app",
		object: "test-object",
		id: "test-id",
		inferred: "not-a-boolean", // Should be boolean
	}),

	/**
	 * Invalid Configuration data with bad join type
	 */
	invalidConfigurationBadJoin: () => ({
		source: {
			app: "source-app",
			object: "source-object",
			join: "invalid-join-type", // Should be 'one' or 'many'
		},
		target: {
			app: "target-app",
			object: "target-object",
			join: "many",
		},
		status: "enabled",
	}),

	/**
	 * Invalid Configuration data with bad status
	 */
	invalidConfigurationBadStatus: () => ({
		source: {
			app: "source-app",
			object: "source-object",
			join: "one",
		},
		target: {
			app: "target-app",
			object: "target-object",
			join: "many",
		},
		status: "invalid-status", // Should be 'enabled' or 'disabled'
	}),

	/**
	 * Invalid SDK Configuration with missing access token
	 */
	invalidSdkConfigMissingToken: () => ({
		host: "https://api.example.com",
		// Missing accessToken
	}),

	/**
	 * Invalid SDK Configuration with empty access token
	 */
	invalidSdkConfigEmptyToken: () => ({
		accessToken: "", // Empty string not allowed
		host: "https://api.example.com",
	}),

	/**
	 * Invalid SDK Configuration with bad host URL
	 */
	invalidSdkConfigBadHost: () => ({
		accessToken: "test-token",
		host: "not-a-valid-url",
	}),
};

/**
 * Mock Helper Functions for common testing scenarios
 */
export const MockHelpers = {
	/**
	 * Creates a mock fetch response
	 */
	createMockResponse: (data: unknown, status = 200): MockResponse => ({
		ok: status >= 200 && status < 300,
		status,
		json: () => Promise.resolve(data),
	}),

	/**
	 * Creates a mock fetch response that rejects JSON parsing
	 */
	createMockResponseWithJsonError: (status = 200): MockResponse => ({
		ok: status >= 200 && status < 300,
		status,
		json: () => Promise.reject(new Error("Invalid JSON")),
	}),

	/**
	 * Creates a mock authorization function
	 */
	createMockAuthorization: (): Mock<Authorization> => {
		return vi.fn((request: RequestInit) => ({
			...request,
			headers: new Headers({
				...Object.fromEntries((request.headers as Headers)?.entries() || []),
				authorization: "Bearer test-token",
			}),
		}));
	},

	/**
	 * Creates a mock authorization function with custom token
	 */
	createMockAuthorizationWithToken: (token: string): Mock<Authorization> => {
		return vi.fn((request: RequestInit) => ({
			...request,
			headers: new Headers({
				...Object.fromEntries((request.headers as Headers)?.entries() || []),
				authorization: token,
			}),
		}));
	},

	/**
	 * Creates a mock authorization function with custom headers
	 */
	createMockAuthorizationWithHeaders: (
		customHeaders: Record<string, string>,
	): Mock<Authorization> => {
		return vi.fn((request: RequestInit) => ({
			...request,
			headers: new Headers({
				...Object.fromEntries((request.headers as Headers)?.entries() || []),
				...customHeaders,
			}),
		}));
	},

	/**
	 * Creates a mock MondoAppConnect instance
	 */
	createMockMondoAppConnect: (
		config?: Partial<ConfigProps>,
	): MondoAppConnect => {
		const defaultConfig = TestDataFactory.validSdkConfig();
		const finalConfig = { ...defaultConfig, ...config };
		return new MondoAppConnect(finalConfig);
	},

	/**
	 * Sets up global mocks for testing (fetch, console.debug)
	 */
	setupGlobalMocks: () => {
		// Mock console.debug to avoid noise in tests
		global.console.debug = vi.fn();

		// Mock fetch globally
		const mockFetch = vi.fn();
		global.fetch = mockFetch;

		return { mockFetch };
	},

	/**
	 * Creates common API error responses
	 */
	createApiErrorResponse: (
		error: string,
		description: string,
		status = 400,
	): MockResponse => ({
		ok: false,
		status,
		json: () =>
			Promise.resolve({
				error,
				error_description: description,
			}),
	}),

	/**
	 * Creates network error for fetch mocking
	 */
	createNetworkError: () => new Error("Network error"),

	/**
	 * Creates a paginated response mock
	 */
	createPaginatedResponse: (
		items: unknown[],
		nextToken: string | undefined = undefined,
	) => ({
		items,
		pagination: {
			nextToken,
		},
	}),
};

/**
 * Common test URLs for consistent testing
 */
export const TestUrls = {
	base: new URL("https://api.test.example.com"),
	apps: new URL("https://api.test.example.com/apps"),
	objects: new URL("https://api.test.example.com/objects"),
	connections: new URL("https://api.test.example.com/connections"),
	configurations: new URL("https://api.test.example.com/configurations"),
	withPath: (path: string) => new URL(path, "https://api.test.example.com"),
};

/**
 * Common test setup utilities
 */
export const TestSetup = {
	/**
	 * Standard beforeEach setup for most tests
	 */
	standardBeforeEach: () => {
		vi.clearAllMocks();
		return MockHelpers.setupGlobalMocks();
	},

	/**
	 * Standard afterEach cleanup for most tests
	 */
	standardAfterEach: () => {
		vi.restoreAllMocks();
	},

	/**
	 * Creates a test environment with common mocks
	 */
	createTestEnvironment: () => {
		const { mockFetch } = MockHelpers.setupGlobalMocks();
		const mockAuthorization = MockHelpers.createMockAuthorization();
		const testUrl = TestUrls.base;

		return {
			mockFetch,
			mockAuthorization,
			testUrl,
		};
	},
};

/**
 * Date utilities for consistent test dates
 */
export const TestDates = {
	fixed: new Date("2024-01-01T00:00:00.000Z"),
	fixedIso: "2024-01-01T00:00:00.000Z",
	fixedUpdated: new Date("2024-01-02T00:00:00.000Z"),
	fixedUpdatedIso: "2024-01-02T00:00:00.000Z",
	now: () => new Date(),
	nowIso: () => new Date().toISOString(),
};
