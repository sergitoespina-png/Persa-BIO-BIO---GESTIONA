
import { useMemo, useState } from "react";
import "./App.css";

const initialMovements = [
  { id: 1, type: "Ingreso", description: "Ventas del día", category: "Ventas", amount: 185000, date: "2026-11-04" },
  { id: 2, type: "Gasto", description: "Compra de mercadería", category: "Mercadería", amount: 95000, date: "2026-11-04" },
  { id: 3, type: "Ingreso", description: "Ventas del día", category: "Ventas", amount: 230000, date: "2026-11-03" },
  { id: 4, type: "Gasto", description: "Pago de arriendo", category: "Arriendo", amount: 180000, date: "2026-11-03" },
  { id: 5, type: "Gasto", description: "Transporte", category: "Transporte", amount: 25000, date: "2026-11-02" },
  { id: 6, type: "Ingreso", description: "Venta de productos", category: "Ventas", amount: 320000, date: "2026-11-02" },
  { id: 7, type: "Gasto", description: "Servicios básicos", category: "Servicios", amount: 45000, date: "2026-11-01" },
];

const monthlyData = [
  { month: "Jun", income: 2200000, expenses: 1700000 },
  { month: "Jul", income: 2600000, expenses: 1900000 },
  { month: "Ago", income: 2400000, expenses: 1800000 },
  { month: "Sep", income: 2800000, expenses: 2100000 },
  { month: "Oct", income: 2700000, expenses: 2200000 },
  { month: "Nov", income: 3000000, expenses: 2500000 },
];

const money = (value) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);

