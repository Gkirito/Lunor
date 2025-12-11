import { DataSource } from 'typeorm'

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'lunolens',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    schema: process.env.DB_SCHEMA || 'assethub',
    entities: ['src/model/generated/*.model.ts'],
    migrations: ['db/migrations/*.js'],
    synchronize: false,
    logging: false,
})
