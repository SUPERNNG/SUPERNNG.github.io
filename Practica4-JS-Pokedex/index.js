
const fetchPokemon = async() => {
    const pokeNameInput = document.getElementById("searchPokemon");
    let pokeName = pokeNameInput.value;
    pokeName = pokeName.toLowerCase();
    const url = `https://pokeapi.co/api/v2/pokemon/${pokeName}`;
    let data = await fetch(url).then((res) => {
        if (res.status != "200") {
            console.log(res);
            pokeImage("ImagenPokedex/pokemonGlich.png")
        }
        else {
            return res.json();
        }
    })
    if (data) {
        console.log(data);
        let pokeId  = data.id;
        let pokeImg = data.sprites.front_default;
        pokeImage(pokeImg,pokeId);
        //obtencion de los stats de cada pokemon
        let pokeStat = data.stats;
        pokeStats(pokeStat)
        // Obtencion del Peso del Pokemon
        let pokeSizeWeight = data.weight;
        let pokeSizeHeight = data.height;
        pokeSize(pokeSizeHeight, pokeSizeWeight)
        let pokeName  = data.name;
        pokeNameId(pokeName, pokeId);
        //Obtencion de los Tipos de pokemon--------------
        let pokeTypes = data.types;
        pokeType(pokeTypes);
        //poner Iconos anterior y siguientes
        pokeIcons(pokeId);
        //Agregar los movimiento del pokemon
        fetchPokeMove(data.moves);
        let dataAbilityName = data.abilities;
        fetchPokeAbilities(dataAbilityName[0].ability.name);
        removeElementsByClass("abilityLabel");
        removeElementsByClass("abilityInput");
        for(let i =0; i< dataAbilityName.length;i++){
            pokeAbilityName(dataAbilityName[i], i);
        }

    }
    const urlDescription = `https://pokeapi.co/api/v2/pokemon-species/${pokeName}`;
    let dataDes = await fetch(urlDescription).then((res) => {
        if (res.status != "200") {
            console.log(res);
        }
        else {
            return res.json();
        }
    })
    if(dataDes)
    {
        let pokeDes = dataDes.flavor_text_entries;
        pokeDescription(pokeDes,"descriptionText" );
        let pokeCat = dataDes.genera;
        pokeCategory(pokeCat);

    }




}
//movimientos
const fetchPokeMove = async(data) => {
    const divElementMove = document.getElementsByClassName("elementMove");
    removeElementsByClass("elementMove");

    for(let i =0 ; i<data.length;i++){
        const urlMove = data[i].move.url;
        let dataMove = await fetch(urlMove).then((res) => {
            if (res.status != "200") {
                console.log(res);
            }
            else {
                return res.json();
            }
        })
        if(dataMove)
        {
            pokeMoveType(dataMove);
        }
    }
}

function removeElementsByClass(className){
    const elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);

    }
}


const pokeMoveType = (url) => {
    let divMove = document.createElement("div");
    divMove.className = "elementMove";
    let pMoveType = document.createElement("p");
    pMoveType.className = url.type.name;
    let pMoveName = document.createElement("p");
    pMoveName.className = "move";
    const divConteinerMove = document.getElementById("conteinerMove");

    pMoveName.innerHTML = letraMayuscula(url.name);
    pMoveType.innerHTML = url.type.name.toUpperCase();
    divMove.append(pMoveType);
    divMove.append(pMoveName);
    divConteinerMove.appendChild(divMove);
}

//----Abilities---------------------------------
const fetchPokeAbilities = async(data) => {

    const divElementAbility = document.getElementsByClassName("abilityli");

        const urlAbility = `https://pokeapi.co/api/v2/ability/${data}`;

        let dataAbility = await fetch(urlAbility).then((res) => {
            if (res.status != "200") {
                console.log(res);
                //pokeDescription("None description");
            }
            else {
                return res.json();
            }
        })
        if(dataAbility)
        {
            //pokeMoveType(dataMove);
            //console.log(dataAbility);
            pokeDescription(dataAbility.flavor_text_entries,"textAbility");
        
        }
    
}

function pokeAbilityTextChange(id){
//console.log(id);

    if(id.checked){
        fetchPokeAbilities(id.value);
        
        
    }
}


const pokeAbilityName = (url,n)=>{
    let inputAbility = document.createElement("input");
    inputAbility.type ="radio";
    inputAbility.id = "id"+url.ability.name;
    inputAbility.name = "abilities";
    inputAbility.value = url.ability.name;
    inputAbility.className = "abilityInput";
    inputAbility.setAttribute("onclick",`pokeAbilityTextChange(this)`);
    if(n==0)inputAbility.checked = true;

    let labelAbility = document.createElement("label");
    labelAbility.className = "abilityLabel";
    labelAbility.setAttribute ("for",`id${url.ability.name}`);
    labelAbility.innerHTML = letraMayuscula(url.ability.name);
    
    
    const divConteinerAbility = document.getElementById("conteinerAbilityName");
    divConteinerAbility.append(inputAbility);
    divConteinerAbility.append(labelAbility);
}

