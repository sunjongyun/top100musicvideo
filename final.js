class MyOutput {
    constructor(status, url, message) {
        this.status = status;
        this.url = url;
        this.message = message;
    }

    get getStatus() {
        return this.status;
    }

    get getUrl() {
        return this.url;
    }

    get getMessage() {
        return this.message;
    }
}

window.onload = function () {
    // alert("Hi");
    getTopTracks();

    eventHandler();
}

function eventHandler() {

    document.addEventListener("click", function (event) {
        if (event.target.nodeName == "A") {

            // fetch
            const target = document.querySelector("#" + event.target.id);
            getVideoId(target.value)
                .then(videoId => {
                    console.log(videoId);
                    window.open(`https://www.youtube.com/watch?v=${videoId}`);
                })
                .catch(error => {
                    console.error("Error retrieving video ID:", error);
                });

            event.preventDefault();
        }
    });
}

function getVideoId(url) {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(resp => resp.json())
            .then(data => {
                if (data.items && data.items.length > 0) {
                    const videoId = data.items[0].id.videoId;

                    console.log(videoId);
                    return resolve(videoId);
                    //     https://www.youtube.com/watch?v=${videoId}
                } else {
                    reject("No video found");
                }
            })
            .catch(e => {
                console.error(e);
                reject(e);
            });
    });
}

function getMusicVideoLink({name, artist}) {

    const searchString = `${name} ${artist} music Video`;
    const apiKey = "AIzaSyB2ciLLeUnuMa-wSBZLlGwx_-6ieqBv_GQ";
    const url = `https://www.googleapis.com/youtube/v3/search?q=${encodeURIComponent(searchString)}&part=snippet&type=video&maxResults=1&key=${apiKey}`;

    return url;
    /*fetch(url)
        .then(response => {
            console.log(response);
            console.log(response.json());
            return response.json();
        })
        .then(data => {
            if (data.items && data.items.length > 0) {
                const videoId = data.items[0].id.videoId;
                const myOutput = new MyOutput("success", `https://www.youtube.com/watch?v=${videoId}`, "");

                console.log(myOutput);

                // return myOutput;
            } else {
                // return new MyOutput("fail", null, "No music found");
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            // return new MyOutput("fail", null, "An error occurred while fetching data.");
        });*/
}

function searchMusicVideo() {
    var songTitle = "postmalone overdrive";
    // var songTitle = document.getElementById("songTitleInput").value;
    var apiKey = "AIzaSyB2ciLLeUnuMa-wSBZLlGwx_-6ieqBv_GQ";

    var url = `https://www.googleapis.com/youtube/v3/search?q=${encodeURIComponent(songTitle + " music video")}&part=snippet&type=video&maxResults=1&key=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.items && data.items.length > 0) {
                var videoId = data.items[0].id.videoId;
                var musicVideoUrl = `https://www.youtube.com/watch?v=${videoId}`;
                document.getElementById("result").innerHTML = `<a href="${musicVideoUrl}" target="_blank">${songTitle} Music Video</a>`;
            } else {
                document.getElementById("result").innerHTML = "No music video found for the given song title.";
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            document.getElementById("result").innerHTML = "An error occurred while fetching data.";
        });
}


const clientId = "36d0b180bb914fd7ac94a2e8a94ebf10"; // Spotify Developer Dashboard에서 받은 클라이언트 ID
const clientSecret = '5dc9afb40d3a43b2a20d3a96d5869557'; // Spotify Developer Dashboard에서 받은 클라이언트 시크릿
const token = `${clientId}:${clientSecret}`;

// Spotify API에 액세스 토큰을 요청합니다.
async function getAccessToken() {
    const response = await axios.post('https://accounts.spotify.com/api/token', null, {
        params: {
            grant_type: 'client_credentials'
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(token)
        }
    });
    return response.data.access_token;
}

// Spotify API를 사용하여 노래 순위를 가져옵니다.
async function getTopTracks() {
    try {
        const accessToken = await getAccessToken();

        const response = await axios.get('https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF/tracks', {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            },
            params: {
                limit: 100
            }
        });

        const tracks = response.data.items.map(item => {
            return {
                name: item.track.name,
                artist: item.track.artists.map(artist => artist.name).join(', ')
            };
        });

        // console.log('Top 100 tracks:');

        // ul 요소 생성
        const ol = document.createElement("ol");

        let cnt = 1;

        tracks.forEach((track, index) => {
            const li = document.createElement("li");
            const a = document.createElement("a");
            // console.log(getMusicVideoLink(track));
            // console.log(myOutput.getStatus());
            a.value = getMusicVideoLink(track);
            a.id = `track_${cnt}`;
            a.href = "#";
            // a.href =
            a.target = "_black";
            a.textContent = `${track.name} - ${track.artist}`;
            li.appendChild(a);
            ol.appendChild(li);

            cnt++;
            // console.log(`${index + 1}. ${track.name} - ${track.artist}`);
        });

        const top100 = document.querySelector("#top100");
        top100.appendChild(ol);
    } catch (error) {
        console.error('Error:', error.message);
    }
}