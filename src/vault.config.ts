export class VaultConfig {
    // Indicates if the HTTP request to the Vault server should use
    // HTTPS (secure) or HTTP (non-secure) protocol
    https: boolean;
    // If https is true, then provide client certificate, client key and
    // the root CA cert
    // Client cert and key are optional now
    cert?: string;
    key?: string;
    cacert?: string;
    // Indicate the server name/IP, port and API version for the Vault,
    // all paths are relative to this one
    baseUrl: string;
    // Sets the root path after the base URL, it translates to a
    // partition inside the Vault where the secret engine / auth method was enabled
    // Can be passed individually on each function through mount parameter
    rootPath: string;
    // HTTP request timeout in milliseconds
    timeout: number;
    // If should use a proxy or not by the HTTP request
    // Example:
    // proxy: { host: proxy.ip, port: proxy.port }
    proxy: boolean;
    // Namespace (multi-tenancy) feature available on all Vault Enterprise versions
    namespace?: string;
}
