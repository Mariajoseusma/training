var formData; 
var selectedRow = null
let flag_search = false
var users ;

const request_type = {
  STORE: 'STORE',
  EDIT: 'EDIT',
  SEARCH: 'SEARCH',
  DELETE: 'DELETE',
  GETALL: 'GETALL'
}

window.addEventListener('DOMContentLoaded', window_loaded)

function window_loaded (){
  send_request(request_type.GETALL, null);  
}

function reqListenerGetall () {
  if (this.readyState == 4) {

    // console.log(this.status);     
    users = JSON.parse(this.responseText);
    
    for (var user in users){
      insertNewRecord(users[user]);
    }

  }  
}

function reqListenerStore () {
  if (this.readyState == 4) {
    // console.log(this.responseText);
    var user = JSON.parse(this.responseText);
    insertNewRecord(user);
    resetForm();
  }
}

function reqListenerEdit () {
  if (this.readyState == 4) {
    
    console.log(this.responseText);
    var user = JSON.parse(this.responseText);
    updateRecord(user);
    resetAfterUpdate();
    resetForm();  
  }
}

function reqListenerDelete () {
  if (this.readyState == 4) {
    console.log(this.responseText);
    document.getElementById('storeList').deleteRow(selectedRow.rowIndex);
    resetForm();
  }
}

function send_request (request_type, data){

  const request = new XMLHttpRequest();  

  const base_url = 'http://127.0.0.1:3333/api/v1/users';

  switch(request_type){
    case 'STORE':
      request.addEventListener("load", reqListenerStore);
      request.open('POST', `${base_url}/store`, true);
      break;
      case 'EDIT':
      request.addEventListener("load", reqListenerEdit);
      request.open('POST', `${base_url}/edit`, true);
      break;
      case 'SEARCH':
      request.addEventListener("load", reqListenerSearch);
      request.open('POST', `${base_url}/search`, true);
      break;
      case 'DELETE':
      request.addEventListener("load", reqListenerDelete);
      request.open('POST', `${base_url}/delete`, true);
      break;
      case 'GETALL': 
      request.addEventListener("load", reqListenerGetall);
      request.open('GET', `${base_url}/getall`, true);
      break;
    default:
      return;
  }

  request.setRequestHeader("Accept", "*/*");
  request.setRequestHeader("Content-Type", "application/json");

  var data_string = JSON.stringify(data);
  request.send(data_string);
}

function onFormSubmit() {   
	event.preventDefault();
  formData = readFormData();   
  
  if (formData != null){  
    if (selectedRow == null){
      send_request( request_type.STORE, formData);
    }
    else{
      formData['id'] = selectedRow.id.toString(10);
      send_request( request_type.EDIT, formData);     
    }      
  }
}

function resetAfterUpdate(){
  document.getElementById("name").placeholder = "Nombre";
  document.getElementById("surname").placeholder = "Apellido";   
  document.getElementById("cellphone").placeholder = "Celular";
  
  document.getElementById("name").style.backgroundColor = 'white';
  document.getElementById("surname").style.backgroundColor = 'white';
  document.getElementById("cellphone").style.backgroundColor = 'white';
  if (flag_search == true){
    document.getElementById("crearButton").disabled = true;
  }
  
}

//Retrieve the data
function readFormData() {
  var formData = {};
  var nombre_value = document.getElementById("name").value;
  var apellido_value = document.getElementById("surname").value;
  var celular_value = document.getElementById("cellphone").value;
  
  if( nombre_value == "" ||  apellido_value == "" ||  celular_value == ""){
    alert("¡Tienes que llenar todos los campos!");
    formData = null;
  }
  else if (celular_value.length != 10){
     alert("¡Ingresa un numero valido de celular!");
     formData = null;
  }
  else{
    formData["name"] = nombre_value;      
    formData["surname"] = apellido_value;      
    formData["cellphone"] = celular_value;     
  }    
    return formData;
}

//Insert the data
function insertNewRecord(data) {
  var table = document.getElementById("storeList").getElementsByTagName('tbody')[0];
  var newRow = table.insertRow();
  newRow.id = data.id;
  cell1 = newRow.insertCell(0);
  cell1.innerHTML = data.name;
  cell2 = newRow.insertCell(1);
  cell2.innerHTML = data.surname;   
  cell3 = newRow.insertCell(2);
  cell3.innerHTML = data.cellphone;   
  cell4 = newRow.insertCell(3);
  cell4.innerHTML = `<button onClick="onEdit(this)">Edit</button> <button onClick="onDelete(this)">Delete</button>`;

}

function updateRecord(formData) {
    selectedRow.cells[0].innerHTML = formData.name;    
    selectedRow.cells[1].innerHTML = formData.surname;    
    selectedRow.cells[2].innerHTML = formData.cellphone;   
}

//Reset the data
function resetForm() {
    document.getElementById("name").value = '';
    document.getElementById("surname").value = '';
    document.getElementById("cellphone").value = '';
    
    selectedRow = null;
    document.getElementById("buscarButton").disabled = false;
}

//Edit the data
function onEdit(td) 
{  
  document.getElementById("buscarButton").disabled = true;
  selectedRow = td.parentElement.parentElement;

  document.getElementById("name").value = selectedRow.cells[0].innerHTML;
  document.getElementById("surname").value = selectedRow.cells[1].innerHTML;   
  document.getElementById("cellphone").value = selectedRow.cells[2].innerHTML;

  document.getElementById("name").style.backgroundColor = '#f08deb';
  document.getElementById("surname").style.backgroundColor = '#f08deb';
  document.getElementById("cellphone").style.backgroundColor = '#f08deb';
  
  document.getElementById("crearButton").disabled = false;
}

//Delete the data
function onDelete(td) {
    if (confirm('¿Quieres borrar esta información?')) {
      selectedRow = td.parentElement.parentElement;
      var data_id = {'id' : selectedRow.id.toString(10)}      
      send_request(request_type.DELETE, data_id);
    }
}

var storeListcopy;

function onBuscar(){
  flag_search = true;
  document.getElementById("crearButton").disabled = true;
  
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

