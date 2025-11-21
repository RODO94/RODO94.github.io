import React from "react";

type BodyVariant = "body-1" | "body-2" | "body-3";
type TypographySize = "sm" | "base" | "lg" | "2xl";

interface BodyProps {
  variant: BodyVariant;
  size: TypographySize;
  children: React.ReactNode;
  style?: string;
}

type ChildTypographyProps = Omit<BodyProps, "variant">;

const variantClass: Record<BodyVariant, React.FC<ChildTypographyProps>> = {
  "body-1": TypographyBody1,
  "body-2": TypographyBody2,
  "body-3": TypographyBody3,
};

export const TypographyBody = ({ variant, children, size, style = "" }: BodyProps) => {
  const BodyComponent = variantClass[variant];
  return <BodyComponent size={size} style={style}>{children}</BodyComponent>;
};

function TypographyBody1({ children, size, style }: ChildTypographyProps) {
  return (
    <p className={`text-${size} leading-7 dark:text-background ${style} m-0`}>
      {children}
    </p>
  );
}

function TypographyBody2({ children, size }: ChildTypographyProps) {
  return (
    <p className={`text-${size} leading-relaxed dark:text-primary-foreground`}>
      {children}
    </p>
  );
}

function TypographyBody3({ children, size }: ChildTypographyProps) {
  return (
    <p className={`text-${size} leading-relaxed dark:text-secondary`}>{children}</p>
  );
}
