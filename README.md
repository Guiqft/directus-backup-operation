# Directus Backup Endpoint

<br />
<p align="center">
  <img src="https://i.ibb.co/3dLBPqd/image-removebg-preview-4.png" alt="35190391-removebg-preview" border="0" height="180" width="180"/>
  <p align="center">
    Custom Directus endpoint to backup the database using <code>pg_dump</code> and upload the <code>.dump</code> file into Directus files.
    <br />
  </p>
</p>


## Usage

Clone this project inside your `/extensions/endpoints` folder, then:

```bash
cd directus-backup-endpoint/
```


```bash
yarn && yarn build
```

## Configuration

You can choose which folder to upload the database `.dump` file, just copy the `.env.example` to your own `.env` and set the `DIRECTUS_BACKUPS_FOLDER` variable to a valid folder name of your Directus instance files.

> For now, this extension supports only `local` as Directus storage
