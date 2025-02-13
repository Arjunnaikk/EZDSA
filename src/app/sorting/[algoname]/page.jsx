'use client'

import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { 
  ChevronRight, 
  ChevronLeft, 
  Edit3, 
  PlayCircle, 
  PauseCircle,
  RefreshCcw, 
  SkipBack,
  SkipForward,
  Code2,
  User,
  Settings,
  BarChart,
  Zap
} from "lucide-react";
import { useParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";

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
  "Merge Sort": {
    name: "Merge Sort",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    description: "A divide-and-conquer sorting algorithm that divides the array into smaller subarrays",
    implementation: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);
  
  return merge(mergeSort(left), mergeSort(right));
}`,
    async *sort(arr) {
      async function* mergeSortHelper(arr, start) {
        if (arr.length <= 1) return arr;
        
        const mid = Math.floor(arr.length / 2);
        const left = arr.slice(0, mid);
        const right = arr.slice(mid);
        
        yield {
          array: [...arr],
          comparing: [start, start + arr.length - 1],
          swapped: null,
          explanation: `Dividing array from index ${start} to ${start + arr.length - 1}`
        };
        
        const sortedLeft = yield* mergeSortHelper(left, start);
        const sortedRight = yield* mergeSortHelper(right, start + mid);
        
        const merged = [];
        let i = 0, j = 0;
        
        while (i < sortedLeft.length && j < sortedRight.length) {
          yield {
            array: [...arr],
            comparing: [start + i, start + mid + j],
            swapped: null,
            explanation: `Comparing elements ${sortedLeft[i]} and ${sortedRight[j]}`
          };
          
          if (sortedLeft[i] <= sortedRight[j]) {
            merged.push(sortedLeft[i++]);
          } else {
            merged.push(sortedRight[j++]);
          }
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        merged.push(...sortedLeft.slice(i));
        merged.push(...sortedRight.slice(j));
        
        for (let k = 0; k < merged.length; k++) {
          arr[k] = merged[k];
          yield {
            array: [...arr],
            comparing: null,
            swapped: [start + k],
            explanation: `Placing ${merged[k]} at position ${start + k}`
          };
        }
        
        return merged;
      }
      
      const result = yield* mergeSortHelper([...arr], 0);
      return result;
    }
  }
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
  const [isPaused, setIsPaused] = useState(false);
  const [isControlsOpen, setIsControlsOpen] = useState(true);
  const [isCodeOpen, setIsCodeOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [sortingHistory, setSortingHistory] = useState([]);
  const [showRuntimeCode, setShowRuntimeCode] = useState(true);

  const svgRef = useRef(null);
  const params = useParams();

  const handleEditArray = () => {
    setIsEditing(true);
    setUserInput(array.join(", "));
  };

  const handleUserInputSubmit = () => {
    const numbers = userInput.split(",")
      .map(n => parseInt(n.trim()))
      .filter(n => !isNaN(n));
    
    if (numbers.length > 0) {
      setArray(numbers);
      setArraySize(numbers.length);
      updateVisualization(numbers, [], []);
      setIsEditing(false);
    }
  };

  const generateSpecialArray = (type) => {
    let newArray = [];
    switch (type) {
      case "sorted-asc":
        newArray = Array.from({ length: arraySize }, (_, i) => i + 1);
        break;
      case "sorted-desc":
        newArray = Array.from({ length: arraySize }, (_, i) => arraySize - i);
        break;
      case "duplicates":
        newArray = Array.from({ length: arraySize }, () => 
          Math.floor(Math.random() * (arraySize / 2)) + 1
        );
        break;
      case "nearly-sorted":
        newArray = Array.from({ length: arraySize }, (_, i) => i + 1);
        for (let i = 0; i < arraySize / 10; i++) {
          const idx1 = Math.floor(Math.random() * arraySize);
          const idx2 = Math.floor(Math.random() * arraySize);
          [newArray[idx1], newArray[idx2]] = [newArray[idx2], newArray[idx1]];
        }
        break;
      default:
        newArray = Array.from({ length: arraySize }, () => 
          Math.floor(Math.random() * 100) + 1
        );
    }
    setArray(newArray);
    setUserInput(newArray.join(", "));
    updateVisualization(newArray, [], []);
  };

  const generateArray = () => generateSpecialArray("random");

  const updateVisualization = (data, comparing = [], swapped = []) => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const padding = 40;
    
    const actualWidth = width * 0.4;
    const actualHeight = height * 0.3;
    
    const xScale = d3.scaleBand()
      .domain(data.map((_, i) => i.toString()))
      .range([padding, actualWidth - padding])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, Math.max(...data)])
      .range([actualHeight - padding, padding]);

    const centerX = (width - actualWidth) / 2;
    const centerY = (height - actualHeight) / 2;
    
    const mainGroup = svg.append("g")
      .attr("transform", `translate(${centerX}, ${centerY})`);

    const bars = mainGroup.selectAll("g")
      .data(data)
      .enter()
      .append("g")
      .attr("transform", (_, i) => `translate(${xScale(i.toString())},0)`);

    bars.append("rect")
      .attr("x", 0)
      .attr("y", d => yScale(d))
      .attr("width", xScale.bandwidth())
      .attr("height", d => actualHeight - padding - yScale(d))
      .attr("rx", 4)
      .attr("fill", (_, i) => {
        if (swapped && swapped.includes(i)) return "#4ade80";
        if (comparing && comparing.includes(i)) return "#facc15";
        return "#818cf8";
      })
      .attr("opacity", (_, i) => {
        if (comparing && comparing.includes(i)) return "1";
        if (swapped && swapped.includes(i)) return "1";
        return "0.6";
      });

    bars.append("text")
      .attr("x", xScale.bandwidth() / 2)
      .attr("y", d => yScale(d) - 5)
      .attr("text-anchor", "middle")
      .attr("fill", "#1f2937")
      .attr("font-size", "12px")
      .text(d => d);
  };

  const handleStepControl = (direction) => {
    if (direction === "next" && currentStep < sortingHistory.length - 1) {
      setCurrentStep(prev => prev + 1);
      const step = sortingHistory[currentStep + 1];
      updateVisualization(step.array, step.comparing, step.swapped);
      setExplanation(step.explanation);
    } else if (direction === "prev" && currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      const step = sortingHistory[currentStep - 1];
      updateVisualization(step.array, step.comparing, step.swapped);
      setExplanation(step.explanation);
    }
  };

  const restartSorting = () => {
    setCurrentStep(0);
    const initialStep = sortingHistory[0];
    if (initialStep) {
      updateVisualization(initialStep.array, initialStep.comparing, initialStep.swapped);
      setExplanation(initialStep.explanation);
    }
  };

  const startSorting = async () => {
    if (isSorting) return;
    setIsSorting(true);
    setSortingHistory([]);
    setCurrentStep(0);

    const algorithm = algorithms[currentAlgo];
    const sorter = algorithm.sort([...array]);
    const history = [];
    
    try {
      while (true) {
        const result = await sorter.next();
        if (result.done) break;
        
        history.push(result.value);
        if (!isPaused) {
          setArray(result.value.array);
          setExplanation(result.value.explanation);
          updateVisualization(
            result.value.array,
            result.value.comparing,
            result.value.swapped
          );
          await new Promise(resolve => setTimeout(resolve, 1000 / speed));
        }
      }
      setSortingHistory(history);
    } finally {
      setIsSorting(false);
      updateVisualization(array, [], []);
    }
  };

  useEffect(() => {
    generateArray();
  }, [arraySize]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="h-16 bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 shadow-md">
        <div className="flex items-center gap-4">
        <span className="text-gray-900 font-semibold text-xl">Sorting Visualizer</span>
          <Select value={currentAlgo} onValueChange={setCurrentAlgo}>
            <SelectTrigger className="w-48 bg-white border-2 hover:border-indigo-400 transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(algorithms).map(algo => (
                <SelectItem key={algo} value={algo}>{algo}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" className="flex items-center gap-2 border-2 hover:bg-gray-100">
          <User className="h-5 w-5 text-gray-700" />
          <span className="font-medium">Login</span>
        </Button>
      </nav>

      <div className="flex h-[calc(100vh-4rem)] mt-16">
        {/* Enhanced Left Controls Panel */}
        <div className={`bg-gradient-to-b from-indigo-50 to-white border-r border-gray-200 transition-all duration-300 shadow-lg ${isControlsOpen ? 'w-80' : 'w-14'}`}>
          <button
            onClick={() => setIsControlsOpen(!isControlsOpen)}
            className="w-full h-12 flex items-center justify-center text-gray-700 hover:bg-indigo-100 transition-colors"
          >
            {isControlsOpen ? 
              <ChevronLeft className="h-6 w-6" /> : 
              <ChevronRight className="h-6 w-6" />
            }
          </button>
          
          {isControlsOpen && (
            <div className="p-6 space-y-8">
              {/* Section Headers */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-indigo-900 font-semibold">
                  <BarChart className="h-5 w-5" />
                  <span>Array Generation</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    onClick={() => generateSpecialArray("random")}
                    variant="outline"
                    className="w-full bg-white text-indigo-700 border-2 hover:bg-indigo-50 hover:border-indigo-400 transition-all font-medium"
                  >
                    Random Array
                  </Button>
                  <Button
                    onClick={() => generateSpecialArray("sorted-asc")}
                    variant="outline"
                    className="w-full bg-white text-indigo-700 border-2 hover:bg-indigo-50 hover:border-indigo-400 transition-all font-medium"
                  >
                    Sorted (Ascending)
                  </Button>
                  <Button
                    onClick={() => generateSpecialArray("sorted-desc")}
                    variant="outline"
                    className="w-full bg-white text-indigo-700 border-2 hover:bg-indigo-50 hover:border-indigo-400 transition-all font-medium"
                  >
                    Sorted (Descending)
                  </Button>
                  <Button
                    onClick={() => generateSpecialArray("duplicates")}
                    variant="outline"
                    className="w-full bg-white text-indigo-700 border-2 hover:bg-indigo-50 hover:border-indigo-400 transition-all font-medium"
                  >
                    With Duplicates
                  </Button>
                  <Button
                    onClick={() => generateSpecialArray("nearly-sorted")}
                    variant="outline"
                    className="w-full bg-white text-indigo-700 border-2 hover:bg-indigo-50 hover:border-indigo-400 transition-all font-medium"
                  >
                    Nearly Sorted
                  </Button>
                </div>
              </div>

              <Separator className="bg-indigo-100" />

              {/* Settings Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-indigo-900 font-semibold">
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-indigo-900">Array Size</label>
                    <Select value={arraySize.toString()} onValueChange={(v) => setArraySize(Number(v))}>
                      <SelectTrigger className="w-full bg-white border-2 hover:border-indigo-400 transition-colors">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[5,10,15,20,25,30,35,40,45,50].map(size => (
                          <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-indigo-900">Animation Speed</label>
                    <Select value={speed.toString()} onValueChange={(v) => setSpeed(Number(v))}>
                      <SelectTrigger className="w-full bg-white border-2 hover:border-indigo-400 transition-colors">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[0.5, 1, 1.5, 2].map(spd => (
                          <SelectItem key={spd} value={spd.toString()}>{spd}x</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator className="bg-indigo-100" />

              {/* Start Button Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-indigo-900 font-semibold">
                  <Zap className="h-5 w-5" />
                  <span>Control</span>
                </div>
                <Button
                  onClick={startSorting}
                  disabled={isSorting}
                  className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-lg rounded-lg shadow-md hover:shadow-lg transition-all disabled:bg-indigo-300"
                >
                  <PlayCircle className="h-6 w-6 mr-2" />
                  Start Sorting
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Main Visualization Area */}
        <div className="flex-1 relative bg-white">
          <div className="absolute inset-0">
            <svg ref={svgRef} className="w-full h-full" />
          </div>

          {/* Array Editor */}
          <Card className="absolute top-4 left-1/2 transform -translate-x-1/2 shadow-lg">
            <CardContent className="flex items-center gap-3 p-4">
              {isEditing ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Enter numbers separated by commas"
                    className="w-80 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUserInputSubmit();
                      }
                    }}
                  />
                  <Button
                    onClick={handleUserInputSubmit}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Apply
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-600 font-mono bg-gray-50 px-4 py-2 rounded-lg">
                    [{array.join(", ")}]
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleEditArray}
                    className="h-9 w-9 border-2 hover:border-indigo-500 hover:bg-gray-100"
                  >
                    <Edit3 className="h-4 w-4 text-gray-700" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Explanation Card */}
          {explanation && (
            <Card className="absolute bottom-20 left-1/2 transform -translate-x-1/2 max-w-lg shadow-lg">
              <CardContent className="p-4">
                <p className="text-sm text-gray-700">{explanation}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Code Panel */}
        <div className={`bg-white border-l border-gray-200 transition-all duration-300 shadow-md ${isCodeOpen ? 'w-96' : 'w-14'}`}>
          <button
            onClick={() => setIsCodeOpen(!isCodeOpen)}
            className="w-full h-12 flex items-center justify-center text-gray-700 hover:bg-gray-100"
          >
            {isCodeOpen ? 
              <ChevronRight className="h-6 w-6" /> : 
              <ChevronLeft className="h-6 w-6" />
            }
          </button>
          
          {isCodeOpen && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {algorithms[currentAlgo].name}
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRuntimeCode(!showRuntimeCode)}
                  className="border-2 hover:border-indigo-500 hover:bg-gray-100"
                >
                  <Code2 className="h-4 w-4 text-gray-700 mr-2" />
                  {showRuntimeCode ? "Hide Code" : "Show Code"}
                </Button>
              </div>
              
              {showRuntimeCode && (
                <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                  <pre className="text-sm overflow-x-auto">
                    <code className="text-gray-700">
                      {algorithms[currentAlgo].implementation}
                    </code>
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Bottom Control Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-indigo-50 to-white border-t border-gray-200 flex items-center justify-center gap-6 px-8 shadow-lg">
        <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-lg shadow-md">
          <Button
            variant="outline"
            size="icon"
            onClick={restartSorting}
            disabled={!sortingHistory.length}
            className="h-10 w-10 border-2 hover:border-indigo-400 hover:bg-indigo-50 disabled:opacity-50 transition-all"
          >
            <RefreshCcw className="h-5 w-5 text-indigo-700" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleStepControl("prev")}
            disabled={currentStep === 0}
            className="h-10 w-10 border-2 hover:border-indigo-400 hover:bg-indigo-50 disabled:opacity-50 transition-all"
          >
            <SkipBack className="h-5 w-5 text-indigo-700" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsPaused(!isPaused)}
            disabled={!isSorting}
            className="h-12 w-12 border-2 hover:border-indigo-400 hover:bg-indigo-50 disabled:opacity-50 transition-all"
          >
            {isPaused ? 
              <PlayCircle className="h-7 w-7 text-indigo-700" /> : 
              <PauseCircle className="h-7 w-7 text-indigo-700" />
            }
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => handleStepControl("next")}
            disabled={currentStep === sortingHistory.length - 1}
            className="h-10 w-10 border-2 hover:border-indigo-400 hover:bg-indigo-50 disabled:opacity-50 transition-all"
          >
            <SkipForward className="h-5 w-5 text-indigo-700" />
          </Button>
        </div>

        <div className="w-96 bg-white px-6 py-3 rounded-lg shadow-md">
          <Slider
            value={[currentStep]}
            max={sortingHistory.length - 1}
            step={1}
            onValueChange={([value]) => {
              setCurrentStep(value);
              const step = sortingHistory[value];
              if (step) {
                updateVisualization(step.array, step.comparing, step.swapped);
                setExplanation(step.explanation);
              }
            }}
            disabled={!sortingHistory.length}
            className="cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default SortingVisualizer;