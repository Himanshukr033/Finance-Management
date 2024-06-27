import { useState, ReactNode } from 'react';
import LoadingContext from './LoadingContext';

interface LoadingProviderProps {
  children: ReactNode;
}

const LoadingProvider = ({ children }: LoadingProviderProps) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export default LoadingProvider;
