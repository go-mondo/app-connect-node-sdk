import { PATH as APP_PATH } from "../apps/resources.js";
import type { AppHandle } from "../apps/schema.js";
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
import {
	type AppObjectHandle,
	type AppObjectPayload,
	AppObjectPayloadSchema,
} from "./schema.js";

const PATH = "objects";

export class AppObjectResources {
	public constructor(private readonly instance: MondoAppConnect) {}

	public listItems(
		app: AppHandle,
		pagination?: Pagination,
	): Promise<PaginationCollection<AppObjectPayload>> {
		return listAppObjects(this.instance, app, pagination);
	}

	public getItem(
		app: AppHandle,
		object: AppObjectHandle,
	): Promise<AppObjectPayload> {
		return getAppObject(this.instance, app, object);
	}
}

export function buildAppObjectListingURL(
	instance: MondoAppConnect,
	app: AppHandle,
	pagination?: Pagination,
): URL {
	return addPaginationToURL(
		new URL(`${APP_PATH}/${app}/${PATH}`, instance.config.host),
		pagination,
	);
}

export function buildAppObjectItemURL(
	instance: MondoAppConnect,
	app: AppHandle,
	object: AppObjectHandle,
): URL {
	return new URL(`${APP_PATH}/${app}/${PATH}/${object}`, instance.config.host);
}

export function parseAppObjectListingResponse(
	data: unknown,
): PaginationCollection<AppObjectPayload> {
	return parseEgressSchema(
		PaginationCollectionSchema(AppObjectPayloadSchema).safeParse(data),
	);
}

export function parseAppObjectItemResponse(data: unknown): AppObjectPayload {
	return parseEgressSchema(AppObjectPayloadSchema.safeParse(data));
}

export async function listAppObjects(
	instance: MondoAppConnect,
	app: AppHandle,
	pagination?: Pagination,
): Promise<PaginationCollection<AppObjectPayload>> {
	return parseAppObjectListingResponse(
		await getItemWithAuthorization(
			buildAppObjectListingURL(instance, app, pagination),
			instance.authorizer,
		),
	);
}

export async function getAppObject(
	instance: MondoAppConnect,
	app: AppHandle,
	object: AppObjectHandle,
): Promise<AppObjectPayload> {
	return parseAppObjectItemResponse(
		await getItemWithAuthorization(
			buildAppObjectItemURL(instance, app, object),
			instance.authorizer,
		),
	);
}
