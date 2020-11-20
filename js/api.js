var DataMatch;
const token = 'bad3d24623da46e18dc267129c4d70c7'
const tahun = 2001
var base_url = "https://api.football-data.org/v2/";
var standing_ep = `${base_url}competitions/${tahun}/standings?standingType=TOTAL`;
var matches_ep = `${base_url}competitions/${tahun}/matches`;

var fetchApi = url => {
  return fetch(url, {
    headers: {
      'X-Auth-Token': token
    }
  });
}

function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    return Promise.reject(new Error(response.statusText));
  } else {
    return Promise.resolve(response);
  }
}

function json(response) {
  return response.json();
}

function error(error) {
  console.log("Error : " + error);
}

var getStandings = () => {
  if ('caches' in window) {
    caches.match(standing_ep).then(function (response) {
      if (response) {
        response.json().then(function (data) {
          Standings(data);
        });
      }
    });
  }

  fetchApi(standing_ep)
    .then(status)
    .then(json)
    .then(data => {
      Standings(data);
    })
    .catch(error => {
      console.log(error);
    })
}

var Standings = (data) => {
  let str = JSON.stringify(data).replace(/http:/g, 'https:');
  data = JSON.parse(str);
  var html = ''
  data.standings.forEach(standing => {
    var detail = ''
    standing.table.forEach(result => {
      detail += `
            <tr>
            <td>${result.position}</td>
            <td><img class="responsive-img" width="32" height="32" alt="Logo Team" src="${ result.team.crestUrl.replace(/^http:\/\//i, 'https://') || 'img/empty_badge.svg'}"> </td>
            <td>${result.team.name}</td>
            <td>${result.playedGames}</td>
            <td>${result.won}</td>
            <td>${result.draw}</td>
            <td>${result.lost}</td>
            <td>${result.points}</td>
          </tr>
          `;
    })

    html += `
        <div class="card">
        <div class="card-content">
        <h5 class="header">${standing.group}</h5>
        <table class="responsive-table">
        <thead>
          <tr>
            <th>Pos</th>
            <th>Logo</th>
            <th>Team Name</th>
            <th>Played</th>
            <th>Won</th>
            <th>Draw</th>
            <th>Lost</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>` + detail + `</tbody>
        </table>
        </div>
        </div>
        </div>
      `
  });
  document.getElementById("articles").innerHTML = html;

}

var getMatches = () => {

  if ('caches' in window) {
    caches.match(matches_ep).then(function (response) {
      if (response) {
        response.json().then(function (data) {
          Matches(data);
        });
      }
    });
  }
  fetchApi(matches_ep)
    .then(status)
    .then(json)
    .then(data => {
      Matches(data);
    })
    .catch(error => {
      console.log(error);
    })
}
var Matches = (data) => {
  DataMatch = data;
  let str = JSON.stringify(data).replace(/http:/g, 'https:');
  data = JSON.parse(str);

  var html = ''
  data.matches.forEach(match => {
    html += `
          <div class="card">
            <div class="card-content card-match" padding="1em">
              <div class="row">
                <div class="col s10">${match.homeTeam.name || 'home tim'}</div>
                <div class="col s2">${match.score.fullTime.homeTeam || '0'}</div>
              </div>
              <div class="row">
                <div class="col s10">${match.awayTeam.name || 'away tim'}</div>
                <div class="col s2">${match.score.fullTime.awayTeam || '0'}</div>
              </div>
              
            </div>
            <div class="card-action right-align">
            <a class="btn-save waves-effect waves-light btn-small" data-idmatch ="${match.id}">Save</a>
            </div>
          </div>
        </div>
          `
  });
  document.getElementById("articles2").innerHTML = html;
  // ambil semua element class btn-save
  const btnSave = document.querySelectorAll('.btn-save');

  btnSave.forEach(button => {
    let id = button.getAttribute('data-idmatch');
    id = parseInt(id);

    // simpan fungsi getById yang ada di db.js.
    const cekDb = getDbById(id);

    // cek apakah data ada di databse
    cekDb.then(function (data) {
      let isDbExist;

      // Load Button
      if (data) {
        button.innerHTML = 'Hapus'
        button.classList.add('red');
        isDbExist = true;

        // kondisi jika data tidak ada di indexDb
      } else {
        button.innerHTML = 'Simpan'
        button.classList.remove('red');
        isDbExist = false;
      }

      button.addEventListener('click', (event) => {

        if (isDbExist) {
          event.preventDefault();
          deleteMatch(id);
          button.innerHTML = 'Simpan'
          button.classList.remove('red');
          isDbExist = false;

        } else {
          event.preventDefault();
          insertMatchListener(id);
          button.innerHTML = 'Hapus'
          button.classList.add('red');
          isDbExist = true;
        }
      })
    })


  })
}


var SaveMatch = () => {
  var matches = getSaveMatch()
  matches.then(data => {
    DataMatch = data;
    var str = JSON.stringify(data).replace(/http:/g, 'https:');
    data = JSON.parse(str);
    var html = '';

    // Notifikasi jika belum ada data yang disimpan
    if (data.length === 0) {
      return document.getElementById("save-match").innerHTML = `<h5>Anda Belum menyimpan tim favorite</h5>`;
    }
    data.forEach(match => {
      html += `
            
            <div class="card">
            <div class="card-content card-match" padding="1em">
              <div class="row">
                <div class="col s10">${match.homeTeam.name || 'home tim'}</div>
                <div class="col s2">${match.score.fullTime.homeTeam || '0'}</div>
              </div>
              <div class="row">
                <div class="col s10">${match.awayTeam.name || 'away tim'}</div>
                <div class="col s2">${match.score.fullTime.awayTeam || '0'}</div>
              </div>
              
            </div>
              <div class="card-action right-align">
              <a class="btn-save red waves-effect waves-light btn-small" data-idmatch ="${match.id}">Delete</a>
              </div>
            </div>
          </div>
            `
    });
    document.getElementById("save-match").innerHTML = html;
    const btnSave = document.querySelectorAll('.btn-save');
    btnSave.forEach(button => {
      const id = button.getAttribute('data-idmatch');
      button.addEventListener('click', (event) => {
        event.preventDefault();
        deleteMatch(parseInt(id));
        SaveMatch();
      })
    })
  })
}

var insertMatchListener = matchId => {
  var match = DataMatch.matches.filter(el => el.id == matchId)[0]
  insertMatch(match)
}

var deleteMatchListener = matchId => {
  deleteMatch(matchId);
}

