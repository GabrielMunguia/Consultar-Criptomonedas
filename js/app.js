const criptomonedasSelect= document.querySelector('#criptomonedas');
const formulario=document.querySelector('#formulario');
const criptomonedaSelect=document.querySelector('#criptomonedas')
const monedaSelect=document.querySelector('#moneda');
const resultado= document.querySelector('#resultado')
const objBusqueda={
    moneda: '',
    criptomoneda:''
}

//crear promise;
const obtenerCriptomonedas= criptomonedas=>new Promise (resolve =>{
    resolve(criptomonedas);
})

document.addEventListener('DOMContentLoaded',()=>{
    consultarCriptomonedas();
    formulario.addEventListener('submit',submitFormulario)
    criptomonedasSelect.addEventListener('change',leerValor)
    monedaSelect.addEventListener('change',leerValor)
})

function consultarCriptomonedas(){
     const url='https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD'
     fetch(url)
        .then(respuesta=>respuesta.json())
        .then(resultado=>obtenerCriptomonedas(resultado))
        .then (criptomonedas=>selectCriptomonedas(criptomonedas.Data));
}

function selectCriptomonedas(criptomonedas){
    console.log(criptomonedas)
 criptomonedas.forEach(cripto => {
    const {FullName,Name}=cripto.CoinInfo;
        
    const option= document.createElement('option');
    option.value=Name;
    option.textContent=FullName;
    criptomonedasSelect.appendChild(option);
 });
}

function submitFormulario(e){
    e.preventDefault();
    //validar formulario

    const {moneda,criptomoneda}=objBusqueda;
    if(moneda===''||criptomoneda=== ''){

    
        mostrarAlerta("Todos los campos son obligatorios");
        return
    }

    //consultar API

    consultarAPI();
}

function leerValor(e){
    objBusqueda[e.target.name]=e.target.value;
    console.log(objBusqueda)
}

function mostrarAlerta(msg){
   const existeAlerta=document.querySelector('.error');

   if(!existeAlerta){
       const divMensaje=document.createElement('div');
       divMensaje.classList.add('error');

       //mensaje de error
       divMensaje.textContent=msg;

       formulario.appendChild(divMensaje);

       setTimeout(()=>{
           divMensaje.remove();
       },3000)
   }
}


function consultarAPI(){
    const {moneda,criptomoneda}=objBusqueda;
    url=`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`
    mostrarSpinner();
    fetch(url)
   .then(respuesta=>respuesta.json())
   .then((cotizacion)=>{
       mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda])

   })
}

function mostrarCotizacionHTML(cotizacion){
   const {PRICE,HIGHDAY,LOWDAY,CHANGEPCT24HOUR,LASTUPDATE}=cotizacion;


   const precio= document.createElement('p');
   precio.classList.add('precio');
   precio.innerHTML=`El precio es : <span>${PRICE}</span>`;

   const precioAlto=document.createElement('p');
   precioAlto.innerHTML=`<p>Precio mas alto del dia <span>${HIGHDAY}</span></p>`

   const PrecioBajo=document.createElement('p');
   PrecioBajo.innerHTML=`<p>Precio mas bajo del dia <span>${LOWDAY}</span></p>`


   const ultimasHoras=document.createElement('p');
   ultimasHoras.innerHTML=`<P>Variacion de las ultimas 24 horas <span>${CHANGEPCT24HOUR} % </span></p>`

   const update=document.createElement('p');
   update.innerHTML=`<p>Ultima Actualizacion :  <span>${LASTUPDATE}</span></p>`

   limpiarHTML();
  resultado.appendChild(precio);
  resultado.appendChild(precioAlto);
  resultado.appendChild(PrecioBajo);
  resultado.appendChild(ultimasHoras);
  resultado.appendChild(update);
 

}


function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild)
    }
}

function mostrarSpinner(){
    const spinner=document.createElement('div');
    spinner.classList.add('spinner');
    spinner.innerHTML=`
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
    `
    limpiarHTML();
    resultado.appendChild(spinner);
}