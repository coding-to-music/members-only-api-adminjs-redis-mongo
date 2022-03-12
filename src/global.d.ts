import { CorsOptions } from "cors";

export interface CustomCorsOptions extends CorsOptions {
    origin: (requestOrigin: string | undefined, callback: (err: Error | null, origin?: StaticOrigin) => void) => void;
}