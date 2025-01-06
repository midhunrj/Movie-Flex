
interface ImportMetaEnv {
    readonly VITE_USER_URL: string;
    readonly VITE_ADMIN_URL: string;
    readonly VITE_THEATRE_URL: string;
    
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}