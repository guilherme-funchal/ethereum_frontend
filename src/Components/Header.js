import React from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '../Api';
import { ethers } from 'ethers';

export default function Header() {

  useEffect(() => {
    const address = localStorage.getItem('wallet');
    setWallet(address);
  }, [])

  const [wallet, setWallet] = useState('');
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  function refreshPage() {
    window.location.reload(false);
  }

  async function doSignUpDirect() {
    setError('');
    const { value: wallet } = await Swal.fire({
      title: 'Insira a sua chave',
      icon: 'question',
      input: 'text',
      inputLabel: '',
      inputPlaceholder: 'Entre sua chave privada'
    })

    if (wallet) {
      var response = await Api.get('account/find/' + wallet);
      console.log(response.data.length);

      if (response.data.length === 0) {
        console.log("Não localizado o usuário!!!");
        Swal.fire('Usuário não localizado!', '', 'error');
      } else {
        console.log(response.data);
        localStorage.setItem('wallet', JSON.stringify(response.data));
        navigate("/Dashboard");
        navigate(0);
      }
    }
  }

  async function doLogout() {
    Swal.fire({
      title: 'Desaja sair da plataforma?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('wallet');
        navigate("/");
        navigate(0);
        Swal.fire(
          'Desconectado!',
          'Você foi desconentado',
          'success'
        )
      }
    })
  }

  async function doSignUp() {
    setError('');

    if (!window.ethereum) return MySwal.fire(<p><h6><b>Carteira não encontrada</b></h6></p>);

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      if (!accounts || !accounts.length) return MySwal.fire(<p><h6><b>Carteira não encontrada</b></h6></p>);
      localStorage.setItem('wallet', accounts[0]);
      window.location.reload(false);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
          <nav className="main-header navbar navbar-expand navbar-white navbar-light navbar-right">
            <ul className="navbar-nav ml-auto">
              {

                !wallet
                  ? (
                    <>
                      <div className="topnav-right">
                        <a className="nav-link" data-widget="control-sidebar" data-slide="true" onClick={doSignUpDirect}>
                          <i className="fa fa-paper-plane fa-1" />
                        </a>
                      </div>
                      <div className="topnav-right">
                        <a className="nav-link" data-widget="control-sidebar" data-slide="true" onClick={doSignUp}>
                          <i className="fa fa-lock" />
                        </a>
                      </div>
                    </>
                  )
                  : (
                    <>
                      <div className="topnav-right">

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

  )
}