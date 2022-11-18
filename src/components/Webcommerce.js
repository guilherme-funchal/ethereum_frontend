import './../App.css';
// import Web3 from 'web3';
import api from '../api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Button } from 'react-bootstrap/';
import { useState, useEffect, useCallback } from 'react';
import { DomainDisabledOutlined } from '@mui/icons-material';


export default function Webcommerce(props) {

  /*   const [showModal1, setShowModal1] = useState(false);
    const MySwal = withReactContent(Swal); */

  const [, updateState] = useState();
  // const forceUpdate = useCallback(() => updateState({}), []);

  const [carbono, setBalanceCarbono] = useState('');

  // const [taxas, setTaxas] = useState('');

  useEffect(() => {
    const resultado = doUsuarios();
  }, [])

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
  
  async function doTransfer(origem, destino, id, valor){

    var block = ""
    block = { 
         "from": origem,
         "to": destino,
         "id": id,
         "amount": String(valor),
         "data": "0x"
    };
    console.log("bloco->", block);
    const response = api.post('transferir', block);
  }

  async function comprarCredito(vendedor, credito) {
    
    var moeda = credito * props.taxas.data.moeda;
    moeda = parseFloat(moeda);
    var block = "";
    var conta = localStorage.getItem('wallet');
    var response = await api.get('account/find/' + conta);
    var profile = response.data[0].profile;
    var comprador = response.data[0].user_id;
    if (profile === "comprador")
    {
      var saldo = await api.get('saldo?conta=' + conta + "&wallet=0");
      if (saldo.data > moeda){
          await doTransfer(vendedor, comprador, 1, credito);
          await doTransfer(comprador, vendedor, 0, moeda);
      } else {
        Swal.fire('Sem saldo para adquirir o crédito!', '', 'fail');
      }
    } else {
       Swal.fire('Somente usuários com perfil de "Comprador" pode adquirir crédito!', '', 'fail');
    }
    
  }

  async function saldoUser(user_id) {
    if (user_id) {
      var response = await api.get('saldo?conta=' + user_id + '&wallet=1');
      var carbono = response.data;
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
              <h1 className="m-0 text-dark">Webcommerce</h1>
            </div>
          </div>
        </div>
      </div>
      <section className="content">
        <div className="container-fluid">

          <table class="blueTable">
            <thead>
              <tr>
                <th><center>User ID</center></th>
                <th><center>Nome</center></th>
                <th><center>Email</center></th>
                <th><center>Perfil</center></th>
                <th><center>Saldo Carbono</center></th>
                <th><center>Operação</center></th>
              </tr>
            </thead>

            {usuarios.map((data) => {
              var test = false;
              if ((data.profile === "propositor") && (data.saldo > 0)){
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
