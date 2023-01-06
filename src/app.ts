import { defineOperationApp } from "@directus/extensions-sdk"

export default defineOperationApp({
    id: "backup",
    name: "Backup",
    icon: "backup",
    description: "Backup your Postgres DB",
    overview: ({ storage, folder }) => {
        const storageOptions = [
            { text: "Local", value: "local" },
            { text: "S3", value: "s3" },
            { text: "Google Cloud Storage", value: "gcs" },
            { text: "Azure", value: "azure" },
        ]

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
                width: "half",
                interface: "select-dropdown",
                note: "Make sure you have the required configs",
                required: true,
                options: {
                    choices: storageOptions,
                    allowOther: true,
                },
            },
        },
        {
            field: "folder",
            name: "$t:interfaces.system-folder.folder",
            type: "uuid",
            meta: {
                width: "half",
                interface: "system-folder",
                note: "Where to show your backups on Directus",
            },
        },
        {
            field: "customConnection",
            name: "Custom Connection",
            type: "json",
            meta: {
                width: "full",
                interface: "input-code",
                options: {
                    language: "json",
                    placeholder: JSON.stringify(
                        {
                            host: "localhost",
                            port: 8432,
                            database: "directus",
                            user: "directus",
                            password: "password",
                        },
                        null,
                        2
                    ),
                    template: JSON.stringify(
                        {
                            host: "localhost",
                            port: 8432,
                            database: "directus",
                            user: "directus",
                            password: "password",
                        },
                        null,
                        2
                    ),
                },
            },
        },
    ],
})
