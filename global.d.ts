import { CorsOptions } from "cors";
import { DecodedJwt } from '@interfaces/auth.interface'

export interface CustomCorsOptions extends CorsOptions {
    origin: (requestOrigin: string | undefined, callback: (err: Error | null, origin?: StaticOrigin) => void) => void;
}