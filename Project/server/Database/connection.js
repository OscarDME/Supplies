import { createRequire } from "module";
const require = createRequire(import.meta.url);

var sql = require('mssql/msnodesqlv8');

//const sql = require("mssql/msnodesqlv8");

//CONFIG FOR LOCAL DATABASE
//Oscar

const config = {
  // connectionString: "Driver={ODBC Driver 18 for SQL Server};Server=(LocalDb)\\MSSQLLocalDB;Database=FitHubBD;Trusted_Connection=yes;TrustServerCertificate=yes"}


  //connectionString: "Driver={ODBC Driver 18 for SQL Server};Server=(LocalDb)\\MSSQLLocalDB;Database=FithubDB2;Trusted_Connection=yes;TrustServerCertificate=yes"}

  //connectionString: "Driver={ODBC Driver 18 for SQL Server};Server=(LocalDb)\\MSSQLLocalDB;Database=FitHubDB2;Trusted_Connection=yes;TrustServerCertificate=yes"}



// //Bruno:
  //  const config = {
   connectionString: "Driver={ODBC Driver 18 for SQL Server};Server=DESKTOP-BT83CK8\\SQLEXPRESS01;Database=FithubBD;Trusted_Connection=yes;TrustServerCertificate=yes"}
  // }

// const config = {
//   // database: "FitHubBD",
//   // server: "(LocalDb)\\MSSQLLocalDB",
//   // driver: "msnodesqlv8",
//   // options: {
//   //   trustedConnection: true
//   // },
//   driver: "msnodesqlv8",
//   // parseJSON: true, // Opcional: para analizar automáticamente resultados JSON
//   connectionString: "Driver={SQL Server Native Client 11.0};Server=(LocalDb)\\MSSQLLocalDB;Database=FitHubBD;Trusted_Connection=yes;"
// }


//CONFIG FOR CLOUD DATABASE
// const config = {
//     user: 'FHAdmin', // better stored in an app setting such as process.env.DB_USER
//     password: '4rXzVfK5vBSNp5M', // better stored in an app setting such as process.env.DB_PASSWORD
//     server: 'fithubmx.database.windows.net', // better stored in an app setting such as process.env.DB_SERVER
//     port: 1433, // optional, defaults to 1433, better stored in an app setting such as process.env.DB_PORT
//     database: 'FitHubDB', // better stored in an app setting such as process.env.DB_NAME
//     authentication: {1
//         type: 'default'
//     },
//     options: {
//         encrypt: true
//     }
// }


export const getConnection = async () => {
    try {
      const pool = await sql.connect(config);
      console.log("Conexion realizada exitosamente");
      return pool;
    } catch (error) {
      console.error(error);
    }
  };
  
export { sql };