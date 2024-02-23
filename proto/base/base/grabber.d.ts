interface grabber {
    domain: string;
    query: string;
    route: string;
}
export default function grabber({ query, route, domain, }: grabber): Promise<string | null>;
export {};
//# sourceMappingURL=grabber.d.ts.map