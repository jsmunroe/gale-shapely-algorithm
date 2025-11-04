import StateViewer from './components/StateViewer';
import useGaleShapely from './hooks/useGaleShapely';
import { useEffect } from 'react';
import './App.css'

function App() {
  const { state, step } = useGaleShapely();

  useEffect(() => {
     setTimeout(step, 250);
  }, [state])

  return (
    <StateViewer state={state} />
  )
}

export default App
