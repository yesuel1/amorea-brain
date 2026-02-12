import { type HTMLAttributes, type ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "default" | "dark" | "gradient";
  hoverable?: boolean;
  padding?: "sm" | "md" | "lg";
}

const variantStyles = {
  default: "bg-vb-card border border-vb-lightsilver",
  dark: "bg-vb-navy text-white border-none",
  gradient: "bg-gradient-to-br from-vb-navy to-vb-charcoal text-white border-none",
};

const paddingStyles = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  children,
  variant = "default",
  hoverable = false,
  padding = "md",
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={`
        rounded-3xl
        shadow-sm
        ${variantStyles[variant]}
        ${paddingStyles[padding]}
        ${hoverable ? "transition-all duration-300 hover:shadow-lg hover:-translate-y-1" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className = "" }: CardHeaderProps) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle({ children, className = "" }: CardTitleProps) {
  return <h3 className={`text-xl font-bold ${className}`}>{children}</h3>;
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = "" }: CardContentProps) {
  return <div className={className}>{children}</div>;
}
