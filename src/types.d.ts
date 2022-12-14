interface IConnection {
    id?: string
    name?: string
    host: string
    port: number
    database: string
    user: string
    password: string
    ssl: boolean
}
