import React, { Fragment, useState, useContext, useEffect } from 'react';
import { microPlanilla } from '../../../services/apis';
import { Button, Form, Icon } from 'semantic-ui-react';
import Show from '../../show';
import Skeleton from 'react-loading-skeleton';
import { CronogramaContext } from '../../../contexts/cronograma/CronogramaContext';
import AddObligacion from './addObligacion';
import ItemObligation from './itemObligation';

const PlaceHolderButton = ({ count = 1, height = "38px" }) => <Skeleton height={height} count={count}/>

const PlaceholderObligaciones = () => (
  <Fragment>
    <div className="col-md-2 col-6 mb-3">
      <PlaceHolderButton/>
    </div>

    <div className="col-md-2 col-6 mb-3">
      <PlaceHolderButton/>
    </div>

    <div className="col-md-4 col-12 mb-3">
      <PlaceHolderButton/>
    </div>

    <div className="col-md-2 col-6 mb-3">
      <PlaceHolderButton/>
    </div>

    <div className="col-md-2 col-6 mb-3">
      <PlaceHolderButton/>
    </div>

    <div className="col-md-8 col-12 mb-3">
      <PlaceHolderButton height="100px"/>
    </div>

    <div className="col-md-2 col-6 mb-3">
      <PlaceHolderButton/>
    </div>
  </Fragment>
);

const Obligacion = () => {

  // cronograma
  const { edit, setEdit, loading, send, historial, setBlock, setSend, cronograma, setIsEditable, setIsUpdatable, cancel } = useContext(CronogramaContext);
  const [current_loading, setCurrentLoading] = useState(true);
  const [obligaciones, setObligaciones] = useState([]);
  const [error, setError] = useState(false);
  const [current_option, setCurrentOption] = useState("");

  // obtener descuentos detallados
  const findObligaciones = async () => {
    setCurrentLoading(true);
    setBlock(true);
    await microPlanilla.get(`historials/${historial.id}/obligations?limit=100`)
      .then(({ data }) => {
        let { items } = data;
        setObligaciones(items || []);
      })
      .catch(() => {
        setObligaciones([]);
        setError(true);
      });
    setCurrentLoading(false);
    setBlock(false);
  }

  // primera carga
  useEffect(() => {
    setIsEditable(true);
    setIsUpdatable(false);
    if (historial.id) findObligaciones();
    return () => {}
  }, [historial.id]);

  // render
  return (
    <Form className="row">
      <div className="col-md-9"></div>
      <div className="col-md-3">
        <Show condicion={!loading && !current_loading}
          predeterminado={<PlaceHolderButton/>}
        >
          <Button color="green"
            fluid
            disabled={!edit}
            onClick={(e) => setCurrentOption("create")}
          >
            <i className="fas fa-plus"></i>
          </Button>
        </Show>
      </div>

      <div className="col-md-12">
        <hr/>
      </div>

      <Show condicion={!loading && !current_loading}
        predeterminado={
          <div className="col-md-12">
              <div className="row">
                  <div className="col-md-4 col-5">
                      <Skeleton/>
                  </div>

                  <div className="col-md-2 col-3">
                      <Skeleton/>
                  </div>
              </div>
          </div>
        }
      >
        <h4 className="col-md-12 mt-1">
          <Icon name="list alternate" /> Lista de Obligaciones Judiciales:
        </h4>
      </Show>

      <Show condicion={!loading && !current_loading}
        predeterminado={<PlaceholderObligaciones/>}
      >
        {obligaciones.map((obl, index) =>
          <ItemObligation
            key={`item-obligation-${index}`}
            obligation={obl}
            edit={edit}
          />
        )}
      </Show>

      <Show condicion={current_option == 'create'}>
        <AddObligacion
          onClose={() => setCurrentOption()}
          onSave={() => findObligaciones()}
          info={historial?.info}
        />
      </Show>
    </Form>
  )
}

export default Obligacion;