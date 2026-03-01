import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { clearSession, readEmployee } from "../lib/auth";
import { applyTheme, getSavedTheme, toggleTheme } from "../lib/theme";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Overview", icon: "bi-speedometer2" },
  { to: "/profile", label: "Profile", icon: "bi-person-badge" },
  { to: "/attendance", label: "Attendance", icon: "bi-fingerprint" },
  { to: "/leaves", label: "Leaves", icon: "bi-calendar2-check" },
  { to: "/holidays", label: "Holidays", icon: "bi-calendar2-heart" },
  { to: "/team", label: "Team", icon: "bi-people" },
  { to: "/projects", label: "Projects", icon: "bi-kanban" },
  { to: "/time-logs", label: "Time Logs", icon: "bi-clock-history" },
];

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const employee = readEmployee();
  const [theme, setTheme] = useState(getSavedTheme());
  const navItems = employee?.role === "admin"
    ? [...NAV_ITEMS, { to: "/admin", label: "Admin", icon: "bi-shield-lock" }]
    : NAV_ITEMS;

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const logout = () => {
    clearSession();
    navigate("/");
  };

  const closeMobileMenu = () => {
    const menu = document.getElementById("mobileMenu");
    if (!menu) return;

    const bs = window.bootstrap;
    if (bs?.Offcanvas) {
      const instance = bs.Offcanvas.getInstance(menu) || new bs.Offcanvas(menu);
      instance.hide();
      return;
    }

    menu.classList.remove("show");
    document.body.classList.remove("offcanvas-backdrop");
  };

  const mobileNavigate = (to) => {
    navigate(to);
    closeMobileMenu();
  };

  const onToggleTheme = () => {
    setTheme((prev) => toggleTheme(prev));
  };

  const renderNav = (isMobile = false) => (
    <>
      <div className="list-group list-group-flush mb-3">
        {navItems.map((item) => (
          isMobile ? (
            <button
              key={item.to}
              type="button"
              className={`list-group-item list-group-item-action border-0 rounded mb-1 ${location.pathname === item.to ? "active" : ""}`}
              onClick={() => mobileNavigate(item.to)}
            >
              <i className={`bi ${item.icon} me-2`}></i>
              {item.label}
            </button>
          ) : (
            <Link
              key={item.to}
              to={item.to}
              title={item.label}
              className={`rail-link ${location.pathname === item.to ? "active" : ""}`}
            >
              <i className={`bi ${item.icon}`}></i>
            </Link>
          )
        ))}
      </div>
    </>
  );

  const currentPage = navItems.find((item) => item.to === location.pathname)?.label || "Dashboard";

  return (
    <div className="app-shell bg-body-tertiary">
      <div className="container-fluid py-3 py-md-4">
        <div className="d-lg-none mb-3">
          <div className="card shadow-sm border-0">
            <div className="card-body d-flex justify-content-between align-items-center py-2">
              <div className="d-flex align-items-center gap-3">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 34, height: 34 }}>
                  <i className="bi bi-building"></i>
                </div>
                <div>
                  <h6 className="mb-0">{currentPage}</h6>
                  <small className="text-muted">EMS Workspace</small>
                </div>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-secondary" onClick={onToggleTheme} title="Toggle theme">
                  <i className={`bi ${theme === "dark" ? "bi-sun" : "bi-moon-stars"}`}></i>
                </button>
                <button
                  className="btn btn-outline-primary"
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#mobileMenu"
                  aria-controls="mobileMenu"
                >
                  <i className="bi bi-list me-1"></i>
                  Menu
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="offcanvas offcanvas-start d-lg-none" tabIndex="-1" id="mobileMenu" aria-labelledby="mobileMenuLabel">
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="mobileMenuLabel">Navigation</h5>
            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div className="offcanvas-body d-flex flex-column">
            {renderNav(true)}
            <div className="border rounded p-3 bg-body-tertiary mb-3">
              <div className="fw-semibold">{employee?.full_name || "Employee"}</div>
              <div className="text-muted small">{employee?.title || ""}</div>
              <span className="badge text-bg-secondary mt-2 text-capitalize">{employee?.role || "user"}</span>
            </div>
            <button className="btn btn-outline-danger mt-auto" onClick={logout}>Logout</button>
          </div>
        </div>

        <div className="row g-3">
          <aside className="d-none d-lg-block col-auto">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-header bg-primary text-white d-flex align-items-center justify-content-center py-3">
                <div className="bg-white text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }}>
                  <i className="bi bi-buildings"></i>
                </div>
              </div>
              <div className="card-body d-flex flex-column align-items-center icon-rail">
                {renderNav()}
              </div>
            </div>
          </aside>

          <main className="col">
            <div className="card border-0 shadow-sm top-header mb-3">
              <div className="card-body py-3 d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div>
                  <h4 className="mb-0">{currentPage}</h4>
                  <small className="text-muted">Workspace dashboard</small>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <button className="btn btn-light border" title="Notifications">
                    <i className="bi bi-bell"></i>
                  </button>
                  <button className="btn btn-light border" onClick={onToggleTheme} title="Toggle theme">
                    <i className={`bi ${theme === "dark" ? "bi-sun" : "bi-moon-stars"}`}></i>
                  </button>
                  <div className="border rounded-3 px-3 py-2 bg-body d-flex align-items-center gap-2">
                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: 34, height: 34 }}>
                      <i className="bi bi-person"></i>
                    </div>
                    <div>
                      <div className="fw-semibold lh-1">{employee?.full_name || "Employee"}</div>
                      <small className="text-muted">{employee?.title || "Team Member"}</small>
                    </div>
                  </div>
                  <button className="btn btn-outline-danger" onClick={logout} title="Logout">
                    <i className="bi bi-box-arrow-right me-1"></i>
                    Logout
                  </button>
                </div>
              </div>
            </div>
            <div className="card shadow-sm border-0">
              <div className="card-body p-3 p-md-4">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
