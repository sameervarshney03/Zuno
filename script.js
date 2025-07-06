let currentsong = new Audio();
let songs = [];
let currfolder;
let currentSongIndex = 0;

function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    let mins = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);

    // Add leading zero if needed
    mins = mins < 10 ? "0" + mins : mins;
    secs = secs < 10 ? "0" + secs : secs;

    return `${mins}:${secs}`;
}


async function getsongs(folder) {
    currfolder = folder;

    let a = await fetch(`/songs/${folder}/index.json`);
    let response = await a.json();

    songs = response.songs; // ["track1.mp3", "track2.mp3"]

    let songUL = document.querySelector(".songlist ul");
    songUL.innerHTML = "";

    songs.forEach((song, index) => {
        let displayName = decodeURIComponent(song.replace(".mp3", ""));
        songUL.innerHTML += `
            <li>
                <img class="invert" src="assets/music.svg">
                <div class="info"><div>${displayName}</div></div>
                <div class="playnow"><img src="assets/play.svg" class="invert"></div>
            </li>`;
    });

    // Attach click
    Array.from(document.querySelectorAll(".songlist li")).forEach((el, i) => {
        el.addEventListener("click", () => {
            playmusic(i);
        });
    });
}

// async function getsongs(folder) {
//     currfolder = folder;
//     let a = await fetch(`/songs/${folder}`);
//     let response = await a.text();
//     let div = document.createElement("div")
//     div.innerHTML = response;
//     let as = div.getElementsByTagName("a");
//     songs = [];
//     for (let index = 0; index < as.length; index++) {
//         const element = as[index];
//         if (element.href.endsWith(".mp3")) {
//             songs.push(element.href.split(`/songs/${folder}/`)[1])
//         }
//     }
//     let songUL = document.querySelector(".songlist ul");
//     songUL.innerHTML = "";

//     songs.forEach((song, index) => {
//         let displayName = decodeURIComponent(song.replace(".mp3", ""));
//         songUL.innerHTML += `
//             <li>
//                 <img class="invert" src="assets/music.svg">
//                 <div class="info">
//                     <div>${displayName}</div>
//                 </div>
//                 <div class="playnow">
//                     <img src="assets/play.svg" class="invert">
//                 </div>
//             </li>`;
//     });

//     // Click to play
//     Array.from(document.querySelectorAll(".songlist li")).forEach((el, i) => {
//         el.addEventListener("click", () => {
//             playmusic(i);
//         });
//     });

// }


function playmusic(index, pause = false) {
    if (index < 0 || index >= songs.length) return;

    currentSongIndex = index;
    currentsong.src = `/songs/${currfolder}/` + encodeURIComponent(songs[index]);
    currentsong.currentTime = 0;

    // 1. Reset all li styles
    document.querySelectorAll(".songlist li").forEach(li => {
        li.classList.remove("playing");
    });

    // 2. Add class to currently playing one
    const liElements = document.querySelectorAll(".songlist li");
    if (liElements[index]) {
        liElements[index].classList.add("playing");
    }

    // update info
    let name = decodeURIComponent(songs[index].replace(".mp3", ""));
    document.querySelector(".songinfo").innerHTML = name;
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";

    if (!pause) {
        currentsong.play();
        play.src = "assets/pause.svg";
    } else {
        play.src = "assets/play.svg";
    }

    document.querySelector(".circle").style.left = "0%";
}

// if (index < 0 || index >= songs.length) return;

// currentSongIndex = index; // ✅ update current index

// let track = songs[index];
// currentsong.src = `/songs/${currfolder}/` + encodeURIComponent(track);

// currentsong.currentTime = 0; // Reset time
// document.querySelector(".circle").style.left = "0%"; // Reset seekbar
// // Reset time display
// document.querySelector(".songtime").innerHTML = "00:00 / 00:00";

// // Reset play/pause button to play icon if paused
// if (pause) {
//     play.src = "assets/play.svg";
// }


// if (!pause) {
//     currentsong.play();
//     play.src = "assets/pause.svg";
// }

// let name = decodeURIComponent(track.replace(".mp3", ""));
// document.querySelector(".songinfo").innerHTML = name;
// document.querySelector(".songtime").innerHTML = "00:00 / 00:00";




// const playmusic = (track, pause = false) => {
//     const cleanTrack = track.startsWith("/") ? track.slice(1) : track;
//     currentsong.src = `/songs/${currfolder}/` + encodeURIComponent(cleanTrack);

//     if (!pause) {
//         currentsong.play();
//         play.src = "assets/pause.svg";
//     }

