import internal from "stream"

export const getFileName = (connection: IConnection) => {
    const date = new Date()
    const currentDate = `${date.getFullYear()}.${
        date.getMonth() + 1
    }.${date.getDate()}.${date.getHours()}.${date.getMinutes()}`
    return connection.name
        ? `${slug(connection.name)}-${currentDate}.dump`
        : `database-backup-${currentDate}.dump`
}

export const slug = (test: string) =>
    test
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "")

export const checkStreamError = (stream: internal.Readable | null) =>
    new Promise((res, rej) => {
        const errors: string[] = []
        stream?.on("data", (e) => errors.push(e))
        stream?.on("end", () => {
            if (errors.length) {
                rej(errors.join(". "))
            }

            res(undefined)
        })
    })
