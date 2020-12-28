import React, { useState, useContext } from 'react';

const Grado = ({ work }) => {

    const [current_loading, setCurrentLoading] = useState(false);
    const [current_grados, setCurrentGrados] = useState([]);
    const [current_page, setCurrentPage] = useState(1);
    const [current_last_page, setCurrentLastPage] = useState(0);
    const [current_total, setCurrentTotal] = useState(0);

    // render
    return <div className="row">
        <div className="col-md-12">
            <h5>Listado de Formación Académica</h5>
            <hr/>
        </div>
        <div className="col-md-12">
            <div className="card">
                <div className="card-header">
                    Planilla: Normal
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-10"></div>
                        <div className="col-md-2 text-right">
                            <div className="btn-group">
                                <button className="btn btn-sm btn-primary">
                                    <i className="fas fa-edit"></i>
                                </button>

                                <button className="btn btn-sm btn-red">
                                    <i className="fas fa-file-pdf"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

// export 
export default Grado;