import React from 'react';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ModalAddProject from "./modals/ModalAddProjeto";
import ModalEditProject from "./modals/ModalEditProject";
import ModalViewProject from "./modals/ModalViewProject";
import { If, Then, ElseIf, Else } from 'react-if-elseif-else-render';

import api from '../api';
import { useEffect, useCallback } from 'react';
import moment from 'moment';
import Swal from 'sweetalert2';

export default function Projetos(props) {

  useEffect(() => {
    const resultado = doProjetos();
  }, [])

  async function doProjetos() {

    var projetos_result = await api.get('listarProjetos');

    await setProjetos(projetos_result.data);

    await Toast.fire({
      icon: 'success',
      title: 'Lista de projetos atualizada'
    });
    forceUpdate();
    return projetos_result;
  }

  const [showModalAddProjeto, setShowModalAddProject] = useState(false);
  const [showModalViewProject, setShowModalViewProject] = useState(false);
  const [showModalEditProject, setShowModalEditProject] = useState(false);

  const [projetos, setProjetos] = useState(['']);
  const [IDprojeto] = useState(['']);
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);
  const [projeto, setProject] = useState('');

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

  const [items, setItems] = useState([' ']);
  const [AprovItems, setAprovItems] = useState([' ']);

  // const [dataItems, setDataItems] = useState({});

  const [modal, setModal] = useState(false);

  const toggle = () => {
    setModal(!modal);
  };

  async function EditItemsProject(id) {
    var response = await api.get('projeto?id=' + id);
    setItems(response.data);
  }

  async function DataItemsProject(id) {
    var response = await api.get('projeto?id=' + id);
    console.log(response);
  }

  async function viewProjeto(id) {
    EditItemsProject(id);
    setShowModalViewProject(true);
    forceUpdate();
  }

  async function editProjeto(id) {
    EditItemsProject(id);
    setShowModalEditProject(true);
  }

  async function transferCredit(account, creditAssigned) {

    var block_money = {
      "account": AprovItems[0].projectOwner,
      "id": "1",
      "amount": creditAssigned,
      "data": "0x"
    };
    await api.post('emitir', block_money);
  }

  async function finalizarProjeto(id, state) {

    if (state === true) {
      var state = "concluido";
    }
    if (state === false) {
      var state = "rejeitado";
    }

    var response = await api.get('projeto?id=' + id);
    setAprovItems(response.data);

    var current = moment()
      .utcOffset('-03:00')
      .format('DD/MM/YYYY hh:mm:ss a');

    let creditAssigned = 0;
    creditAssigned = response.data[0].area * props.taxas.data.carbono;

    const block = {
      "id": response.data[0].id,
      "name": response.data[0].name,
      "projectOwner": response.data[0].projectOwner,
      "projectApprover": response.data[0].projectApprover,
      "description": response.data[0].description,
      "documentation": response.data[0].documentation,
      "hash_documentation": response.data[0].creationDate,
      "state": state,
      "area": response.data[0].area,
      "creditAssigned": String(creditAssigned),
      "creationDate": response.data[0].creationDate,
      "updateDate": String(current)
    };

    var response_patch = await api.patch('/projeto', block);

    if (response_patch.status == 200) {
      if (state === "concluido") {
        var block_money = {
          "account": response.data[0].projectOwner,
          "id": "1",
          "amount": String(creditAssigned),
          "data": "0x"
        };
        await api.post('emitir', block_money);
      }
    }

    await doProjetos();
    await forceUpdate();
    if (state === "concluido") {
      Swal.fire('Projeto aprovado, crédito carbono gerado!', '', 'success');
    }
    if (state === "rejeitado") {
      Swal.fire('Projeto foi rejeitado!', '', 'error');
    }

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
        var response = api.delete('projeto/' + id);

        Toast.fire({
          icon: 'success',
          title: 'Usuário excluído'
        });
      }
      doProjetos();
      forceUpdate();
    })
  }


  return (

    <div>
      <div className="content-wrapper">
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
                  <th><center>Propositor</center></th>
                  <th><center>Estado</center></th>
                  <th><center>Area</center></th>
                  <th><center>Valor</center></th>
                  <th><center>Data criação</center></th>
                  <th><center>Data atualização</center></th>
                  <th><center>Operações disponíveis</center></th>
                </tr>
              </thead>
              {
                projetos.map((data) => {
                  var test = true;
                  var visible = false;

                  if (props.user.data[0].profile === "certificador" || props.user.data[0].profile === "registrador" || props.user.data[0].user_id === data.projectOwner) {
                    visible = true;
                  }

                  if (data.state === 'concluido' || data.state === 'enviado' && props.user.data[0].profile === "propositor") {
                    test = false;
                  }

                  var propositor = false;
                  var certificador = false;
                  var registrador = false;

                  if (props.user.data[0].profile === "certificador" && data.state === 'enviado') {
                    certificador = true;
                  }

                  if (props.user.data[0].profile === "propositor") {
                    propositor = true;
                  }

                  if (props.user.data[0].profile === "registrador") {
                    registrador = true;
                  }

                  const style = { width: '70px' }
                  if (data.id !== '0') {
                    return (

                      <If condition={visible === true}>
                        <Then>
                          <tr>
                            <td onClick={() => viewProjeto(data.id)}><center>{data.id}</center></td>
                            <td onClick={() => viewProjeto(data.id)}><center>{data.name}</center></td>
                            <td onClick={() => viewProjeto(data.id)}><center>{data.projectOwner}</center></td>
                            <td onClick={() => viewProjeto(data.id)}><center>{data.state}</center></td>
                            <td onClick={() => viewProjeto(data.id)}><center>{data.area}</center></td>
                            <td onClick={() => viewProjeto(data.id)}><center>{data.creditAssigned}</center></td>
                            <td onClick={() => viewProjeto(data.id)}><center>{data.creationDate}</center></td>
                            <td onClick={() => viewProjeto(data.id)}><center>{data.updateDate}</center></td>

                            {/* {test === true ?
                          ( */}
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

            <div><br></br></div>
            <Button variant="primary" size="sm" onClick={() => setShowModalAddProject(true)}>
              Adicionar
            </Button>
          </div>
        </section>

      </div>{/* /.col */}

      <ModalAddProject toggle={toggle} keyboard={false} backdrop={"static"} title="Adicionar projeto" onClose={() => { doProjetos(); forceUpdate(); setItems(' '); setShowModalAddProject(false); }} show={showModalAddProjeto}>
      </ModalAddProject>
      <ModalViewProject title="Dados do Projeto" items={items} onClose={() => { setShowModalViewProject(false); }} show={showModalViewProject}>
      </ModalViewProject>
      <ModalEditProject toggle={toggle} keyboard={false} backdrop={"static"} title="Editar dados do projeto" items={items} onClose={() => { doProjetos(); forceUpdate(); setShowModalEditProject(false); setItems(' '); }} show={showModalEditProject}>
      </ModalEditProject>
    </div>
  )

}
