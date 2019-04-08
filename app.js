
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
                let template = articleTemplate(element.poster_path, element.vote_average, videos.results[0].key, element.id);
                $articlesList.innerHTML += template;
            })
            
            
        });
    })
    /*.catch(function() {
        console.log('Request failed!');
    });*/

function articleTemplate(imagePath, score, urlTrailer, idArticle) {
    return (
        `<div class="article">
            <div class="cover">
                <img class="img" src="https://image.tmdb.org/t/p/original${imagePath}" alt="" />
            </div>
            <div class="info">
                <p class="score">${score}<i class="icon fas fa-star"></i></p>
                <a id="${idArticle}" onClick="showTrailer(this.id)" class="trailer"><span class="text">Play Trailer</span></a>
            </div>
        </div>`
    )
}

function showTrailer(articleId) {
    
    const $iframe = document.getElementById('iframe-trailer');

    fetch('https://api.themoviedb.org/3/movie/' + articleId + '/videos?api_key=84ff3251498b1fa0b9f22832083b3196')
    .then(response => {
        return response.json();
    })
    .then(videos => {
        $iframe.src = 'https://www.youtube.com/embed/' + videos.results[0].key + '?&autoplay=1';
    })
}