//     const displayName = cleanTrack.replace(".mp3", "");
//     document.querySelector(".songinfo").innerHTML = displayName;
//     document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
// };

// const playmusic= (track , pause=false)=>{
//     currentsong.src = `/songs/${currfolder}` + track;
//     if(!pause){
//         currentsong.play()
//         play.src = "assets/pause.svg"
//     }

//     document.querySelector(".songinfo").innerHTML = decodeURI(track)
//     document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
// }


// getsongs().then(function (songs) {
//     console.log(songs);

// }
async function displayplaylists() {
    console.log("🧠 displayplaylists() called");
    let res = await fetch("/songs/index.json");
    let folders = await res.json();

    let cardcontainer = document.querySelector(".cardcontainer");
    cardcontainer.innerHTML = "";

    for (const folder of folders) {
        console.log("Loading playlist:", folder);
        try {
            let metaRes = await fetch(`/songs/${folder}/info.json`);
            let meta = await metaRes.json();

            cardcontainer.innerHTML += `
                <div data-folder="${folder}" class="card">
                    <div class="play">
                        <svg width="55" height="100" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="48" fill="#300070" />
                            <polygon points="40,30 70,50 40,70" fill="#57bae5" />
                        </svg>
                    </div>
                    <img src="/songs/${folder}/cover.jpg" alt="cover">
                    <h3>${meta.title}</h3>
                    <p>${meta.description}</p>
                </div>`;
        } catch (e) {
            console.error(`Error loading folder ${folder}`, e);
        }
    }

    // Click to load playlist
    Array.from(document.getElementsByClassName("card")).forEach(card => {
        card.addEventListener("click", async () => {
            const folderName = card.dataset.folder;
            await getsongs(folderName);
            playmusic(0); // Load first song in pause state
            document.querySelector(".left").style.left = "0";
        });
    });
}


// async function displayplaylists() {
//     let a = await fetch("/songs/index.json");
//     let response = await a.json();
//     let div = document.createElement("div");
//     div.innerHTML = response;
//     let anchors = div.getElementsByTagName("a");
//     let folders = [];
//     let array = Array.from(anchors);
//     for (let index = 0; index < array.length; index++) {
//         const e = array[index];
//         let cardcontainer = document.querySelector(".cardcontainer")
//         if (e.href.includes("/songs") && !e.href.includes(".htaaccess")) {
//             let folder = e.href.split("/").slice(-2)[0];
//             //meta data
//             let a = await fetch(`/songs/${folder}/info.json`);
//             let response = await a.json();
//             console.log(response);
//             cardcontainer.innerHTML = cardcontainer.innerHTML + `<div data-folder="${folder}" class="card">
//                         <div class="play">
//                             <svg width="55" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
//                                 <circle cx="50" cy="50" r="48" fill="#300070" />
//                                 <polygon points="40,30 70,50 40,70" fill="#57bae5" />
//                             </svg>
//                         </div>
//                         <img src="songs/${folder}/cover.jpg" alt="cover">
//                         <h3>${response.title}</h3>
//                         <p>${response.description}</p>
//                     </div>`


//         }
//     }
//     //load the playlist
//     Array.from(document.getElementsByClassName("card")).forEach(card => {
//         card.addEventListener("click", async () => {
//             const folderName = card.dataset.folder;
//             await getsongs(folderName); // fetch new playlist
//             playmusic(0); // Load first song in paused mode
//             document.querySelector(".left").style.left = "0";
//         });
//     });


// }


