interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  run(): Promise<unknown>;
  all<T = unknown>(): Promise<{ results: T[] }>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<T[]>;
}

interface Fetcher {
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
}

declare module "cloudflare:workers" {
  export const env: {
    DB: D1Database;
  };
}

declare module "lucide-react" {
  import type {
    ForwardRefExoticComponent,
    RefAttributes,
    SVGProps,
  } from "react";

  type Icon = ForwardRefExoticComponent<
    SVGProps<SVGSVGElement> &
      RefAttributes<SVGSVGElement> & {
        size?: number | string;
        strokeWidth?: number | string;
      }
  >;

  export const ArrowRight: Icon;
  export const ChevronDown: Icon;
  export const Heart: Icon;
  export const MapPin: Icon;
  export const Menu: Icon;
  export const PackageCheck: Icon;
  export const Search: Icon;
  export const ShoppingBag: Icon;
  export const Truck: Icon;
  export const User: Icon;
  export const X: Icon;
}

declare module "tailwind-merge" {
  export function twMerge(
    ...classLists: Array<string | undefined | null | false>
  ): string;
}
