const role = sessionStorage.getItem('userData');
var currentRole = "";
if(role)
{
  currentRole = role.role;
}

export const authRoles = {
  admin: currentRole, // Only Super Admin has access,

};

// Check out app/views/dashboard/DashboardRoutes.js
// Only SA & Admin has dashboard access

// const dashboardRoutes = [
//   {
//     path: "/dashboard/analytics",
//     component: Analytics,
//     auth: authRoles.admin
//   }
// ];