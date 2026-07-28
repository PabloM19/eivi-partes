"use client";

import { FormEvent, useMemo, useState } from "react";

type Role = "admin" | "worker";
type AdminView =
  | "dashboard"
  | "parts"
  | "employees"
  | "clients"
  | "houses"
  | "catalogs"
  | "reports"
  | "archive";
type WorkerView = "worker-home" | "new-part" | "profile";

type Part = {
  id: number;
  date: string;
  day: string;
  employee: string;
  client: string;
  house: string;
  task: string;
  hours: number;
  category: "Oficial" | "Peón";
  status: "Pendiente" | "Revisado" | "Corrección";
};

const parts: Part[] = [
  {
    id: 63819,
    date: "28/07/2026",
    day: "Hoy",
    employee: "Luz Urbano",
    client: "Eiviplant",
    house: "EIVIPLANT · GARDEN",
    task: "Reunión con Zerión",
    hours: 1,
    category: "Oficial",
    status: "Pendiente",
  },
  {
    id: 63817,
    date: "27/07/2026",
    day: "Ayer",
    employee: "Francis Urbano",
    client: "Servicios Es Cubells",
    house: "ATENA",
    task: "Repaso de riego y revisión de zonas",
    hours: 1.25,
    category: "Oficial",
    status: "Revisado",
  },
  {
    id: 63815,
    date: "27/07/2026",
    day: "Ayer",
    employee: "Omar",
    client: "Servicios Es Cubells",
    house: "CASA INFINITY",
    task: "Cortar césped, hacer bordes y retirar residuos",
    hours: 1.5,
    category: "Peón",
    status: "Pendiente",
  },
  {
    id: 63808,
    date: "27/07/2026",
    day: "Ayer",
    employee: "Oscar",
    client: "Servicios Es Cubells",
    house: "KUSSENROW",
    task: "Regar macetas y jardineras",
    hours: 1,
    category: "Peón",
    status: "Pendiente",
  },
  {
    id: 63806,
    date: "27/07/2026",
    day: "Ayer",
    employee: "Antonio S. Sánchez",
    client: "Servicios Es Cubells",
    house: "P. ALTO Nº 12",
    task: "Ver trabajos con la propietaria",
    hours: 0.25,
    category: "Oficial",
    status: "Corrección",
  },
  {
    id: 63792,
    date: "25/07/2026",
    day: "Sábado",
    employee: "Mónica",
    client: "Eiviplant",
    house: "EIVIPLANT · GARDEN",
    task: "Organización, limpieza y preparación de portes",
    hours: 7,
    category: "Peón",
    status: "Revisado",
  },
];

const employees = [
  { name: "Luz Urbano", user: "partesluz", type: "Oficial", role: "Administradora", active: true, parts: 28 },
  { name: "Oscar", user: "oscar", type: "Peón", role: "Operario", active: true, parts: 46 },
  { name: "Antonio S. Sánchez", user: "antonio", type: "Oficial", role: "Operario", active: true, parts: 61 },
  { name: "Francis Urbano", user: "francis", type: "Oficial", role: "Operario", active: true, parts: 39 },
  { name: "Mónica", user: "monica", type: "Peón", role: "Operario", active: false, parts: 17 },
];

const clients = [
  { name: "Eiviplant", code: "02", phone: "—", houses: 2, status: "Activo" },
  { name: "Servicios Es Cubells", code: "423", phone: "971 000 000", houses: 18, status: "Activo" },
  { name: "Tactic Studio", code: "01", phone: "609 738 139", houses: 1, status: "Inactivo" },
];

const houses = [
  { name: "EIVIPLANT · GARDEN", address: "Ibiza", type: "Interno", client: "Eiviplant" },
  { name: "PAR 4", address: "Es Cubells", type: "Mantenimiento", client: "Servicios Es Cubells" },
  { name: "PAR 4 OBRA", address: "Es Cubells", type: "Obra", client: "Servicios Es Cubells" },
  { name: "ISCHIA", address: "Sant Josep", type: "Mantenimiento", client: "Servicios Es Cubells" },
  { name: "P. ALTO Nº 9", address: "Vista Alegre", type: "Mantenimiento", client: "Servicios Es Cubells" },
  { name: "ATENA", address: "Es Cubells", type: "Mantenimiento", client: "Servicios Es Cubells" },
];

const tasks = [
  "Regar",
  "Sacar mala hierba",
  "Conectar riego",
  "Administración",
  "Ventas",
  "Limpieza",
  "Organización",
  "Descargar y colocar plantas",
  "Poda",
  "Recoger",
  "Cavar",
  "Repaso de riego",
];

const navItems: { id: AdminView; label: string; icon: string; group?: string }[] = [
  { id: "dashboard", label: "Inicio", icon: "space_dashboard" },
  { id: "parts", label: "Partes", icon: "assignment", group: "GESTIÓN" },
  { id: "employees", label: "Empleados", icon: "group", group: "PERSONAS" },
  { id: "clients", label: "Clientes", icon: "domain", group: "ORGANIZACIÓN" },
  { id: "houses", label: "Casas / Obras", icon: "home_work" },
  { id: "catalogs", label: "Catálogos", icon: "category" },
  { id: "reports", label: "Informes", icon: "monitoring", group: "ANÁLISIS" },
  { id: "archive", label: "Archivo", icon: "inventory_2" },
];

const viewTitles: Record<AdminView, { title: string; eyebrow: string }> = {
  dashboard: { title: "Buenos días, Luz", eyebrow: "Martes, 28 de julio" },
  parts: { title: "Partes de trabajo", eyebrow: "Gestión y revisión" },
  employees: { title: "Empleados", eyebrow: "Personas y accesos" },
  clients: { title: "Clientes", eyebrow: "Organización" },
  houses: { title: "Casas y obras", eyebrow: "Lugares de trabajo" },
  catalogs: { title: "Catálogos", eyebrow: "Configuración operativa" },
  reports: { title: "Informes", eyebrow: "Análisis e impresión" },
  archive: { title: "Archivo histórico", eyebrow: "Conservación de datos" },
};

