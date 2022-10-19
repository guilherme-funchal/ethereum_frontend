import React, { useReducer, useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";
import "./Modal.css";
import { Form, Button, Row, Col, Feedback } from "react-bootstrap";
import api from '../../api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

async function doSaldo(origem, destino, wallet, valor){

  var response = api.get('saldo?conta=' + origem + '&wallet=' + wallet);
  var saldo = (await response).data;
  console.log(saldo)
  saldo = parseFloat(saldo);
  console.log(saldo)
  saldo = saldo - valor;
  
  
  var msg = 'numero negativo saldo:' + {saldo}
  if (saldo < 0 ) {
    Swal.fire('numero negativo', '', 'error');
  } else {
    Swal.fire('numero positivo', '', 'sucess');
  }

  return saldo;
}

async function doTransation(block) {
  const response = await api.post('transferir', block);

  var transactions_result = (await response).data;
  return transactions_result;
}

const Modal = props => {
  const closeOnEscapeKeyDown = e => {
    if ((e.charCode || e.keyCode) === 27) {
      props.onClose();
    }
  };
  
  const [inputs, setInputs] = useState({});
  const [validated, setValidated] = useState(false);

  
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({...values, [name]: value}))
  }
  
  const reload=()=>window.location.reload();

  const handleSubmit = (event) => {
    const form = event.currentTarget;

    console.log(form.checkValidity());

    var block = ""
    

    // if (form.checkValidity() === false) {
    //   event.preventDefault();
    //   event.stopPropagation();
    //   Swal.fire('Campos vazios', '', 'error')
    // }
    
    // if (form.checkValidity() === true) {
    //   Swal.fire({
    //     title: 'Você deseja realizar a transferência?',
    //     showDenyButton: true,
    //     showCancelButton: false,
    //     confirmButtonText: 'Sim',
    //     denyButtonText: 'Não',
    //     customClass: {
    //       actions: 'my-actions',
    //       cancelButton: 'order-1 right-gap',
    //       confirmButton: 'order-2',
    //       denyButton: 'order-3',
    //     }
    //   }).then((result) => {
    //     if (result.isConfirmed) {
    //       Swal.fire('Operação realizada', '', 'success');
    //     } else if (result.isDenied) {
    //       Swal.fire('Operação não realizada', '', 'info')
    //     }
    //   })
    // }  

    // block = { 
    //    "from": inputs.origem,
    //    "to": inputs.destino,
	  //    "id": inputs.id,
	  //    "amount": inputs.valor,
	  //    "data": "0x"
    // };
    // // const response = api.post('transferir', block);

    // // var saldo = doSaldo(inputs.origem, inputs.destino, inputs.id, inputs.valor);

    // props.onClose();
    // reload();
    // setValidated(false);
  }
  
  useEffect(() => {

    document.body.addEventListener("keydown", closeOnEscapeKeyDown);

    return function cleanup() {
      document.body.removeEventListener("keydown", closeOnEscapeKeyDown);
    };
  }, []);

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
          <form noValidate validated={validated}  id="transfer" onSubmit={handleSubmit}>    
          <Form.Label>Tipo</Form.Label>
          <Form.Control.Feedback type="invalid">
            Selecione um tipo
          </Form.Control.Feedback >
          <Form.Group>
                  <Form.Check size="sm" name='id' inline required label="Carbono" type='radio' id={`inline-1`} onChange={handleChange} value="1" />
                  <Form.Check size="sm" inline name='id' required label="Moeda" type='radio' id={`inline-2`} onChange={handleChange} value="0" />
          </Form.Group>
          <Form.Control.Feedback type="invalid">
            Selecione uma origem
          </Form.Control.Feedback>
          <Form.Label>Origem</Form.Label>
          <Form.Control
             required
             type="text"
             name="origem" 
             value={inputs.origem || ""} 
             onChange={handleChange}
             size="sm"
          />
          <Form.Control.Feedback type="invalid">
            Selecione um destino
          </Form.Control.Feedback>
          <Form.Label>Destino</Form.Label>
          <Form.Control
             required
             type="text"
             name="destino" 
             value={inputs.destino || ""} 
             onChange={handleChange}
             size="sm"
          />
          <Form.Control.Feedback type="invalid">
            Selecione um valor
          </Form.Control.Feedback>
          <Form.Label>Valor</Form.Label>
          <Form.Control 
             required
             type="text" 
             name="valor" 
             value={inputs.valor || ""} 
             onChange={handleChange}
             size="sm"
          />
          
        <br></br>
        
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