import React, { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function Overview() {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    api.get("/ems/dashboard").then((res) => setDashboard(res.data));
  }, []);

  if (!dashboard) return <p className="text-muted mb-0">Loading dashboard...</p>;

  const leaveRows = (rows) => (
    rows.length === 0 ? (
      <tr><td colSpan="6" className="text-center text-muted py-4">No records found.</td></tr>
    ) : (
      rows.map((item, index) => (
        <tr key={item.leave_id || `${item.employee}-${index}`}>
          <td>{index + 1}</td>
          <td>EMP-{String(index + 101).padStart(3, "0")}</td>
          <td>{item.employee}</td>
          <td>{item.reason}</td>
          <td>{item.start_date}</td>
          <td>{item.end_date}</td>
        </tr>
      ))
    )
  );

  return (
    <div>
      <h2 className="h4 mb-1"><i className="bi bi-grid-1x2 me-2"></i>Dashboard Summary</h2>
      <p className="text-muted">Welcome {dashboard.employee.name}, {dashboard.employee.title}</p>

      <div className="row g-3 mb-3">
        <div className="col-12 col-md-4"><div className="card metric-card soft-card border-0"><div className="card-body d-flex align-items-center gap-3"><div className="fs-3 text-danger"><i className="bi bi-hourglass-split"></i></div><div><div className="small text-muted">Average Time</div><div className="h5 mb-0">8:30</div></div></div></div></div>
        <div className="col-12 col-md-4"><div className="card metric-card soft-card border-0"><div className="card-body d-flex align-items-center gap-3"><div className="fs-3 text-danger"><i className="bi bi-alarm"></i></div><div><div className="small text-muted">Average Log Time</div><div className="h5 mb-0">0:00</div></div></div></div></div>
        <div className="col-12 col-md-4"><div className="card metric-card soft-card border-0"><div className="card-body d-flex align-items-center gap-3"><div className="fs-3 text-danger"><i className="bi bi-stopwatch"></i></div><div><div className="small text-muted">Time Left To Cover</div><div className="h5 mb-0">0:00</div></div></div></div></div>
      </div>

      <div className="row g-3">
        <div className="col-12 col-xl-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <ul className="nav nav-tabs mb-3" id="leaveTabs" role="tablist">
                <li className="nav-item" role="presentation">
                  <button className="nav-link active" id="today-tab" data-bs-toggle="tab" data-bs-target="#today-panel" type="button" role="tab">
                    <i className="bi bi-calendar2-check me-2 text-danger"></i>On Leave Today
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button className="nav-link" id="upcoming-tab" data-bs-toggle="tab" data-bs-target="#upcoming-panel" type="button" role="tab">
                    <i className="bi bi-calendar-event me-2 text-danger"></i>Upcoming Leaves
                  </button>
                </li>
              </ul>

              <div className="tab-content">
                <div className="tab-pane fade show active" id="today-panel" role="tabpanel" aria-labelledby="today-tab">
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Sr. No</th>
                          <th>Emp Code</th>
                          <th>Employee Name</th>
                          <th>Reason</th>
                          <th>From Date</th>
                          <th>To Date</th>
                        </tr>
                      </thead>
                      <tbody>{leaveRows(dashboard.today_leaves)}</tbody>
                    </table>
                  </div>
                </div>
                <div className="tab-pane fade" id="upcoming-panel" role="tabpanel" aria-labelledby="upcoming-tab">
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Sr. No</th>
                          <th>Emp Code</th>
                          <th>Employee Name</th>
                          <th>Reason</th>
                          <th>From Date</th>
                          <th>To Date</th>
                        </tr>
                      </thead>
                      <tbody>{leaveRows(dashboard.upcoming_leaves)}</tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-4">
          <div className="card border-0 shadow-sm mb-3">
            <div className="card-body">
              <h6 className="mb-3"><i className="bi bi-journal-check me-2 text-danger"></i>Monthly Leave</h6>
              <div className="row g-2 text-center">
                <div className="col-6"><div className="soft-card border rounded p-2"><div className="h4 mb-0">{dashboard.today_leaves.length}</div><small className="text-muted">On Leave Today</small></div></div>
                <div className="col-6"><div className="soft-card border rounded p-2"><div className="h4 mb-0">{dashboard.upcoming_leaves.length}</div><small className="text-muted">Upcoming</small></div></div>
                <div className="col-6"><div className="soft-card border rounded p-2"><div className="h4 mb-0">{dashboard.upcoming_holidays.length}</div><small className="text-muted">Holidays</small></div></div>
                <div className="col-6"><div className="soft-card border rounded p-2"><div className="h4 mb-0">{dashboard.my_projects.length}</div><small className="text-muted">Projects</small></div></div>
              </div>
            </div>
          </div>
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="mb-3"><i className="bi bi-calendar2-heart me-2 text-danger"></i>Upcoming Holidays</h6>
              {dashboard.upcoming_holidays.length === 0 ? (
                <p className="text-muted mb-0">No upcoming holidays.</p>
              ) : (
                dashboard.upcoming_holidays.map((holiday) => (
                  <div key={holiday.id} className="border rounded p-2 mb-2 bg-body-tertiary">
                    <div className="fw-semibold">{holiday.name}</div>
                    <small className="text-muted">{holiday.holiday_date}</small>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
