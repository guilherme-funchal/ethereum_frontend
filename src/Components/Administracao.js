import Header from './Header';
import Footer from './Footer';
import Sidenav from './Sidenav';
import Api from '../Api';
import Swal from 'sweetalert2';
import { Button } from 'react-bootstrap/';
import { useState, useEffect, useCallback } from 'react';
import ModalAddUser from './Modals/ModalAddUser';
import ModalEditUser from './Modals/ModalEditUser';
import './../App.css';
import './Modals/Modal.css';


export default function Administracao() {
    async function viewUser(user_id) {
        var response = await Api.get('account/find/' + user_id);
        Swal.fire({
          title: response.data[0].name,
          text: response.data[0].email,
          imageUrl: response.data[0].image,
          imageAlt: 'Custom image',
        })
    }

    const getUsers = async () => {
        const response = await Api.get('account/list');
        setUsers(response.data);
    };

    const getTaxas = async () => {
        const response = await Api.get('tax/list');
        setTaxas(response.data);
    };

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

    async function EditItemsUser(id) {
        var response = await Api.get('account/find/' + id);
        setItems(response.data);
    }

    async function editUser(id) {
        EditItemsUser(id);
        setShowModalEditUser(true);
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
                Api.delete('account/' + user_id);
                Toast.fire({
                    icon: 'success',
                    title: 'Usuário excluído'
                });
                const block = {
                    "user_id": user_id
                };
                Api.post('account-lists/add', block);
            }
            getUsers();
            forceUpdate();
        })
    }

    const [users, setUsers] = useState([]);
    const [taxas, setTaxas] = useState([]);
    const [showModalAddUser, setShowModalAddUser] = useState(false);
    const forceUpdate = useCallback(() => updateState({}), []);
    const [, updateState] = useState();
    const [items, setItems] = useState([' ']);
    const [showModalEditUser, setShowModalEditUser] = useState(false);

    async function editCarbono(){
        var block = ''
        const { value: carbono } = await Swal.fire({
          title: 'Cotação para o carbono',
          input: 'text',
          inputLabel: '',
          inputPlaceholder: 'Valor do carbono'
        })
        var moeda = taxas.moeda;
        if (carbono) {
          block = {
            "id": 1,
            "carbono": carbono,
            "moeda": moeda 
          };
    
          await Api.patch('tax/' + 1, block);
          Swal.fire(`Valor do carbono : ${carbono}`);
          taxas.carbono = carbono;
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
        var carbono = taxas.carbono;
    
        if (moeda) {
          block = {
            "id": 1,
            "carbono": carbono,
            "moeda": moeda 
          };
          await Api.patch('tax/' + 1, block);
          Swal.fire(`Valor da moeda : ${moeda}`);
          taxas.moeda = moeda;
          forceUpdate();
        }
      }
      

    useEffect(() => {
        getUsers();
        getTaxas();
    }, []);

    return (
        <div>
            <Header />
            <Sidenav />
            {/* Content Wrapper. Contains page content */}
            <div className="content-wrapper">
                {/* Content Header (Page header) */}
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="m-0">Administração</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <section className="content">
                    <div className="container-fluid">
                        <Button variant="primary" size="sm" onClick={() => setShowModalAddUser(true)}>
                        <i class="fas fa-user"></i> Novo
                        </Button>
                        <table className="blueTable">
                            <thead>
                                <tr>
                                    <th><center>Nome</center></th>
                                    <th><center>Email</center></th>
                                    <th><center>User ID</center></th>
                                    <th><center>Perfil</center></th>
                                    {/* <th><center>Tipo</center></th> */}
                                    <th><center>Operação</center></th>
                                </tr>
                            </thead>

                            {users.map((data) => {
                                var visible = false;
                                if (data.user_id === "0x0000000000000000000000000000000000000000"){
                                    visible = true;
                                }
                                return (
                                    visible ? null
                                    : (
                                    <tr> 
                                    <td><center>{data.name}</center></td>
                                    <td><center>{data.email}</center></td>
                                    <td style={{ cursor: "pointer" }} key={data.user_id} onClick={() => viewUser(data.user_id)}><center>{data.user_id}</center></td> 
                                    <td><center>{data.profile}</center></td>
                                    {/* <td><center>{data.type}</center></td> */}
                                    <td><center> <div>
                                        <Button className="btn btn-default" variant="primary" size="sm" onClick={() => editUser(data.user_id)}>
                                        <i class="fas fa-pen"> Edita</i> 
                                        </Button>
                                        <Button className="btn btn-default" variant="danger" size="sm" onClick={() => delUsuario(data.user_id)}>
                                        <i class="fas fa-trash"> Exclui</i> 
                                        </Button>
                                    </div>
                                    </center></td>
                                    </tr>
                                    )
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
                                        <h3>{taxas.carbono}</h3>
                                        <p>Taxa de conversão de Hectares em crédito de carbono</p>
                                    </div>
                                    <div className="icon">
                                        <i className="ion ion-bag"></i>
                                    </div>
                                    <div className="small-box-footer" onClick={() => editCarbono()}>Alterar <i className="fas fa-arrow-circle-right"></i></div>
                                </div>
                            </div>
                            <div className="col-lg-5 col-8">
                                <div className="small-box bg-warning">
                                    <div className="inner">
                                        <h3>{taxas.moeda}</h3>
                                        <p>Taxa de conversão de crédito de carbono em moeda</p>
                                    </div>
                                    <div className="icon">
                                        <i className="ion ion-bag"></i>
                                    </div>
                                    <div className="small-box-footer" onClick={() => editMoeda()}>Alterar <i className="fas fa-arrow-circle-right"></i></div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                {/* /.content */}
            </div>
            <ModalAddUser onClose={() => { getUsers(); forceUpdate(); setShowModalAddUser(false); setItems(' '); }} show={showModalAddUser}></ModalAddUser>
            <ModalEditUser items={items} onClose={() => { getUsers(); forceUpdate(); setShowModalEditUser(false); setItems(' '); }} show={showModalEditUser}></ModalEditUser>

            {/* /.content-wrapper */}
            <Footer />
        </div>
    )
}