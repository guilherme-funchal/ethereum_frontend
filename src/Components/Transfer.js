import Header from './Header';
import Footer from './Footer';
import Sidenav from './Sidenav';
import Api from '../Api';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { If, Then, ElseIf, Else } from 'react-if-elseif-else-render';
import Web3 from 'web3';
import { useState, useEffect, useCallback } from 'react';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import ModalViewUser from "./Modals/ModalViewUser";

export default function Transfer() {

    async function EditItemUser(user_id) {
        var response = await Api.get('account/find/' + user_id);
        setItemsUser(response.data);
    }
    
    async function viewUser(user_id) {
        EditItemUser(user_id);
        setShowModalViewUser(true);
    }

    const [itemsUser, setItemsUser] = useState([' ']);
    const [showModalViewUser, setShowModalViewUser] = useState(false);

    const inputOptions = new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            '0': 'Moeda',  
            '1': 'Carbono'
            
          })
        }, 1000)
      })

    const Sucesso = Swal.mixin({
        toast: true,
        position: 'center',
        iconColor: 'green',
        customClass: {
            popup: 'colored-toast'
        },
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true
    });

    const Falha = Swal.mixin({
        toast: true,
        position: 'center',
        iconColor: 'falha',
        customClass: {
            popup: 'colored-toast'
        },
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true
    });

    const getTransactions = async () => {
        const response = await Api.get('transacoes');
        setTransactions(response.data);
    };

    const forceUpdate = useCallback(() => updateState({}), []);
    const [, updateState] = useState();

    const [taxas, setTaxas] = useState([]);

    const getTaxas = async () => {
        const response = await Api.get('tax/list');
        setTaxas(response.data);
    };
    const navigate = useNavigate();

    async function doTransfer() {


        const steps = ['1', '2', '3', '4', '5']
        const Queue = await Swal.mixin({
            progressSteps: steps,
            confirmButtonText: 'Próximo >',
            // optional classes to avoid backdrop blinking between steps
            showClass: { backdrop: 'swal2-noanimation' },
            hideClass: { backdrop: 'swal2-noanimation' }
        })
        const { value: tipo } =await Queue.fire({
            title: 'Tipo da tranferência',
            currentProgressStep: 0,
            // optional class to show fade-in backdrop animation which was disabled in Queue mixin
            showClass: { backdrop: 'swal2-noanimation' },
            input: 'radio',
            inputLabel: '',
            inputOptions: inputOptions,
            inputValidator: (value) => {
                if (!value) {
                  return 'Você precisa escolher um!'
                }
              },
            inputPlaceholder: 'User ID'
        })
        const { value: origem } = await Queue.fire({
            title: 'Origem da transferência',
            currentProgressStep: 1,
            // optional class to show fade-in backdrop animation which was disabled in Queue mixin
            showClass: { backdrop: 'swal2-noanimation' },
            input: 'text',
            inputLabel: '',
            inputPlaceholder: 'User ID'
        })
        const { value: destino } = await Queue.fire({
            title: 'Destino da transferência',
            currentProgressStep: 2,
            input: 'text',
            inputLabel: '',
            inputPlaceholder: 'User ID'
        })
        const { value: valor } = await Queue.fire({
            title: 'Valor da transferência',
            currentProgressStep: 3,
            input: 'number',
            inputLabel: '',
            inputPlaceholder: 'Valor'
        })
        const { value: confirma } = await Queue.fire({
            title: 'Confirma transação',
            currentProgressStep: 4,
            confirmButtonText: 'Sim',
            showCancelButton: true,
            cancelButtonText: 'Não',
            // optional class to show fade-out backdrop animation which was disabled in Queue mixin
            showClass: { backdrop: 'swal2-noanimation' },
        })
        if (confirma === true){
            var block = { 
                "from": origem,
                "to": destino,
                "id": tipo,
                "amount": valor,
                "data": "0x"
             };
            
            var saldo = await Api.get('saldo?conta=' + origem + '&wallet=' + tipo); 

            
            if (saldo.data > valor){
                const response = Api.post('transferir', block);
                navigate("/Transfer");
                navigate(0);
            } else {
                Swal.fire({
                    title: 'Não existe saldo suficiente',
                    icon: 'error',
                    showDenyButton: false,
                    showCancelButton: false,
                    confirmButtonText: 'Ok',
                    denyButtonText: 'Não',
                    customClass: {
                      actions: 'my-actions',
                      cancelButton: 'order-1 right-gap',
                      confirmButton: 'order-2',
                      denyButton: 'order-3',
                    }
                })
            }
        }            
    }


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

    const style = { width: '80px' }

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
                                <h1 className="m-0">Transferências</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <section className="content">
                    <div className="container-fluid">
                        <Button style={style} variant="primary" size="sm" onClick={doTransfer}>
                             Nova
                        </Button>
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

                                    var visible = false;
                                    var aposentar = false;



                                    if (user[0]?.profile === "certificador" || user[0]?.profile === "registrador") {
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
                                                visible = false;
                                            }
                                        }
                                        else if (key === "to") {
                                            to = `${val[key]}`;
                                            if (to === "0x0000000000000000000000000000000000000000" && obj.event === "TransferSingle") {
                                                transferencia = "Aposentar";
                                                visible = false;
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
                                    if (from === "0x0000000000000000000000000000000000000000") {
                                        from = "Smart contract"
                                    }

                                    if (user[0]?.user_id === to || user[0]?.user_id === from){
                                        if (transferencia === "Transferir") 
                                        {
                                        visible = true;
                                        }
                                    }

                                    return (
                                        <If condition={visible === true}>
                                            <Then>
                                                <tr>
                                                    <td><center>{transferencia}</center></td>
                                                    <td><center>{obj.blockNumber}</center></td>
                                                    <td onClick={() => viewUser(to)}><center>{from}</center></td>

                                                    <td onClick={() => viewUser(to)}><center>{to}</center></td>
                                                    <td><center>{value.toLocaleString('pt-br', { minimumFractionDigits: 2 })}</center></td>
                                                    <td><center>{id}</center></td>
                                                    <td><center><button className="btn text-red btn-sm" onClick={event => { doTimestamp(obj.blockNumber); }}
                                                    ><i className="fa fa-clock fa-fw" style={{ fontSize: "15px" }}></i></button></center></td>
                                                </tr>
                                            </Then>
                                        </If>
                                    );

                                })}
                            </tbody>
                        </table>
                    </div>{/* /.container-fluid */}
                </section>
                {/* /.content */}
            </div>
            {/* /.content-wrapper */}
            <ModalViewUser title="Dados do Projeto" items={itemsUser} onClose={() => { setShowModalViewUser(false); }} show={showModalViewUser}>
            </ModalViewUser>
            <Footer />
        </div>
    )
}