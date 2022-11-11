import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";
import { Form, Button, Row, Col } from "react-bootstrap";
import api from '../../api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Controller, useForm } from "react-hook-form";
import 'bootstrap/dist/css/bootstrap.min.css';

const ModalEditProjeto = props => {
  const closeOnEscapeKeyDown = e => {
    if ((e.charCode || e.keyCode) === 27) {
      props.onClose();
    }
  };

  var promise = Promise.resolve(props.projeto);
  promise.then(function (val) {
    setOwner(val.data.projectOwner);
    setApprover(val.data.projectApprover);
    setName(val.data.name);
    setDescription(val.data.description);
    setDocumentation(val.data.documentation);
    setHashDocumentation(val.data.hash_documentation);
    setState(val.data.state);
    setArea(val.data.area);
    setCreationDate(val.data.creationDate);
    setCreditAssigned(val.data.creditAssigned);
    setprojectId(val.data.id);
  });

  const address = localStorage.getItem('wallet');
  const MySwal = withReactContent(Swal)

  const [inputs, setInputs] = useState({});
  const [validated, setValidated] = useState(false);

  const [projectId, setprojectId] = useState(" ");
  const [projectOwner, setOwner] = useState(" ");
  const [projectApprover, setApprover] = useState(" ");
  const [projectName, setName] = useState(" ");
  const [projectDescription, setDescription] = useState(" ");
  const [projectDocumentation, setDocumentation] = useState(" ");
  const [projectprojectHashDocumentation, setHashDocumentation] = useState(" ");
  const [projectState, setState] = useState(" ");
  const [projectArea, setArea] = useState(" ");
  const [projectCreationDate, setCreationDate] = useState(" ");
  const [projectCreditAssignede, setCreditAssigned] = useState(" ");
  const [selected, setSelected] = useState('yes');
 
  const handlesubmit = () => {
    form.current.reset(); //this will reset all the inputs in the form
  }

  function resetForm() {
    document.getElementById("form").reset();
  }

  // const reload = () => window.location.reload();
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
      area: {projectArea},
      creditAssigned: "",
      creationDate: "",
      updateDate: ""
    },
  });

  const submitForm = (data) => {
    
    const form = data.currentTarget;
    console.log('--------->', projectArea)
    
    var block = ""
    var response = '';
    const current = Date.now();
    

    block = {
      "id": projectId,
      "name": data.name,
      "projectOwner": projectOwner,
      "projectApprover": "0x0000000000000000000000000000000000000000",
      "description": data.description,
      "documentation": data.documentation,
      "hash_documentation": projectprojectHashDocumentation,
      "state": data.state,
      "area": data.area,
      "creditAssigned": "0",
      "creationDate": projectCreationDate,
      "updateDate": String(current)
    };
    console.log(block)
    
    // response = api.patch('/projeto', block);
    props.onClose();
  }

  const submitFormEdit = (e) => {
    console.log(form.data)
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
              <Form.Group as={Col}>
                <Form.Label for="state">Estado</Form.Label><br></br>
                <input
                  type="checkbox"
                  id="state"
                  name="state"
                  placeholder="State"
                  onChange={(e) => setState(e.target.value)}
                  value="rascunho"
                />
              </Form.Group>
            </Row>
            <Form.Group as={Col} md="20" >
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                id="name"
                name="name"
                value={projectName}
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}
              />  
            </Form.Group>
            <Form.Group as={Col} md="20">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                type="text"
                id="descricption"
                name="descricption"
                value={projectDescription}
                placeholder="Description"
                onChange={(e) => setDescription(e.target.value)}
              />  
            </Form.Group>
            <Form.Group as={Col} md="20" >
              <Form.Label>Documentação</Form.Label>
              <Form.Control
                type="text"
                id="documentacao"
                name="documentation"
                defaultValue={projectDocumentation}
                placeholder="Documentation"
                onChange={(e) => setDocumentation(e.target.value)}
                />  
            </Form.Group>
            <Form.Group as={Col} md="20" >
            <Form.Label>Area</Form.Label>
                <Form.Control
                type="text"
                id="area"
                name="area"
                defaultValue={projectArea}
                placeholder="Area"
                onChange={(e) => setArea(e.target.value)}
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