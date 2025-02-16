'use client'

import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import {
  ArrowDown,
  ArrowUp,
  BarChart,
  ChevronRight,
  ChevronLeft,
  Code,
  Code2,
  Edit3,
  PlayCircle,
  PauseCircle,
  RefreshCcw,
  Ruler,
  Settings,
  SkipBack,
  SkipForward,
  Timer,
  User,
  Zap,

} from "lucide-react";
import { Tooltip } from '@/components/ui/tooltip';
import { TooltipTrigger } from "@/components/ui/tooltip";
import { TooltipContent } from "@radix-ui/react-tooltip";
import { useParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import SettingSelect from "@/components/SettingSelect";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import DraggableCard from "@/components/DraggableCard";
import CodePanel from "@/components/CodePanel";

const algorithms = {
  "Bubble Sort": {
    name: "Bubble Sort",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    description: "A simple comparison-based sorting algorithm",
    explaination: `Bubble sort is like arranging books on a shelf by height. Here's how it works:
Start at the beginning of your list
Compare two adjacent numbers
If they're in the wrong order (bigger number before smaller), swap them
Move to the next pair
Repeat until you reach the end
Start over from the beginning until no more swaps are needed

Let's see a simple example with numbers [5, 2, 8, 1]:
First pass:

Compare 5 and 2: [5, 2, 8, 1] → [2, 5, 8, 1]
Compare 5 and 8: No swap needed
Compare 8 and 1: [2, 5, 8, 1] → [2, 5, 1, 8]

Second pass:

Compare 2 and 5: No swap needed
Compare 5 and 1: [2, 5, 1, 8] → [2, 1, 5, 8]
Compare 5 and 8: No swap needed

Third pass:

Compare 2 and 1: [2, 1, 5, 8] → [1, 2, 5, 8]
Compare 2 and 5: No swap needed
Compare 5 and 8: No swap needed

Final result: [1, 2, 5, 8]
The name "bubble sort" comes from the way larger elements "bubble up" to their correct positions at the end of the list, just like bubbles rise to the surface of water.
While bubble sort is not the most efficient sorting algorithm (it has O(n²) time complexity), it's very intuitive and great for learning about sorting algorithms. Would you like to see the actual code implementation?`,
implementation: `do 
  swapped = false;
  for(let i = 0; i < n-1; i++) 
      if(arr[i] > arr[i+1]) 
          [arr[i], arr[i+1]] = [arr[i+1], arr[i]];
          swapped = true;
while(swapped);`,
    async *sort(arr) {
      const n = arr.length;
      let swapped;
      do {
        swapped = false;
        for (let i = 0; i < n - 1; i++) {
          yield {
            array: [...arr],
            comparing: [i, i + 1],
            swapped: null,
            explanation: `Comparing elements at index ${i} and ${i + 1}`,
            currentLine: 4,
          };

          if (arr[i] > arr[i + 1]) {
            yield {
              array: [...arr],
              comparing: [i, i + 1],
              swapped: null,
              explanation: `Swapping elements at index ${i} and ${i + 1}`,
              currentLine: 5,
            };

            // First yield for the swap operation
            yield {
              array: [...arr],
              comparing: null,
              swapped: [i, i + 1],
              explanation: `Preparing to swap elements ${arr[i]} and ${arr[i + 1]}`,
              currentLine: 6,
            };

            [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
            swapped = true;

            // Second yield after the swap is complete
            yield {
              array: [...arr],
              comparing: null,
              swapped: [i, i + 1],
              explanation: `Swapped elements and marked as swapped`,
              currentLine: 7,
            };
          }
          await new Promise((resolve) => setTimeout(resolve, 50));
        }
      } while (swapped);

      yield {
        array: [...arr],
        comparing: null,
        swapped: null,
        explanation: `Sorting complete`,
        currentLine: 12,
      };

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
      const n = arr.length;
      let swapped;
      do {
        swapped = false;
        for (let i = 0; i < n - 1; i++) {
          yield {
            array: [...arr],
            comparing: [i, i + 1],
            swapped: null,
            explanation: `Comparing elements at index ${i} and ${i + 1}`,
            currentLine: 5, // Line 5: for(let i = 0; i < n-1; i++) {
          };

          if (arr[i] > arr[i + 1]) {
            yield {
              array: [...arr],
              comparing: [i, i + 1],
              swapped: null,
              explanation: `Swapping elements at index ${i} and ${i + 1}`,
              currentLine: 6, // Line 6: if(arr[i] > arr[i+1]) {
            };

            [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
            swapped = true;

            yield {
              array: [...arr],
              comparing: null,
              swapped: [i, i + 1],
              explanation: `Swapped elements ${arr[i]} and ${arr[i + 1]}`,
              currentLine: 7, // Line 7: [arr[i], arr[i+1]] = [arr[i+1], arr[i]];
            };
          }
          await new Promise((resolve) => setTimeout(resolve, 50));
        }
        yield {
          array: [...arr],
          comparing: null,
          swapped: null,
          explanation: `Checking if any swaps occurred in this pass`,
          currentLine: 8, // Line 8: swapped = true;
        };
      } while (swapped);

      yield {
        array: [...arr],
        comparing: null,
        swapped: null,
        explanation: `Sorting complete`,
        currentLine: 9, // Line 9: } while(swapped);
      };

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
},
`,
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
  const [showCode, setShowCode] = useState(false);
  const [isAscending, setIsAscending] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentLine, setCurrentLine] = useState(null); // Track the currently executing line
  const rightSidebarRef = useRef(null);

  // Function to highlight the currently executing line
  const highlightCurrentLine = (lineNumber) => {
    setCurrentLine(lineNumber);
  };


  // Example: Simulate code execution (replace with your sorting logic)
  const simulateCodeExecution = () => {
    const codeLines = algorithms[currentAlgo].implementation.split('\n');
    let currentLineIndex = 0;

    const interval = setInterval(() => {
      if (currentLineIndex >= codeLines.length) {
        clearInterval(interval);
        setCurrentLine(null); // Reset highlighting
        return;
      }

      highlightCurrentLine(currentLineIndex);
      currentLineIndex++;
    }, 1000); // Adjust the delay as needed
  };

  const svgRef = useRef(null);
  const sidebarRef = useRef(null);
  const params = useParams();

  const handleEditArray = () => {
    setIsEditing(true);
    setUserInput(array.join(", "));
  };

  const handleDropdownOpenChange = (open) => {
    setIsDropdownOpen(open);
    if (open) {
      // Ensure focus remains on the sidebar
      sidebarRef.current?.focus();
    }
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

  const handleSortToggle = () => {
    const sortOrder = isAscending ? "sorted-desc" : "sorted-asc";
    generateSpecialArray(sortOrder);
    setIsAscending(!isAscending);
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
    setShowCode(!showCode);

    const algorithm = algorithms[currentAlgo];
    const sorter = algorithm.sort([...array]);
    const history = [];

    try {
      for await (const step of sorter) {
        setCurrentLine(step.currentLine); // Update the current line
        history.push(step);

        if (!isPaused) {
          setArray(step.array);
          setExplanation(step.explanation);
          updateVisualization(step.array, step.comparing, step.swapped);
          await new Promise((resolve) => setTimeout(resolve, 1000 / speed));
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
    <div className="bg-gray-50">
      {/* Navbar */}
      <nav className="h-[50px] bg-white border-b border-gray-200 top-0 left-0 right-0 z-50 flex items-center justify-between px-6 shadow-md">
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
            EzzAlgo
          </span>
          <Select value={currentAlgo} onValueChange={setCurrentAlgo}>
            <SelectTrigger className="w-48 bg-white border-2 border-gray-200 hover:border-indigo-400 text-gray-800 h-[30px] w-[10rem] transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-700/20  backdrop-blur-md text-zinc-800">
              {Object.keys(algorithms).map(algo => (
                <SelectItem key={algo} value={algo}>{algo}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="text-gray-800 hover:text-gray-100">
          <Button variant="outline" className="flex items-center h-[33px] w-[90px] p-0 gap-2 border-2 border-zinc-400 bg-zinc-100 hover:bg-zinc-900 text-gray-800 hover:text-gray-100">
            <User className="h-5 w-5  " />
            <span className="font-small">Login</span>
          </Button>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-4rem)] relative">
        {/* Enhanced Left Controls Panel */}
        <div
      className={`absolute left-0 top-0 h-full bg-gradient-to-b from-indigo-50 to-white border-r border-gray-200 transition-all duration-500 ease-in-out shadow-lg ${
        isControlsOpen ? "w-72" : "w-14"
      } overflow-hidden z-10`}
      onMouseEnter={() => setIsControlsOpen(true)}
      onMouseLeave={() => setIsControlsOpen(false)}
    >
          {isControlsOpen ? (
            <div className="p-6 space-y-8 h-full flex flex-col">
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
                    onClick={handleSortToggle}
                    variant="outline"
                    className="flex-1 bg-white text-indigo-700 border-2 hover:bg-indigo-50 hover:border-indigo-400 transition-all font-medium flex items-center gap-2"
                  >
                    {isAscending ? <ArrowUp className="h-5 w-5" /> : <ArrowDown className="h-5 w-5" />}
                    {isAscending ? "Sorted (Ascending)" : "Sorted (Descending)"}
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
                  <SettingSelect
                    label="Array Size"
                    value={arraySize.toString()}
                    onValueChange={(v) => setArraySize(Number(v))}
                    options={[5, 10, 15, 20, 25, 30, 35, 40, 45, 50]}
                  />
                  <SettingSelect
                    label="Animation Speed"
                    value={speed.toString()}
                    onValueChange={(v) => setSpeed(Number(v))}
                    options={[0.5, 1, 1.5, 2]}
                    formatOption={(v) => `${v}x`}
                  />
                </div>
              </div>

              <Separator className="bg-indigo-100" />
            </div>
          ) : (
            <div className="py-6 space-y-8 h-full flex flex-col items-center">
              <Tooltip title="Array Generation">
                <div className="cursor-pointer p-2 hover:bg-indigo-100 rounded-lg transition-colors">
                  <BarChart className="h-5 w-5 text-indigo-700" />
                </div>
              </Tooltip>

              <Tooltip title="Settings">
                <div className="cursor-pointer p-2 hover:bg-indigo-100 rounded-lg transition-colors">
                  <Settings className="h-5 w-5 text-indigo-700" />
                </div>
              </Tooltip>

              <Tooltip title="Array Size">
                <div className="cursor-pointer p-2 hover:bg-indigo-100 rounded-lg transition-colors">
                  <Ruler className="h-5 w-5 text-indigo-700" />
                </div>
              </Tooltip>

              <Tooltip title="Animation Speed">
                <div className="cursor-pointer p-2 hover:bg-indigo-100 rounded-lg transition-colors">
                  <Timer className="h-5 w-5 text-indigo-700" />
                </div>
              </Tooltip>
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
            <CardContent className="flex items-center gap-3 p-4 ">
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
            <Card className="absolute bottom-[100px] left-1/2 transform -translate-x-1/2 max-w-lg shadow-lg">
              <CardContent className="p-4">
                <p className="text-sm text-gray-700">{explanation}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Code Panel */}
      <CodePanel
        rightSidebarRef={rightSidebarRef}
        isCodeOpen={isCodeOpen}
        setIsCodeOpen={setIsCodeOpen}
        algorithms={algorithms}
        currentAlgo={currentAlgo}
        showRuntimeCode={showRuntimeCode}
        setShowRuntimeCode={setShowRuntimeCode}
        currentLine={currentLine}
      />


        {/* Enhanced Bottom Control Bar */}
        <div className="absolute z-10 bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-indigo-50 to-white border-t border-gray-200 flex items-center justify-between px-8 shadow-lg">
  {/* Left Controls */}
  <div className="flex items-center gap-4">
    {/* Restart Button */}
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          onClick={restartSorting}
          disabled={!sortingHistory.length}
          className="h-10 w-10 border-2 border-indigo-200 bg-white hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
        >
          <RefreshCcw className="h-5 w-5 text-indigo-700" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Restart Sorting</p>
      </TooltipContent>
    </Tooltip>

    {/* Previous Step Button */}
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleStepControl("prev")}
          disabled={currentStep === 0}
          className="h-10 w-10 border-2 border-indigo-200 bg-white hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
        >
          <SkipBack className="h-5 w-5 text-indigo-700" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Previous Step</p>
      </TooltipContent>
    </Tooltip>

    {/* Play/Pause Button */}
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsPaused(!isPaused)}
          disabled={!isSorting}
          className="h-12 w-12 border-2 border-indigo-200 bg-white hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
        >
          {isPaused ? (
            <PlayCircle className="h-7 w-7 text-indigo-700" />
          ) : (
            <PauseCircle className="h-7 w-7 text-indigo-700" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{isPaused ? "Play" : "Pause"}</p>
      </TooltipContent>
    </Tooltip>

    {/* Next Step Button */}
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleStepControl("next")}
          disabled={currentStep === sortingHistory.length - 1}
          className="h-10 w-10 border-2 border-indigo-200 bg-white hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
        >
          <SkipForward className="h-5 w-5 text-indigo-700" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Next Step</p>
      </TooltipContent>
    </Tooltip>
  </div>

  {/* Slider */}
  <div className="flex-1 max-w-2xl mx-8">
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

  {/* Right Controls */}
  <div className="flex items-center gap-4">
    {/* Run Button */}
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={startSorting}
          disabled={isSorting}
          className="h-12 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-lg rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
        >
          <PlayCircle className="h-6 w-6 mr-2" />
          Run
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Start Sorting</p>
      </TooltipContent>
    </Tooltip>

    {/* Code Button */}
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={() => setShowCode(!showCode)}
          className="h-12 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-lg rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105"
        >
          <Code className="h-6 w-6 mr-2" />
          Code
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Toggle Code View</p>
      </TooltipContent>
    </Tooltip>
  </div>
</div>
      </div>

      {/* Code Display Card */}
      <DraggableCard 
        showCode={showCode}
        showRuntimeCode={showRuntimeCode}
        algorithms={algorithms}
        currentAlgo={currentAlgo}
        currentLine={currentLine}
      />
    </div>
  );
};

export default SortingVisualizer;