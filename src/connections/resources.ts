import type { MondoAppConnect } from "../common/init.js";
import {
	deleteItemWithAuthorization,
	getItemWithAuthorization,
	putItemWithAuthorization,
} from "../common/resources/operations.js";
import {
	addFiltersToURL,
	addPaginationToURL,
	parseEgressSchema,
	parseIngressSchema,
} from "../common/resources/utils.js";
import {
	type PaginationCollection,
	PaginationCollectionSchema,
} from "../common/schema/collection.js";
import type { Pagination } from "../common/schema/pagination.js";
import {
	type ConnectionPayload,
	ConnectionPayloadSchema,
	type Source,
	type Target,
	type UpsertConnectionInput,
	type UpsertConnectionPayload,
	UpsertConnectionPayloadSchema,
} from "./schema.js";

const PATH = "/v1/connections";

export class ConnectionResources {
	public constructor(private readonly instance: MondoAppConnect) {}

	public listItems(
		source: Source,
		filter?: Partial<Target>,
		pagination?: Pagination,
	): Promise<PaginationCollection<ConnectionPayload>> {
		return listConnections(this.instance, source, filter, pagination);
	}

	public associateItem(
		source: Source,
		item: UpsertConnectionInput,
	): Promise<ConnectionPayload> {
		return associateConnection(this.instance, source, item);
	}

	public dissociateItem(
		source: Source,
		item: UpsertConnectionInput,
	): Promise<ConnectionPayload> {
		return dissociateConnection(this.instance, source, item);
	}
}

export function buildConnectionListingURL(
	instance: MondoAppConnect,
	source: Source,
	filter?: Partial<Target>,
	pagination?: Pagination,
): URL {
	return addFiltersToURL(
		addPaginationToURL(
			new URL(
				`${PATH}/${source.app}/${source.object}/${source.id}`,
				instance.config.host,
			),
			pagination,
		),
		filter,
	);
}

export function buildConnectionItemURL(
	instance: MondoAppConnect,
	source: Source,
): URL {
	return new URL(
		`${PATH}/${source.app}/${source.object}/${source.id}`,
		instance.config.host,
	);
}

export function parseConnectionListingResponse(
	data: unknown,
): PaginationCollection<ConnectionPayload> {
	return parseEgressSchema(
		PaginationCollectionSchema(ConnectionPayloadSchema).safeParse(data),
	);
}

export function parseConnectionItemResponse(data: unknown): ConnectionPayload {
	return parseEgressSchema(ConnectionPayloadSchema.safeParse(data));
}

export function parseConnectionUpsertPayload(
	data: unknown,
): UpsertConnectionPayload {
	return parseIngressSchema(UpsertConnectionPayloadSchema.safeParse(data));
}

export async function listConnections(
	instance: MondoAppConnect,
	source: Source,
	filter?: Partial<Target>,
	pagination?: Pagination,
): Promise<PaginationCollection<ConnectionPayload>> {
	return parseConnectionListingResponse(
		await getItemWithAuthorization(
			buildConnectionListingURL(instance, source, filter, pagination),
			instance.authorizer,
		),
	);
}

export async function associateConnection(
	instance: MondoAppConnect,
	source: Source,
	item: UpsertConnectionInput,
): Promise<ConnectionPayload> {
	return parseConnectionItemResponse(
		await putItemWithAuthorization(
			buildConnectionItemURL(instance, source),
			instance.authorizer,
			parseConnectionUpsertPayload(item),
		),
	);
}

export async function dissociateConnection(
	instance: MondoAppConnect,
	source: Source,
	item: UpsertConnectionInput,
): Promise<ConnectionPayload> {
	return parseConnectionItemResponse(
		await deleteItemWithAuthorization(
			buildConnectionItemURL(instance, source),
			instance.authorizer,
			parseConnectionUpsertPayload(item),
		),
	);
}
