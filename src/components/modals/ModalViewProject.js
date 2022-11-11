import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";
import { Form, Button, Row, Col } from "react-bootstrap";
import api from '../../api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Controller, useForm } from "react-hook-form";
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from "moment";

function ModalViewProjeto (props) {
  
  const closeOnEscapeKeyDown = e => {
    if ((e.charCode || e.keyCode) === 27) {
      props.onClose();
    }
  };
 
return ReactDOM.createPortal(
  <CSSTransition
    in={props.show}
    unmountOnExit
    timeout={{ enter: 0, exit: 300 }}
  >
    <div className="modal">
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {/* <div className="modal-header">
          <h4 className="modal-title">{props.title}</h4>
        </div> */}
        <div className="modal-body">
        <table class="blueTable">
        <thead>
        <tr>
        <th colspan="2"><center>Itens</center></th>
        </tr>
        </thead>
        <tr>
        <td><b>Nome do projeto</b></td>
        <td>{props.items[0].name}</td>   
        </tr> 
        <tr>
        <td><b>Descrição</b></td>
        <td>{props.items[0].description}</td>   
        </tr> 
        <tr>
        <td><b>Documentação</b></td>
        <td>{props.items[0].documentation}</td>   
        </tr> 
        <tr>
        <td><b>Hash doc</b></td>
        <td>{props.items[0].hash_documentation}</td>   
        </tr> 
        <tr>
        <td><b>Propositor</b></td>
        <td>{props.items[0].projectOwner}</td>   
        </tr> 
        <tr>
        <td><b>Aprovador</b></td>
        <td>{props.items[0].projectApprover}</td>   
        </tr>
        <tr>
        <td><b>Estado</b></td>
        <td>{props.items[0].state}</td>   
        </tr>
        <tr>
        <td><b>Crédito</b></td>
        <td>{props.items[0].creditAssigned}</td>   
        </tr> 
        <tr>
        <td><b>Data de criação</b></td>
        <td>{props.items[0].creationDate}</td>   
        </tr> 
        <tr>
        <td><b>Data de atualização</b></td>
        <td>{props.items[0].updateDate}</td>   
        </tr> 
        </table> 
        <div><br></br></div>                   
          <div className="text-right">
              <Button variant="danger" onClick={props.onClose}>
                Fechar
              </Button>
            </div>  
        </div>
        <div class="modal-footer">
        </div>
      </div>

    </div>
  </CSSTransition>,
  document.getElementById("root")
);
};

export default ModalViewProjeto;