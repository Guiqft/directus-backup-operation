import { defineEndpoint } from "@directus/extensions-sdk"
import { FilesService, FoldersService } from "directus"
import { execute } from "@getvim/execute"
import * as dotenv from "dotenv"
import fs from "fs"

import { errorHandler, getFileName, getFolderId } from "./utils"

dotenv.config({ debug: true, path: __dirname + "/.env" })

export default defineEndpoint({
    id: "backup",
    handler: async (router, { database: db, services, getSchema }) => {
        const schema = await getSchema()

        const filesService: FilesService = new services.FilesService({
            schema,
            knex: db,
        })
        const foldersService: FoldersService = new services.FoldersService({
            schema,
        })

        router.post("/", async (_req, res, next) => {
            const fileName = getFileName()
            try {
                const { user, database, host, port, password } = (
                    db.client as IDbClient
                ).connectionSettings

                await execute(`pg_dump --format=c --file=${fileName}`, {
                    env: {
                        PGHOST: host,
                        PGPORT: String(port),
                        PGDATABASE: database,
                        PGUSER: user,
                        PGPASSWORD: password,
                    },
                })

                await filesService.uploadOne(fs.createReadStream(fileName), {
                    title: fileName,
                    folder: await getFolderId(foldersService),
                    type: "application/octet-stream",
                    filename_download: fileName,
                    storage: "local",
                })
                fs.unlinkSync(fileName)

                res.sendStatus(200)
            } catch (e) {
                if (fs.existsSync(fileName)) {
                    fs.unlinkSync(fileName)
                }
                errorHandler(e, _req, res, next)
            }
        })
    },
})
