import './../App.css';
// import Web3 from 'web3';
import api from '../api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Button } from 'react-bootstrap/';
import { useState, useEffect, useCallback } from 'react';
import { DomainDisabledOutlined } from '@mui/icons-material';
import { Confirm } from 'react-st-modal';

export default function Webcommerce(props) {
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);

  const [carbono, setCarbono] = useState('');

  // const [taxas, setTaxas] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    const resultado = doUsuarios();
    const address = localStorage.getItem('wallet');
    setAddress(address);
    saldoUser(address);
  }, [])

  function refreshPage() {
    window.location.reload(false);
  }

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

  async function doUsuarios() {
    var response = await api.get('saldo-contas?wallet=1');
    var transactions_result = response.data;
    setUsuarios(transactions_result);
    return transactions_result;
  }
  
  async function aposentarCredito(user_id){

    // var response = await api.get('saldo?conta=' + user_id + '&wallet=1');
    // var value = response.data;

    const block = {
      "account": user_id,
      "id": 1,
      "value": String(carbono)
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
              var response = api.post('queimar', block);
              Sucesso.fire({
                  icon: 'success',
                  title: 'Carbono aposentado'
              });
              forceUpdate();
              setCarbono("0,00");
          } else if (result.isDenied) {
              Falha.fire({
                  icon: 'error',
                  title: 'Carbono não aposentado'
              });
          }
      })
  })()
  
  }

  async function doTransfer(origem, destino, id, valor) {

    var block = ""
    block = {
      "from": String(origem),
      "to": String(destino),
      "id": String(id),
      "amount": String(valor),
      "data": "0x"
    };
    const response = await api.post('transferir', block);

  }

  async function comprarCredito(vendedor, credito) {
    var moeda = credito * props.taxas.data.moeda;
    // moeda = parseFloat(moeda);
    var block = "";
    var conta = localStorage.getItem('wallet');
    var response = await api.get('account/find/' + conta);
    var profile = response.data[0].profile;
    var comprador = response.data[0].user_id;
    var saldo = await api.get('saldo?conta=' + conta + "&wallet=0");

    var saldo_carbono = await api.get('saldo?conta=' + conta + "&wallet=0");

    Swal.fire({
      title: 'Você deseja realizar a compra?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Sim',
      denyButtonText: `Não`,
      icon: 'question',
    }).then((result) => {
      if (result.isConfirmed) {
        if (profile === "comprador")
    {
      if (saldo.data > moeda){
          doTransfer(vendedor, comprador, 1, credito);
          doTransfer(comprador, vendedor, 0, moeda);
          Sucesso.fire({
            icon: 'success',
            title: 'Crédito de Carbono adquirido'
          });
          // setCarbono(saldo_carbono.data + credito);
      } else {
        Swal.fire('Sem saldo para adquirir o crédito!', '', 'fail');
      }
    } else {
       Swal.fire('Somente usuários com perfil de "Comprador" pode adquirir crédito!', '', 'fail');
    }  
      
      } else if (result.isDenied) {
        Swal.fire('Compra cancelada!!!', '', 'info')
      }
    }) 
  }  

  async function saldoUser(user_id) {
    if (user_id) {
      var response = await api.get('saldo?conta=' + user_id + '&wallet=1');
      var carbono = response.data;
      setCarbono(carbono);
      carbono = parseFloat(carbono);
      carbono = carbono.toLocaleString('pt-br', { minimumFractionDigits: 2 });
      return carbono;
    }
  }

  const [usuarios, setUsuarios] = useState(['']);

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0 text-dark">Plataforma</h1>
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
                  <h3>{carbono.toString().replace(".", ",")}</h3>

                </div>
                <div className="icon">
                  <i className="ion ion-leaf" />
                </div>
                <a href="#" className="small-box-footer" onClick={() => aposentarCredito(address)}>
                  Aposentar crédito carbono <i className="fas fa-arrow-circle-right"></i>
                </a>
              </div>
            </div>
            <div className="col-lg-3 col-6">
              <div className="small-box bg-info">
                <div className="inner">
                  <p>Saldo Moeda</p>
                  <h3>{props.moeda}</h3>

                </div>
                <div className="icon">
                  <i className="ion ion-cash" />
                </div>
                <a href="/" class="small-box-footer">
                  Ver transações <i class="fas fa-arrow-circle-right"></i>
                </a>
              </div>
            </div>
          </div>
          <table class="blueTable">
            <thead>
              <tr>
                <th><center>User ID</center></th>
                <th><center>Nome</center></th>
                <th><center>Email</center></th>
                <th><center>Perfil</center></th>
                <th><center>Saldo de crédito Carbono</center></th>
                <th><center>Operação</center></th>
              </tr>
            </thead>

            {usuarios.map((data) => {
              var test = false;
              if ((data.profile === "propositor") && (data.saldo > 0)) {
                test = true;
              }
              const style = { width: '80px' }
              if (test === true) {
                return (<tr>
                  <>
                    <td><center>{data.user_id}</center></td>
                    <td><center>{data.name}</center></td>
                    <td><center>{data.email}</center></td>
                    <td><center>{data.profile}</center></td>
                    <td><center>{data.saldo}</center></td>
                    <td><center><div>
                      <Button style={style} class="btn btn-default" rounded variant="primary" size="sm" name="teste" onClick={() => comprarCredito(data.user_id, data.saldo)}>Comprar</Button>
                    </div></center></td>
                  </>
                </tr>
                );
              }
            })}
            <tbody>
            </tbody>
          </table>
        </div>
      </section>
      <div><br></br></div>
    </div>
  )
}    
