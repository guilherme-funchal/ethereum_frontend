import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';



// eslint-disable-next-line import/no-anonymous-default-export
export default props =>
  <div className="content-wrapper">
    <div classeName="content-header">
      <div className="row">
        <div className="col-lg-6">
          <div className="card">
          <div className="card card-primary card-outline">
            <div className="card-header">
              <h5 className="m-0">Bem vindo</h5>
            </div>
            <div className="card-body">
              <h6 className="card-title"></h6>
              <p className="card-text">Bem-vindo ao Dapp em Ethereum para controle de compensação de carbono, desenvolvido para testes no Serpro.
                Nosso objetivo é simular negociações de créditos de carbono relacionadas ao mercado voluntário,
                identificando os principais atores, definindo necessidades de alto nível e funcionalidades básicas.</p> 
                <img className="img-fluid" src="welcome1.jpg" width="90%" height="90%" className="center"></img>
            </div>
            </div> 
          </div>
        </div>
        {/* <div className="col-lg-6">
          <div className="card">
          <div className="col-sm-6">
          <img className="img-fluid" src="welcome1.jpg" alt="Photo"></img>
          </div>
              
          </div>
        </div> */}

        <div className="col-lg-6">
        <div className="card card-primary card-outline">
            <div className="card-header">
              <h5 className="m-0">Blockchain</h5>
            </div>
            <div className="card-body">
              <h6 className="card-title"></h6>
              <p className="card-text">A blockchain é uma tecnologia que organiza dados em uma estrutura chamada de bloco e
                  utiliza técnicas de criptografia para ligar os blocos uns aos outros, formando uma cadeia de blocos.</p>
                  <img className="img-fluid" src="bc.jpg" width="30%" height="30%" className="center-mini"></img>
            </div>
          </div>
          <div className="card card-primary card-outline">
            <div className="card-header">
              <h5 className="m-0">DAPP</h5>
            </div>
            <div className="card-body">
              <h6 className="card-title"></h6>
              <p className="card-text">O Dapp, ou aplicativo descentralizado, usa contratos inteligentes para interagir com a
                blockchain do Ethereum. Os contratos inteligentes são protocolos autoexecutáveis codificados diretamente na blockchain
                que estabelecem um conjunto de regras para que a interação ocorra de maneira autônoma e transparente.</p>
                <img className="img-fluid" src="dapp.jpg" width="40%" height="40%" className="center-mini"></img>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>   
