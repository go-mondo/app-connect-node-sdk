import { z } from "zod";
import {
	AppObjectHandleSchema,
	AppObjectReferenceSchema,
} from "src/objects/schema.js";
import { AppHandleSchema, AppReferenceSchema } from "../apps/schema.js";
import {
	RequiredDatePayloadSchema,
	RequiredDateSchema,
} from "../common/index.js";

export const JoinType = {
	ONE: "one",
	MANY: "many",
} as const;
export type AnyJoinType = (typeof JoinType)[keyof typeof JoinType];

const JoinSchema = z.enum([JoinType.ONE, JoinType.MANY]);
const JoinPropertySchema = z.object({
	join: JoinSchema.default(JoinType.ONE),
});

export const ConfigurationStatus = {
	ENABLED: "enabled",
	DISABLED: "disabled",
} as const;

export type AnyConfigurationStatus =
	(typeof ConfigurationStatus)[keyof typeof ConfigurationStatus];

const StatusSchema = z.enum([
	ConfigurationStatus.ENABLED,
	ConfigurationStatus.DISABLED,
]);
const StatusPropertySchema = z.object({
	status: StatusSchema.default(ConfigurationStatus.ENABLED),
});

const EntitySchema = JoinPropertySchema.extend({
	app: AppReferenceSchema,
	object: AppObjectReferenceSchema,
});
export const SourceSchema = EntitySchema;
export type Source = z.output<typeof SourceSchema>;

export const TargetSchema = EntitySchema;
export type Target = z.output<typeof TargetSchema>;

const BaseSchema = StatusPropertySchema.extend({
	source: SourceSchema,
	target: TargetSchema,
});

export const ConfigurationSchema = BaseSchema.extend({
	updatedAt: RequiredDateSchema,
});
export type ConfigurationProperties = z.input<typeof ConfigurationSchema>;
export type Configuration = z.output<typeof ConfigurationSchema>;

export const ConfigurationPayloadSchema = BaseSchema.extend({
	updatedAt: RequiredDatePayloadSchema,
});
export type ConfigurationPayload = z.output<typeof ConfigurationPayloadSchema>;

const EntityHandleSchema = z.object({
	app: AppHandleSchema,
	object: AppObjectHandleSchema,
});
const EntityReferenceHandleSchema = z.object({
	app: AppReferenceSchema.pick({ handle: true }),
	object: AppObjectReferenceSchema.pick({ handle: true }),
});

const EntityIdentifierSchema = z
	.union([EntityHandleSchema, EntityReferenceHandleSchema])
	.transform((e) => ({
		...e,
		app: {
			handle: typeof e.app === "string" ? e.app : e.app.handle,
		},
		object: {
			handle: typeof e.object === "string" ? e.object : e.object.handle,
		},
	}));

const UpsertEntitySchema = z
	.union([EntityHandleSchema, EntityReferenceHandleSchema])
	.and(JoinPropertySchema)
	.transform((e) => ({
		...e,
		app: {
			handle: typeof e.app === "string" ? e.app : e.app.handle,
		},
		object: {
			handle: typeof e.object === "string" ? e.object : e.object.handle,
		},
		join: e.join,
	}));

export const UpsertConfigurationPayloadSchema = StatusPropertySchema.extend({
	source: UpsertEntitySchema,
	target: UpsertEntitySchema,
});
export type UpsertConfigurationInput = z.input<
	typeof UpsertConfigurationPayloadSchema
>;
export type UpsertConfigurationPayload = z.output<
	typeof UpsertConfigurationPayloadSchema
>;

export const ConfigurationIdentifiersSchema = z.object({
	source: EntityIdentifierSchema,
	target: EntityIdentifierSchema,
});
export type ConfigurationIdentifiersInput = z.input<
	typeof ConfigurationIdentifiersSchema
>;
export type ConfigurationIdentifiers = z.output<
	typeof ConfigurationIdentifiersSchema
>;
export type ConfigurationIdentifiersPayload = ConfigurationIdentifiers;
