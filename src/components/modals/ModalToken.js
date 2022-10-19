import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";
import { Form, Button, Row, Col } from "react-bootstrap";
import api from '../../api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Controller, useForm } from "react-hook-form";
import 'bootstrap/dist/css/bootstrap.min.css';


const ModalToken = props => {
  const closeOnEscapeKeyDown = e => {
    if ((e.charCode || e.keyCode) === 27) {
      props.onClose();
    }
  };
  
  const MySwal = withReactContent(Swal)
  
  const [inputs, setInputs] = useState({});
  const [validated, setValidated] = useState(false);
  
  const [valor, setValor] = useState(" ");
  const [destino, setDestino] = useState(" ");
  const [tipo, setTipo] = useState(" ");
  const [op, setOp] = useState(" ");
  
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
      op: "",
      tipo: "",
      destino: "",
      valor: ""
    },
  });

  const submitForm = (data) => {
    const form = data.currentTarget;
    var block = ""
    var response = '';
     
      Swal.fire({
        title: 'Você deseja realizar a operação?',
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
          console.log(data.op)   
          if (data.op === 'emitir') {
            block = { 
              "account": data.destino,
              "id": data.tipo,
              "amount": data.valor,
              "data": "0x"
            };
            console.log(block);
            response = api.post('emitir', block);

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
        
          if (data.op === 'aposentar') {
            block = { 
              "account": data.destino,
              "id": data.tipo,
              "value": data.valor
            };
            console.log(block);
            response = api.post('queimar', block);
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

        } else if (result.isDenied) {
          Swal.fire({
            title: 'Operação não realizada',
            icon: 'warning',
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
      })
    
    //   // console.log(response); 
    // props.onClose();   
    //   setValidated(false);
    //   setDestino('');
    //   setValor('');
    // }
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
          <Row className="mb-3">  
          <Form.Group as={Col} controlId="validationCustom01">
              <Form.Label>Operação</Form.Label>
              <Controller
                name="op"
                control={control}
                onChange={(e) => setOp(e.target.value)}
                rules={{ required: true }}
                render={({ field }) => (
                  <Form.Check
                    {...field}
                    type="radio"
                    label="Emitir"
                    id={`inline-1`}
                    value="emitir"
                    placeholder="op"
                    isInvalid={errors.tipo}
                  />
                )}
              />
              <Controller
                name="op"
                control={control}
                onChange={(e) => setOp(e.target.value)}
                rules={{ required: true }}
                render={({ field }) => (
                  <Form.Check
                    {...field}
                    type="radio"
                    label="Aposentar"
                    id={`inline-2`}
                    value="aposentar"
                    placeholder="op"
                    isInvalid={errors.op}
                  />
                )}
              />
              {errors.op && (
                 <div class="invalid-feedback">
                <Form.Control.Feedback type="invalid">
                  O campo Operação é requerido
                </Form.Control.Feedback>
                </div>
              )}
          </Form.Group>
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
          </Row>
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

export default ModalToken;