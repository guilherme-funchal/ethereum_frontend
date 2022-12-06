import { Link } from "react-router-dom";
import Header from './Header';
import Footer from './Footer';
import Api from '../Api';
import Table from './Tables/Table';
import { If, Then, ElseIf, Else } from 'react-if-elseif-else-render';
import Button from 'react-bootstrap/Button';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import ModalAddProject from "./Modals/ModalAddProjeto";
import ModalEditProject from "./Modals/ModalEditProject";
import ModalViewProject from "./Modals/ModalViewProject";
import moment from 'moment';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import withReactContent from 'sweetalert2-react-content';

export default function Sidenav() {

    const [user, setUser] = useState([]);
    const navigate = useNavigate();
    const MySwal = withReactContent(Swal)

    var address = false;

    useEffect((address) => {
        address = localStorage.getItem('wallet');

        if (address !== null){
            setUser(JSON.parse(address));
        }else{
            setUser(false);
        }
    }, []);

    let dashboard = false;
    let plataforma = false;
    let administracao = false;
    let projetos = false;
    let certificadora = false;
    let token = false;
    let transf = false;
    visible=true;

    if (user[0]?.profile === 'registrador' || user[0]?.profile === 'comprador') {
        plataforma = true;
    }

    if (user[0]?.profile === 'registrador' || user[0]?.profile === 'certificador' || user[0]?.profile === 'propositor' || user[0]?.profile === 'comprador'){
        dashboard = true;
    }

    if (user[0]?.profile === 'registrador' || user[0]?.profile === 'certificador' || user[0]?.profile === 'propositor') {
        projetos = true;
    }

    if (user[0]?.profile === 'registrador') {
        administracao = true;
    }

    if (user[0]?.profile === 'registrador' || user[0]?.profile === 'certificador') {
        token = true;
        transf = true;
    }

    if (user === false){
        var visible=false;
    }

    async function WalletAtual() {   

        var html =
          '<p className="text-left small"><b>Wallet : </b><span>' + user[0]?.user_id + '</span></p>' +
          '<p className="text-left small"><b>Nome : </b><span>' + user[0]?.name + '</span></p>' +
          '<p className="text-left small"><b>Perfil : </b><span>' + user[0]?.profile + '</span></p>' +
          '<p className="text-left small"><b>Descrição : </b><span>' + user[0]?.desc + '</span></p>' +
          '<p className="text-left small"><b>Email: </b><span>' + user[0]?.email + '</span></p>'
    
        if (user.type === 'pj') {
          html = html + '<p className="text-left small"><b>CNPJ: </b><span>' + user[0]?.doc + '</span></p>'
        } else {
          html = html + '<p className="text-left small"><b>CPF: </b><span>' + user[0]?.doc + '</span></p>'
        }
    
        MySwal.fire({
          html: html,
          icon: 'info'
        });
      }
    
    var image = String(user[0]?.image);

    return (
        <div>
            <aside className="main-sidebar sidebar-dark-primary elevation-4 ">
                <Link to="/" className="brand-link text-center">
                    {/* <img src="dist/img/serpro.png" alt="Logo" className="brand-image" style={{ opacity: '.8' }} /> */}
                    <span className="brand-text font-weight-light text-left"><h6>DApp Compensação Carbono</h6></span>
                </Link>
                <div className="sidebar">
                    <div className="user-panel mt-3 pb-3 mb-3 d-flex">

                         <If condition={image !== "undefined"}>
                            <Then>
                            <div className="image">
                            <img src={image} className="img-circle elevation-2" alt="User Image" />
                            </div>    
                            <div className="info">
                            <p className="text-white">
                                {user[0]?.name}
                                <button id="btn1" className="btn text-light" onClick={WalletAtual}><i className="fas fa fa-info" /> </button>
                            </p> 
                            </div>
                            </Then>  
                        </If>
                        
                    </div>
                    <nav className="mt-2">
                        <ul className="nav nav-pills nav-sidebar flex-column text-left" data-widget="treeview" role="menu" data-accordion="false">
                            <li className="nav-item">
                                <Link to="/" className="nav-link">
                                    <i className="nav-icon fas  fa-bookmark" />
                                    <p>
                                        Inicio
                                    </p>
                                </Link>
                            </li>
                            <If condition={dashboard === true}>
                            <Then>
                            <li className="nav-item">
                                <Link to="/Dashboard" className="nav-link">
                                    <i className="nav-icon fas fa-tachometer-alt" />
                                    <p>
                                        Dashboard
                                    </p>
                                </Link>
                            </li>
                            </Then>  
                            </If>
                            <If condition={token === true}>
                            <Then>
                            <li className="nav-item">
                                <Link to="/Tokens" className="nav-link">
                                    <i className="nav-icon ion ion-cash" />
                                    <p>
                                        Tokens
                                    </p>
                                </Link>
                            </li>
                            </Then>  
                            </If>
                            <If condition={transf === true}>
                            <Then>
                            <li className="nav-item">
                                <Link to="/Transfer" className="nav-link">
                                    <i className="nav-icon fas fa  fa-arrows-alt" />
                                    <p>
                                        Transferências
                                    </p>
                                </Link>
                            </li>
                            </Then>  
                            </If>
                            <If condition={projetos === true}>
                            <Then>
                            <li className="nav-item">
                                <Link to="/Projetos" className="nav-link">
                                    <i className="nav-icon fas fa  fa-folder" />
                                    <p>
                                        Projetos
                                    </p>
                                </Link>
                            </li>
                            </Then>  
                             </If>
                             <If condition={administracao === true}>
                            <Then>
                            <li className="nav-item">
                                <Link to="/Administracao" className="nav-link">
                                    <i className="nav-icon fas fa  fa-user" />
                                    <p>
                                        Administração
                                    </p>
                                </Link>
                            </li>
                            </Then>  
                            </If>
                            <If condition={plataforma === true}>
                            <Then>
                            <li className="nav-item">
                                <Link to="/Plataforma" className="nav-link">
                                    <i className="nav-icon fas fa  fa-sort" />
                                    <p>
                                        Plataforma
                                    </p>
                                </Link>
                            </li>
                            </Then>  
                            </If>
                        </ul>
                    </nav>
                </div>
            </aside>
        </div>
    )
}

