export const getFileName = (connection: IConnection) => {
    const date = new Date()
    const currentDate = `${date.getFullYear()}.${
        date.getMonth() + 1
    }.${date.getDate()}.${date.getHours()}.${date.getMinutes()}`
    return connection.name
        ? `${slug(connection.name)}-${currentDate}.dump`
        : `database-backup-${currentDate}.dump`
}

const slug = (test: string) =>
    test
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "")
