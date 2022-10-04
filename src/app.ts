import { defineOperationApp } from "@directus/extensions-sdk"

export default defineOperationApp({
    id: "backup",
    name: "Backup",
    icon: "backup",
    description: "Backup your Postgres DB",
    overview: ({ folder }) =>
        folder
            ? [
                  {
                      label: "Backup folder",
                      text: folder,
                  },
              ]
            : [],
    options: [
        {
            field: "folder",
            name: "Folder",
            type: "string",
            meta: {
                note: "Where to put your backups",
                width: "full",
                interface: "input",
            },
        },
    ],
})
