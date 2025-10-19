export type TAuth = {
  name?: string;
  email: string;
  password: string;
  role?:
    | "customer"
    | "vendor"
    | "sr"
    | "seller"
    | "vendor-staff"
    | "admin"
    | "admin-staff";
};

export type TExternalProviderAuth = {
  [x: string]: string;
  name: string;
  email: string;
};
