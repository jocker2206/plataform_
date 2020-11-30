import React, { useContext, useEffect, useState } from 'react';
import Router from 'next/router';
import { AUTHENTICATE } from '../../../services/auth';
import { Form, Button, Select } from 'semantic-ui-react';
import Show from '../../../components/show';
import { tramite } from '../../../services/apis';
import Swal from 'sweetalert2';
import { getTracking } from '../../../services/requests/tramite';
import TableTracking from '../../../components/tramite/tableTracking';
import { AppContext } from '../../../contexts/AppContext';
import { TrackingProvider } from '../../../contexts/tracking/TrackingContext';
import { BtnFloat } from '../../../components/Utils';


const TrackingIndex = ({ success, tracking, query }) => {

    // app
    const app_context = useContext(AppContext);

    // estados
    const [refresh, setRefresh] = useState(false);
    const [current_loading, setCurrentLoading] = useState(false);
    const [current_status, setCurrentStatus] = useState({});
    const [role, setRole] = useState({});

    // primera carga
    useEffect(() => {
        app_context.fireEntity({ render: true });
    }, []);

    // vaciar estatus al cambiar la entidad
    useEffect(() => {
        setCurrentStatus({});
    }, [app_context.entity_id]);

    // obtener el estatus
    useEffect(() => {
        if (app_context.entity_id && query.dependencia_id && query.status && !refresh) getStatus(query.dependencia_id);
        else setCurrentStatus({});
    }, [query.dependencia_id, app_context.entity_id, query.status, query.query_search]);

    // refresh
    useEffect(() => {
        if (refresh) getStatus(query.dependencia_id);
    }, [refresh]);

    // obtener el estado del traking seleccionado
    const getStatus = async (DependenciaId) => {
        app_context.fireLoading(true);
        setCurrentLoading(true);
        await tramite.get('status/tramite_interno', { headers: { DependenciaId } })
            .then(res => {
                let { success, message, status_count } = res.data;
                if (!success) throw new Error(message);
                setCurrentStatus(status_count);
            }).catch(err => console.log(err));
        app_context.fireLoading(false);
        setCurrentLoading(false);
        setRefresh(false);
    }

    // render
    return <TrackingProvider value={{ 
        current_loading,
        current_status,
        tracking,
        setRefresh,
        success,
        role, 
        setRole
    }}>
        <TableTracking 
            title="Bandeja de Entrada"
            query={query}
            url={"tracking"}
        />
        <BtnFloat onClick={(e) => {
            let { push, pathname } = Router;
            push({ pathname: `${pathname}/create` });
        }}>
            <i className="fas fa-plus"></i>
        </BtnFloat>
    </TrackingProvider>;
}

// server rendering
TrackingIndex.getInitialProps = async (ctx) => {
    await AUTHENTICATE(ctx);
    let { query } = ctx;
    query.dependencia_id = typeof query.dependencia_id != 'undefined' ? query.dependencia_id : "";
    query.status = typeof query.status != 'undefined' ? query.status : 'REGISTRADO';
    let success = false;
    let tracking = {};
    if (query.dependencia_id) {
        let datos = await getTracking(ctx, { headers: { DependenciaId: query.dependencia_id } })
        success = datos.success || false;
        tracking = datos.tracking || {};
    }
    // response
    return { query, success, tracking }
}

export default TrackingIndex;