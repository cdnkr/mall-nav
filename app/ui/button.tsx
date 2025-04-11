import { cn } from "../utils";

function Button__Pushable({
  children,
  onClick,
  className,
  outerClassName,
  variant = "primary", // default variant
}) {
  const variants = {
    primary: {
      outer: "bg-primary",
      inner: "border-primary bg-primary text-black",
    },
    light: {
      outer: "bg-white",
      inner: "border-white bg-white text-primary",
    },
    dark: {
      outer: "bg-gray-800",
      inner: "border-dark bg-gray-800 text-white",
    },
    secondary: {
      outer: "bg-primary",
      inner: "border-primary bg-white text-primary",
    },
  };

  const selectedVariant = variants[variant] || variants.primary;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full relative cursor-pointer rounded-lg border-none p-0 outline-offset-4 block",
        selectedVariant.outer,
        outerClassName,
      )}
    >
      {variant !== "secondary" && (
        <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full rounded-lg bg-black/20" />
      )}
      <span
        className={cn(
          "max-h-[52px] flex translate-y-[-6px] transform items-center justify-center gap-1 rounded-lg px-10 py-3 font-semibold active:translate-y-[-2px] border-2",
          selectedVariant.inner,
          className,
        )}
      >
        {children}
      </span>
    </button>
  );
}

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "tertiary";
  shadowColor?: string;
  disabled?: boolean;
}

export default function Button({
  children,
  onClick,
  className,
  variant = "primary",
  shadowColor,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "bg-button border-button-border text-button-text uppercase font-mono shadow-[3px_3px_0_0_rgba(var(--color-shadow))] active:shadow-[1px_1px_0_0_rgba(var(--color-shadow))] hover:shadow-[5px_5px_0_0_rgba(var(--color-shadow))] max-h-[52px] leading-snug max-w-full cursor-pointer flex justify-center items-center gap-3 py-3 px-10 border-2 transition-all duration-300",
        // variants[variant],
        disabled && "opacity-75 cursor-not-allowed",
        className,
      )}
      // @ts-ignore
      style={
        shadowColor && {
          "--color-shadow": shadowColor,
        }
      }
      {...rest}
    >
      {children}
    </button>
  );
}

export function UtilityButton({
  children,
  onClick,
  className,
  variant = "primary",
}) {
  const variants = {
    primary: "bg-white border-white text-[#111]",
    secondary: "bg-white text-primary border-dark",
    tertiary: "bg-tertiary border-tertiary text-button-tertiary-text",
  };
  return (
    <button
      onClick={onClick}
      className={cn(
        "font-mono px-2 py-1 text-sm border-2 shadow-[3px_3px_0_0_rgba(var(--color-utility-shadow))] active:shadow-[1px_1px_0_0_rgba(var(--color-utility-shadow))] hover:shadow-[5px_5px_0_0_rgba(var(--color-utility-shadow))] transition-all duration-300 cursor-pointer",
        variants[variant],
        className,
      )}
    >
      {children}
    </button>
  );
}
