import { type } from "arktype";
import { AppObjectHandleSchema, AppObjectSchema } from "src/objects/schema.js";
import { AppHandleSchema, AppSchema } from "../apps/schema.js";
import { RequiredDateSchema } from "../common/index.js";

const BaseEntitySchema = type({
	app: AppHandleSchema,
	object: AppObjectHandleSchema,
	id: "string",
});

export const EntitySchema = BaseEntitySchema.pick("id").and({
	app: AppSchema.pick("handle"),
	object: AppObjectSchema.pick("handle"),
});

export const ExpandedEntitySchema = BaseEntitySchema.pick("id").and({
	app: AppSchema.pick("name", "handle", "avatar"),
	object: AppObjectSchema.pick("name", "handle", "url"),
});

export const SourceSchema = BaseEntitySchema;
export type Source = typeof SourceSchema.inferOut;

export const TargetSchema = BaseEntitySchema;
export type Target = typeof TargetSchema.inferOut;

export const ConnectionPayloadSchema = ExpandedEntitySchema.and({
	updatedAt: RequiredDateSchema,
	inferred: type("boolean").optional(),
});
export type ConnectionInput = typeof ConnectionPayloadSchema.inferIn;
export type ConnectionPayload = typeof ConnectionPayloadSchema.inferOut;

export const UpsertConnectionPayloadSchema = TargetSchema.or(EntitySchema).pipe(
	(v) => ({
		...v,
		object: {
			handle: typeof v.object === "string" ? v.object : v.object.handle,
		},
		app: {
			handle: typeof v.app === "string" ? v.app : v.app.handle,
		},
	}),
);
export type UpsertConnectionInput =
	typeof UpsertConnectionPayloadSchema.inferIn;
export type UpsertConnectionPayload =
	typeof UpsertConnectionPayloadSchema.inferOut;
