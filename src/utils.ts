import { FoldersService } from "directus"

export const getFileName = () => {
    const date = new Date()
    const currentDate = `${date.getFullYear()}.${
        date.getMonth() + 1
    }.${date.getDate()}.${date.getHours()}.${date.getMinutes()}`
    return `database-backup-${currentDate}.dump`
}

export const getFolderId = async (
    name: string,
    service: FoldersService
): Promise<string | undefined> => {
    const [folder] = await service.readByQuery({
        filter: { name: { _eq: name } },
        limit: 1,
    })

    if (!folder) {
        throw new Error("Invalid backup folder config")
    }

    return folder.id
}
