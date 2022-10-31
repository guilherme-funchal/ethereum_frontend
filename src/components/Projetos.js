import './../App.css';
import Web3 from 'web3';
import api from '../api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';


const MySwal = withReactContent(Swal)

// eslint-disable-next-line import/no-anonymous-default-export
export default function Dashboard( {wallet,moeda,carbono,transactions,setTimestamp} ){
  return (



<div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0 text-dark">Projetos</h1>
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
                  <h3></h3>
                  <p>Cancelado</p>
                </div>
                <div className="icon">
                  <i className="ion ion-bag" />
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-6">
              <div className="small-box bg-info">
                <div className="inner">
                  <h3></h3>
                  <p>Aguardando</p>
                </div>
                <div className="icon">
                  <i className="ion ion-bag" />
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-6">
              <div className="small-box bg-success">
                <div className="inner">
                  <h3></h3>
                  <p>Concluído</p>
                </div>
                <div className="icon">
                  <i className="ion ion-stats-bars" />
                </div>
              </div>
            </div>
            
            
          </div>
          <div className="row">

          </div>
          
          <p><h3>Transações</h3></p>
          {/* <table class="table w-auto" > */}
          <table class="blueTable">
                    <thead>
                      <tr>
                        <th><center>ID</center></th>
                        <th><center>Nome</center></th>
                        <th><center>Propositor</center></th>
                        <th><center>Estado</center></th>
                      </tr>
                    </thead>
                    <tbody>
                    
                        <tr>
                          <td><center></center></td> 
                          <td></td>   
                          <td></td>
                          <td></td>
                        </tr>                         
                  </tbody>
                </table> 
        </div>
      </section>
    </div>
  )}    


