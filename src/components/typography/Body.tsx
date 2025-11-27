import React from "react";

type BodyVariant = "body-1" | "body-2" | "body-3";
type TypographySize = "sm" | "base" | "lg" | "2xl";

interface BodyProps {
  variant: BodyVariant;
  size: TypographySize;
  children: React.ReactNode;
  style?: string;
  className?: string;
}

type ChildTypographyProps = Omit<BodyProps, "variant">;

const variantClass: Record<BodyVariant, React.FC<ChildTypographyProps>> = {
  "body-1": TypographyBody1,
  "body-2": TypographyBody2,
  "body-3": TypographyBody3,
};

export const TypographyBody = ({ variant, children, size, style = "", className = "" }: BodyProps) => {
  const BodyComponent = variantClass[variant];
  return <BodyComponent size={size} style={style} className={className}>{children}</BodyComponent>;
};

function TypographyBody1({ children, size, style, className }: ChildTypographyProps) {
  return (
    <p className={`text-${size} leading-7 dark:text-background ${style} m-0 ${className}`}>
      {children}
    </p>
  );
}

function TypographyBody2({ children, size, className }: ChildTypographyProps) {
  return (
    <p className={`text-${size} leading-relaxed dark:text-primary-foreground ${className}`}>
      {children}
    </p>
  );
}

function TypographyBody3({ children, size, className }: ChildTypographyProps) {
  return (
    <p className={`text-${size} text-secondary-foreground dark:text-secondary ${className}`}>{children}</p>
  );
}
