import Header from './Header';
import Footer from './Footer';
import Sidenav from './Sidenav';
import Api from '../Api';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import Web3 from 'web3';
import React, { useState, useEffect} from 'react';

export default function Projetos() {
    const getTransactions = async () => {
        const response = await Api.get('transacoes');
        setTransactions(response.data);
    };

    const [taxas, setTaxas] = useState([]);

    const getTaxas = async () => {
        const response = await Api.get('tax/list');
        setTaxas(response.data);
    };

    const getSaldos = async (wallet) => {
        const response_carbono = await Api.get('saldo?conta=' + wallet[0].user_id + '&wallet=1');
        var carbono = response_carbono.data;
        carbono = parseFloat(carbono);
        carbono = carbono.toLocaleString('pt-br', { minimumFractionDigits: 2 });
        setCarbono(carbono);
        const response_moeda = await Api.get('saldo?conta=' + wallet[0].user_id + '&wallet=0');
        var moeda = response_moeda.data;
        moeda = parseFloat(moeda);
        moeda = moeda.toLocaleString('pt-br', { minimumFractionDigits: 2 });
        setMoeda(moeda);
    };

    const MySwal = withReactContent(Swal);
    const [user, setUser] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [carbono, setCarbono] = useState([]);
    const [moeda, setMoeda] = useState([]);

    async function doTimestamp(param) {
        const block = { block: param };
        const response = Api.post('carimbo', block);
        var timestamp_result = (await response).data;
        var date = new Date(timestamp_result * 1000);
        var resultado = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        MySwal.fire({
            title: <strong>Timestamp do Bloco</strong>,
            html: <i>{resultado}</i>,
            icon: 'info'
        });
    }

   
    async function viewUser(user_id) {
        const response = await Api.get('account/find/' + user_id);
        Swal.fire({
        title: response.data[0].name,
        text: response.data[0].email,
        imageUrl: response.data[0].image,
        imageAlt: 'Custom image',
        })
    }

    useEffect(() => {
        var address = localStorage.getItem('wallet');
        if (address !== null) {
            setUser(JSON.parse(address));
            getTransactions();
            getTaxas();
            getSaldos(JSON.parse(address));
        } else {
            setUser(false);
        }

    }, [])

    return (
        <div>
            <Header />
            <Sidenav />
            {/* Content Wrapper. Contains page content */}
            <div className="content-wrapper">
                {/* Content Header (Page header) */}
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="m-0">Dashboard</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3 col-sm-6 col-12">
                        <div className="info-box">
                            <span className="info-box-icon bg-success"><i className="ion ion-leaf"></i></span>
                            <div className="info-box-content">
                                <span className="info-box-text">Saldo crédito de Carbono</span>
                                <span className="info-box-number">{carbono}</span>
                            </div>

                        </div>

                    </div>

                    <div className="col-md-3 col-sm-6 col-12">
                        <div className="info-box">
                            <span className="info-box-icon bg-info"><i className="ion ion-cash"></i></span>
                            <div className="info-box-content">
                                <span className="info-box-text">Saldo Moeda</span>
                                <span className="info-box-number">{moeda}</span>
                            </div>

                        </div>

                    </div>

                    <div className="col-md-3 col-sm-6 col-12">
                        <div className="info-box">
                            <span className="info-box-icon bg-primary"><i className="ion ion-leaf"></i></span>
                            <div className="info-box-content">
                                <span className="info-box-text">Tx conversão HEC em CC</span>
                                <span className="info-box-number">{taxas.carbono}</span>
                            </div>

                        </div>

                    </div>

                    <div className="col-md-3 col-sm-6 col-12">
                        <div className="info-box">
                            <span className="info-box-icon bg-warning"><i className="far fa-star"></i></span>
                            <div className="info-box-content">
                                <span className="info-box-text">Tx conversão CC em Moeda</span>
                                <span className="info-box-number">{taxas.moeda}</span>
                            </div>

                        </div>

                    </div>

                </div>
                <section className="content">
                    <div className="container-fluid">
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
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((obj) => {

                                    var visible = true;

                                    const val = obj.returnValues;
                                    let from = "";
                                    let id = "";
                                    let to = "";
                                    let value = "";
                                    let transferencia = "Transferir";

                                    for (const key in val) {
                                        if (key === "from") {    
                                            from = `${val[key]}`;
                                            if (from === "0x0000000000000000000000000000000000000000" && obj.event === "TransferSingle") {
                                                transferencia = "Cunhar";
                                            }
                                        }
                                        if (key === "to") {    
                                            to = `${val[key]}`;
                                            if (to === "0x0000000000000000000000000000000000000000" && obj.event === "TransferSingle") {
                                                transferencia = "Aposentar";
                                            }
                                        }
                                        // else if (key === "to") {
                                        //     to = `${val[key]}`;
                                        // }
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
                                        }
                                    }


                                    if (user[0]?.profile === "certificador" || user[0]?.profile === "registrador" || user[0]?.user_id === to || user[0]?.user_id === from) {
                                        visible = false;
                                    }
                                    
                                    return (     
                                        visible ? null
                                        : (
                                                <tr style={{ cursor: "pointer" }}>
                                                    <td key={transferencia}><center>{transferencia}</center></td>
                                                    <td key={obj.blockNumber}><center>{obj.blockNumber}</center></td>
                                                    <td key={from} onClick={() => viewUser(from)}><center>{from}</center></td>
                                                    <td key={to} onClick={() => viewUser(to)}><center>{to}</center></td>
                                                    <td key={value}><center>{value.toLocaleString('pt-br', { minimumFractionDigits: 2 })}</center></td>
                                                    <td key={id}><center>{id}</center></td>
                                                    <td><center><button className="btn text-red btn-sm" onClick={event => { doTimestamp(obj.blockNumber); }}
                                                    ><i className="fa fa-clock fa-fw" style={{ fontSize: "15px" }}></i></button></center></td>
                                                </tr>
                                        )        
                                    );

                                })}
                            </tbody>
                        </table>
                    </div>{/* /.container-fluid */}
                </section>
                {/* /.content */}
            </div>
            {/* /.content-wrapper */}
            <Footer />
        </div>
    )
}