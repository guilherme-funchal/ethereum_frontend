import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";
import { Form, Button, Row, Col } from "react-bootstrap";
import Api from '../../Api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Controller, useForm } from "react-hook-form";
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from "moment";
import { Modal } from "bootstrap";



function ModalViewProjeto (props) {

  const link = "http://localhost:3001/upload/" + props.items[0].documentation;

  const closeOnEscapeKeyDown = e => {
    if ((e.charCode || e.keyCode) === 27) {
      props.onClose();
    }
  };

  const style = { width: '650px' }
  var aposentado = "";

  if (props.items[0].retired === 'false'){
    aposentado = 'Não'
  } else {
    aposentado = 'Sim'
  }
  
return ReactDOM.createPortal(
  <CSSTransition
    in={props.show}
    unmountOnExit
    timeout={{ enter: 0, exit: 300 }}
  >
    <div className="modal">
    <div className="modal-dialog">
      <div className="modal-content" style={style} onClick={e => e.stopPropagation()}>
        {/* <div className="modal-header">
          <h4 className="modal-title">{props.title}</h4>
        </div> */}
        <div className="modal-body">
        <table className="blueTable">
        <thead>
        <tr>
        <th colSpan="2"><center>Itens</center></th>
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
        <td><a href={link} target="_blank">{props.items[0].documentation}</a></td>

        </tr> 
        <tr>
        <td><b>Hash</b></td>
        <td>{props.items[0].hash_documentation}</td>   
        </tr> 
        <tr>
        <td><b>Propositor</b></td>
        <td>{props.items[0].projectCreator}</td>   
        </tr> 
        <tr>
        <td><b>Proprietário</b></td>
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
        <td><b>Area</b></td>
        <td>{props.items[0].area} hectares</td>   
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
        <tr>
        <td><b>Aposentado</b></td>
        <td>{aposentado}</td>   
        </tr>
        </table> 
        <div><br></br></div>                   
          <div className="text-right">
              <Button variant="danger" onClick={props.onClose}>
                Fechar
              </Button>
            </div>  
        </div>
        <div className="modal-footer">
        </div>
      </div>
      </div>    
    </div>
  </CSSTransition>,
  document.getElementById("root")
);
};

export default ModalViewProjeto;