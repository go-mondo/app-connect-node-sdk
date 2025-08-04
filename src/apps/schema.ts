import { z } from "zod";
import {
	type Handle,
	HandleSchema,
	RequiredDatePayloadSchema,
	RequiredDateSchema,
} from "../common/index.js";

export { HandleSchema as AppHandleSchema, type Handle as AppHandle };

const UrlSchema = z.instanceof(URL);
const UrlStringSchema = z.url({
	hostname: z.regexes.domain,
});

const AnyAppAvatarUrlSchema = z.union([
	z.undefined(),
	UrlSchema,
	UrlStringSchema,
]);

export const AppAvatarUrlSchema = AnyAppAvatarUrlSchema.transform((v) =>
	v instanceof URL ? v : v ? new URL(v) : undefined,
);

export const AppAvatarUrlStringSchema = AnyAppAvatarUrlSchema.transform((v) =>
	v instanceof URL ? v.toString() : v,
);

export const NullableAppAvatarUrlStringSchema = AnyAppAvatarUrlSchema.or(
	z.null(),
).transform((v) => (v instanceof URL ? v.toString() : v));

export const AppReferenceSchema = z.object({
	handle: HandleSchema,
	name: z.string(),
});
export type AppReference = z.output<typeof AppReferenceSchema>;

export const AppSchema = AppReferenceSchema.extend({
	avatar: AppAvatarUrlSchema.optional(),
	createdAt: RequiredDateSchema,
	updatedAt: RequiredDateSchema,
});
export type AppProperties = z.input<typeof AppSchema>;
export type App = z.output<typeof AppSchema>;

export const AppPayloadSchema = AppReferenceSchema.extend({
	avatar: AppAvatarUrlStringSchema.optional(),
	createdAt: RequiredDatePayloadSchema,
	updatedAt: RequiredDatePayloadSchema,
});
export type AppPayload = z.output<typeof AppPayloadSchema>;

export const InsertAppPayloadSchema = AppReferenceSchema.extend({
	avatar: AppAvatarUrlStringSchema.optional(),
});
export type InsertAppInput = z.input<typeof InsertAppPayloadSchema>;
export type InsertAppPayload = z.output<typeof InsertAppPayloadSchema>;

export const UpdateAppPayloadSchema = z.object({
	name: z.string().optional(),
	avatar: NullableAppAvatarUrlStringSchema.optional(),
});
export type UpdateAppInput = z.input<typeof UpdateAppPayloadSchema>;
export type UpdateAppPayload = z.output<typeof UpdateAppPayloadSchema>;