async function main() {
    await getsongs("Ambient");
    playmusic(0, true); // play first song in pause mode

    //display playlist
    displayplaylists();


    // Play/Pause
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play();
            play.src = "assets/pause.svg";
        } else {
            currentsong.pause();
            play.src = "assets/play.svg";
        }
    });

    // Time updates
    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML =
            `${formatTime(currentsong.currentTime)} / ${formatTime(currentsong.duration)}`;
        document.querySelector(".circle").style.left =
            (currentsong.currentTime / currentsong.duration) * 100 + "%";
    });

    // Seekbar
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = e.offsetX / e.target.getBoundingClientRect().width;
        currentsong.currentTime = percent * currentsong.duration;
    });
    const seekbar = document.querySelector(".seekbar");
    const circle = document.querySelector(".circle");
    const progress = document.querySelector(".progress");

    let isDragging = false;
    let wasPlaying = false;

    // Update UI during playback (only if not dragging)
    currentsong.addEventListener("timeupdate", () => {
        if (!isDragging && currentsong.duration) {
            const percent = (currentsong.currentTime / currentsong.duration) * 100;
            circle.style.left = percent + "%";
            progress.style.width = percent + "%";
        }

        document.querySelector(".songtime").innerHTML =
            `${formatTime(currentsong.currentTime)} / ${formatTime(currentsong.duration)}`;
    });

    // Seekbar click (jump to point)
    seekbar.addEventListener("click", (e) => {
        const rect = seekbar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        updateToPercent(percent);
    });

    // Mouse drag
    circle.addEventListener("mousedown", () => {
        isDragging = true;
        wasPlaying = !currentsong.paused;
        currentsong.pause();
    });

    document.addEventListener("mouseup", () => {
        if (isDragging) {
            isDragging = false;
            if (wasPlaying) currentsong.play();
        }
    });

    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            const rect = seekbar.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            updateToPercent(percent);
        }
    });

    // Touch drag
    circle.addEventListener("touchstart", () => {
        isDragging = true;
        wasPlaying = !currentsong.paused;
        currentsong.pause();
    });

    document.addEventListener("touchend", () => {
        if (isDragging) {
            isDragging = false;
            if (wasPlaying) currentsong.play();
        }
    });

    document.addEventListener("touchmove", (e) => {
        if (isDragging) {
            const rect = seekbar.getBoundingClientRect();
            const percent = (e.touches[0].clientX - rect.left) / rect.width;
            updateToPercent(percent);
        }
    });

    // Update current time and visuals
    function updateToPercent(percent) {
        percent = Math.max(0, Math.min(1, percent)); // Clamp between 0–1
        const newTime = percent * currentsong.duration;

        currentsong.currentTime = newTime;
        circle.style.left = percent * 100 + "%";
        progress.style.width = percent * 100 + "%";

        // also update time display instantly
        document.querySelector(".songtime").innerHTML =
            `${formatTime(newTime)} / ${formatTime(currentsong.duration)}`;
    }


    // Hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });
    //cross
    document.querySelector(".cross").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    });
    document.querySelector(".cardcontainer").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    });
    document.querySelector(".home>ul>li").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    })

    // ✅ REAL FIXED Previous
    previous.addEventListener("click", () => {
        if (currentSongIndex > 0) {
            playmusic(currentSongIndex - 1);
        }
    });

    // ✅ REAL FIXED Next
    next.addEventListener("click", () => {
        if (currentSongIndex < songs.length - 1) {
            playmusic(currentSongIndex + 1);
        }
    });

    // Volume
    document.querySelector(".range input").addEventListener("change", (e) => {
        currentsong.volume = parseInt(e.target.value) / 100;
        if (currentsong.volume == 0) {
            document.querySelector(".volume").getElementsByTagName("img")[0].src = document.querySelector(".volume").getElementsByTagName("img")[0].src.replace("volume.svg", "mute.svg");
        }
        if (currentsong.volume > 0) {
            document.querySelector(".volume").getElementsByTagName("img")[0].src = document.querySelector(".volume").getElementsByTagName("img")[0].src.replace("mute.svg", "volume.svg");
        }
    });


    //mute
    document.querySelector(".volume").getElementsByTagName("img")[0].addEventListener("click", e => {
        if (e.target.src.includes("assets/volume.svg") & currentsong.volume != 0) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg");
            currentsong.volume = 0;
            document.querySelector(".range input").value = 0;
        }
        // if(e.target.src.includes("assets/volume.svg") & currentsong.volume == 0){

        //     currentsong.volume = 0.4;
        // }
        else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg");
            currentsong.volume = 0.2;
            document.querySelector(".range input").value = 20;
        }
    })





    // Array.from(document.getElementsByClassName("card")).forEach(e => {
    //     console.log(e)
    //     e.addEventListener("click", async item => {
    //         songs = await getsongs(`${item.currentTarget.dataset.folder}/`)
    //     })
    // })


    // async function main() {

    //     songs = await getsongs(`SamPlaylist`);
    //     playmusic(songs[0], true);
    //     let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    //     songUL.innerHTML = "";


    //     for (const song of songs) {
    //         const displayName = decodeURI(song.replace(".mp3", "").replace("/", ""));
    //         songUL.innerHTML += `<li>
    //         <img class="invert" src="assets/music.svg" alt="music">
    //         <div class="info">
    //             <div>${displayName}</div>
    //             <div>song artist</div>
    //         </div>
    //         <div class="playnow">
    //             <span>Play Now</span>
    //             <img src="assets/play.svg" alt="play" class="invert">
    //         </div>
    //     </li>`;
    //     }
    //     Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
    //         e.addEventListener("click", element => {
    //             const name = e.querySelector(".info").firstElementChild.innerHTML + ".mp3";
    //             playmusic(name);
    //         });
    //     });




    //     // for (const song of songs) {
    //     //     songUL.innerHTML = songUL.innerHTML + `<li>
    //     //                             <img class="invert" src="assets/music.svg" alt="music">
    //     //                             <div class="info">
    //     //                                 <div>${decodeURI(song)}</div>
    //     //                                 <div>song artist</div>
    //     //                             </div>
    //     //                             <div class="playnow">
    //     //                                 <span>Play Now</span>
    //     //                                 <img src="assets/play.svg" alt="play" class="invert">
    //     //                             </div>
    //     //                         </li>`;


    //     // }
    //     // Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
    //     //     e.addEventListener("click",element=>{
    //     //         console.log(e.querySelector(".info").firstElementChild.innerHTML);
    //     //         playmusic(e.querySelector(".info").firstElementChild.innerHTML)
    //     //     })

    //     // })

    //     play.addEventListener("click", () => {
    //         if (currentsong.paused) {
    //             currentsong.play();
    //             play.src = "assets/pause.svg"
    //         }
    //         else {
    //             currentsong.pause();
    //             play.src = "assets/play.svg"
    //         }
    //     })

    //     //add for time of song
    //     currentsong.addEventListener("timeupdate", () => {
    //         document.querySelector(".songtime").innerHTML = `${formatTime(currentsong.currentTime)} / ${formatTime(currentsong.duration)}`
    //         document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%"
    //     })

    //     //add for display of time of song
    //     document.querySelector(".seekbar").addEventListener("click", (j) => {
    //         document.querySelector(".circle").style.left = ((j.offsetX / j.target.getBoundingClientRect().width) * 100) + "%";
    //         currentsong.currentTime = currentsong.duration * ((j.offsetX / j.target.getBoundingClientRect().width));
    //         document.querySelector(".songtime").innerHTML = `${formatTime(currentsong.currentTime)} / ${formatTime(currentsong.duration)}`
    //     })

    //     //add hamburger function 
    //     document.querySelector(".hamburger").addEventListener("click", () => {
    //         document.querySelector(".left").style.left = "0"
    //     })

    //     //add cross in right
    //     document.querySelector(".cross").addEventListener("click", () => {
    //         document.querySelector(".left").style.left = "-120%"
    //     })

    //     //add responsiveness of left for touch at right
    //     document.querySelector(".cardcontainer").addEventListener("click", () => {
    //         document.querySelector(".left").style.left = "-120%"
    //     })

    //     //add previous and next buttons

    //     previous.addEventListener("click", () => {
    //         let current = decodeURIComponent(currentsong.src.split("/").pop());
    //         let index = songs.indexOf(current);
    //         if (index > 0) {
    //             playmusic(songs[index - 1]);
    //         }
    //     });

    //     next.addEventListener("click", () => {
    //         let current = decodeURIComponent(currentsong.split("/").pop());
    //         let index = songs.indexOf(current);
    //         if (index !== -1 && index < songs.length - 1) {
    //             playmusic(songs[index + 1]);
    //         }
    //     });


    //     // previous.addEventListener("click",()=>{
    //     //     let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
    //     //     if((index-1)>=0){
    //     //         playmusic(songs[index-1]);
    //     //     }
    //     // })
    //     // next.addEventListener("click",()=>{
    //     //     let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
    //     //     if((index+1)<songs.length){
    //     //         playmusic(songs[index+1]);
    //     //     }
    //     // })

    //     //add an event to volume
    //     document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    //         console.log("Setting volume to" + e.target.value + "/100");
    //         currentsong.volume = parseInt(e.target.value) / 100;
    //     })
    const volumeSlider = document.getElementById("volumeSlider");

    let previousVolume = volumeSlider.value;

    function updateSliderBackground(value) {
        volumeSlider.style.background = `linear-gradient(to right, #4f8cff ${value}%, #1a1a2e ${value}%)`;
    }

    // Initial setup
    updateSliderBackground(volumeSlider.value);

    // Volume slider changes
    volumeSlider.addEventListener("input", () => {
        previousVolume = volumeSlider.value;
        updateSliderBackground(volumeSlider.value);
    });

    // Auth UI logic
    const authButtons = document.getElementById("authButtons");
    const logoutButton = document.getElementById("logoutButton");

    // Check login state from localStorage
    if (localStorage.getItem("loggedIn") === "true") {
        authButtons.classList.add("hidden");
        logoutButton.classList.remove("hidden");
    }

    // Logout functionality
    document.querySelector(".logoutbtn").addEventListener("click", () => {
        localStorage.removeItem("loggedIn");
        window.location.reload();
    });






}
main()






