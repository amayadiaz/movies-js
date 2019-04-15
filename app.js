
const $articlesList = document.getElementById('articles-list');

const moviesUrl = 'https://api.themoviedb.org/3/trending/movie/week?api_key=';



let storedList =  JSON.parse(localStorage.getItem('favorites'));

console.log(storedList);

let favoritesList = [];

if(storedList == null){
    localStorage.setItem('favorites', JSON.stringify(favoritesList));
}else{
    favoritesList = storedList;
}


const key = '84ff3251498b1fa0b9f22832083b3196';

fetch(moviesUrl + key)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {

        data.results.forEach(element => {

            let template = articleTemplate(element.poster_path, element.vote_average, element.id);
            $articlesList.innerHTML += template;            
            
        });
    })
    /*.catch(function() {
        console.log('Request failed!');
    });*/



function showTrailer(articleId) {
    
    const $iframe = document.getElementById('iframe-trailer');

    fetch('https://api.themoviedb.org/3/movie/' + articleId + '/videos?api_key=84ff3251498b1fa0b9f22832083b3196')
    .then(response => {
        return response.json();
    })
    .then(videos => {
        $iframe.src = 'https://www.youtube.com/embed/' + videos.results[0].key + '?&autoplay=1';
    })

    const $modal = document.querySelector('.modal');
    $modal.classList.remove('hidden');
}

function closeTrailer() {
    const $modal = document.querySelector('.modal');
    $modal.classList.add('hidden');
    const $iframe = document.getElementById('iframe-trailer');
    $iframe.setAttribute('src', '');

}

function searchMovie() {

    $articlesList.innerHTML = "";

    const querySearch = document.querySelector('input');

    fetch('https://api.themoviedb.org/3/search/movie?api_key=84ff3251498b1fa0b9f22832083b3196&query=' + querySearch.value)
    .then(response => {
        return response.json();
    })
    .then(data => {
        data.results.forEach(element => {
            let template = articleTemplate(element.poster_path, element.vote_average, element.id);
            $articlesList.innerHTML += template;
        });
        
    })
    
}

function articleTemplate(imagePath, score, idArticle) {
    return (
        `<div class="article">
            <div class="cover">
                <img class="img" src="https://image.tmdb.org/t/p/original${imagePath}" alt="" />
            </div>
            <div class="info">
                <p class="score">${score}<i class="icon fas fa-star"></i></p>
                <div id="${idArticle}" class="like" onClick="addFavorite(this.id)"><i class="far fa-heart icon"></i></span></div>
                <a id="${idArticle}" onClick="showTrailer(this.id, this)" class="trailer"><span class="text">Play Trailer</span></a>
            </div>
        </div>`
    )
}

function addFavorite(articleId) {
 
    const querySelector = document.querySelector('.fa-heart');
    querySelector.classList.remove('far');
    querySelector.classList.add('fas');
    favoritesList.push(articleId);
    localStorage.setItem('favorites', JSON.stringify(favoritesList));


}

function showFavorites() {
    $articlesList.innerHTML = '';

    storedList.forEach(element => {
        fetch('https://api.themoviedb.org/3/movie/' + element + '?api_key=' + key)
        .then(response => {
            return response.json();
        })
        .then(data => {
            
            let template = articleTemplate(data.poster_path, data.vote_average, data.id);
            $articlesList.innerHTML += template;
           
        })
    });
}






