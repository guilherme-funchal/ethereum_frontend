import Header from './Header';
import Footer from './Footer';
import Sidenav from './Sidenav';
import Api from '../Api';
import { Button } from 'react-bootstrap/';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import ModalViewProject from "./Modals/ModalViewProject";
import ModalViewUser from "./Modals/ModalViewUser";
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from "moment";

export default function Plataforma() {
  const Sucesso = Swal.mixin({
    toast: true,
    position: 'center',
    iconColor: 'green',
    customClass: {
      popup: 'colored-toast'
    },
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true
  });

  const Falha = Swal.mixin({
    toast: true,
    position: 'center',
    iconColor: 'falha',
    customClass: {
      popup: 'colored-toast'
    },
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true
  });
  const navigate = useNavigate();
  const [projetos, setProjetos] = useState([]);

  // const getUsuarios = async () => {
  //   const response = await Api.get('saldo-contas?wallet=1');
  //   setUsuarios(response.data);
  // };

  const getTaxas = async () => {
    const response = await Api.get('tax/list');
    setTaxas(response.data);
  };

  const getProjetos = async (cod_paciente) => {
    const response = await Api.get('listarProjetos');
    setProjetos(response.data);
  };

  const style = { width: '70px' }
  const [taxas, setTaxas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [user, setUser] = useState([]);
  const [saldoCarbono, setCarbono] = useState('');
  const [saldoMoeda, setMoeda] = useState([]);
  const forceUpdate = useCallback(() => updateState({}), [])
  const [, updateState] = useState();
  const [items, setItems] = useState([' ']);
  const [itemsUser, setItemsUser] = useState([' ']);
  const [showModalViewProject, setShowModalViewProject] = useState(false);
  const [showModalViewUser, setShowModalViewUser] = useState(false);

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

  async function doTransfer(origem, destino, id, valor) {
    var block = ""
    block = {
      "from": String(origem),
      "to": String(destino),
      "id": String(id),
      "amount": String(valor)
    };
    // const response = await Api.post('transferir', block);
    // navigate("/plataforma");
    // navigate(0);
  }

  async function updateProject(project_id, comprador){
    await EditItemsProject(project_id);

    var current = moment()
      .utcOffset('-03:00')
      .format('DD/MM/YYYY hh:mm:ss a');

    var block = {
      "id": items[0].id,
      "name": items[0].name,
      "projectOwner": user[0]?.user_id,
      "projectCreator": items[0].projectCreator,
      "projectApprover": items[0].projectApprover,
      "description": items[0].description,
      "documentation": items[0].documentation,
      "hash_documentation": items[0].hash_documentation,
      "state": "adquirido",
      "area": items[0].area,
      "creditAssigned": items[0].creditAssigned,
      "creationDate": items[0].creationDate,
      "retired": items[0].retired,
      "updateDate": String(current)
    };
    const response = await Api.patch('/projeto', block);
  }


  async function exeTransfer(vendedor, comprador, credito, moeda){
    await doTransfer(vendedor, comprador, 1, credito);
    await doTransfer(comprador, vendedor, 0, moeda);
    // await Toast.fire({
    //   icon: 'success',
    //   title: 'Crédito de Carbono adquirido'
    // });

    await Sucesso.fire({
      icon: 'success',
      title: 'Crédito de Carbono adquirido'
    })

    navigate(0);
  }
  const getSaldos = async (wallet) => {
    const response_carbono = await Api.get('saldo?conta=' + wallet[0].user_id + '&wallet=1');
    var carbono = response_carbono.data;
    carbono = parseFloat(carbono);
    // carbono = carbono.toLocaleString('pt-br', { minimumFractionDigits: 2 });
    setCarbono(carbono);
    const response_moeda = await Api.get('saldo?conta=' + wallet[0].user_id + '&wallet=0');
    var moeda = response_moeda.data;
    moeda = parseFloat(moeda);
    // moeda = moeda.toLocaleString('pt-br', { minimumFractionDigits: 2 });
    setMoeda(moeda);
  };

  async function EditItemsProject(id) {
    var response = await Api.get('projeto?id=' + id);
    setItems(response.data);
  }

  async function EditItemUser(user_id) {
    var response = await Api.get('account/find/' + user_id);
    setItemsUser(response.data);
  }

  async function viewProjeto(id) {
    EditItemsProject(id);
    setShowModalViewProject(true);
  }

  async function viewUser(user_id) {
    EditItemUser(user_id);
    setShowModalViewUser(true);
  }

  async function aposentarCredito(user_id) {

    const block = {
      "account": user_id,
      "id": 1,
      "value": String(saldoCarbono)
    };

    (async () => {
      const { value: text } = await Swal.fire({
        title: 'Aposentar o crédito de carbono ?',
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
          var response = Api.post('queimar', block);
          Sucesso.fire({
            icon: 'success',
            title: 'Carbono aposentado'
          });
          // forceUpdate();
          // setCarbono("0,00");
          // navigate(0);
        } else if (result.isDenied) {
          Falha.fire({
            icon: 'error',
            title: 'Carbono não aposentado'
          });
        }
      })
    })()
  }

  async function comprarCredito(project_id, vendedor, credito) {
    var test = true;
    var moeda = credito * taxas.moeda;
    moeda = parseFloat(moeda);
    var block = "";
    var profile = user[0].profile;
    var comprador = user[0].user_id;

    Swal.fire({
      title: 'Você deseja realizar a compra?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Sim',
      denyButtonText: `Não`,
      icon: 'question',
    }).then((result) => {
      if (result.isConfirmed) {
        if (profile === "comprador") {
          if (saldoMoeda > moeda) {
            updateProject(project_id, comprador);
            exeTransfer(vendedor, comprador, credito, moeda)
            doTransfer(vendedor, comprador, 1, credito);
            doTransfer(comprador, vendedor, 0, moeda);
          } else {
            Swal.fire('Sem saldo para adquirir o crédito!', '', 'error');
          }
        } else {
          Swal.fire('Somente usuários com perfil de "Comprador" pode adquirir crédito!', '', 'error');
        }

      } else if (result.isDenied) {
        Swal.fire('Compra cancelada!!!', '', 'info')
      }
    })
  }



  useEffect(() => {
    var address = localStorage.getItem('wallet');
    if (address !== null) {
      setUser(JSON.parse(address));
      getTaxas();
      getProjetos();
      getSaldos(JSON.parse(address));
    } else {
      setUser(false);
    }

  }, []);

  return (
    <div>
      <Header />
      <Sidenav />
      {/* Content Wrapper. Contains page content */}
      <div className="content-wrapper">
        {/* Content Header (Page header) */}
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Prataforma</h1>
              </div>
            </div>
          </div>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-3 col-6">
                <div className="small-box bg-success">
                  <div className="inner">
                    <p>Saldo de crédito de Carbono</p>
                    <h3>{saldoCarbono.toLocaleString('pt-br', { minimumFractionDigits: 2 })}</h3>

                  </div>
                  <div className="icon">
                    <i className="ion ion-leaf" />
                  </div>
                  <a href="#" className="small-box-footer" onClick={() => aposentarCredito(user[0].user_id)}>
                    Aposentar crédito carbono <i className="fas fa-arrow-circle-right"></i>
                  </a>
                </div>
              </div>
              <div className="col-lg-3 col-6">
                <div className="small-box bg-info">
                  <div className="inner">
                    <p>Saldo Moeda</p>
                    <h3>{saldoMoeda.toLocaleString('pt-br', { minimumFractionDigits: 2 })}</h3>

                  </div>
                  <div className="icon">
                    <i className="ion ion-cash" />
                  </div>
                  <a href="/" className="small-box-footer">
                    Ver transações <i className="fas fa-arrow-circle-right"></i>
                  </a>
                </div>
              </div>
            </div>
            <table className="blueTable">
              <thead>
                <tr>
                  <th><center>Projeto ID</center></th>
                  <th><center>Nome</center></th>
                  <th><center>Proprietário</center></th>
                  <th><center>Crédito Carbono</center></th>
                  <th><center>Operação</center></th>
                </tr>
              </thead>

              {projetos.map((data) => {
                var valor = data.creditAssigned;
                valor = parseFloat(valor);
                valor = valor.toLocaleString('pt-br', { minimumFractionDigits: 2 });

                  return (<tr>
                    <>
                      <td onClick={() => viewProjeto(data.id)}><center>{data.id}</center></td>
                      <td onClick={() => viewProjeto(data.id)}><center>{data.name}</center></td>
                      <td onClick={() => viewUser(data.projectOwner)}><center>{data.projectOwner}</center></td>
                      <td onClick={() => viewProjeto(data.id)}><center>{valor}</center></td>
                      <td><center><div>
                        <Button style={style} className="btn btn-default" rounded variant="primary" size="sm" name="teste" onClick={() => comprarCredito(data.id, data.projectOwner, data.creditAssigned)}>Comprar</Button>
                      </div></center></td>
                    </>
                  </tr>
                  );

              })}
              <tbody>
              </tbody>
            </table>
          </div>
        </section>
        {/* /.content */}
      </div>
      {/* /.content-wrapper */}
      <ModalViewProject title="Dados do Projeto" items={items} onClose={() => { setShowModalViewProject(false); }} show={showModalViewProject}>
      </ModalViewProject>
      <ModalViewUser title="Dados do Projeto" items={itemsUser} onClose={() => { setShowModalViewUser(false); }} show={showModalViewUser}>
      </ModalViewUser>
      <Footer />
    </div>
  )
}