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

  const style = { width: '430px' }

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
              <div className="card card-primary card-outline">
                <div className="card-body box-profile">
                  <div className="text-center">
                    <img className="profile-user-img img-fluid img-circle" src={props.items[0].image} alt="User profile picture" />
                  </div>
                  <h3 className="profile-username text-center">{props.items[0].name}</h3>
                  <p className="text-muted text-center">{props.items[0].email}</p>
                  <ul className="list-group list-group-unbordered mb-3">
                    <li className="list-group-item">
                      <b>User ID : </b>{props.items[0].user_id}
                    </li>
                  </ul>
                  <Button onClick={props.onClose} className="btn btn-primary btn-block"><b>Fechar</b></Button>
                </div>
              </div>
              <div><br></br></div>
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