import React, { useState } from "react";
import "./App.css";

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
      let hasRemainingProcesses = false; // Variable para controlar si hay procesos restantes

      for (let i = 0; i < processesCopy.length; i++) {
        const process = processesCopy[i];
        if (process.remainingTime > 0) {
          hasRemainingProcesses = true; // Hay procesos restantes
          const timeSlice = Math.min(quantum, process.remainingTime);
          process.remainingTime -= timeSlice;
          currentTime += timeSlice;
          log.push({
            process: process.name,
            startTime: currentTime - timeSlice,
            endTime: currentTime,
            waitingTime: Math.max(
              currentTime - timeSlice - process.burstTime,
              0
            ),
            turnaroundTime: currentTime - process.burstTime,
          });

          if (process.remainingTime === 0) {
            totalWaitingTime += Math.max(
              currentTime - process.burstTime - timeSlice,
              0
            );
            totalTurnaroundTime += currentTime - process.burstTime;
            processesCopy.splice(i, 1);
            i--;
          }
        }
      }

      setExecutionLog(log);

      if (!hasRemainingProcesses) {
        clearInterval(interval); // Detener el intervalo si no hay más procesos restantes
        setIsRunning(false); // Indicar que se ha detenido la ejecución
      }
    }, 1000); // Intervalo de 1 segundo
  };

  const borrar = () => {
    setExecutionLog([]);
    setProcesses([]);
    setQuantum("1");
    setIsRunning(false);
  };

  return (
    <div>
      <h2>Simulador Round Robin</h2>
      <label>
        Quantum:
        <input
          type="number"
          disabled={isRunning === true}
          value={quantum}
          onChange={handleQuantumChange}
        />
      </label>
      <br />
      <h3>Introducir Procesos</h3>
      <form>
        {processes.map((process, index) => (
          <div key={index}>
            <label>
              Proceso {index + 1} Tiempo de Ráfaga:
              <input
                disabled={isRunning === true}
                type="number"
                value={process.burstTime || ""}
                onChange={(e) => handleProcessChange(e, index)}
              />
            </label>
          </div>
        ))}
      </form>
      <br />
      <button onClick={addProcess} disabled={isRunning === true}>
        Agregar Proceso
      </button>
      <button onClick={runRoundRobin} disabled={isRunning === true}>
        Ejecutar Round Robin
      </button>
      <button onClick={borrar}>Borrar</button>
      <br />
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
                executionLog.reduce((acc, curr) => acc + curr.waitingTime, 0) /
                  executionLog.length}
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
  );
}

export default App;
