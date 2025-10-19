export const userRoles = [
  "customer",
  "vendor",
  "vendor-staff",
  "admin",
  "admin-staff",
  "super-admin",
  "sr",
  "seller",
];

export const possibleGenders = ["male", "female", "other"];

export const userStatus = ["active", "pending", "blocked"];

export const userRole = {
  customer: "customer",
  admin: "admin",
  "super-admin": "super-admin",
  vendor: "vendor",
} as const;
