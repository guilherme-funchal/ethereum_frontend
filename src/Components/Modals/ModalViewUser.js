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
        <th colSpan="2"><center>Dados do usuário</center></th>
        </tr>
        </thead>
        <tr>
        <td><b>User ID</b></td>
        <td>{props.items[0].user_id}</td>   
        </tr> 
        <tr>
        <td><b>Nome</b></td>
        <td>{props.items[0].name}</td>   
        </tr> 
        <tr>
        <td><b>Email</b></td>
        <td>{props.items[0].email}</td>   
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