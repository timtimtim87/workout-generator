'use client';
import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';

const exercises = {
  upperPush: [
    { name: 'Dumbbell Bench Press', type: 'Upper Push', target: 'Chest' },
    { name: 'Arnold Press', type: 'Upper Push', target: 'Shoulders' },
    { name: 'Push Press', type: 'Upper Push', target: 'Shoulders' },
    { name: 'Dips', type: 'Upper Push', target: 'Chest/Triceps' },
    { name: 'Incline DB Press', type: 'Upper Push', target: 'Upper Chest' },
  ],
  upperPull: [
    { name: 'Single-arm DB Rows', type: 'Upper Pull', target: 'Back' },
    { name: 'Face Pulls', type: 'Upper Pull', target: 'Rear Delts' },
    { name: 'Lat Pulldowns', type: 'Upper Pull', target: 'Back' },
    { name: 'Meadows Row', type: 'Upper Pull', target: 'Back' },
    { name: 'Seal Row', type: 'Upper Pull', target: 'Back' },
  ],
  lowerBody: [
    { name: 'Goblet Squats', type: 'Lower Body', target: 'Quads' },
    { name: 'Romanian Deadlifts', type: 'Lower Body', target: 'Hamstrings' },
    { name: 'Bulgarian Split Squats', type: 'Lower Body', target: 'Legs' },
    { name: 'Step-ups', type: 'Lower Body', target: 'Legs' },
    { name: 'Hip Thrusts', type: 'Lower Body', target: 'Glutes' },
  ],
  core: [
    { name: 'Pallof Press', type: 'Core', target: 'Anti-Rotation' },
    { name: 'Dead Bug', type: 'Core', target: 'Anti-Extension' },
    { name: 'Plank', type: 'Core', target: 'Core Stability' },
    { name: 'Russian Twists', type: 'Core', target: 'Obliques' },
    { name: 'Copenhagen Plank', type: 'Core', target: 'Lateral Core' },
  ],
};

const adaptationSchemes = {
  strength: { sets: '4-5', reps: '4-6', rest: '2-3' },
  hypertrophy: { sets: '3-4', reps: '8-12', rest: '1-2' },
  stability: { sets: '2-3', reps: '12-15', rest: '1' },
};

export default function Home() {
  const [workout, setWorkout] = useState(null);
  const [supersetCount, setSupersetCount] = useState(3);
  const [focus, setFocus] = useState({
    upper: false,
    lower: false,
    core: false,
  });
  const [adaptation, setAdaptation] = useState('hypertrophy');

  const generateRandomExercise = (excludeExercises) => {
    const availableCategories = Object.keys(exercises).filter(cat => {
      if ((cat === 'upperPush' || cat === 'upperPull') && focus.upper) return true;
      if (cat === 'lowerBody' && focus.lower) return true;
      if (cat === 'core' && focus.core) return true;
      return !Object.values(focus).some(v => v);
    });

    if (availableCategories.length === 0) return null;
    
    const category = availableCategories[Math.floor(Math.random() * availableCategories.length)];
    const exerciseList = exercises[category];
    let exercise;
    do {
      exercise = exerciseList[Math.floor(Math.random() * exerciseList.length)];
    } while (excludeExercises.has(exercise.name));
    
    return exercise;
  };

  const generateWorkout = () => {
    const usedExercises = new Set();
    const supersets = [];
    
    for (let i = 0; i < supersetCount; i++) {
      const exercise1 = generateRandomExercise(usedExercises);
      usedExercises.add(exercise1.name);
      
      const exercise2 = generateRandomExercise(usedExercises);
      usedExercises.add(exercise2.name);
      
      supersets.push({
        exerciseA: exercise1,
        exerciseB: exercise2,
      });
    }
    
    setWorkout(supersets);
  };

  const replaceExercise = (supersetIndex, isExerciseA) => {
    if (!workout) return;
    
    const newWorkout = [...workout];
    const usedExercises = new Set(
      workout.flatMap(s => [s.exerciseA.name, s.exerciseB.name])
        .filter(name => 
          name !== newWorkout[supersetIndex][isExerciseA ? 'exerciseA' : 'exerciseB'].name
        )
    );
    
    const newExercise = generateRandomExercise(usedExercises);
    newWorkout[supersetIndex][isExerciseA ? 'exerciseA' : 'exerciseB'] = newExercise;
    setWorkout(newWorkout);
  };

  const scheme = adaptationSchemes[adaptation];

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-2xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold mb-6 text-gray-900">Tim's Workout Generator</h1>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2 text-gray-900">Number of Supersets</h3>
              <div className="flex gap-4">
                {[3, 4].map((num) => (
                  <label key={num} className="flex items-center text-gray-700">
                    <input
                      type="radio"
                      checked={supersetCount === num}
                      onChange={() => setSupersetCount(num)}
                      className="mr-2"
                    />
                    {num}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2 text-gray-900">Movement Focus</h3>
              <div className="flex gap-4 flex-wrap">
                {Object.entries(focus).map(([key, value]) => (
                  <label key={key} className="flex items-center text-gray-700">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setFocus(prev => ({ ...prev, [key]: e.target.checked }))}
                      className="mr-2"
                    />
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2 text-gray-900">Adaptation Focus</h3>
              <div className="flex gap-4">
                {Object.keys(adaptationSchemes).map((scheme) => (
                  <label key={scheme} className="flex items-center text-gray-700">
                    <input
                      type="radio"
                      checked={adaptation === scheme}
                      onChange={() => setAdaptation(scheme)}
                      className="mr-2"
                    />
                    {scheme.charAt(0).toUpperCase() + scheme.slice(1)}
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={generateWorkout}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Generate New Workout
            </button>
          </div>
        </div>

        {workout && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Today's Workout</h2>
            <div className="space-y-6">
              {workout.map((superset, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Superset {index + 1}</h3>
                  <div className="space-y-4">
                    {['A', 'B'].map((letter, i) => {
                      const exercise = letter === 'A' ? superset.exerciseA : superset.exerciseB;
                      return (
                        <div key={letter} className="flex justify-between items-center">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {letter}. {exercise.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {exercise.type} - {exercise.target}
                            </p>
                          </div>
                          <div className="text-sm mr-4 text-gray-700">{scheme.sets} x {scheme.reps}</div>
                          <button
                            onClick={() => replaceExercise(index, letter === 'A')}
                            className="p-2 hover:bg-gray-100 rounded-md text-gray-700"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
              <div className="text-sm text-gray-600 mt-4">
                • Perform exercises A and B back to back<br />
                • Rest {scheme.rest} minutes between supersets<br />
                • Complete {scheme.sets} rounds of each superset
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}