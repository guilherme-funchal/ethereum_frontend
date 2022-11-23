import './../App.css';
import React from 'react';
import Web3 from 'web3';
import api from './../api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useState, useEffect } from 'react';
import { If, Then, ElseIf, Else } from 'react-if-elseif-else-render';
import Button from 'react-bootstrap/Button';

// eslint-disable-next-line import/no-anonymous-default-export

// export default function Dashboard({ wallet, moeda, carbono, transactions, setTimestamp, taxas, user }) {
export default function Dashboard(props) {

  useEffect(() => {
    const address = localStorage.getItem('wallet');
    getUser(address);

  }, [])

  async function getUser(user_id) {
    var response = await api.get('account/find/' + user_id);
    setProfile(response.data[0].profile);
    setUser(response.data[0].user_id);
  }

  async function aposentarCredito(user_id, value){
    console.log("Aposentar credito", user_id, value);

    const block = {
      "account": user_id,
      "id": 1,
      "value": String(value)
    };
    console.log(block);
    var response = await api.post('queimar', block);
    console.log(response);
  }



  async function doTimestamp(param) {
    const block = { block: param };
    const response = api.post('carimbo', block);
    var timestamp_result = (await response).data;
    var date = new Date(timestamp_result * 1000);
    var resultado = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    MySwal.fire({
      title: <strong>Timestamp do Bloco</strong>,
      html: <i>{resultado}</i>,
      icon: 'info'
    });
  }

  const MySwal = withReactContent(Swal);

  const [profile, setProfile] = useState('');
  const [cont, setCont] = useState(0);
  const [user, setUser] = useState('');
  // const [user] = useState(props.user.data[0]);

  // async function doTaxas() {
  //   var response = await api.get('tax/list');
  //   await setTaxas(response);
  // }

  // useEffect(() => {
  //   const resultado = doTaxas();
  // }, [])

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
      <div className="row">
        <div className="col-md-3 col-sm-6 col-12">
          <div className="info-box">
            <span className="info-box-icon bg-success"><i className="ion ion-leaf"></i></span>
            <div className="info-box-content">
              <span className="info-box-text">Saldo Carbono</span>
              <span className="info-box-number">{props.carbono}</span>
            </div>

          </div>

        </div>

        <div className="col-md-3 col-sm-6 col-12">
          <div className="info-box">
            <span className="info-box-icon bg-info"><i className="ion ion-cash"></i></span>
            <div className="info-box-content">
              <span className="info-box-text">Saldo Moeda</span>
              <span className="info-box-number">{props.moeda}</span>
            </div>

          </div>

        </div>

        <div className="col-md-3 col-sm-6 col-12">
          <div className="info-box">
            <span className="info-box-icon bg-primary"><i className="ion ion-leaf"></i></span>
            <div className="info-box-content">
              <span class="info-box-text">Taxa de conversão carbono</span>
              <span className="info-box-number">{props.taxas.data?.carbono}</span>
            </div>

          </div>

        </div>

        <div className="col-md-3 col-sm-6 col-12">
          <div className="info-box">
            <span className="info-box-icon bg-warning"><i className="far fa-star"></i></span>
            <div className="info-box-content">
              <span className="info-box-text">Taxa de conversão Moeda</span>
              <span className="info-box-number">{props.taxas.data?.moeda}</span>
            </div>

          </div>

        </div>

      </div>
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            {/* <div className="col-lg-3 col-6">
              <div className="small-box bg-danger">
                <div className="inner">
                  <h3>{carbono}</h3>
                  <p>Saldo Carbono</p>
                </div>
                <div className="icon">
                  <i className="ion ion-bag" />
                </div>
              </div>
            </div> */}
            {/* <div className="col-lg-3 col-6">
              <div className="small-box bg-info">
                <div className="inner">
                  <h3>{moeda}</h3>
                  <p>Saldo Moeda</p>
                </div>
                <div className="icon">
                  <i className="ion ion-bag" />
                </div>
              </div>
            </div> */}


          </div>
          <div className="row">

          </div>
          <p><h3>Transações</h3></p>


          <table className="blueTable">
            <thead>
              <tr>
                <th><center>Evento</center></th>
                <th><center>Bloco</center></th>
                <th><center>Origem</center></th>
                <th><center>Destino</center></th>
                <th><center>Valor</center></th>
                <th><center>Tipo</center></th>
                <th><center>Timestamp</center></th>
                <If condition={profile === "comprador"}>
                  <Then>
                    <th><center>Aposentar</center></th>
                  </Then>
                </If>
              </tr>
            </thead>
            <tbody>
              {props.transactions.map((obj) => {

                var visible = false;
                var aposentar = false;

                if (profile === "certificador" || profile === "registrador") {
                  visible = true;
                }

                const val = obj.returnValues;
                let from = "";
                let id = "";
                let to = "";
                let operator = "";
                let value = "";
                let transferencia = "Transferir";
                let count = 0;

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
                  else if (key === "id") {
                    id = `${val[key]}`;
                    if (id === "1") {
                      id = "Carbono";
                    } else {
                      id = "Moeda";
                    }
                  }
                  else if (key === "value") {
                    value = `${val[key]}`;
                    value = Web3.utils.fromWei(value, 'ether');
                    value = parseFloat(value);
                    // value = value.toLocaleString('pt-br', { minimumFractionDigits: 2 });
                  }
                }
                if (from === "0x0000000000000000000000000000000000000000") {
                  from = "Smart contract"
                }

                if (profile === "certificador" || profile === "registrador" || user === to || user === from) {
                  visible = true;
                }

                if (id === "Carbono" && profile === "comprador" && transferencia !== "Aposentar") {
                  aposentar = true;
                }

                return (
                  <If condition={visible === true}>
                    <Then>
                      <tr>
                        <td><center>{transferencia}</center></td>
                        <td><center>{obj.blockNumber}</center></td>
                        <td><center>{from}</center></td>

                        <td><center>{to}</center></td>
                        <td><center>{value.toLocaleString('pt-br', { minimumFractionDigits: 2 })}</center></td>
                        <td><center>{id}</center></td>
                        <td><center><button className="btn text-red btn-sm" onClick={event => { doTimestamp(obj.blockNumber); }}
                        ><i className="fa fa-clock fa-fw" style={{ fontSize: "15px" }}></i></button></center></td>
                        <If condition={aposentar === true}>
                          <Then>
                          <td><center><Button className="btn btn-default" rounded variant="success" size="sm" onClick={() => aposentarCredito(to, value)}>Aposentar</Button></center></td>
                          </Then>
                        </If>
                      </tr>
                    </Then>
                  </If>
                );
              })}

            </tbody>
          </table>
        </div>
        {/* <div className="col-lg-3 col-6">
          <div className="small-box bg-success">
            <div className="inner">
              <h3>{transactions.length}</h3>
              <p>Transações</p>
            </div>
            <div className="icon">
              <i className="ion ion-stats-bars" />
            </div>
          </div>
        </div> */}
      </section>

    </div>

  )
}


