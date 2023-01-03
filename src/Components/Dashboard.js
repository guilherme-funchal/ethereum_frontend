import Header from './Header';
import Footer from './Footer';
import Sidenav from './Sidenav';
import Api from '../Api';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import Web3 from 'web3';
import React, { useState, useEffect } from 'react';

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

    const [users, setUsers] = useState([]);
    const MySwal = withReactContent(Swal);
    const [user, setUser] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [carbono, setCarbono] = useState([]);
    const [moeda, setMoeda] = useState([]);
    var transferir = 0;
    var aposentar = 0;
    var cunhar = 0;
    var total = 0;
    var valor_carbono = 0;
    var valor_moeda = 0;
    var valor_transf_moeda = 0;
    var valor_transf_carbono = 0;

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

    const getUsers = async () => {
        const response = await Api.get('account/list');
        setUsers(response.data);
    };

    async function viewUser(user_id) {
        const response = await Api.get('account/find/' + user_id);
        var html =
            '<p style="text-align:left;"><b>Email : </b><span>' + response.data[0].email + '</span></p>' +
            '<p style="text-align:left;"><b>UserID : </b><span>' + response.data[0].user_id + '</span></p>'
        MySwal.fire({
            width: 460,
            title: response.data[0].name,
            html: html,
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
            getUsers();
            getSaldos(JSON.parse(address));
        } else {
            setUser(false);
        }

    }, [])

    var style = "width:50%;height:50%;";
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
                <div class="row">
                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-header">
                                <h3 class="card-title">Organizações</h3>
                            </div>
                            <div>
                                <div className="card-body p-0">
                                    <ul className="users-list clearfix">
                                        {users.map((data) => {
                                            var visible = false;
                                            if (data.user_id === "0x0000000000000000000000000000000000000000") {
                                                visible = true;
                                            }
                                            if (data.type === "pf") {
                                                visible = true;
                                            }
                                            return (
                                                visible ? null
                                                    : (
                                                        <li>
                                                            <img src={data.image} width={70} height={70} />
                                                            <div style={{ cursor: "pointer" }} onClick={() => viewUser(data.user_id)} className="users-list-name" href="#">{data.name}</div>
                                                        </li>
                                                    )
                                            );
                                        })}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-header">
                                <h3 class="card-title">Usuários</h3>
                            </div>
                            <div>
                                <div className="card-body p-0">
                                    <ul className="users-list clearfix">
                                        {users.map((data) => {
                                            var visible = false;
                                            if (data.user_id === "0x0000000000000000000000000000000000000000") {
                                                visible = true;
                                            }
                                            if (data.type === "pj") {
                                                visible = true;
                                            }
                                            return (
                                                visible ? null
                                                    : (
                                                        <li>
                                                            <img src={data.image} width={70} height={70} />
                                                            <div style={{ cursor: "pointer" }} onClick={() => viewUser(data.user_id)} className="users-list-name" href="#">{data.name}</div>
                                                        </li>
                                                    )
                                            );
                                        })}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div class="row">
                    <div class="col-md-8">
                        <div class="card">
                            <div class="card-header">
                                <h3 class="card-title">Transações</h3>
                            </div>
                            <div>
                                <div className="card-body p-0">
                                    <div style={{ "font-size": "15px" }} class="table-responsive">
                                        {/* <table class="table-sm table-striped"> */}
                                        <table className="blueTable">
                                            <thead>
                                                <tr>
                                                    <th class="bg-primary"><center>Evento</center></th>
                                                    <th class="bg-primary"><center>Bloco</center></th>
                                                    <th class="bg-primary"><center>Origem</center></th>
                                                    <th class="bg-primary"><center>Destino</center></th>
                                                    <th class="bg-primary"><center>Valor</center></th>
                                                    <th class="bg-primary"><center>Tipo</center></th>
                                                    <th class="bg-primary"><center>Timestamp</center></th>
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

                                                    if ((transferencia === 'Cunhar') && (user[0]?.profile === "certificador" || user[0]?.profile === "registrador" || user[0]?.user_id === to || user[0]?.user_id === from)) {
                                                        cunhar = cunhar + 1;
                                                        if (id === "Carbono") {
                                                            valor_carbono = valor_carbono + value;
                                                            valor_carbono = parseFloat(valor_carbono);
                                                        } else {
                                                            valor_moeda = valor_moeda + value;
                                                            valor_moeda = parseFloat(valor_moeda);
                                                        }
                                                    }

                                                    if ((transferencia === 'Transferir') && (user[0]?.profile === "certificador" || user[0]?.profile === "registrador" || user[0]?.user_id === to || user[0]?.user_id === from)) {
                                                        transferir = transferir + 1;
                                                        if (id === "Carbono") {
                                                            valor_transf_carbono = valor_transf_carbono + value;
                                                            valor_transf_carbono = parseFloat(valor_transf_carbono);
                                                        } else {
                                                            valor_transf_moeda = valor_transf_moeda + value;
                                                            valor_transf_moeda = parseFloat(valor_transf_moeda);
                                                        }
                                                    }

                                                    if ((transferencia === 'Aposentar') && (user[0]?.profile === "certificador" || user[0]?.profile === "registrador" || user[0]?.user_id === to || user[0]?.user_id === from)) {
                                                        aposentar = aposentar + 1;
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
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-header">
                                <h3 class="card-title">Histórico de transações</h3>
                            </div>
                            <div>
                                <div>
                                    <div className="card-body p-2">
                                        <div className="progress-group">
                                            Transferências
                                            <span className="float-right"><b>{transferir}</b>/{transferir + cunhar + aposentar}</span>
                                            <div className="progress progress-sm">
                                                <div className="progress-bar bg-primary" style={{ width: total = String((transferir * 100) / (transferir + cunhar + aposentar)) + "%" }} />
                                            </div>
                                        </div>
                                        <div className="progress-group">
                                            <span className="progress-text"> Moeda emitida</span>
                                            <span className="float-right"><b>{cunhar}</b>/{transferir + cunhar + aposentar}</span>
                                            <div className="progress progress-sm">
                                                <div className="progress-bar bg-success" style={{ width: total = String((cunhar * 100) / (transferir + cunhar + aposentar)) + "%" }} />
                                            </div>
                                        </div>
                                        <div className="progress-group">
                                            Aposentadorias de crédito
                                            <span className="float-right"><b>{aposentar}</b>/{transferir + cunhar + aposentar}</span>
                                            <div className="progress progress-sm">
                                                <div className="progress-bar bg-warning" style={{ width: total = String((aposentar * 100) / (transferir + cunhar + aposentar)) + "%" }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card">
                            <div class="card-header">
                                <h3 class="card-title">Valores acumulados</h3>
                            </div>
                                    <div className="info-box bg-success">
                                        <span className="info-box-icon"><i className="far fa-thumbs-up" /></span>
                                        <div className="info-box-content">
                                            <span className="info-box-text">Carbono Compensado</span>
                                            <span className="info-box-number">{valor_carbono.toLocaleString('pt-br', { minimumFractionDigits: 2 })}</span>
                                            <div className="progress">
                                                <div className="progress-bar" style={{ width: '100%' }} />
                                            </div>
                                            <span className="progress-description">
                                            {valor_carbono.toLocaleString('pt-br', { minimumFractionDigits: 2 })} em transferências
                                            </span>
                                        </div>
                                    </div>
                                    <div className="info-box bg-warning">
                                        <span className="info-box-icon"><i className="fas fa-sync-alt" /></span>
                                        <div className="info-box-content">
                                            <span className="info-box-text">Moeda emitida</span>
                                            <span className="info-box-number">{valor_moeda.toLocaleString('pt-br', { minimumFractionDigits: 2 })}</span>
                                            <div className="progress">
                                                <div className="progress-bar" style={{ width: '100%' }} />
                                            </div>
                                            <span className="progress-description">
                                            {valor_transf_moeda.toLocaleString('pt-br', { minimumFractionDigits: 2 })} em transferências
                                            </span>
                                        </div>
                                    </div>

                        </div>
                    </div>
                </div>
            </div>
            {/* /.content-wrapper */}
            <Footer />
        </div>
    )
}