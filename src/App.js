import './App.css';
import Footer from './components/Footer';
import Web3 from 'web3';
import Menu from './components/Menu'
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import api from './api';
import { Modal, Button } from 'react-bootstrap/';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useDialog } from 'react-st-modal';


export default function App() {

  useEffect(() => {
    const address = localStorage.getItem('wallet');
    setWallet(address);  
    const saldo = doSaldo();

    saldo
    .then((value) => {
      setBalance(value);
    })
    .catch((err) => {
      console.log(err); 
    });
    
    const resultado = doTransacoes();

    var promise = Promise.resolve(resultado);
    
    promise.then(function(val) {
      setTransactions(val);
    });

    if (address) doSignIn();


  }, [])
  
  const [error, setError] = useState('');
  const [wallet, setWallet] = useState('');
  const [transactions, setTransactions] = useState(['']);
  const [balance, setBalance] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [showModalTransf, setShow] = useState(false);
  const [showModalMint, setShowMint] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
    const handleShowMint = () => setShowMint(true);
  const handleCloseMint = () => setShowMint(false);
  const handleTimestamp = () => setTimestamp(true); 
  const MySwal = withReactContent(Swal)

  
  async function doOwner(){
    const response = api.get('dono');
    var dono = (await response).data
    console.log((await response).data);
    MySwal.fire({
      title: <strong>Proprietário</strong>,
      html: <i>{dono}</i>,
      icon: 'info'
    })
  }
  
  async function doSaldo(){
    var conta = localStorage.getItem('wallet');
    const response = api.get('saldo?conta=' + conta);
    var saldo = (await response).data;
    saldo = parseFloat(saldo);
    saldo = saldo.toLocaleString('pt-br', {minimumFractionDigits: 2});
    return saldo;
  }

  async function doTimestamp(param){
    const block = { block: param };
    const response = api.post('carimbo', block);
    var timestamp_result = (await response).data;
    var date = new Date(timestamp_result * 1000);
    var resultado = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
    setTimestamp(resultado);
    MySwal.fire({
      title: <strong>Timestamp do Bloco</strong>,
      html: <i>{resultado}</i>,
      icon: 'info'
    });
  }
  
  async function WalletAtual(){
    MySwal.fire({
      title: <strong>Wallet</strong>,
      html: <i>{wallet}</i>,
      icon: 'info'
    });
  }

  async function doTransacoes(){
    const response = api.get('transacoes');
    var transactions_result = (await response).data;
    return transactions_result;
  }

  async function doSignIn() {
  //   alert('Logado');
  // window.location.reload(false);
  }
  
  function refreshPage() {
    window.location.reload(false);
  }

  async function doLogout(){
    localStorage.removeItem('token');
    localStorage.removeItem('wallet');
    setWallet('');
    setError('');
    setTransactions('');
    setBalance('');
    setTimestamp('');
    window.location.reload(false);
  }
  
  async function doSignUp(){
    setError('');
  
    if (!window.ethereum) return MySwal.fire(<p><h6><b>Carteira não encontrada</b></h6></p>);
  
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      if (!accounts || !accounts.length) return MySwal.fire(<p><h6><b>Carteira não encontrada</b></h6></p>);
      localStorage.setItem('wallet', accounts[0]);
      window.location.reload(false);
    }catch(err){
      setError(err.message);
    }
  }
  
  return (
    <div class="wrapper">
      <header>
      <div>
        <nav className="main-header navbar navbar-expand navbar-white navbar-light navbar-right">
        <ul className="navbar-nav ml-auto">
                  {
                    
          !wallet
            ? (
              <>
              <div class="topnav-right">
              <a className="nav-link" data-widget="control-sidebar" data-slide="true" onClick={doSignUp}> 
                <i className="fa fa-lock" />
              </a>
              </div>
              </>
            )
            : (
              <>
              <div class="topnav-right">
              <a className="nav-link" data-widget="control-sidebar" data-slide="true" onClick={doLogout}> 
                <i className="fa fa-unlock-alt" />
              </a>
              </div>
              </>
            )
        }
        {
            error ? <p>{error}</p> : <></>
        }
        </ul>
        </nav>
      </div>
      </header>
      <div>
        <aside className="main-sidebar sidebar-dark-primary elevation-4">
          {/* Brand Logo */}
          <a href="index3.html" className="brand-link">
            <span className="brand-text font-weight-light">Dapp Carbono</span>
          </a>
          {/* Sidebar */}
          <div className="sidebar">
            {/* Sidebar user panel (optional) */}
            <div className="user-panel mt-3 pb-3 mb-3 d-flex">
              <div className="info">
                <p class="text-white">Carteira Metamask <button id="btn1" class="btn text-light" onClick={WalletAtual}><i className="fas fa fa-info" />
              </button>
              <button id="btn2" class="btn text-light" onClick={doOwner}><i className="fas fa fa-university" /></button></p>
              </div>
            </div>
            <Menu handleShow={handleShow} handleShowMint={handleShowMint}/>
            
              </div>
          </aside>     
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0 text-dark">Dashboard</h1>
            </div>
          </div>
        </div>
      </div>
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-3 col-6">
              <div className="small-box bg-danger">
                <div className="inner">
                  <h3>{balance}</h3>
                  <p>Saldo Carbono</p>
                </div>
                <div className="icon">
                  <i className="ion ion-bag" />
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-6">
              <div className="small-box bg-info">
                <div className="inner">
                  <h3>0,00</h3>
                  <p>Saldo Moeda</p>
                </div>
                <div className="icon">
                  <i className="ion ion-bag" />
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-6">
              <div className="small-box bg-success">
                <div className="inner">
                  <h3>{transactions.length}</h3>
                  <p>Transações</p>
                </div>
                <div className="icon">
                  <i className="ion ion-stats-bars" />
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-6">
              <div className="small-box bg-warning">
                <div className="inner">
                  <h3>10</h3>
                  <p>Usuários registrados</p>
                </div>
                <div className="icon">
                  <i className="ion ion-person-add" />
                </div>
              </div>
            </div>
            
          </div>
          <div className="row">

          </div>
          
          <p><h3>Transações</h3></p>
          <table class="table w-auto" >
                    <thead>
                      <tr>
                        <th><center>Evento</center></th>
                        <th><center>Bloco</center></th>
                        <th><center>Origem</center></th>
                        <th><center>Destino</center></th>
                        <th><center>Valor</center></th>
                        <th><center>Timestamp</center></th>
                      </tr>
                    </thead>
                    {transactions.map((obj) => {

                    const val = obj.returnValues
                    let from = ""
                    let to = ""
                    let operator = ""
                    let value = ""

                    for (const key in val) {                    
                      if (key === "operator") {
                        operator = `${val[key]}`;  
                      }
                      else if (key === "from") {
                        from = `${val[key]}`;  
                      }
                      else if (key === "to") {
                        to = `${val[key]}`;  
                      }
                      else if (key === "value") {
                        value = `${val[key]}`;
                        value = Web3.utils.fromWei(value, 'ether'); 
                        value = parseFloat(value);
                        value = value.toLocaleString('pt-br', {minimumFractionDigits: 2}); 
                      }  
                    } 

                    return (

                        <tr>
                          <td>Transferência</td>
                          <td><center>{obj.blockNumber}</center></td> 
                          <td>{from}</td>   
                          <td>{to}</td>
                          <td><center>{value}</center></td>
                          <td><center><button class="btn text-red" onClick={event => { doTimestamp(obj.blockNumber); handleTimestamp();}}
><i class="fas fa fa-info"></i></button></center></td>
                        </tr>                         
                    );
                  })}
                </table> 
        </div>
      </section>
    </div>
    <Modal show={showModalTransf} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Transferência</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Enviar
          </Button>
        </Modal.Footer>
    </Modal>
    <Modal show={showModalMint} onHide={handleCloseMint}>
        <Modal.Header>
          <Modal.Title>Emitir</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form>
          <label>Valor:
            <input type="text" />
          </label>
        </form> 
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseMint}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleCloseMint}>
            Enviar
          </Button>
        </Modal.Footer>
    </Modal>
  </div>
      <Footer wallet={wallet}/>
  </div>
  );
}


// export default App;