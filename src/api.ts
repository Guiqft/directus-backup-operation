import { defineOperationApi } from "@directus/extensions-sdk"
import { FilesService } from "directus"
import childProccess from "child_process"

import pkg from "../package.json"
import { getFileName, checkStreamError } from "./utils"

export default defineOperationApi<{
    storage?: string
    folder?: string
    customConnection?: IConnection
}>({
    id: "backup",
    handler: async (
        { storage, folder, customConnection },
        { database: db, services, getSchema, logger }
    ) => {
        const start = performance.now()

        const schema = await getSchema()

        const filesService: FilesService = new services.FilesService({
            schema,
            knex: db,
        })

        const connection: IConnection =
            customConnection ?? db.client.connectionSettings

        const fileName = getFileName(connection)

        try {
            logger.info(
                `[${pkg.name}] Backing up connection to database ${connection.database} on host ${connection.host}`
            )

            const { stdout, stderr } = childProccess.exec(
                `PGHOST=${connection.host} PGPORT=${connection.port} PGDATABASE=${connection.database} PGUSER=${connection.user} PGPASSWORD=${connection.password} pg_dump --format=c`
            )

            const upload = filesService.uploadOne(stdout!, {
                title: fileName,
                type: "application/octet-stream",
                filename_download: fileName,
                storage: storage ?? "local",
                folder: folder ?? undefined,
            })
            const errors = checkStreamError(stderr)

            await Promise.race([upload, errors]).catch((e) => {
                throw new Error(e)
            })

            logger.info(
                `[${pkg.name}] New database backup created: ${fileName}`
            )

            const time = (performance.now() - start) / 1000
            const size = (await filesService.readOne(await upload)).filesize

            return {
                connection,
                time,
                size,
            }
        } catch (e) {
            await filesService.deleteByQuery({
                filter: {
                    title: {
                        _eq: fileName,
                    },
                },
            })

            const message = JSON.stringify((e as Error).message).replace(
                /(?:PGPASSWORD\=)[^\s]+/,
                "PGPASSWORD=********"
            )

            logger.error(
                `[${pkg.name}] Error on database backup: ${
                    (e as Error).message
                }`
            )
            throw {
                connection,
                error: message,
            }
        }
    },
})
