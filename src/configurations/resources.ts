import type { AppHandle } from "../apps/schema.js";
import type { MondoAppConnect } from "../common/init.js";
import { getItemWithAuthorization } from "../common/resources/operations.js";
import {
	addFiltersToURL,
	addPaginationToURL,
	parseEgressSchema,
} from "../common/resources/utils.js";
import {
	type PaginationCollection,
	PaginationCollectionSchema,
} from "../common/schema/collection.js";
import type { Pagination } from "../common/schema/pagination.js";
import {
	type ConfigurationPayload,
	ConfigurationPayloadSchema,
} from "./schema.js";

const PATH = "/v1/configurations";

export type ConfigurationListingFilter = {
	app?: AppHandle;
};

export class ConfigurationResources {
	public constructor(private readonly instance: MondoAppConnect) {}

	public listItems(
		filter?: ConfigurationListingFilter,
		pagination?: Pagination,
	): Promise<PaginationCollection<ConfigurationPayload>> {
		return listConfigurations(this.instance, filter, pagination);
	}
}

export function buildConfigurationListingURL(
	instance: MondoAppConnect,
	filter?: ConfigurationListingFilter,
	pagination?: Pagination,
): URL {
	return addFiltersToURL(
		addPaginationToURL(new URL(PATH, instance.config.host), pagination),
		filter,
	);
}

export function parseConfigurationListingResponse(
	data: unknown,
): PaginationCollection<ConfigurationPayload> {
	return parseEgressSchema(
		PaginationCollectionSchema(ConfigurationPayloadSchema).safeParse(data),
	);
}

export async function listConfigurations(
	instance: MondoAppConnect,
	filter?: ConfigurationListingFilter,
	pagination?: Pagination,
): Promise<PaginationCollection<ConfigurationPayload>> {
	return parseConfigurationListingResponse(
		await getItemWithAuthorization(
			buildConfigurationListingURL(instance, filter, pagination),
			instance.authorizer,
		),
	);
}
