import React, { Component } from 'react'


export default class Dashboard extends Component {

  
    render() {
        return (
            <div>
  <div className="content-wrapper">
    {/* Content Header (Page header) */}
    <div className="content-header">
      <div className="container-fluid">
        <div className="row mb-2">
          <div className="col-sm-6">
            <h1 className="m-0 text-dark">Dashboard</h1>
          </div>{/* /.col */}
          <div className="col-sm-6">
            <ol className="breadcrumb float-sm-right">
              <li className="breadcrumb-item"><a href="#">Home</a></li>
              <li className="breadcrumb-item active">Dashboard v1</li>
            </ol>
          </div>{/* /.col */}
        </div>{/* /.row */}
      </div>{/* /.container-fluid */}
    </div>
    {/* /.content-header */}
    {/* Main content */}
    <section className="content">
      <div className="container-fluid">
        {/* Small boxes (Stat box) */}
        <div className="row">
          <div className="col-lg-3 col-6">
            {/* small box */}
            <div className="small-box bg-info">
              <div className="inner">
                <h3>110</h3>
                <p>Saldo</p>
              </div>
              <div className="icon">
                <i className="ion ion-bag" />
              </div>
              <a href="#" className="small-box-footer">Informações <i className="fas fa-arrow-circle-right" /></a>
            </div>
          </div>
          {/* ./col */}
          <div className="col-lg-3 col-6">
            {/* small box */}
            <div className="small-box bg-success">
              <div className="inner">
                <h3>100</h3>
                <p>Transações</p>
              </div>
              <div className="icon">
                <i className="ion ion-stats-bars" />
              </div>
              <a href="#" className="small-box-footer">Informações <i className="fas fa-arrow-circle-right" /></a>
            </div>
          </div>
          {/* ./col */}
          <div className="col-lg-3 col-6">
            {/* small box */}
            <div className="small-box bg-warning">
              <div className="inner">
                <h3>10</h3>
                <p>Usuários registrados</p>
              </div>
              <div className="icon">
                <i className="ion ion-person-add" />
              </div>
              <a href="#" className="small-box-footer">Informações <i className="fas fa-arrow-circle-right" /></a>
            </div>
          </div>
          {/* ./col */}
        </div>
        {/* /.row */}
        {/* Main row */}
        <div className="row">
          {/* Left col */}
          {/* right col */}
        </div>
        <p><h3>Transações</h3></p>
        <table class="table w-auto" >
                  <thead>
                    <tr>
                      <th>Evento</th>
                      <th>Bloco</th>
                      <th>Origem</th>
                      <th>Destino</th>
                      <th>Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Transferência</td>
                      <td>2</td>
                      <td>0x70997970C51812dc3A010C7d01b50e0d17dc79C8	</td>
                      <td>0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266</td>
                      <td>1500</td>
                    </tr>
                    <tr>
                      <td>Transferência</td>
                      <td>2</td>
                      <td>0x70997970C51812dc3A010C7d01b50e0d17dc79C8	</td>
                      <td>0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266</td>
                      <td>1500</td>
                    </tr>
                    <tr>
                      <td>Transferência</td>
                      <td>2</td>
                      <td>0x70997970C51812dc3A010C7d01b50e0d17dc79C8	</td>
                      <td>0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266</td>
                      <td>1500</td>
                    </tr>
                    <tr>
                      <td>Transferência</td>
                      <td>2</td>
                      <td>0x70997970C51812dc3A010C7d01b50e0d17dc79C8	</td>
                      <td>0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266</td>
                      <td>1500</td>
                    </tr>
                    <tr>
                      <td>Transferência</td>
                      <td>2</td>
                      <td>0x70997970C51812dc3A010C7d01b50e0d17dc79C8	</td>
                      <td>0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266</td>
                      <td>1500</td>
                    </tr>
                    <tr>
                      <td>Transferência</td>
                      <td>2</td>
                      <td>0x70997970C51812dc3A010C7d01b50e0d17dc79C8	</td>
                      <td>0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266</td>
                      <td>1500</td>
                    </tr>
                    <tr>
                      <td>Transferência</td>
                      <td>2</td>
                      <td>0x70997970C51812dc3A010C7d01b50e0d17dc79C8	</td>
                      <td>0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266</td>
                      <td>1500</td>
                    </tr>
                    </tbody>
                </table>
        {/* /.row (main row) */}
      </div>{/* /.container-fluid */}
    </section>
    {/* /.content */}
  </div>
</div>

        )
    }
}

