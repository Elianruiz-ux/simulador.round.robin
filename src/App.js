import React, { useState } from "react";
import "./App.css";
import { CiPlay1, CiTrash } from "react-icons/ci";
import { IoIosAdd } from "react-icons/io";

function App() {
  const [numProcesos, setNumProcesos] = useState(0);
  const [procesos, setProcesos] = useState([]);
  const [quantum, setQuantum] = useState(0);
  const [intercambio, setIntercambio] = useState(0);
  const [tiempo, setTiempo] = useState(0);
  const [resultados, setResultados] = useState([]);
  const [resultadosPromediosProceso, setResultadosPromediosProceso] = useState(
    []
  );

  const handleNumProcesosChange = (e) => {
    const numProcesos = parseInt(e.target.value);
    if (!isNaN(numProcesos) && numProcesos > 0) {
      setNumProcesos(numProcesos);
      setProcesos(
        Array(numProcesos)
          .fill()
          .map((_, index) => ({
            nombre: `P${index + 1}`,
            tiempoLlegada: 0,
            quantum: 0,
            tiempoRestante: 0,
            entradasSalidas: [],
            primeraVez: false,
          }))
      );
    }
  };

  const handleProcesoChange = (index, field, value) => {
    const nuevosProcesos = [...procesos];
    nuevosProcesos[index] = { ...nuevosProcesos[index], [field]: value };
    setProcesos(nuevosProcesos);
  };

  const handleEntradaSalidaChange = (index, field, value, esIndex) => {
    const nuevosProcesos = [...procesos];
    nuevosProcesos[index].entradasSalidas[esIndex] = {
      ...nuevosProcesos[index].entradasSalidas[esIndex],
      [field]: value,
    };
    setProcesos(nuevosProcesos);
  };

  const addEntradaSalida = (index) => {
    const nuevosProcesos = [...procesos];
    nuevosProcesos[index].entradasSalidas.push({ tiempo: 0, quantum: 0 });
    setProcesos(nuevosProcesos);
  };

  const handleSimulacion = () => {
    setResultados([]);
    setTiempo(0);
    let procesosOrdenados = JSON.parse(JSON.stringify(procesos)).sort(
      (a, b) => a.tiempoLlegada - b.tiempoLlegada
    );

    let tiempoActual = 0;
    let tiemposRestantes = procesosOrdenados.map((proceso) =>
      parseInt(proceso.quantum)
    );
    let hayProcesosPendientes = true;
    let resultadosSimulacion = [];
    let resultadosTiempos = [];

    while (hayProcesosPendientes) {
      hayProcesosPendientes = false;

      for (let i = 0; i < procesosOrdenados.length; i++) {
        let proceso = procesosOrdenados[i];

        if (tiemposRestantes[i] > 0 && proceso.tiempoLlegada <= tiempoActual) {
          hayProcesosPendientes = true;

          let tiempoEjecutado = Math.min(quantum, tiemposRestantes[i]);
          tiempoActual += tiempoEjecutado;
          tiemposRestantes[i] -= tiempoEjecutado;
          tiempoActual += intercambio;

          const inicio = tiempoActual - tiempoEjecutado - intercambio;
          const fin = tiempoActual - intercambio;

          resultadosSimulacion.push({
            proceso: proceso.nombre,
            inicio: inicio,
            fin: fin,
            espera: inicio - proceso.tiempoLlegada, // Aquí debería calcularse el tiempo de espera
            retorno: 0, // Aquí debería calcularse el tiempo de retorno
            intercambio: intercambio,
            quantum: quantum,
          });
          if (proceso.primeraVez === false) {
            proceso.primeraVez = true;
            resultadosTiempos.push({
              proceso: proceso.nombre,
              espera: inicio - proceso.tiempoLlegada,
              retorno: 0,
            });
          }

          console.log("PROCESO " + proceso.nombre);
          console.log("quantum: " + quantum);
          console.log("Tiempo " + tiempoActual);
          console.log(
            "Tiempo restante de " + proceso.nombre + ": " + tiemposRestantes[i]
          );
          console.log("Tiempo después de intercambio " + tiempoActual);

          // Validación de entradas y salidas
          if (tiemposRestantes[i] === 0) {
            if (proceso.entradasSalidas.length > 0) {
              let entradaSalida = proceso.entradasSalidas.shift();
              let aux = tiempoActual + entradaSalida.tiempo - intercambio;
              tiemposRestantes[i] = entradaSalida.quantum;
              proceso.tiempoLlegada = aux; // Actualizar tiempo de llegada
              procesosOrdenados.sort(
                (a, b) => a.tiempoLlegada - b.tiempoLlegada
              ); // Reordenar procesos por tiempo de llegada

              console.log(
                "El proceso " +
                  proceso.nombre +
                  " tiene una entrada/salida. Nuevo tiempo de llegada: " +
                  aux +
                  ", nuevo quantum: " +
                  tiemposRestantes[i]
              );
            } else {
              console.log("El proceso " + proceso.nombre + " ha terminado.");
            }
          }

          if (tiemposRestantes[i] === 0) {
            console.log(i);
            const procesoEspecifico = JSON.parse(JSON.stringify(procesos));
            console.log({ procesoEspecifico });
            const finProceso = tiempoActual - intercambio;
            [...resultadosTiempos].push({
              proceso: proceso.nombre,
              retorno: 1,
            });
          }
        }
      }
    }

    setTiempo(tiempoActual);
    setResultadosPromediosProceso(resultadosTiempos);
    setResultados(resultadosSimulacion);
  };

  const borrar = () => {
    setResultados([]);
    setResultadosPromediosProceso([]);
    setProcesos([]);
    setQuantum(0);
    setIntercambio(0);
    setNumProcesos(0);
    setTiempo(0);
  };

  console.log(procesos);

  return (
    <div className="main">
      <h2 className="header">Simulador Round Robin</h2>
      <div className="mainContainer">
        <div className="actions">
          <div className="input">
            <label>Número de procesos</label>
            <input
              type="number"
              value={numProcesos}
              onChange={handleNumProcesosChange}
            />
          </div>
          <div className="input">
            <label>Quantum {`(Milisegundos)`}</label>
            <input
              type="number"
              value={quantum}
              onChange={(e) =>
                setQuantum(e.target.value >= 0 ? parseInt(e.target.value) : 0)
              }
            />
          </div>
          <div className="input">
            <label>Intercambio {`(Milisegundos)`}</label>
            <input
              type="number"
              value={intercambio}
              onChange={(e) =>
                setIntercambio(
                  e.target.value >= 0 ? parseInt(e.target.value) : 0
                )
              }
            />
          </div>
          <div className="buttons">
            <button
              className="round"
              onClick={handleSimulacion}
              disabled={numProcesos === 0 || quantum === 0}
            >
              <CiPlay1 /> <span>Ejecutar Round Robin</span>
            </button>
            {/* <button className="add" onClick={addProcess}>
              <IoIosAdd /> <span>Agregar Proceso</span>
            </button> */}
            <button className="delete" onClick={borrar}>
              <CiTrash />
              <span>Borrar</span>
            </button>
          </div>
        </div>
        {procesos.length > 0 && (
          <div className="form">
            <>
              <h3 className="headerForm">Introducir Procesos</h3>
              <form>
                {procesos.map((proceso, index) => (
                  <div className="process" key={index}>
                    <p>Proceso {index + 1} </p>
                    <div className="input">
                      <label>Tiempo de Ráfaga de CPU</label>
                      <input
                        type="number"
                        value={proceso.quantum}
                        onChange={(e) =>
                          e.target.value >= 0
                            ? handleProcesoChange(
                                index,
                                "quantum",
                                parseInt(e.target.value)
                              )
                            : 0
                        }
                      />
                    </div>
                    <div className="input">
                      <label>Tiempo de llegada</label>
                      <input
                        type="number"
                        value={proceso.tiempoLlegada}
                        onChange={(e) =>
                          e.target.value >= 0
                            ? handleProcesoChange(
                                index,
                                "tiempoLlegada",
                                parseInt(e.target.value)
                              )
                            : 0
                        }
                      />
                    </div>

                    <div className="buttonES">
                      <button
                        type="button"
                        onClick={() => addEntradaSalida(index)}
                        className="round"
                      >
                        Añadir Entrada/Salida
                      </button>
                      {proceso.entradasSalidas.length > 0 && (
                        <span>E/S: {proceso.entradasSalidas.length}</span>
                      )}
                    </div>
                    {proceso.entradasSalidas.map((es, esIndex) => (
                      <div key={esIndex} className="entradaSalida">
                        <div className="input">
                          <label>Tiempo de Entrada/Salida</label>
                          <input
                            type="number"
                            value={es.tiempo}
                            onChange={(e) =>
                              e.target.value >= 0
                                ? handleEntradaSalidaChange(
                                    index,
                                    "tiempo",
                                    parseInt(e.target.value),
                                    esIndex
                                  )
                                : 0
                            }
                          />
                        </div>
                        <div className="input">
                          <label>Quantum de Entrada/Salida</label>
                          <input
                            type="number"
                            value={es.quantum}
                            onChange={(e) =>
                              e.target.value >= 0
                                ? handleEntradaSalidaChange(
                                    index,
                                    "quantum",
                                    parseInt(e.target.value),
                                    esIndex
                                  )
                                : 0
                            }
                          />
                        </div>
                        {/* <div>
                          <button
                            className="delete"
                            onClick={() => quitarEntradaSalida(index, esIndex)}
                          >
                            Quitar
                          </button>
                        </div> */}
                      </div>
                    ))}
                  </div>
                ))}
              </form>
            </>
          </div>
        )}
        <div className="tableContainer">
          <h3>Registro de Ejecución</h3>
          <div className="table">
            <table>
              <thead>
                <tr>
                  <th>Proceso</th>
                  <th>Intercambio</th>
                  <th>Tiempo de Inicio</th>
                  <th>Tiempo de Finalización</th>
                  {/* <th>Tiempo de Espera</th>
                  <th>Tiempo de vuelta</th> */}
                </tr>
              </thead>
              <tbody>
                {resultados.map((registro, index) => (
                  <React.Fragment key={index}>
                    <tr>
                      <td>{registro.proceso}</td>
                      <td></td>
                      <td>{registro.inicio}</td>
                      <td>{registro.fin}</td>
                      {/* <td>{registro.espera}</td>
                      <td>{registro.retorno}</td> */}
                    </tr>
                    {index !== resultados.length - 1 && (
                      <tr>
                        <td>Intercambio </td>
                        <td colSpan="1">{registro.intercambio}</td>{" "}
                        <td colSpan="2"></td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="tableContainer">
          <h3>Registro de tiempos</h3>
          <div className="table">
            <table>
              <thead>
                <tr>
                  <th>Proceso</th>
                  <th>Tiempo de Espera</th>
                  <th>Tiempo de Vuelta</th>
                </tr>
              </thead>
              <tbody>
                {resultadosPromediosProceso.map((registro, index) => (
                  <tr key={index}>
                    <td>{registro.proceso}</td>
                    <td>{registro.espera}</td>
                    <td>{registro.retorno}</td>
                  </tr>
                ))}

                <tr>
                  <td>Tiempo de espera promedio: </td>
                  <td colSpan="1">
                    {resultadosPromediosProceso.length > 0 &&
                      resultadosPromediosProceso.reduce(
                        (acc, curr) => acc + curr.espera,
                        0
                      ) / resultadosPromediosProceso.length}
                  </td>
                </tr>
                <tr>
                  <td>Tiempo de vuelta promedio: </td>
                  <td></td>
                  <td>
                    {resultadosPromediosProceso.length > 0 &&
                      resultadosPromediosProceso.reduce(
                        (acc, curr) => acc + curr.retorno,
                        0
                      ) / resultadosPromediosProceso.length}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="containerGant">
          <h3>Diagrama de Gantt</h3>
          <div className="gant">
            {resultados.map((registro, index) => (
              <>
                <div key={index} className="barra">
                  <p className="asigno">{registro.quantum}</p>
                  <p>{registro.proceso}</p>
                  <p className="inicio">{registro.inicio}</p>
                  <p className="fin">{registro.fin}</p>
                  {/* Puedes agregar más detalles según sea necesario */}
                </div>
                {index !== resultados.length - 1 && ( // Verifica si no es el último elemento
                  <div key={`${index}-intercambio`} className="barra">
                    <p className="asigno"> {registro.intercambio}</p>
                    <p>I</p>
                    <p className="inicio"></p>
                    <p className="fin"></p>
                  </div>
                )}
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
