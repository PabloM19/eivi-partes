"use client";

import { FormEvent, useMemo, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";

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
type WorkerView = "worker-home" | "new-part";

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
    house: "EIVIPLANT - GARDEN",
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
    house: "EIVIPLANT - GARDEN",
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
  { name: "EIVIPLANT - GARDEN", address: "Ibiza", type: "Interno", client: "Eiviplant" },
  { name: "PAR 4", address: "Es Cubells", type: "Mantenimiento", client: "Servicios Es Cubells" },
  { name: "PAR 4 OBRA", address: "Es Cubells", type: "Obra", client: "Servicios Es Cubells" },
  { name: "ISCHIA", address: "Sant Josep", type: "Mantenimiento", client: "Servicios Es Cubells" },
  { name: "P. ALTO Nº 9", address: "Vista Alegre", type: "Mantenimiento", client: "Servicios Es Cubells" },
  { name: "ATENA", address: "Es Cubells", type: "Mantenimiento", client: "Servicios Es Cubells" },
];

const tasks = [
  "Regar",
  "Sacar mala hierba de plantas",
  "Conectar riego",
  "Administración",
  "Ventas",
  "Limpieza",
  "Organización",
  "Descargar, codificar y colocar plantas / materiales",
  "Poda",
  "Recoger",
  "Cavar",
  "Poner tacos y clavos",
  "Revisión jardín y riegos por lluvias",
  "Llevar porte furgón",
  "Riego con abono",
  "Repaso de riego",
  "Trasplantar",
  "Traer y descargar turbas y abono orgánico",
  "Echar mezcla y cavar",
  "Sulfatar palmeras",
  "Sulfatar olivos",
  "Desbrozar",
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
  dashboard: { title: "Inicio", eyebrow: "Martes, 28 de julio" },
  parts: { title: "Partes de trabajo", eyebrow: "Gestión" },
  employees: { title: "Empleados", eyebrow: "Gestión" },
  clients: { title: "Clientes", eyebrow: "Gestión" },
  houses: { title: "Casas y obras", eyebrow: "Gestión" },
  catalogs: { title: "Catálogos", eyebrow: "Configuración" },
  reports: { title: "Informes", eyebrow: "Listados" },
  archive: { title: "Archivo histórico", eyebrow: "Partes archivados" },
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
      <Image
        className="brand-image"
        src={compact ? "/brand/eiviplant-isologo.png" : "/brand/eiviplant-logo.png"}
        alt="Eiviplant"
        width={compact ? 140 : 500}
        height={167}
        priority
      />
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
      <section className="login-story">
        <Logo />
        <div className="login-summary-copy">
          <span className="eyebrow">APLICACIÓN INTERNA</span>
          <h1>Gestión de partes de trabajo</h1>
          <p>
            Acceso para el equipo de Eiviplant. Permite registrar el trabajo diario y consultar
            la información necesaria para la gestión.
          </p>
          <ul className="login-feature-list">
            <li><Icon name="assignment" /><span><strong>Partes</strong><small>Alta, consulta y revisión</small></span></li>
            <li><Icon name="groups" /><span><strong>Empleados</strong><small>Usuarios y tipos de empleado</small></span></li>
            <li><Icon name="print" /><span><strong>Listados</strong><small>Informes por empleado o casa</small></span></li>
          </ul>
        </div>
        <small className="login-version">Acceso exclusivo para personal autorizado</small>
      </section>

      <section className="login-panel">
        <div className="login-card glass">
          <div className="mobile-logo"><Logo /></div>
          <span className="eyebrow">ACCESO</span>
          <h2>Iniciar sesión</h2>
          <p>Introduce tu usuario y contraseña.</p>
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
            <div className="form-row">
              <label className="check-row">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                />
                Recordarme
              </label>
            </div>
            <button className="primary-button full" type="submit">
              Entrar
              <Icon name="arrow_forward" />
            </button>
            <div className="login-prototype-role">
              <span>Vista del prototipo</span>
              <button className="secondary-button full" type="button" onClick={() => onLogin("worker")}>
                <Icon name="smartphone" />
                Entrar como operario
              </button>
            </div>
          </form>
          <small className="demo-note">
            <Icon name="info" />
            Prototipo sin conexión con el sistema actual.
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
  collapsed,
  onToggle,
}: {
  active: AdminView;
  onNavigate: (view: AdminView) => void;
  open: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      {open && <button className="sidebar-backdrop" onClick={onClose} aria-label="Cerrar menú" />}
      <aside className={`sidebar glass ${open ? "open" : ""} ${collapsed ? "collapsed" : ""}`}>
        <div className="sidebar-top">
          <Logo compact={collapsed} />
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
                  title={collapsed ? item.label : undefined}
                >
                  <Icon name={item.icon} filled={active === item.id} />
                  <span>{item.label}</span>
                  {item.id === "parts" && <b>4</b>}
                </button>
              </div>
            );
          })}
        </nav>
        <button
          className="sidebar-collapse-button"
          onClick={onToggle}
          aria-label={collapsed ? "Desplegar barra lateral" : "Plegar barra lateral"}
          title={collapsed ? "Desplegar barra lateral" : "Plegar barra lateral"}
        >
          <Icon name={collapsed ? "chevron_right" : "chevron_left"} />
          <span>{collapsed ? "" : "Plegar menú"}</span>
        </button>
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
  tone = "",
}: {
  icon: string;
  value: string;
  label: string;
  tone?: string;
}) {
  return (
    <article className={`metric-card bento-card ${tone}`}>
      <span className="metric-icon"><Icon name={icon} /></span>
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </article>
  );
}

