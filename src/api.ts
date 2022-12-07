import { defineOperationApi } from "@directus/extensions-sdk"
import { FilesService } from "directus"
import fs from "fs"
import util from "util"
import childProccess from "child_process"

import pkg from "../package.json"
import { getFileName } from "./utils"

const exec = util.promisify(childProccess.exec)

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

            await exec(
                `PGHOST=${connection.host} 
                PGPORT=${connection.port} 
                PGDATABASE=${connection.database} 
                PGUSER=${connection.user} 
                PGPASSWORD=${connection.password} 
                pg_dump --format=c --file=${fileName}`
            )

            await filesService.uploadOne(fs.createReadStream(fileName), {
                title: fileName,
                type: "application/octet-stream",
                filename_download: fileName,
                storage: storage ?? "local",
                folder: folder ?? undefined,
            })

            logger.info(
                `[${pkg.name}] New database backup created: ${fileName}`
            )

            const size = fs.statSync(fileName).size
            const time = (performance.now() - start) / 1000

            fs.unlinkSync(fileName)
            return {
                connection,
                time,
                size,
            }
        } catch (e) {
            if (fs.existsSync(fileName)) {
                fs.unlinkSync(fileName)
            }
            logger.error(
                `[${pkg.name}] Error on database backup: ${
                    (e as Error).message
                }`
            )
            throw {
                connection,
                error: (e as Error).message,
            }
        }
    },
})
