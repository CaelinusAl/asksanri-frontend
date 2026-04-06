/** Admin rotalarında global modal / capture bileşenlerini kapatmak için */
export function isAdminPath(pathname) {
  return typeof pathname === "string" && pathname.startsWith("/admin");
}
