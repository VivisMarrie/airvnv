const div = document.getElementById('cards');
const url = 'https://api.jsonbin.io/b/5eb7745947a2266b1475dded';

var dados;
var currentPage = 1;
var totalPage;
function getvals() {
    return fetch(url)
        .then((resp) => resp.json())
        .then(function (data) {
            return data;
        })
        .catch(function (error) {
            console.log(error);
        });
}

getvals().then(function (response) {
    totalPage = Math.ceil(response.length / 9);
    dados = response;
    //cria numeros paginator
    for (let index = 1; index <= totalPage; index++) {
        let li = document.createElement('li');
        li.className = "page-item " +
        (index ? "current-page " : "")
        + (index === currentPage ? "active " : "");
        li.innerHTML = `<a class="page-link" href: "javascript:void(0)"> ${index || "..."}<a/>`;        
        document.getElementById('pagination').insertBefore(li, document.getElementById('next-page'));      
    }
    showPage(1); 
});


function listItems(items, pageActual, limitItems) {
    let result = [];
    let count = (pageActual * limitItems) - limitItems;
    let delimiter = count + limitItems;

    if (pageActual <= totalPage) {
        for (let i = count; i < delimiter; i++) {
            if (items[i] != null) {
                result.push(items[i]);
            }
            count++;
        }
    }

    return result;
};

function showPage(page) {
    var resultNext = listItems(dados, page, 9);
    if (page < 1 || page > totalPage) {
        return;
    }

    div.innerHTML = "";
    resultNext.map(function (data) {
        let card = document.createElement('div');
        let photo = data.photo;
        photo = photo.replace("xx_large", "medium");
        card.className = "col-sm-12 col-lg-4 padding";
        card.innerHTML = `  
            <div class="card h-100">
            <img class="card-img-top" src="${photo}" alt="${data.name}"/>
            <div class="card-body">
            <p class="card-text"><small class="text-muted">${data.property_type}</small></p>
            <h6 class="card-title">${data.name}</h6>      
            <p class="card-text"><small><b>R$ ${data.price}</b>/Noite</small></p>
            </div>
        </div>
        `;
        div.appendChild(card);
    });

    liPrev = $(".pagination").children().eq(currentPage);
    liCurrPage = $(".pagination").children().eq(page);
    liPrev.removeClass("active");
    liCurrPage.addClass("active");
    currentPage = page;
}

$('#datepicker').datepicker({
    uiLibrary: 'bootstrap4'
});

$(document).on("click", ".pagination li.current-page:not(.active)", function () {
    return showPage(+$(this).text());
});
$("#next-page").on("click", function () {
    return showPage(currentPage + 1);
});

$("#previous-page").on("click", function () {
    return showPage(currentPage - 1);
});


// Initialize and add the map
function initMap() {
    // The location of Uluru
    var uluru = {lat: -25.344, lng: 131.036};
    // The map, centered at Uluru
    var map = new google.maps.Map(
        document.getElementById('map'), {zoom: 4, center: uluru});
    // The marker, positioned at Uluru
    var marker = new google.maps.Marker({position: uluru, map: map});

   
        for (var i = 0; i < dados.length; i++) {
          var lat = dados[i].lat;
          var lng = dados[i].lng;
          var latLng = new google.maps.LatLng(lat,lng);
          var marker = new google.maps.Marker({
            position: latLng,
            map: map
          });
        }
    
  }

