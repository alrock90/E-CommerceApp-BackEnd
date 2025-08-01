
/*
module.exports = {
  PORT: process.env.PORT,
  DB: {
    PGHOST: process.env.PGHOST,
    PGUSER: process.env.PGUSER,
    PGDATABASE: process.env.PGDATABASE,
    PGPASSWORD: process.env.PGPASSWORD,
    PGPORT: process.env.PGPORT
  },
  SESSION_SECRET: process.env.SESSION_SECRET
}*/


require('dotenv').config({ path: 'example.env' });

/*

const devConfig = {
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
};

const prodConfig = {
  connectionString: process.env.PG_CONNECTION_STRING_ONLINE,
  ssl: {
    rejectUnauthorized: false, // Ajusta según la configuración de tu hosting
  },
};

*/

const devConfig = {
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  dialect: 'postgres',
};

const prodConfig = {
  url: process.env.PGURL,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
};




const getDbConfig = () => {
  return process.env.NODE_ENV === 'production' ? prodConfig : devConfig;
};

module.exports = {
  PORT: process.env.PORT || 3000,
  SESSION_SECRET: process.env.SESSION_SECRET || 'una_cadena_secreta',
  DB: getDbConfig(),
};
