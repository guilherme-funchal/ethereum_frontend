import './../App.css';
import Web3 from 'web3';
import api from './../api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Box from '@mui/material/Box';
import { createSvgIcon } from '@mui/material/utils';


async function doTimestamp(param){
  const block = { block: param };
  const response = api.post('carimbo', block);
  var timestamp_result = (await response).data;
  var date = new Date(timestamp_result * 1000);
  var resultado = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
  MySwal.fire({
    title: <strong>Timestamp do Bloco</strong>,
    html: <i>{resultado}</i>,
    icon: 'info'
  });
}

const MySwal = withReactContent(Swal);


// eslint-disable-next-line import/no-anonymous-default-export
export default function Dashboard( {wallet,moeda,carbono,transactions,setTimestamp} ){
  return (



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
                  <h3>{carbono}</h3>
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
                  <h3>{moeda}</h3>
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
          {/* <table class="table w-auto" > */}
          <table class="blueTable">
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
                    <tbody>
                    {transactions.map((obj) => {

                    const val = obj.returnValues
                    let from = ""
                    let to = ""
                    let operator = ""
                    let value = ""
                    let transferencia = "Transferir"
                    
                    for (const key in val) {                    
                      if (key === "operator") {
                        operator = `${val[key]}`;  
                      }
                      else if (key === "from") {
                        from = `${val[key]}`;
                        if (from === "0x0000000000000000000000000000000000000000" && obj.event === "TransferSingle") {
                          transferencia = "Cunhar"; 
                        }
                      }
                      else if (key === "to") {
                        to = `${val[key]}`;
                        if (to === "0x0000000000000000000000000000000000000000" && obj.event === "TransferSingle") {
                          transferencia = "Aposentar"; 
                        }  
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
                          <td>{transferencia}</td>
                          <td><center>{obj.blockNumber}</center></td> 
                          <td>{from}</td>   
                          <td>{to}</td>
                          <td><center>{value}</center></td>
                          <td><center><button class="btn text-red btn-sm" onClick={event => { doTimestamp(obj.blockNumber);}}
><i class="fa fa-clock fa-fw" style={{fontSize: "15px"}}></i></button></center></td>
                        </tr>                         
                    );
                  })}
                  </tbody>
                </table> 
        </div>
      </section>
      
    </div>
    
  )}    


