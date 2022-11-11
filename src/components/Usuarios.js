import './../App.css';
// import Web3 from 'web3';
import api from '../api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Button } from 'react-bootstrap/';
import { useState, useEffect, useCallback } from 'react';


export default function Usuarios() {  

  useEffect(() => {
    const resultado = doUsuarios();
  }, [])  

  const Toast = Swal.mixin({
    toast: true,
    position: 'bottom-right',
    iconColor: 'green',
    customClass: {
      popup: 'colored-toast'
    },
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true
  });
  
  const [showModal1, setShowModal1] = useState(false);
  const MySwal = withReactContent(Swal);
  
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);

  async function doUsuarios(){
    const response = api.get('account/list');
      var transactions_result = (await response).data;

      var promise = Promise.resolve(transactions_result);
      promise.then(function(val) {
       setUsuarios(val);
      });
      return transactions_result;
  }

  async function refreshPage() {
    window.location.reload(false);
  }

  async function editUsuario(user_id){
    var response = await api.get('account/find/' + user_id);
    var user = response.data[0].user_id;

    const { value: formValues } = await Swal.fire({
      title: 'Editar dados do usuário?',
      html:
      '<form class="form-inline">' +
      '<div class="form-group row">' + 
      '<label for="inp_descricao" class="col-sm-2 col-form-label">User Id</label>' +
      '<div class="col-sm-1">' +
      '<input type="text" size="36" class="form-control form-control-sm" id="user_id" name="user_id" value=' + String(response.data[0].user_id) + '>' +
      '</div></div>' +
      '<form class="form-inline">' +
      '<div class="form-group row">' + 
      '<label for="inp_descricao" class="col-sm-2 col-form-label">Perfil</label>' +
      '<div class="col-sm-1">' +
      '<input type="text" size="36" class="form-control form-control-sm" id="profile" name="profile" value=' + String(response.data[0].profile) + '>' +
      '</div></div>' +
      '<form class="form-inline">' +
      '<div class="form-group row">' + 
      '<label for="inp_descricao" class="col-sm-2 col-form-label">Desc</label>' +
      '<div class="col-sm-1">' +
      '<input type="text" size="36" class="form-control form-control-sm" id="desc" name="desc" value=' + String(response.data[0].desc) + '>' +
      '</div></div>' +
      '<form class="form-inline">' +
      '<div class="form-group row">' + 
      '<label for="inp_descricao" class="col-sm-2 col-form-label">Nome</label>' +
      '<div class="col-sm-1">' +
      '<input type="text" size="36" class="form-control form-control-sm" id="name" name="name" value=' + String(response.data[0].name) + '>' +
      '</div></div>' +
      '<form class="form-inline">' +
      '<div class="form-group row">' + 
      '<label for="inp_descricao" class="col-sm-2 col-form-label">Email</label>' +
      '<div class="col-sm-1">' +
      '<input type="text" size="36" class="form-control form-control-sm" id="email" name="email" value=' + String(response.data[0].email) + '>' +
      '</div></div>' +
      
      '<form class="form-inline">' +
      '<div class="form-group row">' + 
      '<label for="inp_descricao" class="col-sm-2 col-form-label">Doc</label>' +
      '<div class="col-sm-1">' +
      '<input type="text" size="36" class="form-control form-control-sm" id="doc" name="doc" value=' + String(response.data[0].doc) + '>' +
      '</div></div>' + 

      '<form class="form-inline">' +
      '<div class="form-group row">' + 
      '<label for="inp_descricao" class="col-sm-2 col-form-label">Tipo</label>' +
      '<div class="col-sm-1">' +
      '<input type="text" size="36" class="form-control form-control-sm" id="type" name="type" value=' + String(response.data[0].type) + '>' +
      '</div></div>' ,
      

      focusConfirm: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Cancelar',
      denyButtonText: 'Não',
      showDenyButton: true,
      width: '500px',
      heightAuto: false,
      preConfirm: () => {
        return [
          document.getElementById('user_id').value,
          document.getElementById('profile').value,
          document.getElementById('desc').value,
          document.getElementById('name').value,
          document.getElementById('email').value,
          document.getElementById('type').value,
          document.getElementById('doc').value,
        ]
      }
    })
    
    if (formValues) {
      const timestamp = Date.now();
      var block = {
        "user_id": document.getElementById('user_id').value,
        "profile": document.getElementById('profile').value,
        "desc": document.getElementById('desc').value,
        "name": document.getElementById('name').value,
        "email" : document.getElementById('email').value,
        "type": document.getElementById('type').value,
        "doc": document.getElementById('doc').value,
        "created_at": String(response.data[0].created_at),
        "updated_at" : timestamp,
        "last_login": String(response.data[0].last_login)
      };
      response = api.patch('account/' + user_id, block);
      doUsuarios();
      forceUpdate();

      await Toast.fire({
        icon: 'success',
        title: 'Usuário atualizado'
      });  
    }
  }

  async function novoUsuario(){

    const { value: formValues } = await Swal.fire({
      title: 'Criar usuário',
      html:
      '<form class="form-inline">' +
      '<div class="form-group row">' + 
      '<label for="inp_descricao" class="col-sm-2 col-form-label">User Id</label>' +
      '<div class="col-sm-1">' +
      '<input type="text" size="36" class="form-control form-control-sm" id="user_id" name="user_id" placeholder="Insira o ID da carteira">' +
      '</div></div>' +
      '<form class="form-inline">' +
      '<div class="form-group row">' + 
      '<label for="inp_descricao" class="col-sm-2 col-form-label">Perfil</label>' +
      '<div class="col-sm-1">' +
      '<input type="text" size="36" class="form-control form-control-sm" id="profile" name="profile" value="" placeholder="propositor-comprador-monitor-comprador">' +      '</div></div>' +
      '<form class="form-inline">' +
      '<div class="form-group row">' + 
      '<label for="inp_descricao" class="col-sm-2 col-form-label">Desc</label>' +
      '<div class="col-sm-1">' +
      '<input type="text" size="36" class="form-control form-control-sm" id="desc" name="desc" value="" placeholder="Descrição">' +
      '</div></div>' +
      '<form class="form-inline">' +
      '<div class="form-group row">' + 
      '<label for="inp_descricao" class="col-sm-2 col-form-label">Nome</label>' +
      '<div class="col-sm-1">' +
      '<input type="text" size="36" class="form-control form-control-sm" id="name" name="name" value="" placeholder="Nome">' +
      '</div></div>' +
      '<form class="form-inline">' +
      '<div class="form-group row">' + 
      '<label for="inp_descricao" class="col-sm-2 col-form-label">Email</label>' +
      '<div class="col-sm-1">' +
      '<input type="text" size="36" class="form-control form-control-sm" id="email" name="email" value="" placeholder="Email">' +
      '</div></div>' +
      
      '<form class="form-inline">' +
      '<div class="form-group row">' + 
      '<label for="inp_descricao" class="col-sm-2 col-form-label">Doc</label>' +
      '<div class="col-sm-1">' +
      '<input type="text" size="36" class="form-control form-control-sm" id="doc" name="doc" value="" placeholder="Documento">' +
      '</div></div>' + 

      '<form class="form-inline">' +
      '<div class="form-group row">' + 
      '<label for="inp_descricao" class="col-sm-2 col-form-label">Tipo</label>' +
      '<div class="col-sm-1">' +
      '<input type="text" size="36" class="form-control form-control-sm" id="type" name="type" value="" placeholder="pj ou pf">' +
      '</div></div>' ,
      

      focusConfirm: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Cancelar',
      denyButtonText: 'Não',
      showDenyButton: true,
      width: '500px',
      heightAuto: false,
      preConfirm: () => {
        return [
          document.getElementById('user_id').value,
          document.getElementById('profile').value,
          document.getElementById('desc').value,
          document.getElementById('name').value,
          document.getElementById('email').value,
          document.getElementById('type').value,
          document.getElementById('doc').value,
        ]
      }
    })
    
    if (formValues) {
      const timestamp = Date.now();
      var block = {
        "user_id": document.getElementById('user_id').value,
        "profile": document.getElementById('profile').value,
        "desc": document.getElementById('desc').value,
        "name": document.getElementById('name').value,
        "email" : document.getElementById('email').value,
        "type": document.getElementById('type').value,
        "doc": document.getElementById('doc').value,
        "created_at": timestamp,
        "updated_at" : timestamp,
        "last_login": timestamp
      };
      
      var response = api.post('account/add/', block);

      await Toast.fire({
        icon: 'success',
        title: 'Usuário incluído'
      });  
      doUsuarios();
      forceUpdate();
    }
  }

  async function delUsuario(user_id){
    Swal.fire({
      title: 'Deseja excluir a conta?',
      text: "",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não'
    }).then((result) => {
      if (result.isConfirmed) {
        var response = api.delete('account/' + user_id);
        Toast.fire({
            icon: 'success',
            title: 'Usuário excluído'
          });  
        }
        doUsuarios();
        forceUpdate();
    })
  }
  
  const [usuarios, setUsuarios] = useState(['']);
  // const [show, setShow] = useState(false);

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0 text-dark">Usuarios</h1>
            </div>
          </div>
        </div>
      </div>
      <section className="content">
        <div className="container-fluid">
          <Button variant="primary" size="sm" onClick={novoUsuario}>
          Adicionar usuário
          </Button>
          <table class="blueTable">
            <thead>
              <tr>
                <th><center>User ID</center></th>
                <th><center>Nome</center></th>
                <th><center>Email</center></th>
                <th><center>Perfil</center></th>
                <th><center>Tipo</center></th>
                <th><center>Operação</center></th>
              </tr>
            </thead>
            {usuarios.map((data) => {
              return (<tr>
                <td><center>{data.user_id}</center></td>
                <td><center>{data.name}</center></td>
                <td><center>{data.email}</center></td>
                <td><center>{data.profile}</center></td>
                <td><center>{data.type}</center></td>
                <td><center> <div>
                  <Button variant="primary" size="sm" onClick={() => editUsuario(data.user_id)}>
                    Editar
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => delUsuario(data.user_id)}>
                    Excluir
                  </Button>
                  </div>
                </center></td>
              </tr>
              );
            })}
            <tbody>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}    
