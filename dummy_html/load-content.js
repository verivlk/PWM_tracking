//document-fragments.js
//How to use documentFragment objects when dynamically
//creating new webpage content

/*
let movies = [
    'Alien', 'Layer Cake', 'Star Wars', 'Star Trek', 'Jaws', 'Jurassic Park',
    'Memento', 'Dog Soldiers', 'The Host', 'Gran Torino', 'Casino Royale',
];

//use the Array movies and create a list of movies on the page
//inside of the <ul id="movies">
let movieList;

document.addEventListener('DOMContentLoaded', init);

const supportsTemplate = function () {
    //create a template element and make sure it has a 'content' property
    return 'content' in document.createElement('template');
}

function loadTemplate(fileName, id, callback) {

    fetch(fileName).then((res) => {
        return res.text();
    }).then((text) => {
        document.getElementById(id).innerHTML = text;
        //console.log(text)

        if (callback) {
            callback();
        }
    })
}


function init() {

    loadTemplate('./header.html', 'header');
    loadTemplate('./content.html', 'content');

    loadTemplate('./sidebar_articles.html', 'articles');
    loadTemplate('./sidebar_categories.html', 'categories');

    loadTemplate('./sidebar_links.html', 'links', addMovies);

    loadTemplate('./top_navlist.html', 'top_navlist');
    loadTemplate('./footer_right.html', 'footerRight');
    loadTemplate('./footer_left.html', 'footerLeft');

    loadTemplate('./post_content.html', 'post_template', addPostContent);


    addSideBarContent();

}

function addSideBarContent() {

    fetch('users.json')
        .then((response) => {
            return response.json();
        })
        .then((users) => {
            if ('content' in document.createElement('template')) {
                const container = document.getElementById('users');

                users.forEach((user) => {

                    const tmpl = document
                        .getElementById('user-card-template')
                        .content.cloneNode(true);

                    tmpl.querySelector('h2').innerText = user.fullname;
                    tmpl.querySelector('.title').innerText = user.title;


                    container.appendChild(tmpl);
                });
            } else {
                console.error('Your browser does not support templates');
            }
        })
        .catch((err) => console.error(err));


}

function addPostContent() {


    if (supportsTemplate()) {
        //We can use the template element in our HTML
        console.log('Templates are supported.');

        document.getElementById('post_1').remove();
        document.getElementById('post_2').remove();

        let temp = document.getElementById('post_content_template');
        let content = temp.content;
        console.log(content);
        let target = document.getElementById('post_template');
        target.appendChild(content.cloneNode(true))
        target.appendChild(content.cloneNode(true));

    } else {

        //Use another method, like manually building the elements.
        console.log('The else is running');

        fetch('./post_content_support.html').then((res) => {
            return res.text();
        }).then((text) => {
            document.getElementById('post_1').innerHTML = text;
            document.getElementById('post_2').innerHTML = text;

            console.log(text)
        })

    }


}

function addMovies() {
    movieList = document.getElementById('movies');

    //BAD APPROACH - add new content to DOM one at a time
    //    movies.forEach(function(movie){
    //        let li = document.createElement('li');
    //        li.textContent = movie;
    //        movieList.appendChild(li);
    //    })


    //GOOD APPROACH - use a documentFragment and update DOM once
    let df = new DocumentFragment();
    movies.forEach(movie => {
        let li = document.createElement('li')
        li.textContent = movie;
        df.appendChild(li);
    })
    movieList.appendChild(df);

}
*/

async function cargarEstructura() {
    let pageWrapper = document.getElementById('wrapper');

    // Cargar estructura estática
    let header = await cargarTemplate('/templates/common/header.html');
    pageWrapper.insertBefore(header, pageWrapper.firstChild);
    let headerEl = document.getElementById('main_header');
    let nav = await cargarTemplate('/templates/common/nav.html');
    headerEl.appendChild(nav);
    pageWrapper.appendChild(await cargarTemplate('/templates/common/footer.html'));
}

async function cargarTemplate(url) {
    let response = await fetch(url);
    let text = await response.text();

    let template = document.createElement('template');
    template.innerHTML = text;
    return document.importNode(template.content, true);
}

function cargarContenidoDinamico() {
    // Ahora esta función no recibe mainContent, ya que buscará en el DOM actualizado
    fetch('data/content.json')
        .then(response => response.json())
        .then(data => {
            let dynamicContentSection = document.querySelector('#dynamicContent');
            if (!dynamicContentSection) {
                console.error('No se encontró #dynamicContent en el DOM');
                return;
            }
            data.forEach(item => {
                let article = document.createElement('article');
                article.innerHTML = `<h2>${item.title}</h2><p>${item.description}</p>`;
                dynamicContentSection.appendChild(article);
            });
        })
        .catch(error => console.error('Error:', error));
}



document.addEventListener('DOMContentLoaded', async function() {
    await cargarEstructura();
    // Dado que cargarEstructura es async, ahora puedes asegurarte de que todo ha cargado
    cargarContenidoDinamico();
});
