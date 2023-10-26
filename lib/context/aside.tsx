import { createContext, Dispatch, SetStateAction, useState, useContext } from 'react';

const AsideContext = createContext<
  { open: boolean; setOpen: Dispatch<SetStateAction<boolean>> } | undefined
>(undefined);

export function AsideProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return <AsideContext.Provider value={{ open, setOpen }}>{children}</AsideContext.Provider>;
}

export function useAside() {
  const context = useContext(AsideContext);
  if (context === undefined) {
    throw new Error('useAside must be used within an AsideProvider');
  }
  return context;
}
