import './App.css';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import Welcome from './components/Welcome';
import Web3 from 'web3';
import Menu from './components/Menu';
import Projetos from './components/Projetos';
import Usuarios from './components/Usuarios';
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import api from './api';
import { Modal, Button } from 'react-bootstrap/';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Modal1 from "./components/modals/ModalToken";
import Modal2 from "./components/modals/ModalTransfer";
import { If, Then, ElseIf, Else } from 'react-if-elseif-else-render';

export default function App() {

  useEffect(() => {
    const address = localStorage.getItem('wallet');
    setWallet(address);  
    const moeda = doSaldoMoeda();
    const carbono = doSaldoCarbono();

    moeda
    .then((value) => {
      setBalanceMoeda(value);
    })
    .catch((err) => {
      console.log(err); 
    });

    carbono
    .then((value) => {
      setBalanceCarbono(value);
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
  const [user, setUser] = useState('');
  const [transactions, setTransactions] = useState(['']);
  const [moeda, setBalanceMoeda] = useState('');
  const [carbono, setBalanceCarbono] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [showModalTransf, setShow] = useState(false);
  const handleClose = () => setShow(false); 
  const handleTimestamp = () => setTimestamp(true); 
  const MySwal = withReactContent(Swal)

  //Show Modal Form
  const [showModalToken, setShowModalToken] = useState(false);
  const handleShowModalToken = () => setShowModalToken(true);
  
  const [showModalTransfer, setShowModalTransfer] = useState(false);
  const handleShowModalTransfer = () => setShowModalTransfer(true);
  

  const [showProjects, setShowProjects] = useState(false);
  const handleShowProjects = () => setShowProjects(true);
  const handleHideProjects = () => setShowProjects(false);
 
  const [showUsuarios, setShowUsuarios] = useState(false);
  const handleShowUsuarios = () => setShowUsuarios(true);
  const handleHideUsuarios = () => setShowUsuarios(false);

  const [showDashboard, setShowDashboard] = useState(true);
  const handleShowDashboard = () => setShowDashboard(true);
  const handleHideDashboard = () => setShowDashboard(true);


  async function doOwner(){
    var response = api.get('dono');
    var dono = (await response).data
    MySwal.fire({
      title: <strong>Proprietário</strong>,
      html: <i>{dono}</i>,
      icon: 'info'
    })
  }

  async function readUser(pk){
    var response = await api.get('account/find/' + pk);
    setUser(response); 
  }
  
  async function doSaldoCarbono(){
    var conta = localStorage.getItem('wallet');
    if (conta){
      var response = api.get('saldo?conta=' + conta + '&wallet=1');
      var carbono = (await response).data;
      carbono = parseFloat(carbono);
      carbono = carbono.toLocaleString('pt-br', {minimumFractionDigits: 2});
      return carbono;
    }
  }

  async function doSaldoMoeda(){
    var conta = localStorage.getItem('wallet');
    if (conta){
      var response = api.get('saldo?conta=' + conta + '&wallet=0');
      var moeda = (await response).data;
      moeda = parseFloat(moeda);
      moeda = moeda.toLocaleString('pt-br', {minimumFractionDigits: 2});
      return moeda;
    }  
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
    const found = readUser(wallet);

    var html = 
    '<p class="text-left small"><b>Wallet : </b><span>' + user.data[0].user_id + '</span></p>' + 
    '<p class="text-left small"><b>Nome : </b><span>' + user.data[0].name + '</span></p>' + 
    '<p class="text-left small"><b>Perfil : </b><span>' + user.data[0].profile + '</span></p>' + 
    '<p class="text-left small"><b>Descrição : </b><span>' + user.data[0].desc + '</span></p>' + 
    '<p class="text-left small"><b>Email: </b><span>' + user.data[0].email + '</span></p>'
    
    if (user.type === 'pj'){
      html = html + '<p class="text-left small"><b>CNPJ: </b><span>' + user.data[0].doc + '</span></p>'
    } else {
      html = html + '<p class="text-left small"><b>CPF: </b><span>' + user.data[0].doc + '</span></p>'
    }

    MySwal.fire({
      html: html,
      icon: 'info'
    });
  }

  async function doTransacoes(){
    var wallet = localStorage.getItem('wallet'); 
    if (wallet){
      const response = api.get('transacoes');
      var transactions_result = (await response).data;
      return transactions_result;
    } else {
      return transactions_result = "";
    } 
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
    setUser('');
    setBalanceCarbono('');
    setBalanceMoeda('');
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

  async function doSignUpDirect(){
    setError('');
    const { value: wallet } = await Swal.fire({
      title: 'Insira a sua chave',
      icon: 'question',
      input: 'text',
      inputLabel: '',
      inputPlaceholder: 'Entre sua chave privada'
    })
    
    if (wallet) {
      localStorage.setItem('wallet', wallet);
      refreshPage();
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
              <a className="nav-link" data-widget="control-sidebar" data-slide="true" onClick={doSignUpDirect}> 
                <i className="fa fa-paper-plane fa-1" />
              </a>
              </div>
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
          <a href="http://localhost:3000" className="brand-link">
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

            <Menu handleShowModalToken={handleShowModalToken} 
            handleShowModalTransfer={handleShowModalTransfer} 
            handleShowProjects={handleShowProjects} 
            handleShowUsuarios={handleShowUsuarios} 
            handleHideProjects={handleHideProjects}
            handleHideUsuarios={handleHideUsuarios}
            handleHideDashboard={handleHideDashboard}
            />
            
            </div>
          </aside> 
      
    <Modal1 title="Gerar Tokens" onClose={() => {setShowModalToken(false); refreshPage();}} show={showModalToken} >
    </Modal1>
    <Modal2 title="Realizar transferências" onClose={() => {setShowModalTransfer(false); refreshPage();}} show={showModalTransfer} >
    </Modal2>                
  
  </div>
      {
       
      wallet
            ? (
            <>   
            <If condition={showProjects == true}>
            <Then>
              <Projetos />
            </Then>
            <ElseIf condition={showUsuarios == true}>
            <Usuarios />

            </ElseIf>
            <ElseIf condition={showDashboard == true}>
              <Dashboard wallet={wallet} moeda={moeda} carbono={carbono} transactions={transactions} setTimestamp={setTimestamp}/>
            </ElseIf>
           </If>   
            </>
            )
            : (
            <>  
              <Welcome />  
              <Footer wallet={wallet} moeda={moeda}/>
            </>
            )     
      }
      
  </div>
  );
}