function pokeIcons(id){
    const pokeIconBack = document.getElementById("backPokemon");
    const pokeIconNext = document.getElementById("nextPokemon");
    id = parseInt(id);
    if(id>1){
        pokeIconBack.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id-1}.png`;
        pokeIconBack.style.cursor = "pointer";
    }
    else{
        pokeIconBack.src =`ImagenPokedex/pokeball.png`; 
        pokeIconBack.style.cursor = "auto";
    }
    if(id<905){
        pokeIconNext.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id+1}.png`;
        pokeIconNext.style.cursor = "pointer";
    }
    else{
        pokeIconNext.src =`ImagenPokedex/pokeball.png`; 
        pokeIconNext.style.cursor = "auto";
    }
    

}

function backPokemon () {
    const textId = document.getElementById("pokedexNumber");
    let numberId = parseInt(textId.innerHTML);
    if(numberId>1){
        const pokeNameInput = document.getElementById("searchPokemon");
        pokeNameInput.value = numberId-1;
        fetchPokemon();
    }


}
function nextPokemon () {
    const textId = document.getElementById("pokedexNumber");
    let numberId = parseInt(textId.innerHTML);
    if(numberId<905){
        const pokeNameInput = document.getElementById("searchPokemon");
        pokeNameInput.value = numberId+1;
        fetchPokemon();
    }
}
const pokeCategory=(url)=>{
    const textCategory =document.getElementById("textCategory");
    const textLenght = url.length;
    const foundLanguage = "en";
    let numberLanguage = 7;
    for(let i = 0;i<=textLenght-1;i++ ){
        if(foundLanguage == url[i].language.name){
            numberLanguage = i;
        }
    }
    textCategory.innerHTML = url[numberLanguage].genus.toUpperCase();
}

const pokeDescription =(url,element) =>{
    const foundLanguage = "en";
    let numberLanguage = 0;
    const flavorTextLenght = url.length;
    const description = document.getElementById(element);
    for(let i = 0;i<=flavorTextLenght-1;i++ ){
        if(foundLanguage == url[i].language.name){
            numberLanguage = i;
        }
    }
    description.innerHTML = url[numberLanguage].flavor_text;

}


const pokeType = (url)=>{
    const typesLength = url.length;
    const type1 = document.getElementById("type1");
    const type2 = document.getElementById("type2");
    if(typesLength==1){
        type1.innerHTML = url[0].type.name.toUpperCase();
        type1.className = url[0].type.name;
        type2.innerHTML = "";
        type2.className = "typeNone";
    }
    else{
        type1.innerHTML = url[0].type.name.toUpperCase();
        type1.className = url[0].type.name;
        type2.innerHTML = url[1].type.name.toUpperCase();
        type2.className = url[1].type.name;
    }

}

//funcion que permite reemplazar por la imagen del pokemon
const pokeImage = (url,id) => {
    const pokePhoto = document.getElementById("pokeImg");
    const pokeIcon = document.getElementById("pokeIcon");   
    if(url){
        pokePhoto.src = url;
        pokeIcon.src = url
    }
    else if(id){
        pokePhoto.src= `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
        pokeIcon.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
    }
}
//agregar los stast de cada pokemon
const pokeStats = (url)=>{
    
    for(let i=0; i<6;i++){
        const nameStat = url[i].stat.name;
        const numStat = url[i].base_stat;
        const pokeStatName = document.getElementById(`pokeStatName${nameStat}`);
        const pokeStat = document.getElementById(`pokeStat${nameStat}`);
        pokeStatName.innerHTML = letraMayuscula(nameStat);
        pokeStat.innerHTML = numStat;
    }

}
const pokeNameId=(urlName,urlId)=>{
    let pokeName = document.getElementById("pokeName");
    const pokeId = document.getElementById("pokedexNumber");
    pokeId.innerHTML =  urlId;
    pokeName.innerHTML = letraMayuscula( urlName) ;
}
//Agregar altura y peso de cada pokemon
const pokeSize =(urlH,urlW ) =>{
    
    let numWeight = urlW/10;
    let numHeight = urlH/10;
    numHeight = numHeight.toString();
    numWeight = numWeight.toString();
    const pokeHeight = document.getElementById("pokeSizeheight");
    const pokeWeight = document.getElementById("pokeSizewight");
    pokeHeight.innerHTML = numHeight+"m";
    pokeWeight.innerHTML =  numWeight+"kg";

}


function letraMayuscula(string){
    
    string= string.charAt(0).toUpperCase() + string.slice(1)
    if(string.search("-")){
        let n = string.search("-");
        string = string.replaceAt (n+1,string.charAt(n+1).toUpperCase());
        string = string.replace('-',' ')
        
    }
    return string;
  }
  String.prototype.replaceAt = function(index, replacement) {
    if (index >= this.length) {
        return this.valueOf();
    }
 
    return this.substring(0, index) + replacement + this.substring(index + 1);
}