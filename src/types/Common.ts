export interface ILinks {
  collection: {
    href: string;
  };
  next: {
    href: string;
  };
  prev: {
    href: string;
  };
  self: {
    href: string;
  };
  open: {
    href: string;
  };
  thumbnail: {
    href: string;
  };
}

export interface ILinksShort {
  self: {
    href: string;
  };
}

export type MakeOptional<T, K extends keyof T> = Pick<Partial<T>, K> &
  Omit<T, K>;
