import React from "react";

type MainBoxProps = {
  children: React.ReactNode;
};

export const MainBox: React.FC<MainBoxProps> = ({ children }) => (
  <div className='flex flex-col items-center justify-start min-h-screen gap-4 w-[90%] sm:max-w-[600px]'>
    {children}
  </div>
);
