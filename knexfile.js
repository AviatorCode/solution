// Update with your config settings.

module.exports = {
  development: {
    client: 'pg', // This setting corresponds to the db connection js package
    connection: {
      database: 'knex_cluckr',
      // The following two fields are nrequired for a Linux
      // setup. If you don't have a password for your user,
      // you must create one.
      // To set a password, do the following:
      // $ psql
      // my_user=# \password
      //
      username: "aviator",
      password: "aviator"
    },
    migrations: {
      tableName: 'migrations',
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds',
    },
  },
};
