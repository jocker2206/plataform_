import React, { useContext, useState } from 'react';
import { Button, Form, Select } from 'semantic-ui-react';
import Modal from '../modal'
import Show from '../show';
import { AppContext } from '../../contexts/AppContext';
import { ProjectContext } from '../../contexts/project-tracking/ProjectContext'
import { Confirm } from '../../services/utils';
import { projectTracking } from '../../services/apis';
import TableSaldoFinanciero from './tableSaldoFinanciero';
import AddMetaToPlanTrabajo from './addMetaToPlanTrabajo';
import Swal from 'sweetalert2';
import { SelectProjectObjective, SelectPlanTrabajoActivity } from '../select/project_tracking';

const InfoPlanTrabajo = ({ plan_trabajo, isClose = null }) => {

    // app
    const app_context = useContext(AppContext);

    // project
    const { project } = useContext(ProjectContext);

    // estados
    const [form, setForm] = useState({});
    const [refresh, setRefresh] = useState(false);

    // cambiar form
    const handleInput = ({ name, value }) => {
        let newForm = Object.assign({}, form);
        newForm[name] = value;
        setForm(newForm);
    }

    // crear config activity
    const createConfigActivity = async () => {
        let answer = await Confirm("warning", `¿Deseas guardar los datos?`)
        if (answer) {
            app_context.fireLoading(true);
            let datos = Object.assign({}, form);
            datos.plan_trabajo_id = plan_trabajo.id;
            await projectTracking.post(`config_activity`, datos)
                .then(res => {
                    app_context.fireLoading(false);
                    let { success, message } = res.data;
                    if (!success) throw new Error(message);
                    Swal.fire({ icon: 'success', text: message });
                    setForm({});
                    setRefresh(true);
                }).catch(err => {
                    try {
                        app_context.fireLoading(false);
                        let { message, errors } = err.response.data;
                        if (!message) throw new Error(err.message);
                        if (!errors) throw new Error(message);
                        Swal.fire({ icon: 'warning', text: message });
                    } catch (error) {
                        Swal.fire({ icon: 'error', text: error.message || err.message });
                    }
                })
        }
        // quitar el refresh
        setRefresh(false);
    }

    // render
    return (
        <Modal
            show={true}
            titulo={<span><i className="fas fa-info-circle"></i> Información Plan de Trabajo</span>}
            md="12"
            isClose={isClose}
        >  
            <div className="card-body">
                <div className="row">
                    <div className="col-md-12">
                        <div className="row">
                            <div className="col-md-5">
                                <SelectProjectObjective
                                    project_id={project.id}
                                    name="objective_id"
                                    value={form.objective_id}
                                    onChange={(e, obj) => handleInput(obj)}
                                />
                            </div>

                            <div className="col-md-5">
                                <SelectPlanTrabajoActivity
                                    plan_trabajo_id={plan_trabajo.id}
                                    except={1}
                                    objective_id={form.objective_id}
                                    refresh={form.objective_id}
                                    execute={false}
                                    name="activity_id"
                                    value={form.activity_id}
                                    onChange={(e, obj) => handleInput(obj)}
                                />
                            </div>

                            <div className="col-md-2">
                                <Button basic
                                    color="green"
                                    onClick={createConfigActivity}
                                    disabled={!form.activity_id}
                                >
                                    <i className="fas fa-plus"></i>
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-12 mb-4">
                        <hr/>
                    </div>

                    <div className="col-md-12">
                        <TableSaldoFinanciero plan_trabajo={plan_trabajo} refresh={refresh}/>
                    </div>

                    <div className="col-md-12">
                        <Form>
                            <AddMetaToPlanTrabajo plan_trabajo={plan_trabajo}/>
                        </Form>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default InfoPlanTrabajo;