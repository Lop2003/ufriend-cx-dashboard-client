import { useContext } from 'react';
import { CXContext } from '../context/CXContext';

export function useCX() {
  const context = useContext(CXContext);
  if (context === undefined) {
    throw new Error('useCX must be used within a CXProvider');
  }
  return context;
}
export default useCX;
