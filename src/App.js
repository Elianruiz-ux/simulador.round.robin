import React, { useState } from "react";
import "./App.css";
import { CiPlay1, CiTrash } from "react-icons/ci";
import { IoIosAdd } from "react-icons/io";

function App() {
  const [processes, setProcesses] = useState([]);
  const [quantum, setQuantum] = useState("1");
  const [executionLog, setExecutionLog] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const handleQuantumChange = (event) => {
    const value = parseFloat(event.target.value);
    setQuantum(value);
  };

  const handleProcessChange = (event, index) => {
    const { value } = event.target;
    const updatedProcesses = [...processes];
    updatedProcesses[index] = {
      ...updatedProcesses[index],
      burstTime: parseInt(value),
      remainingTime: parseInt(value),
    };
    setProcesses(updatedProcesses);
  };

  const addProcess = () => {
    setProcesses((prevProcesses) => [
      ...prevProcesses,
      {
        name: `Proceso ${prevProcesses.length + 1}`,
        burstTime: 0,
        remainingTime: 0,
      },
    ]);
  };

  const runRoundRobin = () => {
    setIsRunning(true); // Indicar que se está ejecutando el algoritmo
    let processesCopy = [...processes];
    let currentTime = 0;
    let totalWaitingTime = 0;
    let totalTurnaroundTime = 0;
    let log = [];

    const interval = setInterval(() => {
      if (processesCopy.length === 0) {
        // Detener el intervalo si no hay más procesos
        clearInterval(interval);
        setIsRunning(false); // Indicar que se ha detenido la ejecución
        return;
      }

      const process = processesCopy[0]; // Obtener el próximo proceso a ejecutar
      if (process.remainingTime > 0) {
        const timeSlice = Math.min(quantum, process.remainingTime);
        process.remainingTime -= timeSlice;
        currentTime += timeSlice;
        log.push({
          process: process.name,
          startTime: currentTime - timeSlice,
          endTime: currentTime,
          waitingTime: Math.max(currentTime - timeSlice - process.burstTime, 0),
          turnaroundTime: currentTime - process.burstTime,
        });

        if (process.remainingTime === 0) {
          totalWaitingTime += Math.max(
            currentTime - process.burstTime - timeSlice,
            0
          );
          totalTurnaroundTime += currentTime - process.burstTime;
          processesCopy.shift(); // Eliminar el proceso ejecutado de la lista
        }
      }

      setExecutionLog(log.slice()); // Actualizar la tabla con el nuevo registro
    }, 1000); // Intervalo de 1 segundo
  };

  const borrar = () => {
    setExecutionLog([]);
    setProcesses([]);
    setQuantum("1");
    setIsRunning(false);
  };

  return (
    <div className="main">
      <h2 className="header">Simulador Round Robin</h2>
      <div className="mainContainer">
        <div className="actions">
          <div className="input">
            <label>Quantum</label>
            <input
              type="number"
              disabled={isRunning === true}
              value={quantum}
              onChange={handleQuantumChange}
            />
          </div>
          <div className="buttons">
            <button
              className="round"
              onClick={runRoundRobin}
              disabled={isRunning === true}
            >
              <CiPlay1 /> <span>Ejecutar Round Robin</span>
            </button>
            <button
              className="add"
              onClick={addProcess}
              disabled={isRunning === true}
            >
              <IoIosAdd /> <span>Agregar Proceso</span>
            </button>
            <button className="delete" onClick={borrar}>
              <CiTrash />
              <span>Borrar</span>
            </button>
          </div>
        </div>
        {processes.length > 0 && (
          <div className="form">
            <>
              <>
                <h3 className="headerForm">Introducir Procesos</h3>
              </>
              <>
                <form>
                  {processes.map((process, index) => (
                    <div className="process" key={index}>
                      <p>Proceso {index + 1} </p>

                      <div className="input">
                        <label>Tiempo de Ráfaga de CPU</label>
                        <input
                          disabled={isRunning === true}
                          type="number"
                          value={process.burstTime || ""}
                          onChange={(e) => handleProcessChange(e, index)}
                        />
                      </div>
                      <div className="input">
                        <label>Entradas/Salidas</label>
                        <input
                          disabled={isRunning === true}
                          type="number"
                          value={process.burstTime || ""}
                          onChange={(e) => handleProcessChange(e, index)}
                        />
                      </div>
                    </div>
                  ))}
                </form>
              </>
            </>
          </div>
        )}
        <div>
          <h3>Registro de Ejecución</h3>
          <table>
            <thead>
              <tr>
                <th>Proceso</th>
                <th>Tiempo de Inicio</th>
                <th>Tiempo de Finalización</th>
                <th>Tiempo de Espera</th>
                <th>Tiempo de Retorno</th>
              </tr>
            </thead>
            <tbody>
              {executionLog.map((log, index) => (
                <tr key={index}>
                  <td>{log.process}</td>
                  <td>{log.startTime}</td>
                  <td>{log.endTime}</td>
                  <td>{log.waitingTime}</td>
                  <td>{log.turnaroundTime}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="3"></td>
                <td>Tiempo de Espera Promedio:</td>
                <td>
                  {executionLog.length > 0 &&
                    executionLog.reduce(
                      (acc, curr) => acc + curr.waitingTime,
                      0
                    ) / executionLog.length}
                </td>
              </tr>
              <tr>
                <td colSpan="3"></td>
                <td>Tiempo de Retorno Promedio:</td>
                <td>
                  {executionLog.length > 0 &&
                    executionLog.reduce(
                      (acc, curr) => acc + curr.turnaroundTime,
                      0
                    ) / executionLog.length}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>gantt</div>
      </div>
    </div>
  );
}

export default App;
