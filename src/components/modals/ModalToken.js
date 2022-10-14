import React, { useReducer, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";
import "./Modal.css";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import api from '../../api';
import Web3 from 'web3';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';




const Modal = props => {
  const closeOnEscapeKeyDown = e => {
    if ((e.charCode || e.keyCode) === 27) {
      props.onClose();
    }
  };

  const [inputs, setInputs] = useState({});

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({...values, [name]: value}))
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(inputs)
  }

  useEffect(() => {
    document.body.addEventListener("keydown", closeOnEscapeKeyDown);
    return function cleanup() {
      document.body.removeEventListener("keydown", closeOnEscapeKeyDown);
    };
  }, []);


  

    // var block = { 
    //   "account": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
	  //   "id": "0",
	  //   "amount": "10000",
	  //   "data": "0x"
    // };
    
    // const response = api.post('emitir', block);

  return ReactDOM.createPortal(
    <CSSTransition
      in={props.show}
      unmountOnExit
      timeout={{ enter: 0, exit: 300 }}
    >
    <div className="modal" onClick={props.onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h4 className="modal-title">{props.title}</h4>
          </div>
          <div className="modal-body">
          <form onSubmit={handleSubmit}>
              <Form.Group>
                  <label className="mb-3">Tipo<br></br>
                  <select value={inputs.tipo || ""}  onChange={handleChange}  name="tipo" >
                    <option value="0">Carbono</option>
                    <option value="1">Moeda</option>
                  </select>
                  </label >
                </Form.Group>
                <Form.Group >
                  <label className="mb-3">Destino<br></br>
                  <input 
                    type="text" 
                    name="destino" 
                    value={inputs.destino || ""} 
                    onChange={handleChange}
                    size="sm"
                  />
                  </label >
                </Form.Group>
                <Form.Group>
                  <label className="mb-3">Valor<br></br>
                    <input className="mb-3"
                    type="number" 
                    name="valor" 
                    value={inputs.valor || ""} 
                    onChange={handleChange}
                    />
                  </label>
                </Form.Group>  
                  <div className="text-right">
                    <Button variant="danger" onClick={props.onClose}>
                      Cancelar
                    </Button>
                    <Button variant="primary" type="submit">
                      Executar
                    </Button>
                  </div>
              </form>
                </div>
                <div class="modal-footer">                
                </div>
            </div>

      </div>
    </CSSTransition>,
    document.getElementById("root")
  );
};

export default Modal;