
const $articlesList = document.getElementById('articles-list');

const moviesUrl = 'https://api.themoviedb.org/3/trending/movie/week?api_key=';

const key = '84ff3251498b1fa0b9f22832083b3196';

fetch(moviesUrl + key)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {

        data.results.forEach(element => {

            fetch('https://api.themoviedb.org/3/movie/' + element.id + '/videos?api_key=84ff3251498b1fa0b9f22832083b3196')
            .then(response => {
                return response.json();
            })
            .then(videos => {
                let template = articleTemplate(element.poster_path, element.vote_average, videos.results[0].key);
                $articlesList.innerHTML += template;
            })
            
            
        });
    })
    /*.catch(function() {
        console.log('Request failed!');
    });*/

function articleTemplate(imagePath, score, urlTrailer) {
    return (
        `<div class="article">
            <div class="cover">
                <img class="img" src="https://image.tmdb.org/t/p/original${imagePath}" alt="" />
            </div>
            <div class="info">
                <p class="score">${score}<i class="icon fas fa-star"></i></p>
                <a class="trailer" href="https://www.youtube.com/watch?v=${urlTrailer}" target="_blank"><span class="text">Play Trailer</span></a>
            </div>
        </div>`
    )
}

function addClick() {
    const $house = document.querySelector('.house');
    $house.addEventListener("click", () => {
        alert('Click');
    });
}




