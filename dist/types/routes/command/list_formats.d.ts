export default function list_formats({ query, verbose, onionTor, }: {
    query: string;
    verbose?: boolean;
    onionTor?: boolean;
}): Promise<void>;
