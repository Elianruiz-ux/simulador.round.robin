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
    nuevosProcesos[index].entradasSalidas.push({ tiempo: 0, quantum: quantum });
    setProcesos(nuevosProcesos);
  };

  const handleSimulacion = () => {
    let tiempoActual = 0;
    let tiemposRestantes = procesos.map((proceso) => parseInt(proceso.quantum));
    let hayProcesosPendientes = true;
    let resultadosSimulacion = [];

    while (hayProcesosPendientes) {
      hayProcesosPendientes = false;
      for (let i = 0; i < procesos.length; i++) {
        if (tiemposRestantes[i] > 0) {
          hayProcesosPendientes = true;
          resultadosSimulacion.push({
            proceso: procesos[i].nombre,
            inicio: tiempoActual,
            fin: tiempoActual + quantum,
            espera: 0, // Aquí debería calcularse el tiempo de espera
            retorno: 0, // Aquí debería calcularse el tiempo de retorno
            intercambio: intercambio, // Aquí almacenamos el tiempo de intercambio
            quantum: quantum, // Aquí almacenamos el tiempo de intercambio
          });
          tiempoActual += quantum;
          tiemposRestantes[i] -= quantum;
          if (tiemposRestantes[i] < 0) tiemposRestantes[i] = 0;

          tiempoActual += intercambio;
        }
      }
    }

    setTiempo(tiempoActual);
    setResultados(resultadosSimulacion);
  };

  const borrar = () => {
    setResultados([]);
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
            <label>Quantum {`(Q); (1Q es = 100ms)`}</label>
            <input
              type="number"
              value={quantum}
              onChange={(e) =>
                setQuantum(e.target.value > 0 ? parseInt(e.target.value) : 0)
              }
            />
          </div>
          <div className="input">
            <label>Intercambio {`(I); (1I es = 100ms)`}</label>
            <input
              type="number"
              value={intercambio}
              onChange={(e) =>
                setIntercambio(
                  e.target.value > 0 ? parseInt(e.target.value) : 0
                )
              }
            />
          </div>
          <div className="buttons">
            <button className="round" onClick={handleSimulacion}>
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
                          e.target.value > 0
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
                          e.target.value > 0
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
                              e.target.value > 0
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
                        {/* <div className="input">
                          <label>Quantum de Entrada/Salida</label>
                          <input
                            type="number"
                            value={es.quantum}
                            onChange={(e) =>
                              e.target.value > 0
                                ? handleEntradaSalidaChange(
                                    index,
                                    "quantum",
                                    parseInt(e.target.value),
                                    esIndex
                                  )
                                : 0
                            }
                          />
                        </div> */}
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
                  <th>Tiempo de Espera</th>
                  <th>Tiempo de Retorno</th>
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
                      <td>{registro.espera}</td>
                      <td>{registro.retorno}</td>
                    </tr>
                    {index !== resultados.length - 1 && (
                      <tr>
                        <td>Intercambio </td>
                        <td colSpan="1">{registro.intercambio}</td>{" "}
                        <td colSpan="4"></td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* <div className="tiempos">
        <div>
          <p>Tiempo de espera promedio:</p>
          <p className="promedio">
            {executionLog.length > 0 &&
              executionLog.reduce((acc, curr) => acc + curr.waitingTime, 0) /
                executionLog.length}
          </p>
        </div>
        <div>
          <p>Tiempo de retorno promedio:</p>
          <p className="promedio">
            {executionLog.length > 0 &&
              executionLog.reduce((acc, curr) => acc + curr.turnaroundTime, 0) /
                executionLog.length}
          </p>
        </div>
      </div> */}
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
