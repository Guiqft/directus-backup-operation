import { defineOperationApi } from "@directus/extensions-sdk"
import { FilesService, FoldersService } from "directus"
import fs from "fs"
import util from "util"
import childProccess from "child_process"

import pkg from "../package.json"
import { getFileName, getFolderId } from "./utils"

const exec = util.promisify(childProccess.exec)

export default defineOperationApi<{ folder: string }>({
    id: "backup",
    handler: async (
        { folder },
        { database: db, services, getSchema, logger }
    ) => {
        const schema = await getSchema()

        const filesService: FilesService = new services.FilesService({
            schema,
            knex: db,
        })
        const foldersService: FoldersService = new services.FoldersService({
            schema,
        })

        const fileName = getFileName()
        try {
            const { user, database, host, port, password } = (
                db.client as IDbClient
            ).connectionSettings

            await exec(
                `PGHOST=${host} PGPORT=${port} PGDATABASE=${database} PGUSER=${user} PGPASSWORD=${password} pg_dump --format=c --file=${fileName}`
            )

            await filesService.uploadOne(fs.createReadStream(fileName), {
                title: fileName,
                type: "application/octet-stream",
                filename_download: fileName,
                storage: "local",
                folder: folder
                    ? await getFolderId(folder, foldersService)
                    : undefined,
            })
            fs.unlinkSync(fileName)

            logger.info(
                `[${pkg.name}] New database backup created: ${fileName}`
            )
        } catch (e) {
            if (fs.existsSync(fileName)) {
                fs.unlinkSync(fileName)
            }
            logger.error(
                `[${pkg.name}] Error on database backup: ${
                    (e as Error).message
                }`
            )
            throw e
        }
    },
})
