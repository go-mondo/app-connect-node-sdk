import { MondoAppConnect } from "./init.js";

export {
	createHost,
	type Config,
	type ConfigProps,
	type Host,
	type HostProps,
} from "./init.js";
export {
	defaultMutationRequestHeaders,
	defaultRequestHeaders,
	parseEgressSchema,
	parseIngressSchema,
	responseToHttpError,
	toHttpError,
} from "./resources/utils.js";
export * from "./schema/schema.js";

export default MondoAppConnect;
