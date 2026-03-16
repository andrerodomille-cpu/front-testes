import { createContext, useContext, useState } from "react";

const FullScreenContext = createContext({
  isFullScreen: false,
  setIsFullScreen: (value: boolean) => {},
});

export const FullScreenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  return (
    <FullScreenContext.Provider value={{ isFullScreen, setIsFullScreen }}>
      {children}
    </FullScreenContext.Provider>
  );
};

export const useFullScreen = () => useContext(FullScreenContext);
