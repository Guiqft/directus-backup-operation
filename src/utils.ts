export const getFileName = () => {
    const date = new Date()
    const currentDate = `${date.getFullYear()}.${
        date.getMonth() + 1
    }.${date.getDate()}.${date.getHours()}.${date.getMinutes()}`
    return `database-backup-${currentDate}.dump`
}
