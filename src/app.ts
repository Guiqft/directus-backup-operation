import { defineOperationApp } from "@directus/extensions-sdk"

const storageOptions = [
    { text: "Local", value: "local" },
    { text: "S3", value: "s3" },
    { text: "Google Cloud Storage", value: "gcs" },
    { text: "Azure", value: "azure" },
]

export default defineOperationApp({
    id: "backup",
    name: "Backup",
    icon: "backup",
    description: "Backup your Postgres DB",
    overview: ({ storage, folder }) => {
        const labels = [
            {
                label: "Backup Storage",
                text:
                    storageOptions.find(({ value }) => value === storage)
                        ?.text ??
                    storage ??
                    "Invalid Storage",
            },
        ]
        if (folder) {
            labels.push({
                label: "Local Folder",
                text: folder,
            })
        }
        return labels
    },
    options: [
        {
            field: "storage",
            name: "Storage",
            type: "string",
            meta: {
                interface: "select-dropdown",
                options: {
                    choices: storageOptions,
                    allowOther: true,
                },
            },
            schema: {
                default_value: "local",
            },
        },
        {
            field: "folder",
            name: "$t:interfaces.system-folder.folder",
            type: "uuid",
            meta: {
                width: "half",
                interface: "system-folder",
                note: "Where to put your backups",
                conditions: [
                    {
                        rule: {
                            storage: {
                                _eq: "local",
                            },
                        },
                        hidden: false,
                    },
                ],
                hidden: true,
            },
            schema: {
                default_value: undefined,
            },
        },
    ],
})
