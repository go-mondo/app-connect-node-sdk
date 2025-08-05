import { z } from "zod";

const HostSchema = z
	.url({
		hostname: z.regexes.domain,
	})
	.default("https://dxnh0yagb1.execute-api.us-east-1.amazonaws.com") // Todo - Replace me!
	.transform((url) => new URL(url));
export type HostProps = z.input<typeof HostSchema>;
export type Host = z.output<typeof HostSchema>;

const ConfigSchema = z.object({
	host: HostSchema,
	accessToken: z.string().min(1),
});
export type ConfigProps = z.input<typeof ConfigSchema>;
export type Config = z.output<typeof ConfigSchema>;

export class MondoAppConnect {
	readonly config: Config;

	public constructor(config: ConfigProps) {
		this.config = createConfig(config);
	}

	/**
	 * Builds an authorizer function based on the type of access token
	 */
	public get authorizer(): (request: RequestInit) => RequestInit {
		if (this.config.accessToken) {
			return (request) => {
				request.headers = new Headers(request.headers);
				request.headers.append("authorization", this.config.accessToken);
				return request;
			};
		}

		return (request) => request;
	}
}

function createConfig(config: ConfigProps): Config {
	try {
		return ConfigSchema.parse(config);
	} catch (error) {
		if (error instanceof z.ZodError) {
			throw new Error(`Invalid configuration: ${error.message}`);
		}
		throw error;
	}
}

export function createHost(config: HostProps = undefined): Host {
	try {
		return HostSchema.parse(config);
	} catch (error) {
		if (error instanceof z.ZodError) {
			throw new Error(`Invalid host: ${error.message}`);
		}
		throw error;
	}
}
