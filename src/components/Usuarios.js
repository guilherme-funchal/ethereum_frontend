import './../App.css';
// import Web3 from 'web3';
import api from '../api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Button } from 'react-bootstrap/';
import { useState, useEffect, useCallback } from 'react';
import ModalAddUser from './modals/ModalAddUser';
import ModalEditUser from './modals/ModalEditUser';


export default function Usuarios(props) {

  const [items, setItems] = useState([' ']);

  const [showModal1, setShowModal1] = useState(false);
  const MySwal = withReactContent(Swal);

  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);

  const [taxas, setTaxas] = useState('');

  const [showModalAddUser, setShowModalAddUser] = useState(false);
  const [showModalEditUser, setShowModalEditUser] = useState(false);

  
  async function EditItemsUser(id) {
    var response = await api.get('account/find/' + id);
    setItems(response.data);
  }

  async function editUser(id) {
    EditItemsUser(id); 
    setShowModalEditUser(true);  
  }

  useEffect(() => {
    const resultado = doUsuarios();
  }, [])

  const Toast = Swal.mixin({
    toast: true,
    position: 'bottom-right',
    iconColor: 'green',
    customclassName: {
      popup: 'colored-toast'
    },
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true
  });


  async function doUsuarios() {
    const response = api.get('account/list');
    var transactions_result = (await response).data;

    var promise = Promise.resolve(transactions_result);
    promise.then(function (val) {
      setUsuarios(val);
    });
    return transactions_result;
  }

  async function refreshPage() {
    window.location.reload(false);
  }
  
  async function editCarbono(){
    var block = ''
    const { value: carbono } = await Swal.fire({
      title: 'Cotação para o carbono',
      input: 'text',
      inputLabel: '',
      inputPlaceholder: 'Valor do carbono'
    })
    var moeda = props.taxas.data.moeda;
    if (carbono) {
      block = {
        "id": 1,
        "carbono": carbono,
        "moeda": moeda 
      };

      var response = await api.patch('tax/' + 1, block);
      Swal.fire(`Valor do carbono : ${carbono}`);
      props.taxas.data.carbono = carbono;
      forceUpdate();
    }
  }

  async function editMoeda(){
    var block = ''
    const { value: moeda } = await Swal.fire({
      title: 'Cotação para a moeda',
      input: 'text',
      inputLabel: '',
      inputPlaceholder: 'Valor da Moeda'
    })
    var carbono = props.taxas.data.carbono;

    if (moeda) {
      block = {
        "id": 1,
        "carbono": carbono,
        "moeda": moeda 
      };
      var response = await api.patch('tax/' + 1, block);
      Swal.fire(`Valor da moeda : ${moeda}`);
      props.taxas.data.moeda = moeda;
      forceUpdate();
    }
  }

  async function delUsuario(user_id) {
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
        const block = {
          "user_id": user_id
        };
        const response_add = api.post('account-lists/add', block);
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
          <Button variant="primary" size="sm" onClick={() => setShowModalAddUser(true)}>
                        Adicionar usuário
          </Button>
          <table className="blueTable">
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
              const style = { width: '60px' }
              return (<tr>
                <td><center>{data.user_id}</center></td>
                <td><center>{data.name}</center></td>
                <td><center>{data.email}</center></td>
                <td><center>{data.profile}</center></td>
                <td><center>{data.type}</center></td>
                <td><center> <div>
                  {/* <Button style={style} variant="primary" size="sm" onClick={() => editUsuario(data.user_id)}>
                    Editar
                  </Button> */}
                  <Button style={style} variant="primary" size="sm" onClick={() => editUser(data.user_id)}>
                    Editar
                  </Button>
                  <Button style={style} variant="danger" size="sm" onClick={() => delUsuario(data.user_id)}>
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
      <div><br></br></div>
      <div className="container-fluid"> 
      <div c="row mb-2">
            <div className="col-sm-6">
              <h2 className="m-0 text-dark">Cotações</h2>
            </div>
          </div>
      <section className="content">
      
      <div className="row">  
        <div className="col-lg-5 col-8">
          <div className="small-box bg-success">
            <div className="inner">
            <h3>{props.taxas.data.carbono}</h3>
            <p>Taxa de conversão de Hectares em crédito de carbono</p>
            </div>
            <div className="icon">
              <i className="ion ion-bag"></i>
            </div>
            <a href="#" className="small-box-footer" onClick={() => editCarbono()}>Alterar <i className="fas fa-arrow-circle-right"></i></a>
          </div>
        </div> 
        <div className="col-lg-5 col-8"> 
          <div className="small-box bg-warning">  
            <div className="inner">
              <h3>{props.taxas.data.moeda}</h3>
              <p>Taxa de conversão de crédito de carbono em moeda</p>
            </div>
            <div className="icon">
              <i className="ion ion-bag"></i>
            </div>
            <a href="#" className="small-box-footer" onClick={() => editMoeda()}>Alterar <i className="fas fa-arrow-circle-right"></i></a>
          </div>
        </div>
        </div>
        </section>  
      </div>  
      
      <ModalAddUser  onClose={() => {doUsuarios();forceUpdate();setShowModalAddUser(false);setItems(' ');}} show={showModalAddUser}></ModalAddUser>
      <ModalEditUser items={items} onClose={() => {doUsuarios();forceUpdate();setShowModalEditUser(false);setItems(' ');}} show={showModalEditUser}></ModalEditUser>     
      </div>
      
  )
}    
