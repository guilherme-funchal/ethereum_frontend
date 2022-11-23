import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";
import { Form, Button, Row, Col } from "react-bootstrap";
import api from '../../api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Controller, useForm } from "react-hook-form";
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from "moment";

function ModalEditProjeto (props) {
  
  const closeOnEscapeKeyDown = e => {
    if ((e.charCode || e.keyCode) === 27) {
      props.onClose();
    }
  };
  
  const [inputs, setInputs] = useState({});
  const [validated, setValidated] = useState(false);
  const [selected, setSelected] = useState('yes');
  
  var state = props.items[0].state;
  var area = props.items[0].area;
  var creationdate = props.items[0].creationDate;
  var area = props.items[0].area;
  var id = props.items[0].id;
  var name = props.items[0].name;
  var approver = props.items[0].projectApprover;
  var description = props.items[0].description;
  var owner = props.items[0].projectOwner;
  var documentation = props.items[0].documentation;
  var hash_documentation = props.items[0].hash_documentation;

  const handlesubmit = () => {
    form.current.reset(); //this will reset all the inputs in the form
  }

  function resetForm() {
    document.getElementById("form").reset();
  }

  function atribuirValor(){
    console.log('atribuir valor...')
  }

  // const reload = () => window.location.reload();
  const form = useRef(null);
  
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
  });


  async function submitForm(data){
    const form = data.currentTarget;    
    var block = ""
    var response = '';
    var current = moment()
      .utcOffset('-03:00')
      .format('DD/MM/YYYY hh:mm:ss a');
    
    if (state == "on"){
      state = "enviado";
    }

    block = {
      "id": id,
      "name": name,
      "projectOwner": owner,
      "projectApprover": approver,
      "description": description,
      "documentation": documentation,
      "hash_documentation": hash_documentation,
      "state": state,
      "area": area,
      "creditAssigned": "0",
      "creationDate": creationdate,
      "updateDate": String(current)
    };

    response = await api.patch('/projeto', block);
    props.onClose();
  }

return ReactDOM.createPortal(
  <CSSTransition
    in={props.show}
    unmountOnExit
    timeout={{ enter: 0, exit: 300 }}
  >
    <div className="modal">
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h4 className="modal-title">{props.title}</h4>
        </div>
        <div className="modal-body">
        <form ref={form} noValidate onSubmit={handleSubmit(submitForm)}>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Controller
                  name="state"
                  control={control}
                  render={({ field }) => (
                    <Form.Check 
                      type="switch"
                      id="state"
                      label="Cadastramento concluído"
                      onChange={(e) => state=e.target.value}
                    />
                  )}
                />
              </Form.Group>
            </Row>
            <Form.Group as={Col} md="20" >
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                id="name"
                name="name"
                defaultValue={props.items[0].name}
                placeholder="Name"
                onChange={(e) => name=e.target.value}
              />  
            </Form.Group>
            <Form.Group as={Col} md="20">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                as="textarea"
                rows="3"
                id="description"
                name="description"
                defaultValue={props.items[0].description}
                placeholder="Description"
                onChange={(e) => description=e.target.value}
              />  
            </Form.Group>
            <Form.Group as={Col} md="20" >
              <Form.Label>Documentação</Form.Label>
              <Form.Control
                type="textarea"
                id="documentacao"
                name="documentation"
                defaultValue={props.items[0].documentation}
                placeholder="Documentation"
                onChange={(e) => documentation=e.target.value}
                />  
            </Form.Group>
            <Form.Group as={Col} md="20" >
            <Form.Label>Area</Form.Label>
                <Form.Control
                type="text"
                id="area"
                name="area"
                defaultValue={props.items[0].area}
                placeholder="Area"
                onChange={(e) => area=e.target.value}
                />  
            </Form.Group>
            <div className="text-right">
              <Button variant="danger" onClick={props.onClose}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                Salvar
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

export default ModalEditProjeto;