function Icon({ name, filled = false }: { name: string; filled?: boolean }) {
  return (
    <span className={`material-symbols-rounded icon ${filled ? "filled" : ""}`} aria-hidden="true">
      {name}
    </span>
  );
}

function StatusChip({ status }: { status: Part["status"] | "Activo" | "Inactivo" | "Archivado" }) {
  const className = status.toLowerCase().replace("ó", "o");
  return <span className={`status-chip ${className}`}>{status}</span>;
}

function formatHours(value: number) {
  const hours = Math.floor(value);
  const minutes = Math.round((value - hours) * 60);
  if (!minutes) return `${hours} h`;
  if (!hours) return `${minutes} min`;
  return `${hours} h ${minutes} min`;
}

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand ${compact ? "compact" : ""}`} aria-label="Eiviplant">
      <span className="brand-mark">
        <Icon name="psychiatry" filled />
      </span>
      {!compact && (
        <span className="brand-copy">
          <strong>Eiviplant</strong>
          <small>Partes de trabajo</small>
        </span>
      )}
    </div>
  );
}

function LoadingVeil() {
  return (
    <div className="loading-veil" aria-live="polite">
      <span className="spinner" />
      <span>Actualizando vista…</span>
    </div>
  );
}

function Login({
  onLogin,
}: {
  onLogin: (role: Role) => void;
}) {
  const [remember, setRemember] = useState(true);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    onLogin("admin");
  };

  return (
    <main className="login-page">
      <div className="login-orbit orbit-one" />
      <div className="login-orbit orbit-two" />
      <section className="login-story">
        <Logo />
        <div>
          <span className="soft-chip">
            <Icon name="eco" />
            Trabajo más claro, cada día
          </span>
          <h1>La gestión de Eiviplant, sin el ruido.</h1>
          <p>
            Partes, operarios e informes en un espacio rápido, ordenado y preparado para trabajar
            desde cualquier dispositivo.
          </p>
        </div>
        <div className="login-mini-grid">
          <article>
            <Icon name="task_alt" />
            <div><strong>63.819</strong><span>partes organizados</span></div>
          </article>
          <article>
            <Icon name="bolt" />
            <div><strong>En segundos</strong><span>sin esperas ni dudas</span></div>
          </article>
        </div>
      </section>

      <section className="login-panel">
        <div className="login-card glass">
          <div className="mobile-logo"><Logo /></div>
          <span className="eyebrow">BIENVENIDA</span>
          <h2>Accede a tu área</h2>
          <p>Este es un prototipo. Puedes entrar con cualquier dato.</p>
          <form onSubmit={submit}>
            <label>
              Usuario o correo
              <span className="input-with-icon">
                <Icon name="person" />
                <input defaultValue="partesluz" autoComplete="username" />
              </span>
            </label>
            <label>
              Contraseña
              <span className="input-with-icon">
                <Icon name="lock" />
                <input defaultValue="123456" type="password" autoComplete="current-password" />
              </span>
            </label>
            <div className="form-row split">
              <label className="check-row">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                />
                Recordarme
              </label>
              <button type="button" className="text-button">¿Has olvidado tu contraseña?</button>
            </div>
            <button className="primary-button full" type="submit">
              Entrar como administradora
              <Icon name="arrow_forward" />
            </button>
            <button className="secondary-button full" type="button" onClick={() => onLogin("worker")}>
              <Icon name="smartphone" />
              Ver demo de operario
            </button>
          </form>
          <small className="demo-note">
            <Icon name="info" />
            Ningún dato de esta demo se envía a Joomla.
          </small>
        </div>
      </section>
    </main>
  );
}

function AdminSidebar({
  active,
  onNavigate,
  open,
  onClose,
}: {
  active: AdminView;
  onNavigate: (view: AdminView) => void;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {open && <button className="sidebar-backdrop" onClick={onClose} aria-label="Cerrar menú" />}
      <aside className={`sidebar glass ${open ? "open" : ""}`}>
        <div className="sidebar-top">
          <Logo />
          <button className="icon-button close-sidebar" onClick={onClose} aria-label="Cerrar menú">
            <Icon name="close" />
          </button>
        </div>
        <nav aria-label="Navegación principal">
          {navItems.map((item, index) => {
            const showGroup =
              item.group && item.group !== navItems[index - 1]?.group;
            return (
              <div key={item.id}>
                {showGroup && <p className="nav-group">{item.group}</p>}
                <button
                  className={`nav-item ${active === item.id ? "active" : ""}`}
                  onClick={() => onNavigate(item.id)}
                  data-testid={`nav-${item.id}`}
                >
                  <Icon name={item.icon} filled={active === item.id} />
                  <span>{item.label}</span>
                  {item.id === "parts" && <b>4</b>}
                </button>
              </div>
            );
          })}
        </nav>
        <div className="sidebar-help">
          <span><Icon name="support_agent" /></span>
          <div>
            <strong>¿Necesitas ayuda?</strong>
            <small>Consulta la guía rápida</small>
          </div>
          <Icon name="arrow_forward" />
        </div>
        <div className="sidebar-profile">
          <span className="avatar">LU</span>
          <div><strong>Luz Urbano</strong><small>Administradora</small></div>
          <Icon name="more_vert" />
        </div>
      </aside>
    </>
  );
}

function Topbar({
  view,
  role,
  onRoleChange,
  onMenu,
  onLogout,
}: {
  view: AdminView;
  role: Role;
  onRoleChange: (role: Role) => void;
  onMenu: () => void;
  onLogout: () => void;
}) {
  return (
    <header className="topbar">
      <button className="icon-button menu-button" onClick={onMenu} aria-label="Abrir menú">
        <Icon name="menu" />
      </button>
      <div>
        <span className="eyebrow">{viewTitles[view].eyebrow}</span>
        <h1>{viewTitles[view].title}</h1>
      </div>
      <div className="topbar-actions">
        <div className="role-switch" aria-label="Cambiar vista de demostración">
          <button className={role === "admin" ? "active" : ""} onClick={() => onRoleChange("admin")}>
            Admin
          </button>
          <button className={role === "worker" ? "active" : ""} onClick={() => onRoleChange("worker")}>
            Operario
          </button>
        </div>
        <button className="icon-button notification-button" aria-label="Notificaciones">
          <Icon name="notifications" />
          <i />
        </button>
        <button className="avatar-button" onClick={onLogout} title="Cerrar sesión">
          LU
        </button>
      </div>
    </header>
  );
}

function MetricCard({
  icon,
  value,
  label,
  trend,
  tone = "",
}: {
  icon: string;
  value: string;
  label: string;
  trend: string;
  tone?: string;
}) {
  return (
    <article className={`metric-card bento-card ${tone}`}>
      <span className="metric-icon"><Icon name={icon} /></span>
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
      <small>{trend}</small>
    </article>
  );
}

function Dashboard({
  onNavigate,
  onSelectPart,
  notify,
}: {
  onNavigate: (view: AdminView) => void;
  onSelectPart: (part: Part) => void;
  notify: (message: string) => void;
}) {
  return (
    <div className="page-stack">
      <section className="dashboard-grid">
        <MetricCard icon="assignment" value="18" label="Partes de hoy" trend="+4 respecto a ayer" />
        <MetricCard icon="pending_actions" value="4" label="Pendientes de revisar" trend="Requieren tu atención" tone="amber" />
        <MetricCard icon="schedule" value="146 h" label="Horas esta semana" trend="+8,5 % semanal" />
        <MetricCard icon="groups" value="9" label="Operarios activos" trend="7 con actividad hoy" />

        <article className="welcome-card bento-card">
          <div>
            <span className="soft-chip light"><Icon name="wb_sunny" /> Todo al día</span>
            <h2>Tu mañana, de un vistazo</h2>
            <p>Revisa los partes pendientes o genera los informes que más utiliza Luz.</p>
          </div>
          <button className="light-button" onClick={() => onNavigate("parts")}>
            Revisar pendientes <Icon name="arrow_forward" />
          </button>
          <div className="leaf-shape"><Icon name="psychiatry" filled /></div>
        </article>

        <article className="quick-actions bento-card">
          <div className="section-heading">
            <div><span className="eyebrow">ACCESOS RÁPIDOS</span><h2>¿Qué necesitas?</h2></div>
          </div>
          <div className="quick-grid">
            <button onClick={() => onNavigate("reports")}>
              <span><Icon name="badge" /></span>
              <strong>Por empleado</strong>
              <small>Imprimir horas</small>
            </button>
            <button onClick={() => onNavigate("reports")}>
              <span><Icon name="home_work" /></span>
              <strong>Por casa</strong>
              <small>Generar informe</small>
            </button>
            <button onClick={() => onNavigate("employees")}>
              <span><Icon name="person_add" /></span>
              <strong>Empleado</strong>
              <small>Crear acceso</small>
            </button>
            <button onClick={() => onNavigate("houses")}>
              <span><Icon name="add_home_work" /></span>
              <strong>Casa / obra</strong>
              <small>Añadir ubicación</small>
            </button>
          </div>
        </article>
      </section>

      <section className="content-grid">
        <article className="panel recent-panel">
          <div className="section-heading">
            <div><span className="eyebrow">EN TIEMPO REAL</span><h2>Pendientes de revisar</h2></div>
            <button className="text-button" onClick={() => onNavigate("parts")}>Ver todos <Icon name="arrow_forward" /></button>
          </div>
          <div className="compact-list">
            {parts.filter((part) => part.status !== "Revisado").slice(0, 4).map((part) => (
              <button key={part.id} className="compact-row" onClick={() => onSelectPart(part)}>
                <span className={`category-dot ${part.category === "Oficial" ? "official" : ""}`} />
                <span className="row-main"><strong>{part.house}</strong><small>{part.task}</small></span>
                <span className="row-person">{part.employee}</span>
                <strong className="row-hours">{formatHours(part.hours)}</strong>
                <StatusChip status={part.status} />
                <Icon name="chevron_right" />
              </button>
            ))}
          </div>
        </article>

        <article className="panel hours-panel">
          <div className="section-heading">
            <div><span className="eyebrow">SEMANA ACTUAL</span><h2>Horas registradas</h2></div>
            <button className="icon-button" onClick={() => notify("Vista semanal actualizada")}><Icon name="more_horiz" /></button>
          </div>
          <div className="hours-total"><strong>146 h</strong><span className="positive-chip">+8,5 %</span></div>
          <div className="bar-chart" aria-label="Horas por día">
            {[58, 76, 68, 90, 82, 35, 18].map((height, index) => (
              <div key={index}><i style={{ height: `${height}%` }} /><span>{["L", "M", "X", "J", "V", "S", "D"][index]}</span></div>
            ))}
          </div>
          <div className="hours-legend">
            <span><i className="official" /> Oficial <strong>82 h</strong></span>
            <span><i /> Peón <strong>64 h</strong></span>
          </div>
        </article>
      </section>
    </div>
  );
}

function PartsView({
  onSelectPart,
  notify,
}: {
  onSelectPart: (part: Part) => void;
  notify: (message: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Todos");
  const filtered = useMemo(
    () =>
      parts.filter((part) => {
        const text = `${part.house} ${part.employee} ${part.client} ${part.task}`.toLowerCase();
        return text.includes(query.toLowerCase()) && (status === "Todos" || part.status === status);
      }),
    [query, status],
  );

  return (
    <div className="page-stack">
      <section className="page-toolbar">
        <div className="toolbar-copy"><strong>{filtered.length} partes</strong><span>Mostrando actividad reciente</span></div>
        <div className="toolbar-actions">
          <button className="secondary-button" onClick={() => notify("Preparando vista de impresión…")}><Icon name="print" /> Imprimir</button>
          <button className="secondary-button" onClick={() => notify("Exportación preparada (demo)")}><Icon name="download" /> Exportar</button>
          <button className="primary-button" onClick={() => notify("Formulario de nuevo parte abierto")}><Icon name="add" /> Nuevo parte</button>
        </div>
      </section>

      <section className="filter-panel glass">
        <label className="search-box">
          <Icon name="search" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por casa, empleado o tarea…"
            aria-label="Buscar partes"
          />
        </label>
        <label>Desde<input type="date" defaultValue="2026-07-20" /></label>
        <label>Hasta<input type="date" defaultValue="2026-07-28" /></label>
        <label>Estado
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option>Todos</option><option>Pendiente</option><option>Revisado</option><option>Corrección</option>
          </select>
        </label>
        <button className="filter-more"><Icon name="tune" /> Más filtros <span>3</span></button>
      </section>

      <section className="panel table-panel">
        <div className="table-head parts-grid">
          <span>Estado</span><span>Fecha</span><span>Empleado</span><span>Casa / obra</span><span>Tarea</span><span>Horas</span><span />
        </div>
        <div className="parts-table">
          {filtered.map((part) => (
            <button className="table-row parts-grid" key={part.id} onClick={() => onSelectPart(part)}>
              <span data-label="Estado"><StatusChip status={part.status} /></span>
              <span data-label="Fecha"><strong>{part.date}</strong><small>#{part.id}</small></span>
              <span data-label="Empleado" className="person-cell"><i>{part.employee.slice(0, 2).toUpperCase()}</i>{part.employee}</span>
              <span data-label="Casa / obra"><strong>{part.house}</strong><small>{part.client}</small></span>
              <span data-label="Tarea" className="task-cell">{part.task}<small>{part.category}</small></span>
              <span data-label="Horas" className="hours-cell">{formatHours(part.hours)}</span>
              <span className="row-actions"><Icon name="chevron_right" /></span>
            </button>
          ))}
          {!filtered.length && (
            <div className="empty-state">
              <span><Icon name="search_off" /></span>
              <h3>No encontramos partes</h3>
              <p>Prueba a cambiar la búsqueda o limpiar los filtros.</p>
              <button className="secondary-button" onClick={() => { setQuery(""); setStatus("Todos"); }}>Limpiar filtros</button>
            </div>
          )}
        </div>
        <div className="pagination">
          <span>Mostrando {filtered.length} de 63.819</span>
          <div><button disabled><Icon name="chevron_left" /></button><button className="active">1</button><button>2</button><button>3</button><button><Icon name="chevron_right" /></button></div>
        </div>
      </section>
    </div>
  );
}

function EmployeesView({
  onAdd,
  notify,
}: {
  onAdd: () => void;
  notify: (message: string) => void;
}) {
  return (
    <div className="page-stack">
      <section className="page-toolbar">
        <div className="toolbar-copy"><strong>{employees.length} empleados</strong><span>Usuarios y datos laborales en un solo lugar</span></div>
        <button className="primary-button" onClick={onAdd}><Icon name="person_add" /> Nuevo empleado</button>
      </section>
      <section className="mini-stats">
        <article><span><Icon name="groups" /></span><div><strong>9</strong><small>Empleados activos</small></div></article>
        <article><span><Icon name="engineering" /></span><div><strong>5</strong><small>Oficiales</small></div></article>
        <article><span><Icon name="yard" /></span><div><strong>4</strong><small>Peones</small></div></article>
      </section>
      <section className="panel table-panel">
        <div className="simple-table-head employee-grid"><span>Empleado</span><span>Usuario</span><span>Tipo</span><span>Rol</span><span>Estado</span><span>Partes</span><span /></div>
        {employees.map((employee) => (
          <button className="simple-table-row employee-grid" key={employee.user} onClick={() => notify(`Ficha de ${employee.name} abierta`)}>
            <span className="person-cell"><i>{employee.name.slice(0, 2).toUpperCase()}</i><strong>{employee.name}</strong></span>
            <span>@{employee.user}</span><span>{employee.type}</span><span>{employee.role}</span>
            <span><StatusChip status={employee.active ? "Activo" : "Inactivo"} /></span>
            <strong>{employee.parts}</strong><Icon name="more_horiz" />
          </button>
        ))}
      </section>
    </div>
  );
}

function ClientsView({ notify }: { notify: (message: string) => void }) {
  return (
    <div className="page-stack">
      <section className="page-toolbar">
        <div className="toolbar-copy"><strong>{clients.length} clientes</strong><span>Empresas, contactos y trabajos asociados</span></div>
        <button className="primary-button" onClick={() => notify("Formulario de cliente abierto")}><Icon name="add_business" /> Nuevo cliente</button>
      </section>
      <section className="cards-list">
        {clients.map((client) => (
          <article className="entity-card" key={client.code}>
            <div className="entity-icon"><Icon name="domain" /></div>
            <div className="entity-copy"><small>CLIENTE {client.code}</small><h3>{client.name}</h3><span><Icon name="call" /> {client.phone}</span></div>
            <div className="entity-meta"><strong>{client.houses}</strong><small>casas / obras</small></div>
            <StatusChip status={client.status as "Activo" | "Inactivo"} />
            <button className="icon-button" onClick={() => notify(`Ficha de ${client.name} abierta`)}><Icon name="arrow_forward" /></button>
          </article>
        ))}
      </section>
    </div>
  );
}

function HousesView({ notify }: { notify: (message: string) => void }) {
  const [type, setType] = useState("Todos");
  const filtered = houses.filter((house) => type === "Todos" || house.type === type);
  return (
    <div className="page-stack">
      <section className="page-toolbar">
        <div className="toolbar-copy"><strong>{houses.length} casas y obras</strong><span>Lugares de trabajo vinculados a clientes</span></div>
        <button className="primary-button" onClick={() => notify("Formulario de casa / obra abierto")}><Icon name="add_home_work" /> Nueva casa / obra</button>
      </section>
      <section className="filter-panel short glass">
        <label className="search-box"><Icon name="search" /><input placeholder="Buscar una casa…" /></label>
        <div className="segmented">
          {["Todos", "Mantenimiento", "Obra", "Interno"].map((item) => (
            <button className={type === item ? "active" : ""} key={item} onClick={() => setType(item)}>{item}</button>
          ))}
        </div>
      </section>
      <section className="house-grid">
        {filtered.map((house) => (
          <article className="house-card" key={house.name}>
            <div className="house-top"><span><Icon name={house.type === "Obra" ? "construction" : "potted_plant"} /></span><span className="soft-chip">{house.type}</span></div>
            <h3>{house.name}</h3><p><Icon name="location_on" /> {house.address}</p>
            <div className="house-client"><small>CLIENTE</small><strong>{house.client}</strong></div>
            <button className="text-button" onClick={() => notify(`Detalle de ${house.name} abierto`)}>Ver actividad <Icon name="arrow_forward" /></button>
          </article>
        ))}
      </section>
    </div>
  );
}

function CatalogsView({ notify }: { notify: (message: string) => void }) {
  const [tab, setTab] = useState("Tareas");
  const catalog = tab === "Tareas"
    ? tasks.map((name, index) => ({ name, meta: `${12 + index * 3} usos este mes`, price: "Activo" }))
    : tab === "Materiales"
      ? ["Abono orgánico", "Tierra vegetal", "Tubo de riego", "Grava", "Tacos y clavos"].map((name) => ({ name, meta: "Unidad", price: "Activo" }))
      : tab === "Tipos empleado"
        ? [{ name: "Peón", meta: "Precio por hora", price: "10 €" }, { name: "Oficial", meta: "Precio por hora", price: "30 €" }]
        : ["Mantenimiento", "Obra", "Interno"].map((name) => ({ name, meta: "Tipo de trabajo", price: "Activo" }));
  return (
    <div className="page-stack">
      <section className="page-toolbar">
        <div className="toolbar-copy"><strong>Datos operativos</strong><span>Listas que alimentan los formularios de partes</span></div>
        <button className="primary-button" onClick={() => notify(`Nuevo registro en ${tab}`)}><Icon name="add" /> Añadir registro</button>
      </section>
      <section className="panel catalog-panel">
        <div className="tabs">
          {["Tareas", "Materiales", "Tipos empleado", "Tipos obra"].map((item) => (
            <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{item}</button>
          ))}
        </div>
        <div className="catalog-list">
          {catalog.map((item, index) => (
            <button key={item.name} onClick={() => notify(`${item.name}: edición simulada`)}>
              <span className="catalog-number">{String(index + 1).padStart(2, "0")}</span>
              <span><strong>{item.name}</strong><small>{item.meta}</small></span>
              <StatusChip status="Activo" />
              <strong>{item.price === "Activo" ? "" : item.price}</strong>
              <Icon name="edit" />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function ReportsView({ notify }: { notify: (message: string) => void }) {
  const [group, setGroup] = useState("General");
  return (
    <div className="page-stack">
      <section className="report-hero">
        <div><span className="eyebrow light-text">INFORMES</span><h2>Convierte el trabajo diario en información clara.</h2><p>Filtra, agrupa e imprime los partes sin recorrer menús interminables.</p></div>
        <Icon name="analytics" />
      </section>
      <section className="panel report-builder">
        <div className="section-heading">
          <div><span className="eyebrow">CONFIGURAR INFORME</span><h2>¿Qué quieres consultar?</h2></div>
          <div className="segmented">
            {["General", "Por empleado", "Por casa / obra"].map((item) => <button className={group === item ? "active" : ""} onClick={() => setGroup(item)} key={item}>{item}</button>)}
          </div>
        </div>
        <div className="report-filters">
          <label>Fecha inicial<input type="date" defaultValue="2026-07-20" /></label>
          <label>Fecha final<input type="date" defaultValue="2026-07-28" /></label>
          <label>Cliente<select><option>Todos los clientes</option><option>Eiviplant</option><option>Servicios Es Cubells</option></select></label>
          <label>{group === "Por casa / obra" ? "Casa / obra" : "Empleado"}<select><option>Todos</option><option>Luz Urbano</option><option>Oscar</option></select></label>
          <button className="primary-button" onClick={() => notify("Informe actualizado")}><Icon name="refresh" /> Generar informe</button>
        </div>
      </section>
      <section className="mini-stats report-stats">
        <article><span><Icon name="assignment" /></span><div><strong>64</strong><small>Partes</small></div></article>
        <article><span><Icon name="schedule" /></span><div><strong>146 h</strong><small>Total de horas</small></div></article>
        <article><span><Icon name="engineering" /></span><div><strong>82 h</strong><small>Oficial</small></div></article>
        <article><span><Icon name="yard" /></span><div><strong>64 h</strong><small>Peón</small></div></article>
      </section>
      <section className="panel table-panel">
        <div className="section-heading report-results">
          <div><span className="eyebrow">20–28 JUL 2026</span><h2>Resultados · {group}</h2></div>
          <div><button className="secondary-button" onClick={() => notify("Vista de impresión preparada")}><Icon name="print" /> Imprimir</button><button className="secondary-button" onClick={() => notify("CSV generado (demo)")}><Icon name="download" /> Exportar</button></div>
        </div>
        <div className="simple-table-head report-grid"><span>Fecha</span><span>Empleado</span><span>Casa / obra</span><span>Cliente</span><span>Tareas</span><span>Horas</span></div>
        {parts.slice(0, 5).map((part) => (
          <div className="simple-table-row report-grid" key={part.id}><strong>{part.date}</strong><span>{part.employee}</span><strong>{part.house}</strong><span>{part.client}</span><span>{part.task}</span><strong>{formatHours(part.hours)}</strong></div>
        ))}
      </section>
    </div>
  );
}

function ArchiveView({ notify }: { notify: (message: string) => void }) {
  return (
    <div className="page-stack">
      <section className="archive-intro panel">
        <span className="archive-icon"><Icon name="inventory_2" /></span>
        <div><span className="eyebrow">ARCHIVADO AUTOMÁTICO</span><h2>Los datos antiguos siguen disponibles, sin entorpecer el trabajo diario.</h2><p>La política propuesta archivará partes con más de 5 años. Nunca se eliminan automáticamente.</p></div>
        <button className="secondary-button" onClick={() => notify("Configuración de retención abierta")}><Icon name="settings" /> Configurar</button>
      </section>
      <section className="archive-years">
        {[
          { year: "2021", parts: "8.492", hours: "17.206 h", size: "82 MB" },
          { year: "2020", parts: "7.945", hours: "15.839 h", size: "76 MB" },
          { year: "2019", parts: "6.811", hours: "13.427 h", size: "64 MB" },
        ].map((item) => (
          <article className="archive-card" key={item.year}>
            <span><Icon name="folder_zip" /></span><h3>{item.year}</h3>
            <div><strong>{item.parts}</strong><small>partes</small></div><div><strong>{item.hours}</strong><small>registradas</small></div>
            <small>{item.size}</small>
            <button className="text-button" onClick={() => notify(`Archivo ${item.year} abierto`)}>Consultar <Icon name="arrow_forward" /></button>
          </article>
        ))}
      </section>
    </div>
  );
}

function PartDrawer({
  part,
  onClose,
  notify,
}: {
  part: Part | null;
  onClose: () => void;
  notify: (message: string) => void;
}) {
  if (!part) return null;
  return (
    <>
      <button className="drawer-backdrop" onClick={onClose} aria-label="Cerrar detalle" />
      <aside className="part-drawer" role="dialog" aria-modal="true" aria-label={`Parte ${part.id}`}>
        <div className="drawer-head">
          <div><span className="eyebrow">PARTE #{part.id}</span><h2>{part.house}</h2><p>{part.date} · {part.employee}</p></div>
          <button className="icon-button" onClick={onClose} aria-label="Cerrar"><Icon name="close" /></button>
        </div>
        <div className="drawer-status"><StatusChip status={part.status} /><span>Actualizado hoy a las 11:42</span></div>
        <section className="detail-section">
          <h3>Información general</h3>
          <div className="detail-grid">
            <div><small>Empleado</small><strong>{part.employee}</strong></div>
            <div><small>Cliente</small><strong>{part.client}</strong></div>
            <div><small>Fecha</small><strong>{part.date}</strong></div>
            <div><small>Total</small><strong>{formatHours(part.hours)}</strong></div>
          </div>
        </section>
        <section className="detail-section">
          <div className="section-heading"><h3>Tareas realizadas</h3><span className="soft-chip">1 tarea</span></div>
          <article className="task-detail-card">
            <div><span className="category-icon"><Icon name={part.category === "Oficial" ? "engineering" : "yard"} /></span><div><strong>{part.task}</strong><span>{part.category}</span></div><b>{formatHours(part.hours)}</b></div>
            <p>Trabajo realizado según la planificación. Zona revisada y recogida al finalizar.</p>
          </article>
        </section>
        <section className="detail-section">
          <h3>Resumen</h3>
          <div className="cost-row"><span>Horas {part.category}</span><strong>{formatHours(part.hours)}</strong></div>
          <div className="cost-row total"><span>Coste estimado</span><strong>{part.category === "Oficial" ? `${part.hours * 30} €` : `${part.hours * 10} €`}</strong></div>
        </section>
        <label className="drawer-comment">Comentario interno<textarea placeholder="Añade una nota para el equipo…" /></label>
        <div className="drawer-actions">
          <button className="secondary-button" onClick={() => notify("Solicitud de corrección enviada (demo)")}><Icon name="undo" /> Solicitar corrección</button>
          <button className="primary-button" onClick={() => { notify("Parte marcado como revisado"); onClose(); }}><Icon name="task_alt" /> Marcar revisado</button>
        </div>
      </aside>
    </>
  );
}

function EmployeeModal({
  open,
  onClose,
  notify,
}: {
  open: boolean;
  onClose: () => void;
  notify: (message: string) => void;
}) {
  if (!open) return null;
  const submit = (event: FormEvent) => {
    event.preventDefault();
    notify("Empleado y acceso creados en la demo");
    onClose();
  };
  return (
    <>
      <button className="drawer-backdrop" onClick={onClose} aria-label="Cerrar formulario" />
      <section className="employee-modal" role="dialog" aria-modal="true" aria-label="Nuevo empleado">
        <div className="drawer-head"><div><span className="eyebrow">ALTA UNIFICADA</span><h2>Nuevo empleado</h2><p>Crea sus datos laborales y el acceso en un único paso.</p></div><button className="icon-button" onClick={onClose}><Icon name="close" /></button></div>
        <form onSubmit={submit}>
          <fieldset><legend>Datos personales</legend><div className="form-grid"><label>Nombre<input required placeholder="Nombre" /></label><label>Apellidos<input required placeholder="Apellidos" /></label><label>Teléfono<input placeholder="600 000 000" /></label><label>Correo<input type="email" placeholder="nombre@eiviplant.com" /></label></div></fieldset>
          <fieldset><legend>Acceso a la aplicación</legend><div className="form-grid"><label>Nombre de usuario<input required placeholder="nombre.apellido" /></label><label>Rol<select><option>Operario</option><option>Supervisor</option><option>Administrador</option></select></label></div><label className="option-card"><input type="checkbox" defaultChecked /><span><strong>Enviar enlace para crear contraseña</strong><small>El empleado recibirá instrucciones por correo.</small></span></label></fieldset>
          <fieldset><legend>Información laboral</legend><div className="form-grid"><label>Tipo de empleado<select><option>Peón</option><option>Oficial</option></select></label><label>Fecha de alta<input type="date" defaultValue="2026-07-28" /></label></div><label>Observaciones<textarea placeholder="Información interna opcional…" /></label></fieldset>
          <div className="modal-footer"><button type="button" className="secondary-button" onClick={onClose}>Cancelar</button><button className="primary-button"><Icon name="person_add" /> Crear empleado y acceso</button></div>
        </form>
      </section>
    </>
  );
}

function WorkerHeader({ onRoleChange }: { onRoleChange: (role: Role) => void }) {
  return (
    <header className="worker-header">
      <Logo compact />
      <div className="worker-brand"><strong>Eiviplant</strong><small>Área de operario</small></div>
      <button className="worker-role-button" onClick={() => onRoleChange("admin")}><Icon name="admin_panel_settings" /> Vista admin</button>
      <button className="avatar-button">LU</button>
    </header>
  );
}

function WorkerHome({
  onNavigate,
  onSelectPart,
}: {
  onNavigate: (view: WorkerView) => void;
  onSelectPart: (part: Part) => void;
}) {
  const workerParts = parts.filter((part) => part.employee === "Luz Urbano" || part.id === 63792);
  return (
    <div className="worker-page">
      <section className="worker-greeting"><span className="eyebrow">MARTES, 28 DE JULIO</span><h1>Hola, Luz <span>👋</span></h1><p>Todo listo para registrar el trabajo de hoy.</p></section>
      <section className="worker-summary">
        <article className="primary-summary"><span><Icon name="schedule" /></span><div><strong>1 h</strong><small>registrada hoy</small></div><i>Objetivo 8 h</i></article>
        <article><strong>1</strong><small>Parte hoy</small></article>
        <article><strong>32 h</strong><small>Esta semana</small></article>
      </section>
      <button className="new-part-hero" onClick={() => onNavigate("new-part")}>
        <span><Icon name="add" /></span><div><strong>Crear nuevo parte</strong><small>Registra tareas, tiempo y materiales</small></div><Icon name="arrow_forward" />
      </button>
      <section className="worker-list-section">
        <div className="section-heading"><div><span className="eyebrow">ACTIVIDAD</span><h2>Mis partes</h2></div><div className="segmented compact"><button className="active">Semana</button><button>Mes</button></div></div>
        <div className="worker-date-label"><span>HOY</span><i /></div>
        {workerParts.map((part) => (
          <button className="worker-part-card" key={part.id} onClick={() => onSelectPart(part)}>
            <div className="worker-card-top"><span className="worker-house-icon"><Icon name="potted_plant" /></span><div><strong>{part.house}</strong><small>{part.client}</small></div><StatusChip status={part.status} /></div>
            <p>{part.task}</p>
            <div className="worker-card-bottom"><span className="soft-chip">{part.category}</span><strong><Icon name="schedule" /> {formatHours(part.hours)}</strong><Icon name="chevron_right" /></div>
          </button>
        ))}
      </section>
    </div>
  );
}

function NewPartView({
  onNavigate,
  notify,
}: {
  onNavigate: (view: WorkerView) => void;
  notify: (message: string) => void;
}) {
  const [duration, setDuration] = useState(60);
  const [category, setCategory] = useState<"Oficial" | "Peón">("Oficial");
  const [taskCount, setTaskCount] = useState(1);
  const [saving, setSaving] = useState(false);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      notify("Parte guardado correctamente en la demo");
      onNavigate("worker-home");
    }, 650);
  };
  return (
    <form className="new-part-page" onSubmit={submit}>
      <div className="worker-form-head"><button type="button" className="icon-button" onClick={() => onNavigate("worker-home")}><Icon name="arrow_back" /></button><div><span className="eyebrow">NUEVO REGISTRO</span><h1>Crear parte</h1></div><span className="soft-chip">Borrador</span></div>
      <section className="mobile-form-card">
        <div className="mobile-section-title"><span>1</span><div><strong>¿Dónde has trabajado?</strong><small>Selecciona la casa o la obra</small></div></div>
        <label>Casa / obra<select required defaultValue="EIVIPLANT · GARDEN"><option>EIVIPLANT · GARDEN</option>{houses.slice(1).map((house) => <option key={house.name}>{house.name}</option>)}</select></label>
        <div className="selected-client"><span><Icon name="domain" /></span><div><small>CLIENTE ASOCIADO</small><strong>Eiviplant</strong></div><Icon name="task_alt" /></div>
        <label>Fecha<input type="date" defaultValue="2026-07-28" /></label>
      </section>
      <section className="mobile-form-card">
        <div className="mobile-section-title"><span>2</span><div><strong>Tareas realizadas</strong><small>Añade tiempo y descripción</small></div></div>
        {Array.from({ length: taskCount }).map((_, index) => (
          <article className="mobile-task-card" key={index}>
            <div className="task-card-heading"><strong>Tarea {index + 1}</strong>{taskCount > 1 && <button type="button" onClick={() => setTaskCount(taskCount - 1)}><Icon name="delete" /> Quitar</button>}</div>
            <label>Duración
              <div className="duration-stepper"><button type="button" onClick={() => setDuration(Math.max(15, duration - 15))}><Icon name="remove" /></button><strong>{formatHours(duration / 60)}</strong><button type="button" onClick={() => setDuration(duration + 15)}><Icon name="add" /></button></div>
            </label>
            <label>Categoría
              <span className="category-switch">
                <button type="button" className={category === "Peón" ? "active" : ""} onClick={() => setCategory("Peón")}><Icon name="yard" /> Peón</button>
                <button type="button" className={category === "Oficial" ? "active" : ""} onClick={() => setCategory("Oficial")}><Icon name="engineering" /> Oficial</button>
              </span>
            </label>
            <label>Tarea<select defaultValue="Administración">{tasks.map((task) => <option key={task}>{task}</option>)}</select></label>
            <label>Descripción<textarea defaultValue={index === 0 ? "Reunión con Zerión" : ""} placeholder="Describe brevemente el trabajo…" /></label>
          </article>
        ))}
        <button type="button" className="add-outline-button" onClick={() => setTaskCount(taskCount + 1)}><Icon name="add_circle" /> Añadir otra tarea</button>
      </section>
      <section className="mobile-form-card collapsed-card"><span><Icon name="inventory_2" /></span><div><strong>Materiales utilizados</strong><small>No se han añadido materiales</small></div><button type="button"><Icon name="add" /> Añadir</button></section>
      <div className="worker-save-bar">
        <div><small>TOTAL DEL PARTE</small><strong>{formatHours((duration * taskCount) / 60)}</strong></div>
        <button className="primary-button" disabled={saving}>{saving ? <><span className="spinner small" /> Guardando…</> : <><Icon name="task_alt" /> Guardar parte</>}</button>
      </div>
    </form>
  );
}

function WorkerProfile({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="worker-page profile-page">
      <section className="profile-hero"><span className="big-avatar">LU</span><h1>Luz Urbano</h1><p>Oficial · Administradora</p></section>
      <section className="profile-options">
        <button><span><Icon name="person" /></span><div><strong>Datos personales</strong><small>Nombre, teléfono y correo</small></div><Icon name="chevron_right" /></button>
        <button><span><Icon name="lock" /></span><div><strong>Cambiar contraseña</strong><small>Actualiza tus credenciales</small></div><Icon name="chevron_right" /></button>
        <button><span><Icon name="help" /></span><div><strong>Ayuda</strong><small>Guía rápida de la aplicación</small></div><Icon name="chevron_right" /></button>
      </section>
      <button className="logout-button" onClick={onLogout}><Icon name="logout" /> Cerrar sesión</button>
    </div>
  );
}

function WorkerNav({ active, onNavigate }: { active: WorkerView; onNavigate: (view: WorkerView) => void }) {
  return (
    <nav className="worker-bottom-nav">
      <button className={active === "worker-home" ? "active" : ""} onClick={() => onNavigate("worker-home")}><Icon name="home" filled={active === "worker-home"} /><span>Inicio</span></button>
      <button className="center-action" onClick={() => onNavigate("new-part")}><span><Icon name="add" /></span><small>Nuevo parte</small></button>
      <button className={active === "profile" ? "active" : ""} onClick={() => onNavigate("profile")}><Icon name="person" filled={active === "profile"} /><span>Perfil</span></button>
    </nav>
  );
}

export default function Home() {
  const [sessionRole, setSessionRole] = useState<Role | null>(null);
  const [adminView, setAdminView] = useState<AdminView>("dashboard");
  const [workerView, setWorkerView] = useState<WorkerView>("worker-home");
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [employeeModal, setEmployeeModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const navigateAdmin = (view: AdminView) => {
    if (view === adminView) return;
    setBusy(true);
    setSidebarOpen(false);
    window.setTimeout(() => {
      setAdminView(view);
      setBusy(false);
    }, 280);
  };

  const switchRole = (role: Role) => {
    setSessionRole(role);
    setSelectedPart(null);
    notify(role === "admin" ? "Vista de administración" : "Vista móvil de operario");
  };

  if (!sessionRole) return <Login onLogin={setSessionRole} />;

  if (sessionRole === "worker") {
    return (
      <main className="worker-app">
        <WorkerHeader onRoleChange={switchRole} />
        {workerView === "worker-home" && <WorkerHome onNavigate={setWorkerView} onSelectPart={setSelectedPart} />}
        {workerView === "new-part" && <NewPartView onNavigate={setWorkerView} notify={notify} />}
        {workerView === "profile" && <WorkerProfile onLogout={() => setSessionRole(null)} />}
        {workerView !== "new-part" && <WorkerNav active={workerView} onNavigate={setWorkerView} />}
        <PartDrawer part={selectedPart} onClose={() => setSelectedPart(null)} notify={notify} />
        {toast && <div className="toast"><Icon name="task_alt" /> {toast}</div>}
      </main>
    );
  }

  return (
    <main className="admin-app">
      <AdminSidebar active={adminView} onNavigate={navigateAdmin} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <section className="admin-main">
        <Topbar view={adminView} role={sessionRole} onRoleChange={switchRole} onMenu={() => setSidebarOpen(true)} onLogout={() => setSessionRole(null)} />
        <div className="admin-content">
          {adminView === "dashboard" && <Dashboard onNavigate={navigateAdmin} onSelectPart={setSelectedPart} notify={notify} />}
          {adminView === "parts" && <PartsView onSelectPart={setSelectedPart} notify={notify} />}
          {adminView === "employees" && <EmployeesView onAdd={() => setEmployeeModal(true)} notify={notify} />}
          {adminView === "clients" && <ClientsView notify={notify} />}
          {adminView === "houses" && <HousesView notify={notify} />}
          {adminView === "catalogs" && <CatalogsView notify={notify} />}
          {adminView === "reports" && <ReportsView notify={notify} />}
          {adminView === "archive" && <ArchiveView notify={notify} />}
        </div>
      </section>
      {busy && <LoadingVeil />}
      <PartDrawer part={selectedPart} onClose={() => setSelectedPart(null)} notify={notify} />
      <EmployeeModal open={employeeModal} onClose={() => setEmployeeModal(false)} notify={notify} />
      {toast && <div className="toast"><Icon name="task_alt" /> {toast}</div>}
    </main>
  );
}
