import React from "react";

type MainBoxProps = {
  children: React.ReactNode;
};

export const MainBox: React.FC<MainBoxProps> = ({ children }) => (
  <div className='flex flex-col items-center justify-start min-h-screen w-full gap-4 max-w-sm'>
    {children}
  </div>
);
