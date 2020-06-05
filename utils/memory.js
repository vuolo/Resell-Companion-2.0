const Datastore = require('nedb');
const path = require('path');
const homedir = require('os').homedir();

function syncObject(obj, doc) {
  for (var key in doc) {
    obj[key] = doc[key];
  }
}

function syncObjects(objArr, docArr) {
  while (objArr.length > 0) {
    objArr.pop();
  }
  for (var doc of docArr) {
    objArr.push(doc)
  }
}

async function saveToDatabase(database, data) {
  return await new Promise(function(resolve, reject) {
    const dataStore = new Datastore(path.resolve(homedir, `./Resell Companion/data/${database}.db`));
    dataStore.loadDatabase();
    dataStore.update({}, data, { upsert: true }, function (err, numReplaced, upsert) {
      if (err) {
        resolve(false);
      }
      resolve(data);
    });
  });
}

async function getFromDatabase(database) {
  return await new Promise(function(resolve, reject) {
    const dataStore = new Datastore(path.resolve(homedir, `./Resell Companion/data/${database}.db`));
    dataStore.loadDatabase();
    setTimeout(function() {
      resolve(undefined);
    }, 1000 * 1); // database timeout
    dataStore.find({}, {}, function (err, docs) {
      if (docs.length > 0) {
        resolve(docs[0]);
      } else {
        resolve(undefined);
      }
    });
  });
}

module.exports = {
  syncObject: syncObject,
  syncObjects: syncObjects,
  saveToDatabase: saveToDatabase,
  getFromDatabase: getFromDatabase
};
