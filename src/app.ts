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
            name: "$t:interfaces.system-folder.folder",
            type: "uuid",
            meta: {
                width: "half",
                interface: "system-folder",
                note: "$t:interfaces.system-folder.field_hint",
            },
            schema: {
                default_value: undefined,
            },
        },
    ],
})
