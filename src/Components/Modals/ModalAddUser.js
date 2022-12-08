import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";
import { Form, Button, Row, Col } from "react-bootstrap";
import Api from '../../Api';
import Swal from 'sweetalert2';
// import withReactContent from 'sweetalert2-react-content';
import { Controller, useForm } from "react-hook-form";
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from "moment";
// import Select from 'react-select';

function ModalAddUser(props) {

  const options = [
    { value: 'certificador', label: 'certificador' },
    { value: 'registrador', label: 'registrador' },
    { value: 'propositor', label: 'propositor' },
    { value: 'comprador', label: 'comprador' },
  ];

  const [selectedOption, setSelectedOption] = useState(null);

  const [userName, setName] = useState("");
  const [userProfile, setProfile] = useState("");
  const [userDesc, setDesc] = useState("");
  const [userEmail, setEmail] = useState("");
  const [userType, setType] = useState("");
  const [userDoc, setDoc] = useState("");
  const [userImage, setImage] = useState("");
  const [userId, setUserId] = useState("");
  const [current, setCurrent] = useState("");

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

  const address = localStorage.getItem('wallet');

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

  useEffect(() => {
    var data = moment()
      .utcOffset('-03:00')
      .format('DD/MM/YYYY hh:mm:ss a');
    setCurrent(data);

  }, [])

  const onChange = (e) => {
    setValues({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const Toast = Swal.mixin({
    toast: true,
    position: 'bottom-right',
    iconColor: 'green',
    customClass: {
      popup: 'colored-toast'
    },
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true
  });

  var name = "";
  var user_id = "";
  var profile = "";
  var desc = "";
  var email = "";
  var type = "";
  var doc = "";
  var created_at = "";
  var last_login = "";
  var image = "";

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      user_id: "",
      profile: "",
      desc: "",
      name: "",
      email: "",
      type: "",
      doc: "",
      created_at: "",
      updated_at: "",
      last_login: "",
      image: ""
    },
  });

  async function submitForm(data) {
    var response = "";
    const id = await Api.get('account-lists/list');
    response = await Api.delete('account-lists/delete/' + id.data[0].user_id);
    const form = data.currentTarget;

    const block = {
      "user_id": id.data[0].user_id,
      "profile": userProfile,
      "desc": data.desc,
      "name": data.name,
      "email": data.email,
      "type": userType,
      "doc": data.doc,
      "created_at": current,
      "updated_at": current,
      "last_login": current,
      "image": data.image
    };

    response = await Api.post('account/add/', block);

    await Toast.fire({
      icon: 'success',
      title: 'Usuário incluído'
    });

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
            <h4 className="modal-title">Adicionar usuário</h4>
          </div>
          <div className="modal-body">
            <form ref={form} noValidate onSubmit={handleSubmit(submitForm)}>
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
                      placeholder="Name"
                      isInvalid={errors.name}
                    />
                  )}
                />
                {errors.name && (
                  <div className="invalid-feedback">
                    <Form.Control.Feedback type="invalid">
                      O campo é requerido
                    </Form.Control.Feedback>
                  </div>
                )}
              </Form.Group>
              <Form.Group as={Col} md="20" controlId="validationCustom01">
                <Form.Label>Descrição</Form.Label>
                <Controller
                  name="desc"
                  control={control}
                  onChange={(e) => setDesc(e.target.value)}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Form.Control
                      {...field}
                      type="text"
                      placeholder="Descrição"
                      isInvalid={errors.desc}
                    />
                  )}
                />
                {errors.desc && (
                  <div className="invalid-feedback">
                    <Form.Control.Feedback type="invalid">
                      O campo é requerido
                    </Form.Control.Feedback>
                  </div>
                )}
              </Form.Group>
              <Form.Group as={Col} md="20" controlId="validationCustom01">
                <Form.Label>Profile</Form.Label><br></br>
                {/* <Select
                defaultValue={selectedOption}
                onChange={setSelectedOption}
                options={options}
              /> */}
                <select name="profile" value={profile} onChange={texto => setProfile(texto.target.value)}>
                  <option value="">Selecione um perfil</option>
                  <option value="certificador">Certificador</option>
                  <option value="registrador">Registrador</option>
                  <option value="propositor">Propositor</option>
                  <option value="comprador">Comprador</option>
                </select><br /><br />
              </Form.Group>
              <Form.Group as={Col} md="20" controlId="validationCustom01">
                <Form.Label>Email</Form.Label>
                <Controller
                  name="email"
                  control={control}
                  onChange={(e) => setEmail(e.target.value)}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Form.Control
                      {...field}
                      type="text"
                      placeholder="Email"
                      isInvalid={errors.email}
                    />
                  )}
                />
                {errors.email && (
                  <div className="invalid-feedback">
                    <Form.Control.Feedback type="invalid">
                      O campo é requerido
                    </Form.Control.Feedback>
                  </div>
                )}
              </Form.Group>
              <Form.Group as={Col} md="20" controlId="validationCustom01">
                <Form.Label>Tipo</Form.Label><br></br>
                <select name="type" value={type} onChange={tipo => setType(tipo.target.value)}>
                  <option value="">Selecione um tipo</option>
                  <option value="pf">Pesssoa física</option>
                  <option value="pj">Pessoa Jurídica</option>
                </select><br /><br />
              </Form.Group>  
                {/* <Controller
                  name="type"
                  control={control}
                  onChange={(e) => setType(e.target.value)}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Form.Control
                      {...field}
                      type="text"
                      placeholder="tipo"
                      isInvalid={errors.type}
                    />
                  )}
                />
                {errors.type && (
                  <div className="invalid-feedback">
                    <Form.Control.Feedback type="invalid">
                      O campo é requerido
                    </Form.Control.Feedback>
                  </div>
                )}
              </Form.Group> */}
              <Form.Group as={Col} md="20" controlId="validationCustom01">
                <Form.Label>Documento(CPF - RG -CNPJ)</Form.Label>
                <Controller
                  name="doc"
                  control={control}
                  onChange={(e) => setDoc(e.target.value)}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Form.Control
                      {...field}
                      type="text"
                      placeholder="doc"
                      isInvalid={errors.doc}
                    />
                  )}
                />
                {errors.doc && (
                  <div className="invalid-feedback">
                    <Form.Control.Feedback type="invalid">
                      O campo é requerido
                    </Form.Control.Feedback>
                  </div>
                )}
              </Form.Group>
              <Form.Group as={Col} md="20" controlId="validationCustom01">
                <Form.Label>Imagem</Form.Label>
                <Controller
                  name="image"
                  control={control}
                  onChange={(e) => setImage(e.target.value)}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Form.Control
                      {...field}
                      type="text"
                      placeholder="imagem"
                      isInvalid={errors.image}
                    />
                  )}
                />
                {errors.image && (
                  <div className="invalid-feedback">
                    <Form.Control.Feedback type="invalid">
                      O campo é requerido
                    </Form.Control.Feedback>
                  </div>
                )}
              </Form.Group>
              <br></br>
              <div className="text-right">
                <Button variant="danger" onClick={props.onClose} size="sm">
                <i class="fas fa-trash"> Cancela</i>
                </Button>
                <Button variant="primary" type="submit" size="sm">
                <i class="fas fa-check"> Salvar</i>
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

export default ModalAddUser;