function Dashboard({
  onNavigate,
  onSelectPart,
}: {
  onNavigate: (view: AdminView) => void;
  onSelectPart: (part: Part) => void;
}) {
  return (
    <div className="page-stack">
      <section className="dashboard-grid">
        <MetricCard icon="assignment" value="18" label="Partes de hoy" />
        <MetricCard icon="pending_actions" value="4" label="Pendientes de revisar" tone="amber" />
        <MetricCard icon="schedule" value="146 h" label="Horas esta semana" />
        <MetricCard icon="groups" value="9" label="Empleados activos" />

        <article className="quick-actions bento-card">
          <div className="section-heading">
            <div><h2>Accesos directos</h2></div>
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
            <div><h2>Partes pendientes de revisar</h2></div>
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
  const [partItems, setPartItems] = useState(parts);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [reviewModal, setReviewModal] = useState<"Revisado" | "Pendiente" | null>(null);
  const filtered = useMemo(
    () =>
      partItems.filter((part) => {
        const text = `${part.house} ${part.employee} ${part.client} ${part.task}`.toLowerCase();
        return text.includes(query.toLowerCase()) && (status === "Todos" || part.status === status);
      }),
    [partItems, query, status],
  );
  const selectableIds = filtered.map((part) => part.id);
  const selectedParts = partItems.filter((part) => selectedIds.includes(part.id));
  const allVisibleSelected = selectableIds.length > 0 && selectableIds.every((id) => selectedIds.includes(id));

  const leaveSelectionMode = () => {
    setSelectionMode(false);
    setSelectedIds([]);
  };

  const togglePart = (id: number) => {
    setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const toggleVisible = () => {
    setSelectedIds((current) => {
      if (allVisibleSelected) return current.filter((id) => !selectableIds.includes(id));
      return Array.from(new Set([...current, ...selectableIds]));
    });
  };

  const confirmReview = (targetStatus: "Revisado" | "Pendiente") => {
    setPartItems((current) => current.map((part) => selectedIds.includes(part.id) ? { ...part, status: targetStatus } : part));
    const destination = targetStatus === "Revisado" ? "revisados" : "no revisados";
    notify(`${selectedIds.length} ${selectedIds.length === 1 ? "parte marcado" : "partes marcados"} como ${destination}`);
    setReviewModal(null);
    leaveSelectionMode();
  };

  return (
    <div className="page-stack">
      <section className="page-toolbar">
        <div className="toolbar-copy"><strong>{filtered.length} partes</strong><span>Mostrando actividad reciente</span></div>
        <div className="toolbar-actions">
          <button
            className={`secondary-button bulk-entry-button ${selectionMode ? "active" : ""}`}
            onClick={() => selectionMode ? leaveSelectionMode() : setSelectionMode(true)}
          >
            <Icon name={selectionMode ? "close" : "checklist"} /> {selectionMode ? "Cancelar selección" : "Revisar varios"}
          </button>
          <button className="secondary-button" onClick={() => notify("Preparando vista de impresión…")}><Icon name="print" /> Imprimir</button>
          <button className="secondary-button" onClick={() => notify("Exportación preparada")}><Icon name="download" /> Exportar</button>
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
        {selectionMode && (
          <div className="bulk-action-bar" aria-live="polite">
            <div className="bulk-action-copy">
              <span className="bulk-icon"><Icon name="done_all" /></span>
              <div><strong>Revisión múltiple</strong><span>Selecciona los partes cuyo estado quieras actualizar.</span></div>
            </div>
            <div className="bulk-action-controls">
              <button className="text-button" onClick={toggleVisible} disabled={!selectableIds.length}>
                {allVisibleSelected ? "Deseleccionar visibles" : `Seleccionar visibles (${selectableIds.length})`}
              </button>
              <span className="selection-count">{selectedIds.length} {selectedIds.length === 1 ? "seleccionado" : "seleccionados"}</span>
              <button className="secondary-button unreview-button" disabled={!selectedIds.length} onClick={() => setReviewModal("Pendiente")}>
                <Icon name="remove_done" /> Marcar como no revisados
              </button>
              <button className="primary-button" disabled={!selectedIds.length} onClick={() => setReviewModal("Revisado")}>
                <Icon name="task_alt" /> Marcar como revisados
              </button>
            </div>
          </div>
        )}
        <div className={`table-head parts-grid ${selectionMode ? "bulk-enabled" : ""}`}>
          {selectionMode && (
            <label className="select-control select-all-control" title="Seleccionar todos los partes visibles">
              <input type="checkbox" checked={allVisibleSelected} onChange={toggleVisible} disabled={!selectableIds.length} />
              <span />
            </label>
          )}
          <span>Estado</span><span>Fecha</span><span>Empleado</span><span>Casa / obra</span><span>Tarea</span><span>Horas</span><span />
        </div>
        <div className="parts-table">
          {filtered.map((part) => {
            const selected = selectedIds.includes(part.id);
            const row = (
              <button className={`table-row parts-grid ${selected ? "selected" : ""}`} onClick={() => selectionMode ? togglePart(part.id) : onSelectPart(part)}>
                <span data-label="Estado"><StatusChip status={part.status} /></span>
                <span data-label="Fecha"><strong>{part.date}</strong><small>#{part.id}</small></span>
                <span data-label="Empleado" className="person-cell"><i>{part.employee.slice(0, 2).toUpperCase()}</i>{part.employee}</span>
                <span data-label="Casa / obra"><strong>{part.house}</strong><small>{part.client}</small></span>
                <span data-label="Tarea" className="task-cell">{part.task}<small>{part.category}</small></span>
                <span data-label="Horas" className="hours-cell">{formatHours(part.hours)}</span>
                <span className="row-actions"><Icon name="chevron_right" /></span>
              </button>
            );

            if (!selectionMode) return <div className="part-table-record" key={part.id}>{row}</div>;

            return (
              <div className={`part-table-record selectable-record ${selected ? "selected" : ""}`} key={part.id}>
                <label className="select-control" title={`Seleccionar parte ${part.id}`}>
                  <input type="checkbox" checked={selected} onChange={() => togglePart(part.id)} />
                  <span />
                </label>
                {row}
              </div>
            );
          })}
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
      <BulkReviewModal
        targetStatus={reviewModal}
        parts={selectedParts}
        onClose={() => setReviewModal(null)}
        onConfirm={confirmReview}
      />
    </div>
  );
}

function BulkReviewModal({
  targetStatus,
  parts: selectedParts,
  onClose,
  onConfirm,
}: {
  targetStatus: "Revisado" | "Pendiente" | null;
  parts: Part[];
  onClose: () => void;
  onConfirm: (targetStatus: "Revisado" | "Pendiente") => void;
}) {
  if (!targetStatus) return null;
  const totalHours = selectedParts.reduce((total, part) => total + part.hours, 0);
  const isReviewing = targetStatus === "Revisado";
  const actionLabel = selectedParts.length === 1
    ? (isReviewing ? "revisado" : "no revisado")
    : (isReviewing ? "revisados" : "no revisados");
  return createPortal(
    <>
      <button className="drawer-backdrop" onClick={onClose} aria-label="Cancelar revisión múltiple" />
      <section className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="bulk-review-title">
        <div className={`confirm-modal-icon ${isReviewing ? "" : "pending"}`}><Icon name={isReviewing ? "done_all" : "remove_done"} /></div>
        <div className="confirm-modal-copy">
          <span className="eyebrow">CONFIRMAR REVISIÓN</span>
          <h2 id="bulk-review-title">¿Marcar {selectedParts.length} {selectedParts.length === 1 ? "parte" : "partes"} como {actionLabel}?</h2>
          <p>{isReviewing
            ? "Los partes seleccionados dejarán de aparecer como pendientes. Podrás seguir consultándolos desde el filtro de estado."
            : "Los partes seleccionados volverán al estado pendiente para que puedan revisarse de nuevo."}</p>
        </div>
        <div className="confirm-summary">
          <div><small>PARTES</small><strong>{selectedParts.length}</strong></div>
          <div><small>HORAS TOTALES</small><strong>{formatHours(totalHours)}</strong></div>
        </div>
        <div className="confirm-part-list" aria-label="Partes seleccionados">
          {selectedParts.slice(0, 3).map((part) => <span key={part.id}>#{part.id} · {part.employee}<small>{part.house}</small></span>)}
          {selectedParts.length > 3 && <span className="more-parts">Y {selectedParts.length - 3} más</span>}
        </div>
        <div className="modal-footer">
          <button className="secondary-button" onClick={onClose}>Cancelar</button>
          <button className={`primary-button ${isReviewing ? "" : "pending-action"}`} onClick={() => onConfirm(targetStatus)}>
            <Icon name={isReviewing ? "task_alt" : "remove_done"} /> Sí, marcar como {actionLabel}
          </button>
        </div>
      </section>
    </>,
    document.body,
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
      <section className="panel report-builder">
        <div className="section-heading">
          <div><h2>Filtros del informe</h2></div>
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
      <section className="panel report-summary" aria-label="Resumen de horas">
        <div>
          <span className="eyebrow">RESUMEN DE HORAS</span>
          <strong>146 h</strong>
          <small>Total registrado</small>
        </div>
        <dl>
          <div><dt>Oficial</dt><dd>82 h</dd></div>
          <div><dt>Peón</dt><dd>64 h</dd></div>
        </dl>
      </section>
      <section className="panel table-panel">
        <div className="section-heading report-results">
          <div><span className="eyebrow">20–28 JUL 2026</span><h2>Resultados · {group}</h2></div>
          <div><button className="secondary-button" onClick={() => notify("Vista de impresión preparada")}><Icon name="print" /> Imprimir</button><button className="secondary-button" onClick={() => notify("CSV generado")}><Icon name="download" /> Exportar</button></div>
        </div>
        <div className="simple-table-head report-grid"><span>Fecha</span><span>Empleado</span><span>Casa / obra</span><span>Cliente</span><span>Tareas</span><span>Horas</span></div>
        {parts.slice(0, 5).map((part) => (
          <div className="simple-table-row report-grid" key={part.id}>
            <strong className="report-date">{part.date}</strong>
            <span className="report-employee">{part.employee}</span>
            <strong className="report-house">{part.house}</strong>
            <span className="report-client">{part.client}</span>
            <span className="report-task">{part.task}</span>
            <strong className="report-hours">{formatHours(part.hours)}</strong>
          </div>
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
        <div><h2>Partes archivados</h2><p>Los partes con más de 5 años pasan al archivo y continúan disponibles para consulta.</p></div>
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
          <button className="secondary-button" onClick={() => notify("Solicitud de corrección preparada")}><Icon name="undo" /> Solicitar corrección</button>
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
    notify("Empleado y acceso creados");
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

function WorkerHeader({
  onRoleChange,
  onLogout,
}: {
  onRoleChange: (role: Role) => void;
  onLogout: () => void;
}) {
  return (
    <header className="worker-header">
      <Logo compact />
      <div className="worker-brand"><strong>Eiviplant</strong><small>Partes de trabajo</small></div>
      <button className="worker-role-button" onClick={() => onRoleChange("admin")}><Icon name="admin_panel_settings" /> Vista admin</button>
      <button className="avatar-button" onClick={onLogout} title="Cerrar sesión" aria-label="Cerrar sesión"><Icon name="logout" /></button>
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
      <section className="worker-greeting"><h1>Mis partes</h1><p>Martes, 28 de julio</p></section>
      <button className="new-part-hero" onClick={() => onNavigate("new-part")}>
        <span><Icon name="add" /></span><div><strong>Nuevo parte</strong><small>Registrar el trabajo realizado</small></div><Icon name="arrow_forward" />
      </button>
      <section className="worker-list-section">
        <div className="section-heading"><div><h2>Partes recientes</h2></div><div className="segmented compact"><button className="active">Semana</button><button>Mes</button></div></div>
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
  const [materialCount, setMaterialCount] = useState(0);
  const [saving, setSaving] = useState(false);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      notify("Parte guardado correctamente");
      onNavigate("worker-home");
    }, 650);
  };
  return (
    <form className="new-part-page" onSubmit={submit}>
      <div className="worker-form-head"><button type="button" className="icon-button" onClick={() => onNavigate("worker-home")}><Icon name="arrow_back" /></button><div><span className="eyebrow">NUEVO REGISTRO</span><h1>Crear parte</h1></div><span className="soft-chip">Borrador</span></div>
      <section className="mobile-form-card">
        <div className="mobile-section-title"><span>1</span><div><strong>¿Dónde has trabajado?</strong><small>Selecciona la casa o la obra</small></div></div>
        <label>Casa / obra<select required defaultValue="EIVIPLANT - GARDEN"><option>EIVIPLANT - GARDEN</option>{houses.slice(1).map((house) => <option key={house.name}>{house.name}</option>)}</select></label>
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
      <section className={`mobile-form-card materials-card ${materialCount === 0 ? "collapsed-card" : ""}`}>
        <span><Icon name="inventory_2" /></span>
        <div className="materials-content">
          <strong>Materiales utilizados</strong>
          {materialCount === 0 ? (
            <small>No se han añadido materiales</small>
          ) : (
            <div className="materials-list">
              {Array.from({ length: materialCount }).map((_, index) => (
                <div className="material-row" key={index}>
                  <label>Material<input placeholder="Nombre o referencia" /></label>
                  <label>Cantidad<input type="number" min="0" step="0.01" defaultValue="1" /></label>
                  <button type="button" onClick={() => setMaterialCount(Math.max(0, materialCount - 1))} aria-label={`Quitar material ${index + 1}`}><Icon name="close" /></button>
                </div>
              ))}
            </div>
          )}
        </div>
        <button type="button" onClick={() => setMaterialCount(materialCount + 1)}><Icon name="add" /> Añadir</button>
      </section>
      <div className="worker-save-bar">
        <div><small>TOTAL DEL PARTE</small><strong>{formatHours((duration * taskCount) / 60)}</strong></div>
        <button className="primary-button" disabled={saving}>{saving ? <><span className="spinner small" /> Guardando…</> : <><Icon name="task_alt" /> Guardar parte</>}</button>
      </div>
    </form>
  );
}

function WorkerNav({
  active,
  onNavigate,
  onLogout,
}: {
  active: WorkerView;
  onNavigate: (view: WorkerView) => void;
  onLogout: () => void;
}) {
  return (
    <nav className="worker-bottom-nav">
      <button className={active === "worker-home" ? "active" : ""} onClick={() => onNavigate("worker-home")}><Icon name="assignment" filled={active === "worker-home"} /><span>Mis partes</span></button>
      <button className="center-action" onClick={() => onNavigate("new-part")}><span><Icon name="add" /></span><small>Nuevo parte</small></button>
      <button onClick={onLogout}><Icon name="logout" /><span>Cerrar sesión</span></button>
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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
        <WorkerHeader onRoleChange={switchRole} onLogout={() => setSessionRole(null)} />
        {workerView === "worker-home" && <WorkerHome onNavigate={setWorkerView} onSelectPart={setSelectedPart} />}
        {workerView === "new-part" && <NewPartView onNavigate={setWorkerView} notify={notify} />}
        {workerView !== "new-part" && <WorkerNav active={workerView} onNavigate={setWorkerView} onLogout={() => setSessionRole(null)} />}
        <PartDrawer part={selectedPart} onClose={() => setSelectedPart(null)} notify={notify} />
        {toast && <div className="toast"><Icon name="task_alt" /> {toast}</div>}
      </main>
    );
  }

  return (
    <main className={`admin-app ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <AdminSidebar
        active={adminView}
        onNavigate={navigateAdmin}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((value) => !value)}
      />
      <section className="admin-main">
        <Topbar
          view={adminView}
          role={sessionRole}
          onRoleChange={switchRole}
          onMenu={() => {
            setSidebarCollapsed(false);
            setSidebarOpen(true);
          }}
          onLogout={() => setSessionRole(null)}
        />
        <div className="admin-content">
          {adminView === "dashboard" && <Dashboard onNavigate={navigateAdmin} onSelectPart={setSelectedPart} />}
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
