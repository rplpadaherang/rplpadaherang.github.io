let dbPromised = idb.open('football', 1, upgradeDb => {
  switch (upgradeDb.oldVersion) {
    case 0:
      upgradeDb.createObjectStore('matches', { 'keyPath': 'id' })
      upgradeDb.createObjectStore('teams', { 'keyPath': 'id' })
  }
});

let insertMatch = (match) => {
  dbPromised.then(db => {
    let tx = db.transaction('matches', 'readwrite');
    let store = tx.objectStore('matches')
    store.put(match)
    return tx.complete;
  }).then(() => {
    M.toast({ html: `Match ${match.homeTeam.name} VS ${match.awayTeam.name}\nhas saved!` })
    console.log('Match has saved');
  }).catch(err => {
    console.error('Match not saved', err);
  });
}

let deleteMatch = (matchId) => {
  dbPromised.then(db => {
    let tx = db.transaction('matches', 'readwrite');
    let store = tx.objectStore('matches');
    store.delete(matchId);
    return tx.complete;
  }).then(() => {
    M.toast({ html: 'Match has deleted!' });
    // SaveMatch();
  }).catch(err => {
    console.error('Error: ', err);
  });
}


let getSaveMatch = () => {
  return dbPromised.then(db => {
    let tx = db.transaction('matches', 'readonly');
    let store = tx.objectStore('matches');
    return store.getAll();
  })
}

// buat fungsi untuk mendapatkan data berdsarkan id pada indexDb.
// ini bisa digunakan untuk cek data  apakah tersedia di db
const getDbById = (id) => {
  // kembalikan promise resolve atau reject
  return new Promise(function (resolve, reject) {
    dbPromised
      .then(function (db) {
        var tx = db.transaction("matches", "readonly");
        var store = tx.objectStore("matches");
        return store.get(id);
      })
      .then(function (team) {
        // kembalikan ke resolve saat sukses
        resolve(team);
      });
  });
}

