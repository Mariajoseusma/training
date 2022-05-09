var selectedRow = null
let flag_search = false

function onFormSubmit() {   
	event.preventDefault();
  var formData = readFormData(); 
  if (formData != null){  
    if (selectedRow == null){
      insertNewRecord(formData);
    }
    else{
      updateRecord(formData);
      console.log(updateRecord(formData));   
      resetAfterUpdate();
    }
    resetForm();
  }     
}

function resetAfterUpdate(){
  document.getElementById("Nombre").placeholder = "Nombre";
  document.getElementById("Apellido").placeholder = "Apellido";   
  document.getElementById("Celular").placeholder = "Celular";
  
  document.getElementById("Nombre").style.backgroundColor = 'white';
  document.getElementById("Apellido").style.backgroundColor = 'white';
  document.getElementById("Celular").style.backgroundColor = 'white';
  if (flag_search == true){
    document.getElementById("crearButton").disabled = true;
  }
  
}

//Retrieve the data
function readFormData() {
  var formData = {};
  var nombre_value = document.getElementById("Nombre").value;
  var apellido_value = document.getElementById("Apellido").value;
  var celular_value = document.getElementById("Celular").value;
  
  if( nombre_value == "" ||  apellido_value == "" ||  celular_value == ""){
    alert("¡Tienes que llenar todos los campos!");
    formData = null;
  }
  else if (celular_value.length != 10){
     alert("¡Ingresa un numero valido de celular!");
     formData = null;
  }
  else{
    formData["Nombre"] = nombre_value + " " + apellido_value;      
    formData["Celular"] = celular_value;   
  }    
    return formData;
}

//Insert the data
function insertNewRecord(data) {
    var table = document.getElementById("storeList").getElementsByTagName('tbody')[0];
    var newRow = table.insertRow(table.length);
    cell1 = newRow.insertCell(0);
		cell1.innerHTML = data.Nombre;
    cell2 = newRow.insertCell(1);
		cell2.innerHTML = data.Celular;   
    cell3 = newRow.insertCell(2);
        cell3.innerHTML = `<button onClick="onEdit(this)">Edit</button> <button onClick="onDelete(this)">Delete</button>`;

}

function updateRecord(formData) {
    selectedRow.cells[0].innerHTML = formData.Nombre;    
    selectedRow.cells[1].innerHTML = formData.Celular;   
}

//Reset the data
function resetForm() {
    document.getElementById("Nombre").value = '';
    document.getElementById("Apellido").value = '';
    document.getElementById("Celular").value = '';
    
    selectedRow = null;
    document.getElementById("buscarButton").disabled = false;
}

//Edit the data
function onEdit(td) 
{  
  document.getElementById("buscarButton").disabled = true;
  
  selectedRow = td.parentElement.parentElement;
  document.getElementById("Nombre").placeholder = "Edit";
  document.getElementById("Apellido").placeholder = "Edit";   
  document.getElementById("Celular").placeholder = "Edit";

  document.getElementById("Nombre").style.backgroundColor = '#f08deb';
  document.getElementById("Apellido").style.backgroundColor = '#f08deb';
  document.getElementById("Celular").style.backgroundColor = '#f08deb';
  
  document.getElementById("crearButton").disabled = false;
}

//Delete the data
function onDelete(td) {
    if (confirm('¿Quieres borrar esta información?')) {
        row = td.parentElement.parentElement;
        document.getElementById('storeList').deleteRow(row.rowIndex);
        resetForm();
    }
}

var storeListcopy;

function onBuscar(){
  flag_search = true;
  document.getElementById("crearButton").disabled = true;
  debugger;
  let filter = searchInput.value.toUpperCase(); 
  var body = document.getElementById("storeList").getElementsByTagName('tbody')[0]
  rows = body.getElementsByTagName("tr");  
  let list_contain_filter = false;
  
  for (let row of rows) {
    let cells = row.getElementsByTagName("td");
    for (let cell of cells) {
      if (cell.textContent.toUpperCase().indexOf(filter) > -1 ) {
        list_contain_filter = true;
      } 
    }
    row.style.display = (list_contain_filter)  ? "" : "none";
    list_contain_filter = false;
  }
  
  let buttonVolverobj = document.getElementById("demo");
  buttonVolverobj.style.display = "";
  buttonVolverobj.innerHTML = '<button onClick="onVolver()">Volver</button>';
}

function onVolver(){ 
  flag_search = false;
  document.getElementById("demo").style.display = "none";
  document.getElementById("crearButton").disabled = false;
  rows = storeList.getElementsByTagName("tr");  
  for (let row of rows) {
    if (row.style.display == 'none'){
      row.style.display = '';
    }
  }
}