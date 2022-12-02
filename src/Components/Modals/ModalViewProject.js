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



function ModalViewProjeto(props) {

  const link = "http://localhost:3001/upload/" + props.items[0].documentation;

  const closeOnEscapeKeyDown = e => {
    if ((e.charCode || e.keyCode) === 27) {
      props.onClose();
    }
  };

  const style = { width: '650px' }
  console.log(props.items);

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
            <div class="card card-widget widget-user-2 shadow-sm">

              <div class="widget-user-header bg-primary">
                <h6 class="widget-user-username">{props.items[0].name}</h6>
                <h5 class="widget-user-desc">{props.items[0].description}</h5>
              </div>
              <div class="card-footer p-0">
                <ul class="nav flex-column">
                  
                  <li class="description-text">
                        Propositor
                        <span class="float-right">{props.items[0].projectCreator}</span>
                  </li>
                  <li class="description-text">
                        Proprietário
                        <span class="float-right">{props.items[0].projectOwner}</span>
                  </li>
                  <li class="description-text">
                        Aprovador
                        <span class="float-right">{props.items[0].projectApprover}</span>
                  </li>
                  <li class="description-text">
                        Estado
                        <span class="float-right">{props.items[0].state}</span>
                  </li>
                  <li class="description-text">
                        Área
                        <span class="float-right">{props.items[0].area}</span>
                  </li>
                  <li class="description-text">
                        Crédito
                        <span class="float-right">{props.items[0].creditAssigned}</span>
                  </li>
                  <li class="description-text">Atualização
                  <span class="float-right">{props.items[0].updateDate}</span>
                  </li>
                  <li class="description-text">
                        Documentação
                        <span class="float-right badge bg-warning"><a href={link} target="_blank">{props.items[0].documentation}</a></span>
                  </li>
                  <div class="description-block">
                  <h5 class="description-header">Hash do documento</h5>
                  <span class="description-text">{props.items[0].hash_documentation}</span>
                  </div>
                </ul>
              </div>
            </div>
            <div className="modal-body">
              <div><br></br></div>
              <div className="text-right">
              <Button onClick={props.onClose} className="btn btn-primary btn-block"><b>Fechar</b></Button>
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