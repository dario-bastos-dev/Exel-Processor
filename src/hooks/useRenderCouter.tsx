import { useRef } from 'react';

function useRenderCounter() {
  const count = useRef(0);
  console.log(`Renderização ${++count.current}`);
}

export default useRenderCounter;
