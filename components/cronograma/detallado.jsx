import React, { Component, Context, Fragment } from 'react';
import { unujobs } from '../../services/apis';
import { Button, Form, Select, Icon, Grid } from 'semantic-ui-react';
import { parseOptions } from '../../services/utils';
import Swal from 'sweetalert2';
import { responsive } from '../../services/storage.json';

export default class Detalle extends Component
{
    state = {
        type_detalles: [],
        detalles: [],
        type_detalle_id: "",
        monto: "",
        loader: false,
        payload: []
    }

    componentDidMount = async () => {
        await this.getTypeDetalles();
        await this.getDetalles(this.props);
    }

    componentWillReceiveProps = async (nextProps) => {
        if (nextProps.historial && nextProps.historial.id != this.props.historial.id) {
            this.setState({ detalles: [] });
            await this.getDetalles(nextProps);
        }
        // update
        if (nextProps.send && nextProps.send != this.props.send) {
            await this.update();
        }
    }

    handleInput = ({ name, value }) => {
        this.setState({ [name]: value });
    }

    create = async () => {
        this.props.setLoading(true);
        let payload = {
            historial_id: this.props.historial.id,
            type_detalle_id: this.state.type_detalle_id,
            monto: this.state.monto
        };
        // request
        await unujobs.post('detalle', payload)
        .then(async res => {
            this.props.setLoading(false);
            let { success, message } = res.data;
            if (!success) throw new Error(message);
            await Swal.fire({ icon: 'success', text: message });
            await this.getDetalles(this.props);
            await this.props.updatingHistorial();
            this.props.setEdit(false);
        })
        .catch(err => {
            this.props.setLoading(false);
            Swal.fire({ icon: 'error', text: err.message })
        });
        this.setState({ loader: false });
        this.props.setSend(false);
    }

    getDetalles = async (props) => {
        this.props.setLoading(true);
        let { historial } = props;
        await unujobs.get(`historial/${historial.id}/detalle`)
        .then(async res => {
            await this.setState({ detalles: res.data ? res.data : [] });
        }).catch(err => console.log(err.message));
        this.props.setLoading(false);
    }

    getTypeDetalles = async () => {
        this.props.setLoading(true);
        await unujobs.get('type_detalle')
        .then(async res => {
            let type_detalles = res.data;
            await type_detalles.map(obj => {
                obj.descripcion = `${obj.type_descuento && obj.type_descuento.key}.- ${obj.descripcion}`;
                return obj;
            })
            // set
            this.setState({ type_detalles })
        })
        .catch(err => console.log(err.message));
        this.props.setLoading(false);
    }

    handleMonto = async ({ name, value }, parent, detalle, index) => {
        this.setState(state => {
            detalle[name] = value;
            detalle.edit = true;
            state.detalles[parent].detalles[index] = detalle;
            state.payload[index] = {
                id: detalle.id,
                monto: detalle.monto,
                descripcion: detalle.descripcion
            };
            // response
            return { detalles: state.detalles };
        });
    }

    update = async () => {
        let form = new FormData;
        let { historial } = this.props;
        form.append('detalles', JSON.stringify(this.state.payload));
        await unujobs.post(`detalle/${historial.id}/all`, form, { headers: { CronogramaID: historial.cronograma_id } })
        .then(async res => {
            let { success, message } = res.data;
            if(!success) throw new Error(message);
            this.props.setLoading(false);
            await Swal.fire({ icon: 'success', text: message });
            await this.props.updatingHistorial();
        })
        .catch(err => {
            this.props.setLoading(false);
            Swal.fire({ icon: 'error', text: err.message })
        });
        // setting
        this.props.setLoading(false);
        this.props.setSend(false);
    }

    delete = async (id) => {
        this.props.setLoading(true);
        await unujobs.post(`detalle/${id}`, { _method: 'DELETE' })
        .then(async res => {
            this.props.setLoading(false);
            let { success, message } = res.data;
            if (!success) throw new Error(message);
            await Swal.fire({ icon: 'success', text: message })
            await this.getDetalles(this.props);
            await this.props.updatingHistorial();
            this.props.setEdit(false);
        })
        .catch(err => {
            this.props.setLoading(false);
            Swal.fire({ icon: 'error', text: err.message })
        });
        this.props.setLoading(false);
    }
    
    render() {

        let { detalles, type_detalle_id, monto, type_detalles, loader } = this.state;
        let { loading } = this.props;
 
        return (
            <Form className="row" loading={!this.props.loading && loader}>

                <div className="col-md-12">
                    <div className="row">
                        <div className="col-md-4 mb-1 col-12 col-sm-12 col-lg-4">
                            <Select
                                fluid
                                placeholder="Select. Tipo Detalle"
                                options={parseOptions(type_detalles, ['sel-type', '', 'Select. Tipo Detalle'], ['id', 'id', 'descripcion'])}
                                name="type_detalle_id"
                                value={type_detalle_id}
                                onChange={(e, obj) => this.handleInput(obj)}
                                disabled={!this.props.edit}
                            />
                        </div>

                        <div className="col-md-4 mb-1 col-10 col-lg-3 col-sm-9">
                            <Form.Field>
                                <input type="number"
                                    name="monto"
                                    step="any"
                                    value={monto}
                                    placeholder="Ingrese un monto"
                                    disabled={!this.props.edit}
                                    onChange={({target}) => this.handleInput(target)}
                                />
                            </Form.Field>
                        </div>

                        <div className="col-xs col-md-4 col-2 col-sm-3 col-lg-3">
                            <Button color="green"
                                disabled={!type_detalle_id || !this.props.edit}
                                onClick={this.create}    
                                fluid
                            >
                                <i className="fas fa-plus"></i> {this.props.screenX > responsive.md ? 'Agregar' : ''}
                            </Button>
                        </div>
                    </div>
                </div>
                
                <div className="col-md-12">
                    <hr/>
                </div>

                <div className="col-md-12">
                    <Grid columns={2} fluid>
                        {!loading && detalles.map((det, parent) => 
                            <Grid.Column key={`type_detalle_${det.id}`}>
                                <b><span className="text-red mb-2">{det.key}</span>.- <span className="text-primary">{det.descripcion}</span></b>
                                <hr/>
                                {det.detalles.map((detalle, index) => 
                                    <Fragment>
                                        <Form.Field key={`detalle-${detalle.id}`}>
                                            <label htmlFor="">{detalle.type_detalle && detalle.type_detalle.descripcion}</label>
                                            <div className="row">
                                                <div className="col-md-10">
                                                    <input type="number" 
                                                        name="monto"
                                                        step="any"
                                                        value={detalle.monto || ""}
                                                        disabled={!this.props.edit}
                                                        onChange={({target}) => this.handleMonto(target, parent, detalle, index)}
                                                        min="0"
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <Button
                                                        fluid
                                                        color="red"
                                                        disabled={!this.props.edit}
                                                        onClick={(e) => this.delete(detalle.id)}
                                                    >
                                                        <i className="fas fa-trash-alt"></i>
                                                    </Button>
                                                </div>
                                            </div>
                                        </Form.Field>   

                                        <Form.Field>
                                            <textarea 
                                                disabled={!this.props.edit}
                                                name="descripcion"    
                                                onChange={({ target }) => this.handleMonto(target, parent, detalle, index)}
                                                value={detalle.descripcion || ""}
                                            />
                                        </Form.Field>
                                    </Fragment> 
                                )}
                            </Grid.Column>    
                        )}
                    </Grid>
                </div>
            </Form>
        )
    }

}