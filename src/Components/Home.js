import React from 'react';

export default function Home() {
  return (
    <div className="content-wrapper">
      <div classeName="content-header">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Bem-vindo</h3>
                <div className="card-tools">
                </div>
              </div>
              <div className="card-body">
                <div className="brand-text font-weight-light text-left">
                Bem-vindo ao Dapp em Ethereum para  compensação de carbono desenvolvido para testes no Serpro.
                </div>
                <div className="brand-text font-weight-light text-left">
                Nosso objetivo é simular negociações de créditos de carbono relacionadas ao mercado voluntário,
                identificando os principais atores, definindo necessidades de alto nível e funcionalidades básicas.
                </div>

                <div className="brand-text font-weight-light text-left">
                O Dapp, ou aplicativo descentralizado, usa contratos inteligentes para interagir com a blockchain do Ethereum.
                A blockchain é uma tecnologia que organiza dados em uma estrutura chamada de bloco e
                utiliza técnicas de criptografia para ligar os blocos uns aos outros, formando uma cadeia de blocos. 
                </div>
                <div className="brand-text font-weight-light text-left">
                Os contratos inteligentes são protocolos autoexecutáveis codificados diretamente na blockchain
                  que estabelecem um conjunto de regras para que a interação ocorra de maneira autônoma e transparente.
                </div>  
              </div>

              <div className="card-footer">
                <img className="img-fluid" src="dist/img/dapp.png" width="30%" height="30%" alt="imagem"></img>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}
