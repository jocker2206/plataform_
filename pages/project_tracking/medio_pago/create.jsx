import React, { useEffect, useContext, useState } from "react";
import { Body, BtnBack } from "../../../components/Utils";
import { AUTHENTICATE } from "../../../services/auth";
import { projectTracking } from "../../../services/apis";
import { AppContext } from "../../../contexts/AppContext";
import { backUrl, Confirm } from "../../../services/utils";
import Router from "next/router";
import { Button, Form, Checkbox } from "semantic-ui-react";
import Show from "../../../components/show";
import Swal from "sweetalert2";

const CreateMedioPago = () => {
  // app
  const app_context = useContext(AppContext);

  // datos
  const [form, setForm] = useState({});

  // primera carga
  useEffect(() => {
    app_context.fireEntity({ render: true });
  }, []);

  // change form
  const handleInput = ({ name, value }) => {
    let newForm = Object.assign({}, form);
    newForm[name] = value;
    setForm(newForm);
  };

  // guardar medio de pago
  const saveMedioPago = async () => {
    let answer = await Confirm("warning", `¿Estas seguro en guardar el Medio de Pago`);
    if (answer) {
      app_context.fireLoading(true);
      let newForm = Object.assign({}, form);
      await projectTracking
        .post("medio_pago", newForm)
        .then((res) => {
          app_context.fireLoading(false);
          let { message } = res.data;
          Swal.fire({ icon: "success", text: message });
          setForm({});
        })
        .catch((err) => {
          app_context.fireLoading(false);
          let { message, errors } = err.response.data;
          Swal.fire({ icon: "warning", text: message });
        })
        .catch((err) => {
          Swal.fire({ icon: "error", text: err.message });
        });
    }
  };

  // render
  return (
    <div className="col-md-12">
      <Body>
        <div className="card-">
          <div className="card-header">
            <BtnBack onClick={(e) => Router.push(backUrl(Router.pathname))} />{" "}
            Crear Medio de Pago
          </div>
          <div className="card-body">
            <div className="row justify-content-center">
              <div className="col-md-9">
                <Form>
                  <div className="row">
                    <div className="col-md-12 mb-4">
                      <Form.Field>
                        <label>Nombre</label>
                        <input
                          type="text"
                          placeholder="ingrese un nombre"
                          value={form.name || ""}
                          name="name"
                          onChange={(e) => handleInput(e.target)}
                        />
                      </Form.Field>
                    </div>

                    <div className="col-md-12">
                      <hr />

                      <div className="text-right">
                        <Button color="teal" onClick={saveMedioPago}>
                          <i className="fas fa-save"></i> Guardar
                        </Button>
                      </div>
                    </div>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </Body>
    </div>
  );
};

// rendering server
CreateMedioPago.getInitialProps = async (ctx) => {
  await AUTHENTICATE(ctx);
  // response
  return {};
};

export default CreateMedioPago;
