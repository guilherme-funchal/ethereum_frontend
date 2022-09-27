import './App.css';
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import api from './api';


function App() {
  
  
   useEffect(() => {
    const address = localStorage.getItem('wallet');
    setWallet(address);  

    // setTransaction(saldo);
    if (address) doSignIn();
  }, [])
  
  const [error, setError] = useState('');
  const [wallet, setWallet] = useState('');
  const [trans, setTransaction] = useState('');
  
  async function doOwner(){
    const response = api.get('dono');
    //this.setTransaction({ trans: response.data});
    var dono = (await response).data
    console.log((await response).data);
    alert(dono);
  }

  async function doSaldo(){
    var conta = localStorage.getItem('wallet');

    console.log(conta);
    const response = api.get('saldo?conta=' + conta);
    console.log((await response).data);
    var saldo = (await response).data;
    alert(saldo);
  }

  async function doSignIn() {
    alert('Logado');
  // window.location.reload(false);
  }
  
  function refreshPage() {
    window.location.reload(false);
  }

  async function doLogout(){
    localStorage.removeItem('token');
    localStorage.removeItem('wallet');
    localStorage.removeItem('saldo');
    setWallet('');
    setError('');
    setTransaction('');
  }
  
  
  async function doSignUp(){
    setError('');
  
    if (!window.ethereum) return setError(`No MetaMask found!`);
  
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      if (!accounts || !accounts.length) return setError('Wallet not found/allowed!');
      localStorage.setItem('wallet', accounts[0]);
      window.location.reload(false);
    }catch(err){
      setError(err.message);
    }
  }

  return (
    <div className="App">
    <header className="App-header">
      <h1>Login</h1>
      <div>
        {
          !wallet
            ? (
              <>
                <button onClick={doSignUp}>
                 Login
                 </button>
              </>
            )
            : (
              <>
                <p>
                  Wallet: {wallet}
                </p>
                <p>
                  Dono: {trans}
                </p>
                <button onClick={doLogout}>
                  Logout
                </button>
                <button onClick={doOwner}>
                  Proprietário {trans}
                </button>
                <button onClick={doSaldo}>
                  Saldo {trans}
                </button>
                {/* <button onClick={doSignUp}>
                 Login
                </button> */}
                <button onClick={refreshPage}>
                 Atualizar
                </button>
              </>
            )
        }
        {
            error ? <p>{error}</p> : <></>
        }
      </div>
    </header>
  </div>
  );
}

export default App;
