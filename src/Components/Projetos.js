import Header from './Header';
import Footer from './Footer';
import Sidenav from './Sidenav';
import Api from '../Api';
import Table from './Tables/Table';
import { If, Then, ElseIf, Else } from 'react-if-elseif-else-render';
import Button from 'react-bootstrap/Button';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import ModalAddProject from "./Modals/ModalAddProjeto";
import ModalEditProject from "./Modals/ModalEditProject";
import ModalViewProject from "./Modals/ModalViewProject";
import moment from 'moment';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import ModalViewUser from "./Modals/ModalViewUser";

export default function Projetos(){ 
  const Sucesso = Swal.mixin({
    toast: true,
    // position: 'center',
    iconColor: 'green',
    customClass: {
      popup: 'colored-toast'
    },
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true
  });

  const Falha = Swal.mixin({
    toast: true,
    // position: 'center',
    iconColor: 'falha',
    customClass: {
      popup: 'colored-toast'
    },
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true
  });

    const [AprovItems, setAprovItems] = useState([' ']);
    const [user, setUser] = useState([]);
    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);
    const [showModalAddProjeto, setShowModalAddProject] = useState(false);
    const [showModalViewProject, setShowModalViewProject] = useState(false);
    const [showModalEditProject, setShowModalEditProject] = useState(false);
    const [modal, setModal] = useState(false);

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

    const getProjetos = async (cod_paciente) => {
        const response = await Api.get('listarProjetos');
        setProjetos(response.data);
    };

    const toggle = () => {
        setModal(!modal);
    };
    const navigate = useNavigate();
    const [projetos, setProjetos] = useState([]);
    const [items, setItems] = useState([' ']);
    const [itemsUser, setItemsUser] = useState([' ']);
    const [showModalViewUser, setShowModalViewUser] = useState(false);
    const [taxas, setTaxas] = useState([]);

    const getTaxas = async () => {
        const response = await Api.get('tax/list');
        setTaxas(response.data);
    };


    async function EditItemsProject(id) {
        var response = await Api.get('projeto?id=' + id);
        setItems(response.data);
    }

    async function viewProjeto(id) {
        EditItemsProject(id);
        setShowModalViewProject(true);
        forceUpdate();
    }
    
    async function EditItemUser(user_id) {
      var response = await Api.get('account/find/' + user_id);
      setItemsUser(response.data);
    }
  
  async function viewUser(user_id) {
      EditItemUser(user_id);
      setShowModalViewUser(true);
  }
    async function editProjeto(id) {
        EditItemsProject(id);
        setShowModalEditProject(true);
    }

    async function delProjeto(id) {
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
            var response = Api.delete('projeto/' + id);
    
            Toast.fire({
              icon: 'success',
              title: 'Projeto excluído'
            });
          }
          getProjetos();
          forceUpdate();
        })
      }

    async function transferCredit(account, creditAssigned) {

        var block_money = {
          "account": AprovItems[0].projectOwner,
          "id": "1",
          "amount": creditAssigned,
          "data": "0x"
        };
        await Api.post('emitir', block_money);
    }

    useEffect(() => {
        var address = localStorage.getItem('wallet');
        if (address !== null) {
          setUser(JSON.parse(address));
          getProjetos();
          getTaxas();
      } else {
          setUser(false);
      }

    }, []);

    async function updadateProject(id, state){
      if (state === true) {
        var state = "concluido";
      }
      if (state === false) {
        var state = "rejeitado";
      }
  
      var response = await Api.get('projeto?id=' + id);
      setAprovItems(response.data);
  
      var current = moment()
        .utcOffset('-03:00')
        .format('DD/MM/YYYY hh:mm:ss a');
  
      let creditAssigned = 0;
      creditAssigned = response.data[0].area * taxas.carbono;
  
      const block = {
        "id": response.data[0].id,
        "name": response.data[0].name,
        "projectOwner": response.data[0].projectOwner,
        "projectCreator": response.data[0].projectCreator,
        "projectApprover": response.data[0].projectApprover,
        "description": response.data[0].description,
        "documentation": response.data[0].documentation,
        "hash_documentation": response.data[0].hash_documentation,
        "state": state,
        "area": response.data[0].area,
        "creditAssigned": String(creditAssigned),
        "creationDate": response.data[0].creationDate,
        "retired": response.data[0].retired,
        "updateDate": String(current)
      };
  
      var response_patch = await Api.patch('/projeto', block);
  
      if (response_patch.status === 200) {
        if (state === "concluido") {
          var block_money = {
            "account": response.data[0].projectOwner,
            "id": "1",
            "amount": String(creditAssigned),
            "data": "0x"
          };
          await Api.post('emitir', block_money);
        }
        await Sucesso.fire({
          icon: 'success',
          title: 'Projeto sendo atualizado'
        });
      }

      navigate(0);
    }

    async function finalizarProjeto(id, state) {

      Swal.fire({
        title: 'Confirma operação?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não'
      }).then((result) => {
        if (result.isConfirmed) {
          updadateProject(id, state)
        }
      })
        // await getProjetos();
        // await forceUpdate();
        // if (state === "concluido") {
        //   Swal.fire('Projeto aprovado, crédito carbono gerado!', '', 'success');
        // }
        // if (state === "rejeitado") {
        //   Swal.fire('Projeto foi rejeitado!', '', 'error');
        // }
      }

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
                                <h1 className="m-0">Projetos</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <section className="content">
                    <div className="container-fluid">
                    <table className="blueTable">
              <thead>
                <tr>
                  <th><center>ID</center></th>
                  <th><center>Nome</center></th>
                  <th><center>Proprietário</center></th>
                  <th><center>Criador</center></th>
                  <th><center>Estado</center></th>
                  {/* <th><center>Area</center></th>
                  <th><center>Valor</center></th> */}
                  {/* <th><center>Data criação</center></th> */}
                  {/* <th><center>Aposentado</center></th> */}
                  <th><center>Data atualização</center></th>
                  <th><center>Operações</center></th>
                </tr>
              </thead>
              {
                projetos.map((data) => {
                  var test = true;
                  var visible = false;

                  if (user[0]?.profile === "certificador" || user[0]?.profile === "registrador" || user[0]?.user_id === data.projectOwner) {
                    visible = true;
                  }

                  if (data.state === 'concluido' || data.state === 'enviado' && user[0]?.profile === "propositor") {
                    test = false;
                  }

                  var propositor = false;
                  var certificador = false;
                  var registrador = false;
                  var aposentado = "";

                  if (user[0]?.profile === "certificador" && data.state === 'enviado') {
                    certificador = true;
                  }

                  if (user[0]?.profile === "registrador" && data.state === 'enviado') {
                    certificador = true;
                  }

                  if (user[0]?.profile === "propositor") {
                    propositor = true;
                  }

                  if (user[0]?.profile === "registrador") {
                    registrador = true;
                  }

                  if (data.retired === 'false'){
                    aposentado = 'Não';
                  } else {
                    aposentado = 'Sim';
                  }

                  const style = { width: '70px' }

                  console.log('test->', test);

                  if (data.id !== '0') {
                    return (
                      

                      <If condition={visible === true}>
                        <Then>
                          <tr>
                            <td onClick={() => viewProjeto(data.id)}><center>{data.id}</center></td>
                            <td onClick={() => viewProjeto(data.id)}><center>{data.name}</center></td>
                            <td onClick={() => viewUser(data.projectOwner)}><center>{data.projectOwner}</center></td>
                            <td onClick={() => viewUser(data.projectCreator)}><center>{data.projectCreator}</center></td>
                            <td onClick={() => viewProjeto(data.id)}><center>{data.state}</center></td>
                            {/* <td onClick={() => viewProjeto(data.id)}><center>{data.area}</center></td>
                            <td onClick={() => viewProjeto(data.id)}><center>{data.creditAssigned}</center></td> */}
                            {/* <td onClick={() => viewProjeto(data.id)}><center>{data.creationDate}</center></td> */}
                            {/* <td onClick={() => viewProjeto(data.id)}><center>{aposentado}</center></td> */}
                            <td onClick={() => viewProjeto(data.id)}><center>{data.updateDate}</center></td>

                            <If condition={test === true}>
                              <Then>
                                <td><center><div>
                                  <If condition={visible === true}>
                                    <Then>
                                      <If condition={propositor === true}>
                                        <Then>
                                          <Button style={style} className="btn btn-default" rounded variant="primary" size="sm" name="teste" onClick={() => editProjeto(data.id)}>Editar</Button>
                                          <Button style={style} className="btn btn-default" rounded variant="danger" size="sm" onClick={() => delProjeto(data.id)}>Excluir</Button>
                                        </Then>
                                      </If>
                                      <If condition={certificador === true}>
                                        <Then>
                                          <Button style={style} className="btn btn-default" rounded variant="success" size="sm" onClick={() => finalizarProjeto(data.id, true)}>Aprovar</Button>
                                          <Button style={style} className="btn btn-default" rounded variant="danger" size="sm" onClick={() => finalizarProjeto(data.id, false)}>Rejeitar</Button>
                                        </Then>
                                      </If>
                                      <If condition={registrador === true}>
                                        <Then>
                                          {/* <Button style={style} className="btn btn-default" rounded variant="primary" size="sm" name="teste" onClick={() => editProjeto(data.id)}>Editar</Button>
                                          <Button style={style} className="btn btn-default" rounded variant="danger" size="sm" onClick={() => delProjeto(data.id)}>Excluir</Button> */}
                                          <Button style={style} className="btn btn-default" rounded variant="success" size="sm" onClick={() => finalizarProjeto(data.id, true)}>Aprovar</Button>
                                          <Button style={style} className="btn btn-default" rounded variant="danger" size="sm" onClick={() => finalizarProjeto(data.id, false)}>Rejeitar</Button>
                                        </Then>
                                      </If>
                                    </Then>
                                  </If>
                                  <Button style={style} className="btn btn-default" rounded variant="primary" size="sm" name="teste" onClick={() => viewProjeto(data.id)}>Ver</Button>
                                </div></center></td>
                              </Then>
                            </If>
                          </tr>
                        </Then>
                      </If>

                    );
                  }
                })}
              {/* <tbody>
              </tbody> */}
            </table>
            <Button variant="primary" size="sm" onClick={() => setShowModalAddProject(true)}>
              Adicionar
            </Button>

            <ModalAddProject toggle={toggle} keyboard={false} projectOwner={user[0]?.user_id} backdrop={"static"} title="Adicionar projeto" onClose={() => { getProjetos(); forceUpdate(); setItems(' '); setShowModalAddProject(false); }} show={showModalAddProjeto}>
            </ModalAddProject>
            <ModalViewProject title="Dados do Projeto" items={items} onClose={() => { setShowModalViewProject(false); }} show={showModalViewProject}>
            </ModalViewProject>
            <ModalEditProject toggle={toggle} keyboard={false} backdrop={"static"} title="Editar dados do projeto" items={items} onClose={() => { getProjetos(); forceUpdate(); setShowModalEditProject(false); setItems(' '); }} show={showModalEditProject}>
            </ModalEditProject>
            <ModalViewUser title="Dados do Projeto" items={itemsUser} onClose={() => { setShowModalViewUser(false); }} show={showModalViewUser}>
            </ModalViewUser>
                    </div>{/* /.container-fluid */}
                </section>
                {/* /.content */}
            </div>
            {/* /.content-wrapper */}
            <Footer />
    </div>
    )
}
