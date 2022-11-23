import React from "react";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useState, useEffect } from 'react';
import { Wallet } from "ethers";
import api from '../api';
import { If, Then, ElseIf, Else } from 'react-if-elseif-else-render';


async function refreshPage() {
    await Toast.fire({
      icon: 'success',
      title: 'Página sendo atualizada'
    });
    window.location.reload(false);    
}

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

const MySwal = withReactContent(Swal);


// eslint-disable-next-line import/no-anonymous-default-export
export default function Child( {
  proms,
  handleShow, 
  handleShowMint, 
  handleShowModalToken, 
  handleShowModalTransfer, 
  handleShowProjects, 
  handleShowUsuarios, 
  handleHideProjects, 
  handleHideUsuarios, 
  handleHideDashboard, 
  handleShowDashboard,
  handleHideWebcommerce,
  handleShowWebcommerce
} ){
  const [user, setUser] = useState('');
  
  async function readUser(pk){
    var response = await api.get('account/find/' + pk);
    return response.data[0];
  }

  useEffect(() => {
    const address = localStorage.getItem('wallet');
    const profile = readUser(address);

    profile
    .then((value) => {
      setUser(value);
    })
    .catch((err) => {
      console.log(err); 
    });

  }, [])

  let webcommerce = false;
  let administracao = false;
  let projetos = false;
  let certificadora = false;
  let token = false;
  let transf = false;

  if (user?.profile === 'registrador' || user?.profile === 'comprador') {
    webcommerce = true;
  } 

  if (user?.profile === 'registrador' || user?.profile === 'certificador' || user?.profile === 'propositor')
  {
    projetos = true;
  } 
 
  if (user?.profile === 'registrador')
  {
    administracao = true;
  } 
   
  if (user?.profile === 'registrador' || user?.profile === 'certificador')
  {
    token = true;
    transf = true;
  }  
  // console.log(comprador);


  return (
    <div>  
        <nav className="mt-2">
                <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                  <li className="nav-item has-treeview">
                  <a href="" className="nav-link"  onClick={() => { 
                    handleShowDashboard(); 
                    handleHideUsuarios(); 
                    handleHideProjects();
                    handleHideWebcommerce();
                  }}>
                    <i className="nav-icon fas fa-tachometer-alt" />
                    <p>
                      Dashboard
                    </p>
                  </a>  
                  {/* <a href="#" className="nav-link" onClick={handleShowModalToken}>
                    <i className="nav-icon fas fa-key" />
                    <p>
                      Tokens
                    </p>
                  </a> */}
                  </li>
                  <If condition={token === true}>
                  <Then>
                  <li className="nav-item">
                    <a href="#" className="nav-link" onClick={handleShowModalToken}>
                      <i className="nav-icon ion ion-cash" />
                      <p>
                      Tokens
                      </p>
                    </a>
                  </li>
                  </Then>  
                  </If>
                  <If condition={transf === true}>
                  <Then>
                  <li className="nav-item">
                    <a href="#" className="nav-link" onClick={handleShowModalTransfer}>
                      <i className="nav-icon fas fa  fa-arrows-alt" />
                      <p>
                      Transferências
                      </p>
                    </a>
                  </li>
                  </Then>  
                  </If>
                  <If condition={projetos === true}>
                  <Then>
                  <li className="nav-item">
                    <a href="#" className="nav-link" onClick={() => { 
                      handleShowProjects(); 
                      handleHideUsuarios(); 
                      handleHideDashboard();
                      handleHideWebcommerce();
                      }}>
                      <i className="nav-icon fas fa  fa-folder" />
                      <p>
                        Projetos
                      </p>
                    </a>
                  </li>
                  </Then>  
                  </If>
                  <If condition={administracao === true}>
                  <Then>
                  <li className="nav-item">
                    <a href="#" className="nav-link" onClick={() => { 
                      handleShowUsuarios(); 
                      handleHideProjects(); 
                      handleHideDashboard();
                      handleHideWebcommerce();
                      }}>
                      <i className="nav-icon fas fa  fa-user" />
                      <p>
                        Administração
                      </p>
                    </a>
                  </li>
                  </Then>  
                  </If>
                  <If condition={webcommerce === true}>
                  <Then>
                    <li className="nav-item has-treeview">
                      <a href="#" className="nav-link" onClick={() => { 
                        handleHideUsuarios(); 
                        handleHideProjects(); 
                        handleHideDashboard();
                        handleShowWebcommerce();
                        }}>
                        <i className="nav-icon fas fa  fa-sort" />
                        <p>
                           Plataforma
                        </p>
                      </a>
                    </li>
                  </Then>  
                  </If>
                  <li className="nav-item">
                    <a href="#" className="nav-link" onClick={refreshPage}>
                      <i className="nav-icon fas fa fa-reply" />
                      <p>
                        Atualizar Página
                      </p>
                    </a>
                  </li>
                  
                </ul>
              </nav>   
    </div>
  )
}
