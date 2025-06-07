declare global {
    namespace NodeJS {
        interface ProcessEnv {
            RABBITMQ_URL: string;
            USER_MSS_PORT: string;
            CATALOG_MSS_PORT: string;
            ALUGUEL_MSS_PORT: string;
            DISPONIBILIDADE_MSS_PORT: string
            PROPRIEDADE_MSS_PORT: string;
        }
    }
}
export {};