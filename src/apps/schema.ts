import { type } from "arktype";
import {
	type Handle,
	HandleSchema,
	RequiredDatePayloadSchema,
	RequiredDateSchema,
} from "../common/index.js";

export { HandleSchema as AppHandleSchema, type Handle as AppHandle };

const UrlScheama = type.instanceOf(URL);
const UrlStringScheama = type("string.url");

const AnyAppAvatarUrlSchema = type("undefined")
	.or(UrlScheama)
	.or(UrlStringScheama);

export const AppAvatarUrlSchema = AnyAppAvatarUrlSchema.pipe((v) =>
	v instanceof URL ? v : v ? new URL(v) : undefined,
);

export const AppAvatarUrlStringSchema = AnyAppAvatarUrlSchema.pipe((v) =>
	v instanceof URL ? v.toString() : v,
);

export const NullableAppAvatarUrlStringSchema = AnyAppAvatarUrlSchema.or(
	"null",
).pipe((v) => (v instanceof URL ? v.toString() : v));

export const AppReferenceSchema = type({
	handle: HandleSchema,
	name: "string",
});
export type AppReference = typeof AppSchema.inferOut;

export const AppSchema = AppReferenceSchema.and({
	avatar: AppAvatarUrlSchema.optional(),
	createdAt: RequiredDateSchema,
	updatedAt: RequiredDateSchema,
});
export type AppProperties = typeof AppSchema.inferIn;
export type App = typeof AppSchema.inferOut;

export const AppPayloadSchema = AppReferenceSchema.and({
	avatar: AppAvatarUrlStringSchema.optional(),
	createdAt: RequiredDatePayloadSchema,
	updatedAt: RequiredDatePayloadSchema,
});
export type AppPayload = typeof AppPayloadSchema.inferOut;

export const InsertAppPayloadSchema = AppReferenceSchema.and({
	avatar: AppAvatarUrlStringSchema.optional(),
});
export type InsertAppInput = typeof InsertAppPayloadSchema.inferIn;
export type InsertAppPayload = typeof InsertAppPayloadSchema.inferOut;

export const UpdateAppPayloadSchema = type({
	name: type("string").optional(),
	avatar: NullableAppAvatarUrlStringSchema.optional(),
});
export type UpdateAppInput = typeof UpdateAppPayloadSchema.inferIn;
export type UpdateAppPayload = typeof UpdateAppPayloadSchema.inferOut;
