import React from "react";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';


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
export default function Child( {handleShow, handleShowMint, handleShowModalToken, handleShowModalTransfer} ){
  return (
    <div>  
        <nav className="mt-2">
                <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                  <li className="nav-item has-treeview">
                  <a className="nav-link active" onClick={handleShowModalToken}>
                    <i className="nav-icon fas fa-tachometer-alt" />
                    <p>
                      Tokens
                    </p>
                  </a>
                    <a className="nav-link active" onClick={handleShowModalTransfer}>
                      <i className="nav-icon fas fa fa-arrows-alt" />
                      <p>
                        Transferências
                      </p>
                    </a>
                  </li>
                  <li className="nav-item has-treeview menu-close">
                  
                </li>
                  <li className="nav-item has-treeview">
                    <a href="#" className="nav-link active">
                      <i className="nav-icon fas fa  fa-user" />
                      <p>
                        Usuários
                      </p>
                    </a>
                  </li>
                  <li className="nav-item has-treeview">
                    <a href="#" className="nav-link active" onClick={refreshPage}>
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

    
        

   