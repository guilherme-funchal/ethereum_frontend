import "./Modal.css";
import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";
import { Form, Button, Row, Col } from "react-bootstrap";
import api from '../../api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Controller, useForm } from "react-hook-form";
import 'bootstrap/dist/css/bootstrap.min.css';





const ModalTransfer = props => {
  async function doTransfer(origem, destino, id, valor){

    var block = ""
    var response = api.get('saldo?conta=' + origem + '&wallet=' + id);
    var saldo = (await response).data;
    console.log(saldo)
    saldo = parseFloat(saldo);
    console.log(saldo)
    saldo = saldo - valor;
    
    
    var msg = 'numero negativo saldo:' + {saldo}
    if (saldo < 0 ) {
      Swal.fire({
        title: 'Não existe saldo suficiente',
        icon: 'error',
        showDenyButton: false,
        showCancelButton: false,
        confirmButtonText: 'Ok',
        denyButtonText: 'Não',
        customClass: {
          actions: 'my-actions',
          cancelButton: 'order-1 right-gap',
          confirmButton: 'order-2',
          denyButton: 'order-3',
        }
      }).then((result) => {
        props.onClose();
      })
    } else {
      block = { 
         "from": origem,
         "to": destino,
         "id": id,
         "amount": valor,
         "data": "0x"
      };
      const response = api.post('transferir', block);
      Swal.fire({
        title: 'Transação realizada',
        icon: 'success',
        showDenyButton: false,
        showCancelButton: false,
        confirmButtonText: 'Ok',
        denyButtonText: 'Não',
        customClass: {
          actions: 'my-actions',
          cancelButton: 'order-1 right-gap',
          confirmButton: 'order-2',
          denyButton: 'order-3',
        }
      }).then((result) => {
        props.onClose();
      })

    }
  }

  const closeOnEscapeKeyDown = e => {
    if ((e.charCode || e.keyCode) === 27) {
      props.onClose();
    }
  };
  
  const MySwal = withReactContent(Swal)
  
  const [inputs, setInputs] = useState({});
  const [validated, setValidated] = useState(false);
  
  const [valor, setValor] = useState(" ");
  const [origem, setOrigem] = useState(" ");
  const [destino, setDestino] = useState(" ");
  const [transfer, setTransfer] = useState('');
  const [tipo, setTipo] = useState(" ");
  const handleTransfer = () => setTransfer(false);
  
  const handlesubmit = () => {
    form.current.reset(); //this will reset all the inputs in the form
  }

  function resetForm() {
    document.getElementById("form").reset();
  }

  const reload=()=>window.location.reload();
  const form = useRef(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      tipo: "",
      origem: "",
      destino: "",
      valor: ""
    },
  });

  const submitForm = (data) => {
    const form = data.currentTarget;
    var block = ""
    
    
    var html = "<h6><b>Origem :</b>" + data.origem + "</h6><br>" + "<h6><b>Destino :</b>" + data.destino + "</h6><br>" + "<h6><b>Valor :</b>" + data.valor + "</h6><br>"
    Swal.fire({
      title: 'Executar a transferência?',
        html: "" + html + "",
        icon: 'question',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Sim',
        denyButtonText: 'Não',
        customClass: {
          actions: 'my-actions',
          cancelButton: 'order-1 right-gap',
          confirmButton: 'order-2',
          denyButton: 'order-3',
        }
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(data);
        const resultado = doTransfer(data.origem, data.destino, data.tipo, data.valor);
      } else if (result.isDenied) {
        Swal.fire('Operação não realizada', '', 'info');
      }
    })    
  };

  useEffect(() => {
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
          <form ref={form} noValidate onSubmit={handleSubmit(submitForm)}>
          <Form.Group as={Col} controlId="validationCustom02">
              <Form.Label>Tipo</Form.Label>
              <Controller
                name="tipo"
                control={control}
                onChange={(e) => setTipo(e.target.value)}
                rules={{ required: true }}
                render={({ field }) => (
                  <Form.Check
                    {...field}
                    type="radio"
                    label="Carbono"
                    id={`inline-1`}
                    value="1"
                    placeholder="Tipo"
                    isInvalid={errors.tipo}
                  />
                )}
              />
              <Controller
                name="tipo"
                control={control}
                onChange={(e) => setTipo(e.target.value)}
                rules={{ required: true }}
                render={({ field }) => (
                  <Form.Check
                    {...field}
                    type="radio"
                    label="Moeda"
                    id={`inline-2`}
                    value="0"
                    placeholder="Tipo"
                    isInvalid={errors.tipo}
                  />
                )}
              />
              {errors.tipo && (
                 <div class="invalid-feedback">
                <Form.Control.Feedback type="invalid">
                  O campo tipo é requerido
                </Form.Control.Feedback>
                </div>
              )}
          </Form.Group>
          <Form.Group as={Col} md="20" controlId="validationCustom01">
              <Form.Label>Origem</Form.Label>
              <Controller
                name="origem"
                control={control}
                onChange={(e) => setOrigem(e.target.value)}
                rules={{ required: true }}
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    type="text"
                    placeholder="Origem"
                    isInvalid={errors.origem}
                  />
                )}
              />
              {errors.destino && (
                 <div class="invalid-feedback">
                <Form.Control.Feedback type="invalid">
                  O campo valor é requerido
                </Form.Control.Feedback>
                </div>
              )}
          </Form.Group>
          <Form.Group as={Col} md="20" controlId="validationCustom01">
              <Form.Label>Destino</Form.Label>
              <Controller
                name="destino"
                control={control}
                onChange={(e) => setDestino(e.target.value)}
                rules={{ required: true }}
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    type="text"
                    placeholder="Destino"
                    isInvalid={errors.destino}
                  />
                )}
              />
              {errors.destino && (
                 <div class="invalid-feedback">
                <Form.Control.Feedback type="invalid">
                  O campo valor é requerido
                </Form.Control.Feedback>
                </div>
              )}
          </Form.Group>
          <Form.Group as={Col} md="10" controlId="validationCustom01">
              <Form.Label>Valor</Form.Label>
              <Controller
                name="valor"
                control={control}
                onChange={(e) => setValor(e.target.value)}
                rules={{ required: true }}
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    type="text"
                    placeholder="Valor"
                    isInvalid={errors.valor}
                  />
                )}
              />
              {errors.valor && (
                 <div class="invalid-feedback">
                <Form.Control.Feedback type="invalid">
                  O campo valor é requerido
                </Form.Control.Feedback>
                </div>
              )}
            </Form.Group>
          
          
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

export default ModalTransfer;