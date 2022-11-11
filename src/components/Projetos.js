import React from 'react';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ModalAddProject from "./modals/ModalAddProjeto";
import ModalEditProject from "./modals/ModalEditProject";
import ModalViewProject from "./modals/ModalViewProject";

import api from '../api';
import { useEffect, useCallback } from 'react';
import moment from 'moment';
import Swal from 'sweetalert2';

export default function Projetos() {

  useEffect(() => {
    const resultado = doProjetos();
  }, [])  

  async function doProjetos() {

    const response = await api.get('listarProjetos');
    var projetos_result = (await response).data;
    var promise = Promise.resolve(projetos_result);
    promise.then(function (val) {
      setProjetos(val);
    });
    // await Toast.fire({
    //   icon: 'success',
    //   title: 'Lista de projetos atualizada'
    // });  
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

  // const [dataItems, setDataItems] = useState({});

  // async function setProjeto(id){
  //   // var response = api.get('projeto?id=' + id);
  //   // .them(response => response.json())
  //   // var promise = Promise.resolve(response);
  //   // promise.then(function (val) {
  //   //   setItems(val)
  //   // });
  //   console.log("---->", id)
  //   fetch("http://localhost:3001/projeto?id=" + id)
  //     .then((response) => response.json())
  //     .then((items) => setItems(items))
  //     .catch((err) => console.log(err));
    
  //   setShowModalEditProject(true);  
  // }  
   
  const [modal, setModal] = useState(false);
  
  const toggle = () => {
    setModal(!modal);
  };
  
  async function EditItemsProject(id) {
    fetch("http://localhost:3001/projeto?id=" + id)
      .then((response) => response.json())
      .then((items) => setItems(items))
      .catch((err) => console.log(err));
  }

  async function DataItemsProject(id) {
    var response = await api.get('projeto?id=' + id);
    console.log(response);
  }

  async function viewProjeto(id) {
    setShowModalViewProject(true);  
  }

  async function editProjeto(id) {
    EditItemsProject(id); 
    setShowModalEditProject(true);  
  }
  
  async function aprovarProjeto(id){
    console.log('Aprovar!!!')
    var response = await api.get('projeto?id=' + id);
    console.log(response);
    // setItens(response);
  }

  async function delProjeto(id){
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
                      <table class="blueTable">
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
                            <th><center>Operação</center></th>
                          </tr>
                        </thead>
                        {projetos.map((data) => {
                          

                          if (data.id !== '0'){
                          return (<tr>
                            <td onClick={() => viewProjeto(data.id)}><center>{data.id}</center></td>
                            <td onClick={() => viewProjeto(data.id)}><center>{data.name}</center></td>
                            <td onClick={() => viewProjeto(data.id)}><center>{data.projectOwner}</center></td>
                            <td onClick={() => viewProjeto(data.id)}><center>{data.state}</center></td>
                            <td onClick={() => viewProjeto(data.id)}><center>{data.area}</center></td>
                            <td onClick={() => viewProjeto(data.id)}><center>{data.creditAssigned}</center></td>
                            <td onClick={() => viewProjeto(data.id)}><center>{data.creationDate}</center></td>
                            <td onClick={() => viewProjeto(data.id)}><center>{data.updateDate}</center></td>
                            <td><center> <div>
                              <Button variant="primary" size="sm"  name="teste" onClick={() => editProjeto(data.id)}>
                                Editar
                              </Button>
                              <Button variant="danger" size="sm" onClick={() => delProjeto(data.id)}>
                                Excluir
                              </Button>
                              <Button variant="success" size="sm" onClick={() => aprovarProjeto(data.id)}>
                                Aprovar
                              </Button>
                            </div>
                            </center></td>  
                          </tr>
                          );
                          }
                        })}

                        <tbody>
                        </tbody>


                      </table>
                      <div><br></br></div>
                      <Button variant="primary" size="sm" onClick={() => setShowModalAddProject(true)}>
                        Adiciona
                      </Button>
                    </div>
                  </section>

                </div>{/* /.col */}
              
        <ModalAddProject toggle={toggle} keyboard={false} backdrop={"static"}  title="Adicionar projeto" onClose={() => {setShowModalAddProject(false); forceUpdate()}} show={showModalAddProjeto}>
        </ModalAddProject>
        {/* <ModalViewProject title="Dados do Projeto" dataItems={dataItems} onClose={() => {setShowModalViewProject(false); forceUpdate()}} show={showModalViewProject}>
        </ModalViewProject> */}
        <ModalEditProject toggle={toggle} keyboard={false} backdrop={"static"} title="Editar dados do projeto" items={items} onClose={() => {doProjetos(); forceUpdate(); setShowModalEditProject(false);}} show={showModalEditProject}>
        </ModalEditProject>
        </div>
      )

}
