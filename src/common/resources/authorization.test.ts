import { describe, expect, test } from "vitest";
import type { Authorization } from "./authorization.js";

describe("Authorization", () => {
	test("should be a function type that takes RequestInit and returns RequestInit", () => {
		// Test that Authorization type can be implemented correctly
		const mockAuth: Authorization = (request: RequestInit) => {
			return {
				...request,
				headers: new Headers({
					...Object.fromEntries((request.headers as Headers)?.entries() || []),
					authorization: "Bearer test-token",
				}),
			};
		};

		const testRequest: RequestInit = {
			method: "GET",
			headers: new Headers({ "content-type": "application/json" }),
		};

		const result = mockAuth(testRequest);

		expect(result).toEqual({
			method: "GET",
			headers: expect.any(Headers),
		});
		expect((result.headers as Headers).get("authorization")).toBe("Bearer test-token");
		expect((result.headers as Headers).get("content-type")).toBe("application/json");
	});

	test("should allow identity function implementation", () => {
		const identityAuth: Authorization = (request: RequestInit) => request;
		
		const testRequest: RequestInit = {
			method: "POST",
			body: JSON.stringify({ test: "data" }),
		};

		const result = identityAuth(testRequest);
		expect(result).toBe(testRequest);
	});

	test("should allow modification of request properties", () => {
		const modifyingAuth: Authorization = (request: RequestInit) => ({
			...request,
			method: "POST",
			headers: new Headers({ authorization: "Bearer modified-token" }),
		});

		const testRequest: RequestInit = {
			method: "GET",
		};

		const result = modifyingAuth(testRequest);
		expect(result.method).toBe("POST");
		expect((result.headers as Headers).get("authorization")).toBe("Bearer modified-token");
	});
});