function App() {
  const [movements, setMovements] = useState(initialMovements);
  const [activePage, setActivePage] = useState("resumen");
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("Todos");

  const totals = useMemo(() => {
    const income = movements
      .filter((m) => m.type === "Ingreso")
      .reduce((sum, m) => sum + m.amount, 0);

    const expenses = movements
      .filter((m) => m.type === "Gasto")
      .reduce((sum, m) => sum + m.amount, 0);

    return { income, expenses, result: income - expenses };
  }, [movements]);

  const visibleMovements = movements.filter(
    (m) => filter === "Todos" || m.type === filter
  );

  const addMovement = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const newMovement = {
      id: Date.now(),
      type: data.get("type"),
      description: data.get("description"),
      category: data.get("category"),
      amount: Number(data.get("amount")),
      date: data.get("date"),
    };

    if (!newMovement.description || newMovement.amount <= 0) return;

    setMovements((current) => [newMovement, ...current]);
    setShowForm(false);
    event.currentTarget.reset();
  };

  const navItems = [
    { id: "resumen", icon: "▦", label: "Resumen general" },
    { id: "movimientos", icon: "⇄", label: "Movimientos" },
    { id: "informes", icon: "▤", label: "Informes" },
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">P</div>
          <div>
            <h1>Persa Gestiona</h1>
            <span>Gestión financiera</span>
          </div>
        </div>

        <div className="sidebar-label">MENÚ PRINCIPAL</div>

        <nav className="navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activePage === item.id ? "active" : ""}`}
              onClick={() => setActivePage(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon">?</div>
            <strong>¿Necesitas ayuda?</strong>
            <p>Aprende a gestionar mejor las finanzas de tu negocio.</p>
            <button onClick={() => setActivePage("informes")}>
              Ver información →
            </button>
          </div>
          <div className="user-profile">
            <div className="avatar">DL</div>
            <div>
              <strong>Demo Locatario</strong>
              <span>Mi negocio</span>
            </div>
            <span className="profile-dots">•••</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <span className="breadcrumb">Persa Gestiona /</span>
            <strong>
              {activePage === "resumen"
                ? "Resumen general"
                : activePage === "movimientos"
                ? "Movimientos"
                : "Informes"}
            </strong>
          </div>
          <div className="topbar-right">
            <span className="demo-tag">● DEMOSTRACIÓN</span>
            <div className="top-avatar">DL</div>
          </div>
        </header>

        <div className="page-content">
          <div className="welcome-row">
            <div>
              <p className="eyebrow">PANEL DE CONTROL</p>
              <h2>
                {activePage === "resumen"
                  ? "¡Hola! Bienvenido a tu negocio"
                  : activePage === "movimientos"
                  ? "Tus movimientos"
                  : "Informes financieros"}
              </h2>
              <p className="subheading">
                {activePage === "resumen"
                  ? "Aquí puedes revisar cómo marcha tu negocio."
                  : "Consulta y organiza la información financiera de tu negocio."}
              </p>
            </div>
            <button className="primary-button" onClick={() => setShowForm(true)}>
              <span>＋</span> Registrar movimiento
            </button>
          </div>

          {activePage === "resumen" && (
            <>
              <div className="section-heading">
                <div>
                  <h3>Resumen financiero</h3>
                  <p>Indicadores de tus movimientos registrados en esta demo</p>
                </div>
                <span className="period-label">◷ Noviembre 2026</span>
              </div>

              <div className="metrics-grid">
                <MetricCard
                  title="Ingresos registrados"
                  value={money(totals.income)}
                  icon="↗"
                  color="green"
                  note="Total de entradas registradas"
                />
                <MetricCard
                  title="Gastos registrados"
                  value={money(totals.expenses)}
                  icon="↙"
                  color="red"
                  note="Total de salidas registradas"
                />
                <MetricCard
                  title="Diferencia"
                  value={money(totals.result)}
                  icon="◈"
                  color="blue"
                  note="Ingresos menos gastos"
                />
                <MetricCard
                  title="Gastos sobre ingresos"
                  value={
                    totals.income
                      ? `${((totals.expenses / totals.income) * 100).toFixed(1)}%`
                      : "0%"
                  }
                  icon="%"
                  color="orange"
                  note="Proporción de gastos registrados"
                />
              </div>

              <div className="dashboard-grid">
                <section className="panel chart-panel">
                  <div className="panel-heading">
                    <div>
                      <h3>Ingresos y gastos</h3>
                      <p>Comparación de los últimos seis meses</p>
                    </div>
                    <span className="small-select">Últimos 6 meses⌄</span>
                  </div>

                  <div className="chart-legend">
                    <span><i className="legend-dot income-dot"></i>Ingresos</span>
                    <span><i className="legend-dot expense-dot"></i>Gastos</span>
                  </div>

                  <div className="bar-chart">
                    <div className="chart-axis">
                      <span>$3M</span>
                      <span>$2M</span>
                      <span>$1M</span>
                      <span>$0</span>
                    </div>
                    <div className="chart-bars">
                      {monthlyData.map((item) => (
                        <div className="bar-group" key={item.month}>
                          <div className="bars">
                            <div
                              className="bar income-bar"
                              style={{ height: `${(item.income / 3200000) * 100}%` }}
                              title={`Ingresos: ${money(item.income)}`}
                            ></div>
                            <div
                              className="bar expense-bar"
                              style={{ height: `${(item.expenses / 3200000) * 100}%` }}
                              title={`Gastos: ${money(item.expenses)}`}
                            ></div>
                          </div>
                          <span className="bar-month">{item.month}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="panel result-panel">
                  <div className="panel-heading">
                    <div>
                      <h3>Estado de tus movimientos</h3>
                      <p>Resumen de los registros actuales</p>
                    </div>
                  </div>
                  <div className="result-circle">
                    <div className="circle-inner">
                      <span>Movimientos</span>
                      <strong>{movements.length}</strong>
                      <small>registrados</small>
                    </div>
                  </div>
                  <div className="result-rows">
                    <div><span><i className="legend-dot income-dot"></i>Ingresos</span><strong>{movements.filter(m => m.type === "Ingreso").length}</strong></div>
                    <div><span><i className="legend-dot expense-dot"></i>Gastos</span><strong>{movements.filter(m => m.type === "Gasto").length}</strong></div>
                  </div>
                </section>
              </div>

              <MovementsTable
                movements={movements.slice(0, 5)}
                onViewAll={() => setActivePage("movimientos")}
              />
            </>
          )}

          {activePage === "movimientos" && (
            <section className="panel full-panel">
              <div className="panel-heading">
                <div>
                  <h3>Historial de movimientos</h3>
                  <p>Revisa los ingresos y gastos que has registrado.</p>
                </div>
                <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
                  <option>Todos</option>
                  <option>Ingreso</option>
                  <option>Gasto</option>
                </select>
              </div>
              <MovementsTable movements={visibleMovements} />
            </section>
          )}

          {activePage === "informes" && (
            <div className="reports-grid">
              <section className="panel report-card">
                <div className="report-icon">▤</div>
                <h3>Resumen financiero</h3>
                <p>Consulta los ingresos, gastos y diferencia de tus movimientos registrados.</p>
                <strong>{money(totals.result)}</strong>
                <span>Resultado simplificado</span>
              </section>
              <section className="panel report-card">
                <div className="report-icon">◷</div>
                <h3>Movimientos registrados</h3>
                <p>Revisa la cantidad de registros que has ingresado en esta demostración.</p>
                <strong>{movements.length}</strong>
                <span>Registros totales</span>
              </section>
              <section className="panel report-note">
                <h3>Aprende a interpretar tus resultados</h3>
                <p><strong>Ingresos:</strong> dinero que recibe tu negocio por sus ventas u otras entradas.</p>
                <p><strong>Gastos:</strong> pagos y salidas de dinero que registras en el sistema.</p>
                <p><strong>Diferencia:</strong> ingresos registrados menos gastos registrados. No equivale necesariamente a la utilidad contable.</p>
              </section>
            </div>
          )}

          <footer className="footer">
            <span>Persa Gestiona · Herramienta de apoyo para locatarios</span>
            <span>Versión 0.1 · Datos demostrativos</span>
          </footer>
        </div>
      </main>

      {showForm && (
        <div className="modal-backdrop" onClick={() => setShowForm(false)}>
          <form className="movement-form" onSubmit={addMovement} onClick={(e) => e.stopPropagation()}>
            <div className="form-heading">
              <div>
                <h3>Registrar movimiento</h3>
                <p>Ingresa los datos del movimiento de tu negocio.</p>
              </div>
              <button type="button" className="close-button" onClick={() => setShowForm(false)}>×</button>
            </div>

            <label>Tipo de movimiento</label>
            <select name="type" required>
              <option value="Ingreso">Ingreso</option>
              <option value="Gasto">Gasto</option>
            </select>

            <label>Descripción</label>
            <input name="description" placeholder="Ej. Venta del día" required />

            <label>Categoría</label>
            <select name="category" required>
              <option value="Ventas">Ventas</option>
              <option value="Mercadería">Mercadería</option>
              <option value="Arriendo">Arriendo</option>
              <option value="Servicios">Servicios básicos</option>
              <option value="Remuneraciones">Remuneraciones</option>
              <option value="Transporte">Transporte</option>
              <option value="Otros">Otros</option>
            </select>

            <label>Monto en pesos chilenos</label>
            <input name="amount" type="number" min="1" placeholder="Ej. 150000" required />

            <label>Fecha</label>
            <input name="date" type="date" defaultValue="2026-11-04" required />

            <button type="submit" className="primary-button submit-button">Guardar movimiento</button>
          </form>
        </div>
      )}
    </div>
  );
}

function MetricCard({ title, value, icon, color, note }) {
  return (
    <div className="metric-card">
      <div className="metric-top">
        <span>{title}</span>
        <div className={`metric-icon ${color}`}>{icon}</div>
      </div>
      <strong className="metric-value">{value}</strong>
      <span className="metric-note">{note}</span>
    </div>
  );
}

function MovementsTable({ movements, onViewAll }) {
  return (
    <section className="panel movements-panel">
      <div className="panel-heading">
        <div>
          <h3>Movimientos recientes</h3>
          <p>Últimos ingresos y gastos registrados</p>
        </div>
        {onViewAll && <button className="text-button" onClick={onViewAll}>Ver todos →</button>}
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Descripción</th>
              <th>Categoría</th>
              <th>Fecha</th>
              <th>Tipo</th>
              <th className="amount-column">Monto</th>
            </tr>
          </thead>
          <tbody>
            {movements.length === 0 ? (
              <tr><td colSpan="5" className="empty-state">Todavía no hay movimientos registrados.</td></tr>
            ) : (
              movements.map((m) => (
                <tr key={m.id}>
                  <td className="description-cell">{m.description}</td>
                  <td>{m.category}</td>
                  <td>{m.date}</td>
                  <td><span className={`status-pill ${m.type === "Ingreso" ? "status-income" : "status-expense"}`}>{m.type}</span></td>
                  <td className={`amount-column ${m.type === "Ingreso" ? "positive" : "negative"}`}>
                    {m.type === "Ingreso" ? "+" : "−"}{money(m.amount)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default App;