import { Link, type LinkProps } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

type Props = LinkProps & {
  className?: string;
  activeClassName?: string;
  children?: React.ReactNode;
};

export const NavLink = ({ className, activeClassName, children, ...rest }: Props) => (
  <Link
    {...rest}
    className={cn(className)}
    activeProps={{ className: cn(className, activeClassName) }}
  >
    {children as any}
  </Link>
);

export default NavLink;
