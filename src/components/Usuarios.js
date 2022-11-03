import './../App.css';
import Web3 from 'web3';
import api from '../api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Modal, Button } from 'react-bootstrap/';


import { useState, useEffect } from "react";
// import usuarios from "../components/data/data.json"


// eslint-disable-next-line import/no-anonymous-default-export
// export default function Usuarios({ usuarios }) {
export default function Usuarios() {  

  async function doUsuarios(){
    const response = api.get('account/list');
      var transactions_result = (await response).data;
      return transactions_result;
  }
  
  const resultado = doUsuarios();
  const [usuarios, setUsuarios] = useState(['']);

  var promise = Promise.resolve(resultado);
  promise.then(function(val) {
     setUsuarios(val);
  });

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

          <table class="blueTable">
            <thead>
              <tr>
                <th><center>User ID</center></th>
                <th><center>Nome</center></th>
                <th><center>Email</center></th>
                <th><center>Perfil</center></th>
                <th><center>Operação</center></th>
              </tr>
            </thead>
            {usuarios.map((data) => {
              return (<tr>
                <td><center>{data.user_id}</center></td>
                <td><center>{data.name}</center></td>
                <td><center>{data.email}</center></td>
                <td><center>{data.profile}</center></td>
                <td><center> <div>
                  <Button variant="primary" size="sm">
                    Editar
                  </Button>
                  <Button variant="danger" size="sm">
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
