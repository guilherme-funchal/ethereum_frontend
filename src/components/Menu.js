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
export default function Child( {
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
  return (
    <div>  
        <nav className="mt-2">
                <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                  <li className="nav-item has-treeview">
                  <a href="" className="nav-link active"  onClick={() => { 
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
                  <a href="#" className="nav-link active" onClick={handleShowModalToken}>
                    <i className="nav-icon fas fa-key" />
                    <p>
                      Tokens
                    </p>
                  </a>
                    <a href="#" className="nav-link active" onClick={handleShowModalTransfer}>
                      <i className="nav-icon fas fa fa-arrows-alt" />
                      <p>
                        Transferências
                      </p>
                    </a>
                  </li>
                  <li className="nav-item has-treeview menu-close">
                  
                </li>
                  <li className="nav-item has-treeview">
                    <a href="#" className="nav-link active" onClick={() => { 
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
                  <li className="nav-item has-treeview">
                    <a href="#" className="nav-link active" onClick={() => { 
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
                  <li className="nav-item has-treeview">
                    <a href="#" className="nav-link active" onClick={() => { 
                      handleHideUsuarios(); 
                      handleHideProjects(); 
                      handleHideDashboard();
                      handleShowWebcommerce();
                      }}>
                      <i className="nav-icon fas fa  fa-user" />
                      <p>
                        Webcommerce
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
