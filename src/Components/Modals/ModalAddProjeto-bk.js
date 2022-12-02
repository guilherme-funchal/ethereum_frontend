import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";
import { Form, Button, Row, Col } from "react-bootstrap";
import Api from '../../Api';
import { Controller, useForm } from "react-hook-form";
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from "moment";

function ModalAddProjeto (props) {

  const closeOnEscapeKeyDown = e => {
    if ((e.charCode || e.keyCode) === 27) {
      props.onClose();
    }
  };

  const [, setValues] = useState({
    id: 0,
    state: ""
  });
  
  const inputRef = useRef()
  
  const [state, setState] = useState("");
  const [projectName, setName] = useState("");

  const [projectDescription, setDescription] = useState("");
  const [projectArea, setArea] = useState("");

  const [file, setFile] = useState('');
  const [status, setStatus] = useState({
    type: '',
    mensagem: ''
  });

  const handlesubmit = () => {
    form.current.reset(); //this will reset all the inputs in the form
  }

  function resetForm() {
    document.getElementById("form").reset();
  }

  const reload = () => window.location.reload();
  const form = useRef(null);

  const onChange = (e) => {
    setValues({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      projectOwner: "",
      projectCreator: "",
      projectApprover: "",
      name: "",
      description: "",
      documentation: "",
      hash_documentation: "",
      state: "",
      area: "",
      creditAssigned: "",
      updateDate: ""
    },
  });

  async function submitForm(data){  
    const form = data.currentTarget;
    var block = ""
    var response = '';
    var current = moment()
      .utcOffset('-03:00')
      .format('DD/MM/YYYY hh:mm:ss a');
    
    // if (state == "on"){
    //     state = "enviado";
    // }
    
    console.log("state->", state);

    let formdata = new FormData(); 
    formdata.append('file', file);

    const headers = {
      'headers': {
        'Content-Type': 'multipart/form-data'
      }
    }
   
    
    var transactions_result = await Api.post("/upload", formdata, headers);

    block = {
      "projectOwner": props.projectOwner,
      "projectCreator": props.projectOwner,
      "projectApprover": "0x0000000000000000000000000000000000000000",
      "name": data.name,
      "description": data.description,
      "documentation": transactions_result.data.file,
      "hash_documentation": transactions_result.data.hash_file,
      "state": state,
      "area": data.area,
      "creditAssigned": "0",
      "updateDate": String(current)
    };
    console.log('Block->', block);
    response = await Api.post('/projeto', block);
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
          <Form.Group as={Col} md="20" controlId="validationCustom01">
                <Form.Label>Estado</Form.Label><br></br>
                <select name="state" value={state} onChange={state => setState(state.target.value)}>
                  <option value="0">Selecione um tipo</option>
                  <option value="rascunho">Rascunho</option>
                  <option value="enviado">Concluído</option>
                </select><br /><br />
              </Form.Group>  
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
                <div className="invalid-feedback">
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
                    as="textarea"
                    rows="3"
                    placeholder="Descrição do projeto"
                    isInvalid={errors.description}
                  />
                )}
              />
              {errors.description && (
                <div className="invalid-feedback">
                  <Form.Control.Feedback type="invalid">
                    O campo name é requerido
                  </Form.Control.Feedback>
                </div>
              )}
            </Form.Group>
            <Form.Group as={Col} md="20" controlId="validationCustom01">
              <Form.Label>Documentação</Form.Label><br></br>
              <input type="file" name="documentation" onChange={e => setFile(e.target.files[0])} />
            </Form.Group>
            <Form.Group as={Col} md="20" controlId="validationCustom01">
              <Form.Label>Área em hectares</Form.Label>
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
                <div className="invalid-feedback">
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
        <div className="modal-footer">
        </div>
      </div>

    </div>
  </CSSTransition>,
  document.getElementById("root")
);
};

export default ModalAddProjeto;