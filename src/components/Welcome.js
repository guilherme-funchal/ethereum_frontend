import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';



// eslint-disable-next-line import/no-anonymous-default-export
export default props =>
  <div className="content-wrapper">
    <div className="content-header">
      <div class="row">
        <div class="col-lg-6">
          <div class="card">
          <div class="card card-primary card-outline">
            <div class="card-header">
              <h5 class="m-0">Bem vindo</h5>
            </div>
            <div class="card-body">
              <h6 class="card-title"></h6>
              <p class="card-text">Bem-vindo ao Dapp em Ethereum para controle de compensação de carbono, desenvolvido para testes no Serpro.
                Nosso objetivo é simular negociações de créditos de carbono relacionadas ao mercado voluntário,
                identificando os principais atores, definindo necessidades de alto nível e funcionalidades básicas.</p> 
                <img class="img-fluid" src="welcome1.jpg" width="90%" height="90%" class="center"></img>
            </div>
            </div> 
          </div>
        </div>
        {/* <div class="col-lg-6">
          <div class="card">
          <div class="col-sm-6">
          <img class="img-fluid" src="welcome1.jpg" alt="Photo"></img>
          </div>
              
          </div>
        </div> */}

        <div class="col-lg-6">
        <div class="card card-primary card-outline">
            <div class="card-header">
              <h5 class="m-0">Blockchain</h5>
            </div>
            <div class="card-body">
              <h6 class="card-title"></h6>
              <p class="card-text">A blockchain é uma tecnologia que organiza dados em uma estrutura chamada de bloco e
                  utiliza técnicas de criptografia para ligar os blocos uns aos outros, formando uma cadeia de blocos.</p>
                  <img class="img-fluid" src="bc.jpg" width="30%" height="30%" class="center-mini"></img>
            </div>
          </div>
          <div class="card card-primary card-outline">
            <div class="card-header">
              <h5 class="m-0">DAPP</h5>
            </div>
            <div class="card-body">
              <h6 class="card-title"></h6>
              <p class="card-text">O Dapp, ou aplicativo descentralizado, usa contratos inteligentes para interagir com a
                blockchain do Ethereum. Os contratos inteligentes são protocolos autoexecutáveis codificados diretamente na blockchain
                que estabelecem um conjunto de regras para que a interação ocorra de maneira autônoma e transparente.</p>
                <img class="img-fluid" src="dapp.jpg" width="40%" height="40%" class="center-mini"></img>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>   
