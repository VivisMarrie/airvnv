const div = document.getElementById('cards');
const url = 'https://v2-api.sheety.co/33ddb6f9591aa44f82386f033548141d/airvnv/airvnv';

var dados;
var currentPage = 1;
var totalPage;
var qtdHospedes = 0;
var qtdDias = 0;

const getvals = async function () {
    return await fetch(url)
        .then((resp) => resp.json())
        .then(function (data) {
            return data.airvnv;
        })
        .catch(function (error) {
            console.log(error);
        });
}

getvals().then(response => {
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
        let badge = "";
        if (data.tag != null && data.tag == "SUPERHOST") {
            badge = ` <span class="badge badge-info">${data.tag}</span>`;
        } else if (data.tag != null && data.tag == "PLUS") {
            badge = ` <span class="badge badge-dark">${data.tag}</span>`;
        }
        let totalizador = "";
        if(qtdHospedes != null && qtdDias != null){
            let total = qtdHospedes * qtdDias * data.price;
            totalizador = `<span class="float-right"><small class="text-muted">Total: <b>R$ ${total}</b></small></span>`;
        }
        card.className = "col-sm-12 col-lg-4";
        card.innerHTML = `     
        <div class="card m-2">     
            <img class="card-img-top img-fluid" src="${photo}" alt="${data.name}"/>
            <div class="card-body">
                <p class="card-text">${badge}<small class="text-muted"> ${data.propertyType}</small>
                <small><span class="float-right"><i class="fas fa-star"></i>
                ${data.score}</span></small></p>
                <h6 class="card-title">${data.name}</h6>      
                <p class="card-text"><small><b>R$ ${data.price}</b>/Noite</small>${totalizador}</p>
                <a id="cardlink-${data.id}" data-toggle="modal" data-target="#modalCard" href="" class="stretched-link"></a>
            </div>
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

$('#modalCard').on('show.bs.modal', function (e) {
    let link = e.relatedTarget.id;
    link = link.replace("cardlink-", "");
    dado = dados[link - 1];

    let h3 = document.getElementById('ModalTitle');
    cardImageModal = document.getElementById('cardImageModal');
    cardContentModal = document.getElementById('cardContentModal');
    h3.innerHTML = dado.name;

    let badge = "";
    if (dado.tag != null && dado.tag == "SUPERHOST") {
        badge = ` <span class="badge badge-info">${dado.tag}</span>`;
    } else if (dado.tag != null && dado.tag == "PLUS") {
        badge = ` <span class="badge badge-dark">${dado.tag}</span>`;
    }
    cardImageModal.innerHTML = `<img class="img-fluid w-100" src="${dado.photo}" alt="${dado.name}"/>     
    `;
    let total = qtdHospedes * qtdDias * dado.price;
    cardContentModal.innerHTML = `
    <p>
    <p>${badge}<small class="text-muted"> ${dado.propertyType}</small></p>
    Quarto em apart-hotel
    2 hóspedes
    1 quarto
    2 camas
    1 banheiros privado
    <h6 class="card-title">${dado.name}</h6>   
    Self check-in
    Faça check-in sem problemas com o porteiro.
    
    Comodidades para a vida diária
    O anfitrião equipou este espaço para estadias longas — Wi-Fi, estacionamento gratuito, ar condicionado e aquecedor incluídos.
    <br/>
    <div class="card">     
        <div class="card-body">   
        <ul class="list-group list-group-flush">
        <li class="list-group-item"><span>R$${dado.price}<small> por noite </small></span>
        <div class="w-100"></div>
            <span ><i class="fas fa-star"></i>
            ${dado.score} <small class="text-muted">(155 comentários)</small></span>
        </li>
        <li class="list-group-item">Datas<span class="float-right">${qtdDias} Dias</span></li>
        <li class="list-group-item">Hóspedes<span class="float-right">${qtdHospedes} Hóspedes</span></li>
        <li class="list-group-item"><span class="float-left">R$${dado.price} x ${qtdDias} noites</span><span class="float-right">R$${total}</span></li>
        <li class="list-group-item"><span class="float-left">Total</span><span class="float-right">R$${total}</span></li>
        </ul>
        <button type="button" class="btn btn-pink btn-block">Reservar</button>
        </div>
        </div> 
        </div>   
    `;

    var pos = { lat: dado.lat, lng: dado.lng };
    var mapModal = new google.maps.Map(
        document.getElementById('mapModal'), {
        zoom: 13,
        center: pos,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        controlSize: 25,
    });

    var marker = new google.maps.Marker({
        position: pos,
        label: dado.name,
        map: mapModal
    });

    google.maps.event.addListener(marker, "click", function () {
        mapModal.panTo(this.getPosition());
        mapModal.setZoom(5);
    });


});

$("#pesquisar").on("click", function () {
    qtdHospedes = $('#qtdHospedes').val();
    qtdDias = $('#qtdDias').val();
    console.log(qtdHospedes);
    console.log(qtdDias);
    showPage(currentPage);
});

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

var map;

// Initialize and add the map
function initMap() {
    var brazil = new google.maps.LatLng(-11.067796, -52.896404);
    var map = new google.maps.Map(
        document.getElementById('map'), {
        zoom: 3,
        center: brazil,
        mapTypeControl: false,
        controlSize: 32
    });

    getvals().then(response => {
        for (var i = 0; i < response.length; i++) {

            var lat = response[i].lat;
            var lng = response[i].lng;

            var latLng = { lat: lat, lng: lng };

            var marker = new google.maps.Marker({
                position: latLng,
                // label: response[i].name,
                map: map
            });
            google.maps.event.addListener(marker, "click", function () {
                map.panTo(this.getPosition());
                map.setZoom(5);
            });
        }
    });


}


