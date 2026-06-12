import { Config, RouteParam } from 'ziggy-js';

declare global {
    function route(
        name?: string,
        params?: any,
        absolute?: boolean,
        config?: any
    ): string;
}
