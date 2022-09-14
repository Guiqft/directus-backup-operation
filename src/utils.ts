import { FoldersService } from "directus"
import { Request, NextFunction, Response } from "express"

export const getFileName = () => {
    const date = new Date()
    const currentDate = `${date.getFullYear()}.${
        date.getMonth() + 1
    }.${date.getDate()}.${date.getHours()}.${date.getMinutes()}`
    return `database-backup-${currentDate}.dump`
}

export const getFolderId = async (
    service: FoldersService
): Promise<string | undefined> => {
    let folderId
    if (process.env.DIRECTUS_BACKUPS_FOLDER) {
        const [folder] = await service.readByQuery({
            filter: { name: { _eq: process.env.DIRECTUS_BACKUPS_FOLDER } },
            limit: 1,
        })

        if (!folder) {
            throw new Error("Invalid backup folder config")
        }

        folderId = folder.id
    }

    return folderId
}

export const errorHandler = (
    err: any,
    _: Request,
    res: Response,
    next: NextFunction
) => {
    if (res.headersSent) {
        return next(err)
    }
    res.status(err.status || 500)
    res.json({
        error: { ...err },
        message: err.message,
    })
}
