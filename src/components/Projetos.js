import React from 'react';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ModalAddProjeto from "./modals/ModalAddProjeto";
import ModalEditProject from "./modals/ModalEditProject";
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
    await Toast.fire({
      icon: 'success',
      title: 'Lista de projetos atualizada'
    });  
    forceUpdate();
    return projetos_result;
  }

  const [showModalAddProjeto, setShowModalAddProject] = useState(false);
  const [showModalEditProject, setShowModalEditProject] = useState(false);
  const [projetos, setProjetos] = useState(['']);
  const IDprojeto = useState(['']);
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);

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
                      <Button variant="primary" size="sm" onClick={() => setShowModalAddProject(true)}>
                        Adiciona
                      </Button>
                      <table class="blueTable">
                        <thead>
                          <tr>
                            <th><center>ID</center></th>
                            <th><center>Nome</center></th>
                            <th><center>Propositor</center></th>
                            <th><center>Estado</center></th>
                            <th><center>Area</center></th>
                            <th><center>Documento</center></th>
                            <th><center>Data criação</center></th>
                            <th><center>Data atualização</center></th>
                            <th><center>Operação</center></th>
                          </tr>
                        </thead>
                        {projetos.map((data) => {
                          if (data.projectIdCounter !== '0'){
                          return (<tr>
                            <td><center>{data.projectIdCounter}</center></td>
                            <td><center>{data.name}</center></td>
                            <td><center>{data.projectOwner}</center></td>
                            <td><center>{data.state}</center></td>
                            <td><center>{data.area}</center></td>
                            <td><center>{data.documentation}</center></td>
                            <td><center>{data.creationDate}</center></td>
                            <td><center>{String(data.updateDate)}</center></td>
                            <td><center> <div>
                              <Button variant="primary" size="sm"  id={data.projectIdCounter} onClick={() => setShowModalEditProject(true)}>
                                Editar
                              </Button>
                              <Button variant="danger" size="sm" onClick={() => delProjeto(data.projectIdCounter)}>
                                Excluir
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
                    </div>
                  </section>

                </div>{/* /.col */}
              
        <ModalAddProjeto title="Adicionar projeto" onClose={() => {setShowModalAddProject(false); forceUpdate()}} show={showModalAddProjeto}>
        </ModalAddProjeto>
                <ModalEditProject title="My ModalEditProject" onClose={() => {setShowModalEditProject(false);}} show={showModalEditProject}></ModalEditProject>
        </div>
      )

}
