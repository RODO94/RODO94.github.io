import React from "react";

type MaxWidthBoxProps = {
  children: React.ReactNode;
};

export const MaxWidthBox: React.FC<MaxWidthBoxProps> = ({ children }) => (
  <div className='max-w-[800px] min-w-[320px] m-auto'>{children}</div>
);
