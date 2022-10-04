# Directus Backup Operation

<br />
<p align="center">
  <img src="https://i.ibb.co/3dLBPqd/image-removebg-preview-4.png" alt="35190391-removebg-preview" border="0" height="180" width="180"/>
  <p align="center">
    Custom Directus operation to backup Postgres database using <code>pg_dump</code> and upload the <code>.dump</code> file into Directus storage.
    <br />
  </p>
</p>

## Prerequisites

Make sure you have installed the following prerequisites on your Directus machine. 

- PostgreSQL Client - [Install PSQL](https://packages.ubuntu.com/bionic/any/postgresql-client). Needs to be installed so Node can spawn `pg_dump` process. If running in Docker, you can check this [example repo](https://github.com/Guiqft/directus-psql-docker-example).

## Usage

Clone this project inside your `/extensions/operations` folder, then:

```bash
cd directus-backup-operation/
```

```bash
yarn && yarn build
```


After activate the extension, you can create a new Directus flow and choose how to trigger the database backup 🚀

## Configuration

You can choose which folder to upload the database `.dump` file, just type the folder name on operation register. Make sure to type a valid folder name on your Directus storage.

> For now, this extension supports only `local` as Directus storage
