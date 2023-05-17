const config = {
    app: {
      port: process.env.PORT || 8080,
      name: 'iExpress'
    },
    db: {
      host: 'localhost',
      port: 27017,
      name: 'db'
    },
    backup: {
      saveFile: false,
      path: './backup'
    }
};
   
module.exports = config;