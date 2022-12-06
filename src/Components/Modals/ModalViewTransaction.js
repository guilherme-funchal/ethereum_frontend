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

function ModalViewTransaction(props) {

  const link = "http://localhost:3001/upload/" + props.items[0].documentation;

  const closeOnEscapeKeyDown = e => {
    if ((e.charCode || e.keyCode) === 27) {
      props.onClose();
    }
  };

  const [showModalViewUser, setShowModalViewUser] = useState(false);
  const [itemsUser, setItemsUser] = useState([' ']);

  const style = { width: '660px' }

  var value = parseFloat(props.items[0].creditAssigned);
  value = value.toLocaleString('pt-br', { minimumFractionDigits: 2 });


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

                <h3 className="card-title">Transação</h3>
              </div>
              <div className="card-body">

                <div className="col-md-3">
                </div>
                <strong><i className="fas fa-pencil-alt mr-1"></i> Informação</strong>
                <p class="text-muted">
                <b>Projeto ID : </b>{props.items[0].id} <br></br>
                <b>Crédito : </b>{value} <br></br>
                <b>hash : </b>{props.items[0].txhash} <br></br>
                <b>Bloco : </b>{props.items[0].block}
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

export default ModalViewTransaction;