const M3U_URL = "/api/m3u";

let canais = [];
let hls;
const video = document.getElementById("player");

fetch(M3U_URL)
.then(res => res.text())
.then(text => {
    const linhas = text.split("\n");

    for(let i=0;i<linhas.length;i++){
        if(linhas[i].startsWith("#EXTINF")){
            let info = linhas[i];

            let nome = info.split(",")[1] || "Canal";
            let logo = (info.match(/tvg-logo="(.*?)"/) || [])[1] || "https://via.placeholder.com/150";
            let grupo = (info.match(/group-title="(.*?)"/) || [])[1] || "Outros";
            let url = linhas[i+1];

            canais.push({nome, logo, grupo, url});
        }
    }

    renderizar(canais);
});

function renderizar(lista){
    const conteudo = document.getElementById("conteudo");
    conteudo.innerHTML = "";

    let categorias = {};

    lista.forEach(c => {
        if(!categorias[c.grupo]){
            categorias[c.grupo] = [];
        }
        categorias[c.grupo].push(c);
    });

    for(let cat in categorias){
        let divCat = document.createElement("div");
        divCat.className = "categoria";

        let titulo = document.createElement("h3");
        titulo.innerText = cat;

        let listaDiv = document.createElement("div");
        listaDiv.className = "lista";

        categorias[cat].forEach(canal => {
            let card = document.createElement("div");
            card.className = "card";

            card.innerHTML = `
                <img src="${canal.logo}">
                <p>${canal.nome}</p>
            `;

            card.onclick = () => tocar(canal.url);

            listaDiv.appendChild(card);
        });

        divCat.appendChild(titulo);
        divCat.appendChild(listaDiv);
        conteudo.appendChild(divCat);
    }
}

function tocar(url){
    if(hls){
        hls.destroy();
    }

    if(Hls.isSupported()){
        hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(video);
    } else {
        video.src = url;
    }
}

document.getElementById("search").addEventListener("input", e => {
    let termo = e.target.value.toLowerCase();

    let filtrados = canais.filter(c =>
        c.nome.toLowerCase().includes(termo)
    );

    renderizar(filtrados);
});
