var common = require("./common")
  , odbc = require("../")
  , db = new odbc.ODBC()
  , assert = require("assert")
  , exitCode = 0
  ;

db.createConnection(function (err, conn) {
  conn.open(common.connectionString, function (err) {
    conn.createStatement(function (err, stmt) {
      var r, result, caughtError;
      
      var a = ['hello', 'world'];
      
      stmt.prepareSync('select ? as col1, ? as col2');
      
      stmt.bindSync(a);
      
      result = stmt.executeSync();
      
      console.log(result.fetchAllSync());
      result.closeSync();
      
      a[0] = 'goodbye';
      a[1] = 'steven';
      
      result = stmt.executeSync();
      
      r = result.fetchAllSync();
      
      try {
        assert.deepEqual(r, [ { col1: 'goodbye', col2: 'steven' } ]);
      }
      catch (e) {
        console.log(e);
        exitCode = 1;
      }
      
      conn.close(function () {
        if (exitCode) {
          console.log("failed");
        }
        else {
          console.log("success");
        }
        
        process.exit(exitCode);
      });
    });
  });
});
