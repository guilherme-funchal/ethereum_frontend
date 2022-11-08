import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";
import { Form, Button, Row, Col } from "react-bootstrap";
import api from '../../api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Controller, useForm } from "react-hook-form";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ConstructionOutlined } from "@mui/icons-material";


const ModalAddProjeto = props => {
  const closeOnEscapeKeyDown = e => {
    if ((e.charCode || e.keyCode) === 27) {
      props.onClose();
    }
  };
  
  const address = localStorage.getItem('wallet');
  const MySwal = withReactContent(Swal)

  const [inputs, setInputs] = useState({});
  const [validated, setValidated] = useState(false);

  const [projectOwner, setOwner] = useState(" ");
  const [projectApprove, setApprove] = useState(" ");
  const [projectName, setName] = useState(" ");
  const [projectDescription, setDescription] = useState(" ");
  const [projectDocumentation, setDocumentation] = useState(" ");
  const [projectprojectHashDocumentation, setHashDocumentation] = useState(" ");
  const [projectState, setState] = useState(" ");
  const [projectArea, setArea] = useState(" ");
  const [projectCreditAssignede, setCreditAssigned] = useState(" ");

  const handlesubmit = () => {
    form.current.reset(); //this will reset all the inputs in the form
  }

  function resetForm() {
    document.getElementById("form").reset();
  }

  const reload = () => window.location.reload();
  const form = useRef(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      projectOwner: "",
      projectApprover: "",
      name: "",
      description: "",
      documentation: "",
      hash_documentation: "",
      state: "",
      area: "",
      creditAssigned: "",
      creationDate: "",
      updateDate: ""
    },
  });

  const submitForm = (data) => {
    const form = data.currentTarget;
    var block = ""
    var response = '';
    const current = Date.now();

    block = {
      "projectOwner": address,
      "projectApprover": "0x0000000000000000000000000000000000000000",
      "name": data.name,
      "description": data.description,
      "documentation": data.documentation,
      "hash_documentation": data.hash_documentation,
      "state": data.state,
      "area": data.area,
      "creditAssigned": "0",
      "creationDate": String(current),
      "updateDate": String(current)
    };
    response = api.post('/projeto', block);
    props.onClose();
  }

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
                <Form.Label>Estado</Form.Label>
                <Controller
                  name="state"
                  control={control}
                  onChange={(e) => setState(e.target.value)}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Form.Check
                      {...field}
                      type="radio"
                      label="Rascunho"
                      id={`inline-1`}
                      value="rascunho"
                      placeholder="op"
                      isInvalid={errors.tipo}
                    />
                  )}
                />
                <Controller
                  name="state"
                  control={control}
                  onChange={(e) => setState(e.target.value)}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Form.Check
                      {...field}
                      type="radio"
                      label="Enviar"
                      id={`inline-2`}
                      value="enviar"
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
            </Row>
            <Form.Group as={Col} md="20" controlId="validationCustom01">
              <Form.Label>Nome</Form.Label>
              <Controller
                name="name"
                control={control}
                onChange={(e) => setName(e.target.value)}
                rules={{ required: true }}
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    type="text"
                    placeholder="Nome do projeto"
                    isInvalid={errors.name}
                  />
                )}
              />
              {errors.name && (
                <div class="invalid-feedback">
                  <Form.Control.Feedback type="invalid">
                    O campo descrição é requerido
                  </Form.Control.Feedback>
                </div>
              )}
            </Form.Group>
            <Form.Group as={Col} md="20" controlId="validationCustom01">
              <Form.Label>Descrição</Form.Label>
              <Controller
                name="description"
                control={control}
                onChange={(e) => setDescription(e.target.value)}
                rules={{ required: true }}
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    type="text"
                    placeholder="Descrição do projeto"
                    isInvalid={errors.description}
                  />
                )}
              />
              {errors.description && (
                <div class="invalid-feedback">
                  <Form.Control.Feedback type="invalid">
                    O campo name é requerido
                  </Form.Control.Feedback>
                </div>
              )}
            </Form.Group>
            <Form.Group as={Col} md="20" controlId="validationCustom01">
              <Form.Label>Documentação</Form.Label>
              <Controller
                name="documentation"
                control={control}
                onChange={(e) => setDocumentation(e.target.value)}
                rules={{ required: true }}
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    type="text"
                    placeholder="Documentação do projeto"
                    isInvalid={errors.documentation}
                  />
                )}
              />
              {errors.documentation && (
                <div class="invalid-feedback">
                  <Form.Control.Feedback type="invalid">
                    O campo name é requerido
                  </Form.Control.Feedback>
                </div>
              )}
            </Form.Group>
            <Form.Group as={Col} md="20" controlId="validationCustom01">
              <Form.Label>Area</Form.Label>
              <Controller
                name="area"
                control={control}
                onChange={(e) => setArea(e.target.value)}
                rules={{ required: true }}
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    type="text"
                    placeholder="Área em hectares do projeto"
                    isInvalid={errors.area}
                  />
                )}
              />
              {errors.area && (
                <div class="invalid-feedback">
                  <Form.Control.Feedback type="invalid">
                    O campo name é requerido
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

export default ModalAddProjeto;