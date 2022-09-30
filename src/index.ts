import { defineEndpoint } from "@directus/extensions-sdk"
import { FilesService, FoldersService } from "directus"
import * as dotenv from "dotenv"
import fs from "fs"
import util from "util"
import childProccess from "child_process"

import { errorHandler, getFileName, getFolderId } from "./utils"

const exec = util.promisify(childProccess.exec)
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

                await exec(
                    `PGHOST=${host} PGPORT=${port} PGDATABASE=${database} PGUSER=${user} PGPASSWORD=${password} pg_dump --format=c --file=${fileName}`
                )

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
