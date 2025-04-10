function map(array, callback) {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    result.push(callback(array[i], i, array));
  }
  return result;
}
  
function reduce(array, callback, initialValue) {
  let accumulator = initialValue !== undefined ? initialValue : array[0];
  let startIndex = initialValue !== undefined ? 0 : 1;

  for (let i = startIndex; i < array.length; i++) {
    accumulator = callback(accumulator, array[i], i, array);
  }
  return accumulator;
}
  
function pipe(...functions) {
  return function(initialValue) {
    return reduce(functions, (value, func) => func(value), initialValue);
  };
}
  
function getMapFunction(op, n) {
  switch (op) {
    case 'square': return x => x * x;
    case 'cube': return x => x * x * x;
    case 'add': return x => x + Number(n);
    case 'subtract': return x => x - Number(n);
    case 'multiply': return x => x * Number(n);
    case 'divide': return x => x / Number(n);
    default: return x => x;
  }
}
  
function getReduceFunction(op) {
  switch (op) {
    case 'sum': return (acc, x) => acc + x;
    case 'multiply': return (acc, x) => acc * x;
    default: return (acc, x) => acc;
  }
}
  
function parseInput() {
  const input = document.getElementById("numberInput").value;
  return input.split(",").map(x => Number(x.trim())).filter(x => !isNaN(x));
}
  
function handleMap() {
  const data = parseInput();
  const op = document.getElementById("mapOperation").value;
  const val = document.getElementById("mapValue").value;
  const result = map(data, getMapFunction(op, val));
  document.getElementById("mapResult").textContent = "Rezultat map: " + result.join(", ");
}
  
function handleReduce() {
  const data = parseInput();
  const op = document.getElementById("reduceOperation").value;
  const result = reduce(data, getReduceFunction(op));
  document.getElementById("reduceResult").textContent = "Rezultat reduce: " + result;
}
  
function addPipeStep() {
  const stepDiv = document.createElement("div");
  stepDiv.className = "pipe-step";

  const stepType = document.createElement("select");
  stepType.innerHTML = `
    <option value="map">Map</option>
    <option value="reduce">Reduce</option>
  `;

  const operationSelect = document.createElement("select");
  const numberInput = document.createElement("input");
  numberInput.type = "number";
  numberInput.placeholder = "n (ako treba)";

  stepType.onchange = () => {
    if (stepType.value === "map") {
      operationSelect.innerHTML = `
        <option value="square">x²</option>
        <option value="cube">x³</option>
        <option value="add">x + n</option>
        <option value="subtract">x - n</option>
        <option value="multiply">x * n</option>
        <option value="divide">x / n</option>
      `;
      numberInput.style.display = "inline-block";
    } else {
      operationSelect.innerHTML = `
        <option value="sum">Zbroji sve</option>
        <option value="multiply">Pomnoži sve</option>
      `;
      numberInput.style.display = "none";
    }
  };
  stepType.onchange();

  stepDiv.appendChild(stepType);
  stepDiv.appendChild(operationSelect);
  stepDiv.appendChild(numberInput);

  document.getElementById("pipeSteps").appendChild(stepDiv);
}
  
function runPipe() {
  const data = parseInput();
  const steps = document.querySelectorAll(".pipe-step");
  const functions = [];

  steps.forEach(step => {
    const type = step.querySelector("select:nth-child(1)").value;
    const op = step.querySelector("select:nth-child(2)").value;
    const val = step.querySelector("input").value;

    if (type === "map") {
      functions.push(arr => {
        if (!Array.isArray(arr)) arr = [arr];
        return map(arr, getMapFunction(op, val));
      });
    } else if (type === "reduce") {
      functions.push(arr => {
        if (!Array.isArray(arr)) arr = [arr];
        return reduce(arr, getReduceFunction(op));
      });
    }
  });

  let result = data;
  functions.forEach(fn => {
    result = fn(result);
  });

  document.getElementById("pipeResult").textContent = "Rezultat pipe: " + (Array.isArray(result) ? result.join(", ") : result);
}
  
  