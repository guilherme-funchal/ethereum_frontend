import './App.css';
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import api from './api';
import { Button } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';


function App() {
  
  
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
  
  // async function doOwner(){
  //   const response = api.get('dono');
  //   var dono = (await response).data
  //   console.log((await response).data);
  //   alert(dono);
  // }

  async function doSaldo(){
    var conta = localStorage.getItem('wallet');
    const response = api.get('saldo?conta=' + conta);
    var saldo = (await response).data;
    return saldo;
  }

  async function doTransacoes(){
    const response = api.get('transacoes');
    var transactions_result = (await response).data;
     // console.log(transactions_result);
    
    
    return transactions_result;
  }

  async function doSignIn() {
    // alert('Logado');
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
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#link">Link</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>  
    <header className="App-header">
      <h6>Login</h6>
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
                  Saldo: {balance}
                </p>
                <Button variant="primary" onClick={doLogout}>
                  Logout</Button>{''}
                <Button variant="primary" onClick={refreshPage}>
                  Atualizar</Button>{''}
                {/* <button onClick={doOwner}>
                  Proprietário {trans}
                </button> */}
                {/* <button onClick={doSignUp}>
                 Login
                </button> */}
                
              </>
            )
        }
        {
            error ? <p>{error}</p> : <></>
        }
      </div>
    </header>
    <body>
    <table striped bordered hover variant="dark">
                        <tr>
                          <th>Hash do bloco</th>
                          <th>Evento</th>
                          <th>Bloco</th>
                          {/* <th>Operador</th> */}
                          <th>Origem</th>
                          <th>Destino</th>
                          <th>Valor</th>
                        </tr> 
                  {/* {console.log(transactions)} */}
                  {transactions.map(obj => {
                    // Object.keys(obj.returnValues).forEach(key => {
                    //   console.log(key, obj.returnValues[key]);
                    // });
                    const val = obj.returnValues
                    let from = ""
                    let to = ""
                    let operator = ""
                    let value = ""
                    for (const key in val) {
                      // console.log(`${key}: ${val[key]}`);
                      
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
                      }  

                    } 

                    // console.log("From:" + from);

                    return (

                      // <div key={obj.blockHash}>
                        <tr>
                        <td>{obj.blockHash}</td>
                        <td>Transferência</td>
                        <td>{obj.blockNumber}</td> 
                        {/* <td>{operator}</td>       */}
                        <td>{from}</td>   
                        <td>{to}</td>
                        <td>{value}</td>  
                        </tr>         
                      // </div>                    
                    );
                  })}
                </table> 
    </body>
  </div>
  );
}

export default App;
