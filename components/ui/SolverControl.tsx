'use client';

import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '@/lib/store/useGameStore';
import { solveKlotski } from '@/lib/solver';
import { SolverResult, Move } from '@/lib/solver/types';
import { isKlotskiAvailable } from '@/lib/solver/klotski-wrapper';

export function SolverControl() {
  const { blocks, moveBlock } = useGameStore();
  const [solving, setSolving] = useState(false);
  const [result, setResult] = useState<SolverResult | null>(null);
  const [autoPlaying, setAutoPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [klotskiAvailable, setKlotskiAvailable] = useState(false);
  const pauseRef = useRef(false);
  const stopRef = useRef(false);
  const currentStepRef = useRef(0);

  useEffect(() => {
    setKlotskiAvailable(isKlotskiAvailable());
  }, []);

  const handleSolve = async () => {
    setSolving(true);
    setResult(null);
    setCurrentStep(0);

    try {
      const solverResult = solveKlotski(blocks);

      setResult(solverResult);
    } catch (error) {
      console.error('Solving failed:', error);
      alert('Solving failed, please try again later');
    } finally {
      setSolving(false);
    }
  };

  const handleAutoPlay = async () => {
    if (!result || !result.success) return;

    if (isPaused) {
      // Resume playback
      setIsPaused(false);
      pauseRef.current = false;
      return;
    }

    setAutoPlaying(true);
    setIsPaused(false);
    pauseRef.current = false;
    stopRef.current = false;
    currentStepRef.current = 0;
    setCurrentStep(0);

    // Use recursive function to implement true pause
    const playNextMove = async (stepIndex: number) => {
      if (stopRef.current || stepIndex >= result.moves.length) {
        setAutoPlaying(false);
        setIsPaused(false);
        pauseRef.current = false;
        stopRef.current = false;
        return;
      }

      // If paused, wait for resume
      if (pauseRef.current) {
        const checkPause = () => {
          return new Promise<void>((resolve) => {
            const interval = setInterval(() => {
              if (!pauseRef.current || stopRef.current) {
                clearInterval(interval);
                resolve();
              }
            }, 100);
          });
        };
        await checkPause();
        
        if (stopRef.current) {
          setAutoPlaying(false);
          setIsPaused(false);
          pauseRef.current = false;
          stopRef.current = false;
          return;
        }
      }

      const move = result.moves[stepIndex];
      setCurrentStep(stepIndex + 1);
      currentStepRef.current = stepIndex + 1;
      
      await new Promise(resolve => setTimeout(resolve, 400));
      
      if (stopRef.current) {
        setAutoPlaying(false);
        setIsPaused(false);
        pauseRef.current = false;
        stopRef.current = false;
        return;
      }
      
      moveBlock(move.blockId, move.to);
      
      // Recursively call next move
      playNextMove(stepIndex + 1);
    };

    playNextMove(0);
  };

  const handlePause = () => {
    setIsPaused(true);
    pauseRef.current = true;
  };

  const handleStop = () => {
    setAutoPlaying(false);
    setIsPaused(false);
    pauseRef.current = false;
    stopRef.current = true;
  };

  const handleStepForward = () => {
    if (!result || !result.success || currentStep >= result.moves.length) return;
    
    const move = result.moves[currentStep];
    moveBlock(move.blockId, move.to);
    setCurrentStep(currentStep + 1);
    
    // If currently auto-playing, continue auto-play after single step
    if (autoPlaying && !isPaused) {
      // Continue auto-play logic
      const continueAutoPlay = async () => {
        if (currentStep + 1 >= result.moves.length) {
          setAutoPlaying(false);
          setIsPaused(false);
          pauseRef.current = false;
          stopRef.current = false;
          return;
        }
        
        // Continue playing remaining steps
        for (let i = currentStep + 1; i < result.moves.length; i++) {
          if (stopRef.current || pauseRef.current) {
            break;
          }
          
          const nextMove = result.moves[i];
          setCurrentStep(i + 1);
          await new Promise(resolve => setTimeout(resolve, 400));
          
          if (stopRef.current) {
            setAutoPlaying(false);
            setIsPaused(false);
            pauseRef.current = false;
            stopRef.current = false;
            return;
          }
          
          moveBlock(nextMove.blockId, nextMove.to);
        }
        
        setAutoPlaying(false);
        setIsPaused(false);
        pauseRef.current = false;
        stopRef.current = false;
      };
      
      continueAutoPlay();
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 space-y-4">
      
      {/* Klotski Library Status */}
      {!klotskiAvailable && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center space-x-2 text-red-700">
            <span className="text-lg">❌</span>
            <span className="font-medium">Klotski Library Not Available</span>
          </div>
        </div>
      )}

      {/* Solve Button */}
      <button
        onClick={handleSolve}
        disabled={solving || autoPlaying}
        className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all ${
          solving || autoPlaying
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-md hover:shadow-lg'
        }`}
      >
        {solving ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            AI is thinking...
          </span>
        ) : (
          '🚀 Start Solving'
        )}
      </button>

      {/* Solve Result */}
      {result && (
        <div className={`p-4 rounded-lg ${result.success ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}>
          {result.success ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-green-700 font-semibold">
                <span className="text-2xl">✅</span>
                <span>Solution Found!</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white/50 p-3 rounded-lg">
                  <div className="text-gray-600">Total Steps</div>
                  <div className="text-2xl font-bold text-green-600">{result.totalSteps}</div>
                </div>
                <div className="bg-white/50 p-3 rounded-lg">
                  <div className="text-gray-600">States Explored</div>
                  <div className="text-2xl font-bold text-blue-600">{result.statesExplored.toLocaleString()}</div>
                </div>
                <div className="bg-white/50 p-3 rounded-lg col-span-2">
                  <div className="text-gray-600">Solve Time</div>
                  <div className="text-2xl font-bold text-purple-600">{result.timeElapsed}ms</div>
                </div>
              </div>

              {/* Step Progress */}
              {currentStep > 0 && (
                <div className="bg-white/50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600 mb-2">
                    Progress: {currentStep} / {result.totalSteps}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(currentStep / result.totalSteps) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Control Buttons */}
              <div className="flex gap-2">
                {!autoPlaying ? (
                  <button
                    onClick={handleAutoPlay}
                    className="flex-1 py-2 px-4 rounded-lg font-semibold text-white transition-all bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  >
                    ▶️ Auto Demo
                  </button>
                ) : (
                  <>
                    {!isPaused ? (
                      <button
                        onClick={handlePause}
                        className="flex-1 py-2 px-4 rounded-lg font-semibold text-white transition-all bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                      >
                        ⏸️ Pause
                      </button>
                    ) : (
                      <button
                        onClick={handleAutoPlay}
                        className="flex-1 py-2 px-4 rounded-lg font-semibold text-white transition-all bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                      >
                        ▶️ Resume
                      </button>
                    )}
                    <button
                      onClick={handleStop}
                      className="py-2 px-4 rounded-lg font-semibold text-white transition-all bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                    >
                      ⏹️ Stop
                    </button>
                  </>
                )}
                
                <button
                  onClick={handleStepForward}
                  disabled={currentStep >= result.totalSteps}
                  className={`py-2 px-4 rounded-lg font-semibold transition-all ${
                    currentStep >= result.totalSteps
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  ⏭️ Step
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-red-700 font-semibold">
                <span className="text-2xl">❌</span>
                <span>No Solution Found</span>
              </div>
              <p className="text-sm text-red-600">
                Explored {result.statesExplored.toLocaleString()} states in {result.timeElapsed}ms
              </p>
              <p className="text-xs text-gray-600">
                Tip: Try increasing search depth or using a different algorithm
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

