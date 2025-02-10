import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { Edit3 } from "lucide-react";

const algorithms = {
  "Bubble Sort": {
    name: "Bubble Sort",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    description: "A simple comparison-based sorting algorithm",
    implementation: `function bubbleSort(arr) {
  let n = arr.length;
  let swapped;
  do {
    swapped = false;
    for(let i = 0; i < n-1; i++) {
      if(arr[i] > arr[i+1]) {
        [arr[i], arr[i+1]] = [arr[i+1], arr[i]];
        swapped = true;
      }
    }
  } while(swapped);
  return arr;
}`,
    async *sort(arr) {
      const n = arr.length;
      let swapped;
      do {
        swapped = false;
        for(let i = 0; i < n-1; i++) {
          yield { 
            array: [...arr], 
            comparing: [i, i+1],
            swapped: null,
            explanation: `Comparing elements at index ${i} and ${i+1}`
          };
          
          if(arr[i] > arr[i+1]) {
            [arr[i], arr[i+1]] = [arr[i+1], arr[i]];
            swapped = true;
            
            yield { 
              array: [...arr], 
              comparing: null,
              swapped: [i, i+1],
              explanation: `Swapped elements ${arr[i]} and ${arr[i+1]}`
            };
          }
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      } while(swapped);
      return arr;
    }
  },
  "Quick Sort": {
    name: "Quick Sort",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(log n)",
    description: "A divide-and-conquer sorting algorithm",
    implementation: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}`,
    async *sort(arr) {
      async function* quickSortHelper(arr, low, high) {
        if (low < high) {
          yield {
            array: [...arr],
            comparing: [low, high],
            swapped: null,
            explanation: `Partitioning array from index ${low} to ${high}`
          };

          const pivot = arr[high];
          let i = low - 1;

          for (let j = low; j < high; j++) {
            yield {
              array: [...arr],
              comparing: [j, high],
              swapped: null,
              explanation: `Comparing element ${arr[j]} with pivot ${pivot}`
            };

            if (arr[j] < pivot) {
              i++;
              [arr[i], arr[j]] = [arr[j], arr[i]];
              yield {
                array: [...arr],
                comparing: null,
                swapped: [i, j],
                explanation: `Swapped elements ${arr[j]} and ${arr[i]}`
              };
              await new Promise(resolve => setTimeout(resolve, 50));
            }
          }

          [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
          yield {
            array: [...arr],
            comparing: null,
            swapped: [i + 1, high],
            explanation: `Placed pivot ${pivot} at its correct position`
          };

          const pi = i + 1;
          yield* quickSortHelper(arr, low, pi - 1);
          yield* quickSortHelper(arr, pi + 1, high);
        }
      }
      yield* quickSortHelper(arr, 0, arr.length - 1);
      return arr;
    }
  },

  
};

const SortingVisualizer = () => {
  const [array, setArray] = useState([]);
  const [arraySize, setArraySize] = useState(10);
  const [speed, setSpeed] = useState(1);
  const [currentAlgo, setCurrentAlgo] = useState("Bubble Sort");
  const [explanation, setExplanation] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [isSorting, setIsSorting] = useState(false);
  
  const svgRef = useRef(null);

  const generateArray = () => {
    const newArray = Array.from({ length: arraySize }, () => 
      Math.floor(Math.random() * 100) + 1
    );
    setArray(newArray);
    setExplanation("");
    updateVisualization(newArray, [], []);
  };

  const handleUserInput = (input) => {
    const numbers = input.split(",").map(n => parseInt(n.trim())).filter(n => !isNaN(n));
    if (numbers.length > 0) {
      setArray(numbers);
      setArraySize(numbers.length);
      updateVisualization(numbers, [], []);
    }
  };

  const updateVisualization = (data, comparing = [], swapped = []) => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const padding = 40;
    
    const xScale = d3.scaleBand()
      .domain(data.map((_, i) => i.toString()))
      .range([padding, width - padding])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, Math.max(...data)])
      .range([height - padding, padding]);

    const bars = svg.selectAll("g")
      .data(data)
      .enter()
      .append("g")
      .attr("transform", (_, i) => `translate(${xScale(i.toString())},0)`);

    bars.append("rect")
      .attr("x", 0)
      .attr("y", d => yScale(d))
      .attr("width", xScale.bandwidth())
      .attr("height", d => height - padding - yScale(d))
      .attr("rx", 2)
      .attr("fill", (_, i) => {
        if (swapped && swapped.includes(i)) return "#22c55e";
        if (comparing && comparing.includes(i)) return "#eab308";
        return "#a855f7";
      })
      .attr("opacity", (_, i) => {
        if (comparing && comparing.includes(i)) return "1";
        if (swapped && swapped.includes(i)) return "1";
        return "0.4";
      });

    bars.append("text")
      .attr("x", xScale.bandwidth() / 2)
      .attr("y", d => yScale(d) - 5)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", "12px")
      .text(d => d);
  };

  const startSorting = async () => {
    if (isSorting) return;
    setIsSorting(true);

    const algorithm = algorithms[currentAlgo];
    const sorter = algorithm.sort([...array]);
    
    try {
      while (true) {
        const result = await sorter.next();
        if (result.done) break;
        
        const { array: newArray, comparing, swapped, explanation: newExplanation } = result.value;
        setArray(newArray);
        setExplanation(newExplanation);
        updateVisualization(newArray, comparing, swapped);
        
        await new Promise(resolve => setTimeout(resolve, 1000 / speed));
      }
    } finally {
      setIsSorting(false);
      updateVisualization(array, [], []);
    }
  };
  console.log(algorithms);

  useEffect(() => {
    generateArray();
  }, [arraySize]);

  return (
    <div className="min-h-screen bg-black">
      <div className="p-4">
        <div className="mb-8 bg-zinc-900 p-4 rounded border border-purple-500">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 flex items-center gap-2">
              {isEditing ? (
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Enter numbers separated by commas"
                  className="w-full px-3 py-2 bg-black border border-purple-500 rounded text-white"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUserInput(userInput);
                      setIsEditing(false);
                    }
                  }}
                />
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">Current Array:</span>
                  <span className="text-purple-400">[{array.join(", ")}]</span>
                </div>
              )}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-2 text-purple-400"
              >
                <Edit3 size={18} />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-400">Size:</label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={arraySize}
                  onChange={(e) => setArraySize(Number(e.target.value))}
                  className="w-24"
                  disabled={isEditing}
                />
                <span className="text-sm text-gray-400">{arraySize}</span>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-400">Speed:</label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-24"
                />
                <span className="text-sm text-gray-400">{speed}x</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={generateArray}
                className="px-4 py-2 bg-purple-500 bg-opacity-20 text-purple-400 rounded border border-purple-500"
                disabled={isSorting}
              >
                Generate New Array
              </button>
              <button
                onClick={startSorting}
                className="px-4 py-2 bg-purple-500 bg-opacity-20 text-purple-400 rounded border border-purple-500"
                disabled={isSorting}
              >
                Sort
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-zinc-900 p-6 rounded border border-purple-500 h-[500px] relative">
            <svg
              ref={svgRef}
              className="w-full h-full"
            />
            
          </div>

          <div className="bg-zinc-900 p-6 rounded border border-purple-500 ">
            <div className="flex flex-col mb-4">
              <div className="flex gap-2">
              <h3 className="text-lg font-semibold text-purple-400">
                {algorithms[currentAlgo].name}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>Time: {algorithms[currentAlgo].timeComplexity}</span>
                <span>Space: {algorithms[currentAlgo].spaceComplexity}</span>
              </div>
              </div>
              {explanation && (
              <div className="p-4 bg-black bg-opacity-50 mt-4 rounded border border-purple-500">
                <p className="text-sm text-purple-400">{explanation}</p>
              </div>
            )}
            </div>
            <pre className="bg-black bg-opacity-30 p-4 rounded text-sm overflow-x-auto">
              <code className="text-gray-300">
                {algorithms[currentAlgo].implementation}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortingVisualizer;