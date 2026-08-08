export const ROLES = {
  ADMIN: "ADMIN",
  STAFF: "STAFF",
  MEMBER: "MEMBER",
};

const ROLE_HOME = {
  ADMIN: "/admin",
  STAFF: "/staff",
  MEMBER: "/member",
};

export function getRoleHome(role) {
  return ROLE_HOME[role] ?? "/";
}
