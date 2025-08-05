import type { MondoAppConnect } from "../common/init.js";
import { getItemWithAuthorization } from "../common/resources/operations.js";
import {
	addPaginationToURL,
	parseEgressSchema,
} from "../common/resources/utils.js";
import {
	type PaginationCollection,
	PaginationCollectionSchema,
} from "../common/schema/collection.js";
import type { Pagination } from "../common/schema/pagination.js";
import { type AppHandle, type AppPayload, AppPayloadSchema } from "./schema.js";

export const PATH = "/v1/apps";

export class AppResources {
	public constructor(private readonly instance: MondoAppConnect) {}

	public listItems(
		pagination?: Pagination,
	): Promise<PaginationCollection<AppPayload>> {
		return listApps(this.instance, pagination);
	}

	public getItem(app: AppHandle): Promise<AppPayload> {
		return getApp(this.instance, app);
	}
}

export function buildAppListingURL(
	instance: MondoAppConnect,
	pagination?: Pagination,
): URL {
	return addPaginationToURL(new URL(PATH, instance.config.host), pagination);
}

export function buildAppItemURL(
	instance: MondoAppConnect,
	app: AppHandle,
): URL {
	return new URL(`${PATH}/${app}`, instance.config.host);
}

export function parseAppListingResponse(
	data: unknown,
): PaginationCollection<AppPayload> {
	return parseEgressSchema(
		PaginationCollectionSchema(AppPayloadSchema).safeParse(data),
	);
}

export function parseAppItemResponse(data: unknown): AppPayload {
	return parseEgressSchema(AppPayloadSchema.safeParse(data));
}

export async function listApps(
	instance: MondoAppConnect,
	pagination?: Pagination,
): Promise<PaginationCollection<AppPayload>> {
	return parseAppListingResponse(
		await getItemWithAuthorization(
			buildAppListingURL(instance, pagination),
			instance.authorizer,
		),
	);
}

export async function getApp(
	instance: MondoAppConnect,
	app: AppHandle,
): Promise<AppPayload> {
	return parseAppItemResponse(
		await getItemWithAuthorization(
			buildAppItemURL(instance, app),
			instance.authorizer,
		),
	);
}
