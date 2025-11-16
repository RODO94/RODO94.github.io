import React from "react";

type HeaderVariant = "header-1" | "header-2" | "header-3" | "header-4";

interface HeaderProps {
  variant: HeaderVariant;
  children: React.ReactNode;
}

const variantClass: Record<
  HeaderVariant,
  React.FC<{ children: React.ReactNode }>
> = {
  "header-1": TypographyH1,
  "header-2": TypographyH2,
  "header-3": TypographyH3,
  "header-4": TypographyH4,
};

export const TypographyHeader = ({ variant, children }: HeaderProps) => {
  const HeaderVariant = variantClass[variant];

  return <HeaderVariant>{children}</HeaderVariant>;
};

function TypographyH1({ children }: { children: React.ReactNode }) {
  return (
    <h1 className='scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance'>
      {children}
    </h1>
  );
}

function TypographyH2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className='scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0'>
      {children}
    </h2>
  );
}

function TypographyH3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className='scroll-m-20 text-2xl font-semibold tracking-tight'>
      {children}
    </h3>
  );
}

function TypographyH4({ children }: { children: React.ReactNode }) {
  return (
    <h4 className='scroll-m-20 text-xl font-semibold tracking-tight'>
      {children}
    </h4>
  );
}
