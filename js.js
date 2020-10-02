$(function() {
var databaseJSON = JSON.parse(dataJSON)

const opcionesNumeroFormato = {
    style: 'currency',
    currency: 'ARS'
};

const formatoNumero = new Intl.NumberFormat('es-AR', opcionesNumeroFormato);

function fLTUP(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

class completarSelectores {

    static completarMarcas() {
        let arrayMarcas = Object.keys(databaseJSON)
        arrayMarcas.forEach(function(element) {
            let c = fLTUP(element)
            selectorMarca.innerHTML += `<option value="${element}">${c}</option>`
        })
    }
    
    static completarModelos(valueMarca) {
        selectorModelo.innerHTML = `<option value="" disabled selected>Modelo</option>`
        let modelosDeMarca = databaseJSON[valueMarca]
        let arrayModelosDeMarca = Object.keys(modelosDeMarca)
        arrayModelosDeMarca.forEach(function(element) {
            let c = fLTUP(element)
            selectorModelo.innerHTML += `<option value=${element.toLowerCase()}>${c}</option>`
        })
    }
    
}


const selectorMarca = document.getElementById("selector-marca");
completarSelectores.completarMarcas();
let iniciadorSelectorMarca = M.FormSelect.init(selectorMarca);
const fotoMarca = document.getElementById("foto-marca");
const selectorModelo = document.getElementById("selector-modelo");
let iniciadorSelectorModelo = M.FormSelect.init(selectorModelo);
const selectorAnio = document.getElementById("selector-anio");
let iniciadorSelectorAnio = M.FormSelect.init(selectorAnio);
const selectorKilometraje = document.getElementById("selector-kilometraje");
let iniciadorSelectorKilometraje = M.FormSelect.init(selectorKilometraje);
const selectorLocalidad = document.getElementById("selector-localidad");
let iniciadorSelectorLocalidad = M.FormSelect.init(selectorLocalidad);
const checkboxGaraje1 = document.getElementById("checkbox-garaje1");
const checkboxGaraje2 = document.getElementById("checkbox-garaje2");
const inputCP = document.getElementById("codigo-postal");
const inputEmail = document.getElementById("email");
const inputTelefono = document.getElementById("telefono");
const divCotizacion = document.getElementById("div-cotizacion")
const animacionCarga = document.getElementById("animacion-carga")
const resultadoCotizacion = document.getElementById("resultado-cotizacion")
var valueMarca;
var valueModelo;
var valueAnio;
var valueKilometraje;
var valueCheckboxGaraje1;
var valueCheckboxGaraje2;
var valueLocalidad;
var precioBruto;
var precioCotizacion;



// LISTENERS

selectorMarca.addEventListener("change", function() {
    valueMarca = selectorMarca.value
    fotoMarca.src = `/${valueMarca}.jpg`
    completarSelectores.completarModelos(valueMarca);
    selectorModelo.removeAttribute("disabled")
    iniciadorSelectorModelo = M.FormSelect.init(selectorModelo)
})


selectorAnio.addEventListener("change", function() {
    valueAnio = selectorAnio.value
})

selectorModelo.addEventListener("change", function() {
    valueModelo = selectorModelo.value
    selectorAnio.removeAttribute("disabled")
    iniciadorSelectorAnio = M.FormSelect.init(selectorAnio)
    selectorKilometraje.removeAttribute("disabled")
    iniciadorSelectorKilometraje = M.FormSelect.init(selectorKilometraje)
})

selectorKilometraje.addEventListener("change", function() {
    valueKilometraje = selectorKilometraje.value
})

checkboxGaraje1.addEventListener("change", function() {
    valueCheckboxGaraje1 = checkboxGaraje1.checked
    if (valueCheckboxGaraje1) {
        checkboxGaraje2.checked = false
    }
})

checkboxGaraje2.addEventListener("change", function() {
    valueCheckboxGaraje2 = checkboxGaraje2.checked
    if (valueCheckboxGaraje2) {
        checkboxGaraje1.checked = false
        valueCheckboxGaraje1 = false
    }
})

selectorLocalidad.addEventListener("change", function() {
    valueLocalidad = selectorLocalidad.value
})

// LISTENER
// CALCULOS

var inputsFaltantes = ''

class Cotizador {
    static inputsFaltantes() {
        if (valueMarca == null) {
            M.toast({
                html: 'No selecciono una marca',
                classes: 'blue-grey'
            })
            inputsFaltantes = 'vacio'
        } else if (valueModelo == null) {
            M.toast({
                html: 'No selecciono un modelo',
                classes: 'blue-grey'
            })
            inputsFaltantes = 'vacio'
        } else if (valueAnio == null) {
            M.toast({
                html: 'No selecciono el anio de su auto',
                classes: 'blue-grey'
            })
            inputsFaltantes = 'vacio'
        } else if (valueKilometraje == null) {
            M.toast({
                html: 'No selecciono un rango de kilometros',
                classes: 'blue-grey'
            })
            inputsFaltantes = 'vacio'
        } else if (valueCheckboxGaraje1 == null) {
            M.toast({
                html: 'No selecciono la opcion de garaje',
                classes: 'blue-grey'
            })
            inputsFaltantes = 'vacio'
        } else if (valueLocalidad == null) {
            M.toast({
                html: 'No selecciono una localidad',
                classes: 'blue-grey'
            })
            inputsFaltantes = 'vacio'
        } else {
            return;
        }
    }
    
    static descuentoKilometraje() {
        let kilometrajeSeleccionado = parseInt(valueKilometraje)
        switch (kilometrajeSeleccionado) {
            case 1:
                precioBruto = precioBruto - 75000
                break;
            case 2:
                precioBruto = precioBruto - 50000
                break;
            case 3:
                precioBruto = precioBruto - 25000
                break;
            case 4:
                precioBruto = precioBruto - 10000
                break
        }
    }

    static descuentoGaraje() {
        if (valueCheckboxGaraje1) {
            let descuentoGaraje = (precioBruto / 100) * 7
            precioBruto = precioBruto - descuentoGaraje
        }
    }

    static descuentoLocalidad() {
        let descuentoLocalidad;
        switch (valueLocalidad) {
            case 'palermo':
                descuentoLocalidad = (precioBruto / 100) * 15
                precioBruto = precioBruto - descuentoLocalidad
                break;
            case 'belgrano':
                descuentoLocalidad = (precioBruto / 100) * 12
                precioBruto = precioBruto - descuentoLocalidad
                break;
            case 'caballito':
                descuentoLocalidad = (precioBruto / 100) * 9
                precioBruto = precioBruto - descuentoLocalidad
                break;
        }
    }

    static cotizacionFinal() {
        M.Toast.dismissAll();
        inputsFaltantes = ''
        this.inputsFaltantes();
        if (inputsFaltantes === '') {
            let anioAuto = parseInt(valueAnio)
            precioBruto = databaseJSON[valueMarca][valueModelo][anioAuto]
            this.descuentoKilometraje()
            this.descuentoLocalidad()
            this.descuentoGaraje()
            datosUsuario()
            var precioNeto = ((precioBruto / 100) * 1.5)
            const resultadoCotizacionH2 = document.getElementById("resultado-cotizacion__h2")
            resultadoCotizacionH2.innerText = `Valor por mes = ${formatoNumero.format(precioNeto)}`
        }
    }
    
    static mostrarCotizacion() {
        this.cotizacionFinal()
        $("#resultado-cotizacion").hide();
        $("#animacion-carga").show();
        setTimeout(function() {
            setTimeout(function() {
              btnCotizar.classList.remove("disabled")
            }, 1500)
            $("#animacion-carga").hide()
            $("#resultado-cotizacion").slideDown("slow");
            btnCotizar.classList.add("disabled")
        }, 3000)
    }
   
}


var datosClientes = []

function datosUsuario() {
    let valueTelefono = inputTelefono.value
    let valueEmail = inputEmail.value
    let valueCP = inputCP.value
    sessionStorage.setItem("telefono", valueTelefono)
    sessionStorage.setItem("email", valueEmail)
    sessionStorage.setItem("codigo-postal", valueCP)
    let cliente = {
        'telefono': valueTelefono,
        'email': valueEmail,
        'cp': valueCP
    }
    if(valueTelefono != '' || valueEmail != '' || valueCP != ''){
        datosClientes.push(cliente)
    }
}

// CALCULOS

const btnCotizar = document.getElementById("btn-cotizar")
btnCotizar.addEventListener("click", function() {
    Cotizador.mostrarCotizacion();
})



});