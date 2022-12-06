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

  const [showModalViewUser, setShowModalViewUser] = useState(false);
  const [itemsUser, setItemsUser] = useState([' ']);

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
          <h4 className="modal-title">{props.title}</h4> */}
            <div className="card card-primary">
              <div className="card-header">

                <h3 className="card-title">{props.items[0].name}</h3>
              </div>
              <div className="card-body">

                <div className="col-md-3">
                </div>
                <strong><i className="fas fa-book mr-1"></i> Descrição</strong>
                <p class="text-muted">
                  {props.items[0].description}
                </p>
                <strong><i className="fas fa-pencil-alt mr-1"></i> Informações</strong>
                <p class="text-muted">
                <b>Área : </b>{props.items[0].area} <br></br>
                <b>Valor : </b>{props.items[0].creditAssigned} <br></br>
                <b>Estado : </b>{props.items[0].state} <br></br>
                <b>Atualização : </b>{props.items[0].updateDate}
                </p>
                <strong><i className="fas fa-file mr-1"></i> Documentação</strong>
                <p class="text-muted">
                <b>Arquivo : </b><a href={link} target="_blank">{props.items[0].documentation}</a><br></br>
                <b>Hash : </b>{props.items[0].hash_documentation}
                </p>
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
        </div>
      </div>
    </CSSTransition>,
    document.getElementById("root")
  );
};

export default ModalViewProjeto;