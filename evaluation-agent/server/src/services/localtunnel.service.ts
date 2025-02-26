import { BaseService } from "./base.service.js";
import localtunnel from "localtunnel";

export class LocalTunnelService extends BaseService {
    private static instance: LocalTunnelService;
    private url: string | null = null;
    private tunnel: localtunnel.Tunnel | null = null;

    private constructor() {
        super();
    }

    public static getInstance(): LocalTunnelService {
        if (!LocalTunnelService.instance) {
            LocalTunnelService.instance = new LocalTunnelService();
        }
        return LocalTunnelService.instance;
    }

    public async start(): Promise<void> {
        this.tunnel = await localtunnel({
            port: parseInt(process.env.PORT || "3002"),
            // Optional: you can specify a subdomain if you want a consistent URL
            // subdomain: 'your-preferred-subdomain'
        });
        this.url = this.tunnel.url;
        console.log("Tunnel created:", this.url);


        this.tunnel.on('error', (err) => {
            console.error('Tunnel error:', err);
        });

        // Handle tunnel close
        this.tunnel.on('close', () => {
            console.log('Tunnel closed');
            this.url = null;
            this.tunnel = null;
        });

        return;
    }

    public getUrl(): string | null {
        return this.url;
    }

    public async stop(): Promise<void> {
        if (this.tunnel) {
            await this.tunnel.close();
            this.tunnel = null;
            this.url = null;
        }
    }
}
