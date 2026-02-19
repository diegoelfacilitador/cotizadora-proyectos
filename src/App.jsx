import { useState, useMemo } from "react";

const fmt = (n) => Math.ceil(n).toLocaleString("es-CL");
const fmtMoney = (n) => {
  const num = parseFloat(n);
  if (!num || isNaN(num)) return "$0";
  return "$" + num.toLocaleString("es-CL", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

function Slider({ label, value, onChange, min, max, step = 1, suffix = "%", dark }) {
  const t = dark;
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: t ? "#888" : "#666", fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#D4A843" }}>{typeof value === "number" ? value.toLocaleString("es-CL") : value}{suffix}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: "#D4A843", cursor: "pointer" }} />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
        <span style={{ fontSize: 10, color: t ? "#555" : "#bbb" }}>{min}{suffix}</span>
        <span style={{ fontSize: 10, color: t ? "#555" : "#bbb" }}>{max}{suffix}</span>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, dark }) {
  const t = dark;
  const raw = value.toString().replace(/\D/g, "");
  const display = raw ? Number(raw).toLocaleString("es-CL") : "";
  const handleChange = (e) => {
    const clean = e.target.value.replace(/\D/g, "");
    onChange(clean);
  };
  return (
    <div style={{ flex: 1, minWidth: 180 }}>
      <label style={{ display: "block", fontSize: 12, color: t ? "#888" : "#666", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {label}
      </label>
      <div style={{ display: "flex", alignItems: "center", background: t ? "#1a1a1a" : "#f0f0f0", border: `1px solid ${t ? "#333" : "#ccc"}`, borderRadius: 8, padding: "10px 14px" }}>
        <span style={{ color: "#D4A843", fontWeight: 700, marginRight: 6, fontSize: 16 }}>$</span>
        <input
          type="text"
          inputMode="numeric"
          value={display}
          onChange={handleChange}
          placeholder="0"
          style={{ background: "transparent", border: "none", outline: "none", color: t ? "#f0f0f0" : "#111", fontSize: 18, fontWeight: 700, width: "100%", fontFamily: "inherit" }} />
      </div>
    </div>
  );
}

function FunnelBar({ label, value, max, color, dark }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const t = dark;
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: t ? "#aaa" : "#666" }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: t ? "#f0f0f0" : "#111" }}>{fmt(value)}</span>
      </div>
      <div style={{ height: 8, background: t ? "#2a2a2a" : "#e0e0e0", borderRadius: 4 }}>
        <div style={{ height: "100%", width: pct + "%", background: color, borderRadius: 4, transition: "width 0.4s ease" }} />
      </div>
    </div>
  );
}

export default function App() {
  const [dark, setDark] = useState(true);
  const [meta, setMeta] = useState("");
  const [ticket, setTicket] = useState("");
  const [convRate, setConvRate] = useState(20);
  const [apertura, setApertura] = useState(5);
  const [asistencia, setAsistencia] = useState(70);
  const [semanas, setSemanas] = useState(4);
  const [progreso, setProgreso] = useState(0);
  const [showRatios, setShowRatios] = useState(false);

  const t = dark;
  const bg = t ? "#111" : "#f5f5f0";
  const card = t ? "#181818" : "#ffffff";
  const border = t ? "#2a2a2a" : "#e0e0e0";
  const text = t ? "#f0f0f0" : "#111";
  const sub = t ? "#888" : "#666";

  const calc = useMemo(() => {
    const m = parseFloat(meta) || 0;
    const tk = parseFloat(ticket) || 1;
    const clientes = m / tk;
    const reunionesNecesarias = clientes / (convRate / 100);
    const agendadas = reunionesNecesarias / (asistencia / 100);
    const contactos = agendadas * apertura;
    const porSemana = contactos / semanas;

    // simulación con slider
    const contactosHechos = Math.round((progreso / 100) * contactos);
    const aperturasSim = contactosHechos / apertura;
    const agendadasSim = aperturasSim * (asistencia / 100);  // agendadas que se concretan
    const reunionesSim = agendadasSim; // las que efectivamente ocurren
    const clientesSim = reunionesSim * (convRate / 100);
    const ingresosSim = clientesSim * tk;

    return { clientes, reunionesNecesarias, agendadas, contactos, porSemana, contactosHechos, aperturasSim, agendadasSim, reunionesSim, clientesSim, ingresosSim };
  }, [meta, ticket, convRate, apertura, asistencia, semanas, progreso]);

  const listo = parseFloat(meta) > 0 && parseFloat(ticket) > 0;

  return (
    <div style={{ minHeight: "100vh", background: bg, color: text, fontFamily: "'Inter','Helvetica Neue',sans-serif", padding: "24px 16px", transition: "background 0.3s, color 0.3s" }}>
      <div style={{ maxWidth: 540, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <div style={{ width: 3, height: 22, background: "#D4A843", borderRadius: 2 }} />
              <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, letterSpacing: "-0.02em", color: text }}>La Ecuación del Vendedor</h1>
            </div>
            <p style={{ margin: 0, fontSize: 12, color: sub, paddingLeft: 13 }}>Activa tu red. Sacude el árbol. · JB</p>
          </div>
          <button onClick={() => setDark(!dark)}
            style={{ background: t ? "#222" : "#e8e8e8", border: `1px solid ${border}`, borderRadius: 20, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontWeight: 600, color: text, transition: "all 0.2s" }}>
            {t ? "☀ Claro" : "☾ Oscuro"}
          </button>
        </div>

        {/* Bloque 1 */}
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: 20, marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#D4A843", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>01 — Tu Meta</div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <InputField label="¿Cuánto quieres vender este mes?" value={meta} onChange={setMeta} dark={t} />
            <InputField label="¿Cuál es tu ticket promedio?" value={ticket} onChange={setTicket} dark={t} />
          </div>
          {listo && (
            <div style={{ marginTop: 14, padding: "10px 14px", background: t ? "#1f1f1f" : "#f5f0e8", borderRadius: 8, borderLeft: "3px solid #D4A843" }}>
              <span style={{ fontSize: 12, color: sub }}>Clientes que necesitas: </span>
              <span style={{ fontWeight: 800, fontSize: 16, color: text }}>{fmt(calc.clientes)}</span>
            </div>
          )}
        </div>

        {/* Bloque 2 */}
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: 20, marginBottom: 12 }}>
          <button onClick={() => setShowRatios(!showRatios)}
            style={{ background: "none", border: "none", cursor: "pointer", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: 0, color: "inherit" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#D4A843", letterSpacing: "0.1em", textTransform: "uppercase" }}>02 — Tus Ratios</span>
            <span style={{ fontSize: 12, color: sub }}>{showRatios ? "▲ ocultar" : "▼ ajustar"}</span>
          </button>

          {!showRatios && (
            <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
              {[["Apertura", "1 de " + apertura], ["Asistencia", asistencia + "%"], ["Conversión", convRate + "%"], ["Semanas", semanas]].map(([l, v]) => (
                <div key={l} style={{ flex: 1, background: t ? "#1a1a1a" : "#f5f5f0", borderRadius: 8, padding: "8px 6px", textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: sub, marginBottom: 2 }}>{l}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#D4A843" }}>{v}</div>
                </div>
              ))}
            </div>
          )}

          {showRatios && (
            <div style={{ marginTop: 16 }}>
              <Slider dark={t} label="De cada X contactos, 1 te abre la puerta" value={apertura} onChange={setApertura} min={1} max={20} step={1} suffix=" contactos" />
              <Slider dark={t} label="% de reuniones agendadas que se concretan" value={asistencia} onChange={setAsistencia} min={10} max={100} />
              <Slider dark={t} label="% de reuniones que se convierten en venta" value={convRate} onChange={setConvRate} min={5} max={80} />
              <Slider dark={t} label="Semanas disponibles" value={semanas} onChange={setSemanas} min={1} max={12} suffix=" sem" />
            </div>
          )}
        </div>

        {/* Bloque 3 */}
        {listo && (
          <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: 20, marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#D4A843", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>03 — El Número que Importa</div>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: sub, marginBottom: 8 }}>Personas del árbol que tienes que sacudir</div>
              <div style={{ fontSize: 72, fontWeight: 900, color: text, lineHeight: 1, letterSpacing: "-0.04em" }}>{fmt(calc.contactos)}</div>
              <div style={{ fontSize: 12, color: sub, marginTop: 6 }}>contactos en {semanas} semana{semanas !== 1 ? "s" : ""}</div>
            </div>
            <div style={{ background: "#D4A843", borderRadius: 10, padding: "14px 18px", textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "#111", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Esta semana sacude a</div>
              <div style={{ fontSize: 40, fontWeight: 900, color: "#111", lineHeight: 1 }}>{fmt(calc.porSemana)}</div>
              <div style={{ fontSize: 11, color: "#333", marginTop: 2 }}>personas</div>
            </div>
          </div>
        )}

        {/* Bloque 4: Embudo con simulación */}
        {listo && (
          <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#D4A843", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>04 — El Embudo</div>
            <p style={{ fontSize: 12, color: sub, marginTop: 0, marginBottom: 16 }}>Mueve el slider para simular cuánto árbol llevas sacudido</p>

                          <Slider dark={t} label="¿Cuánto árbol llevas sacudido?" value={progreso} onChange={setProgreso} min={0} max={100} suffix="%" />

            <div style={{ marginBottom: 20 }}>
              <FunnelBar dark={t} label={`Sacudidos (${fmt(calc.contactosHechos)} de ${fmt(calc.contactos)})`} value={calc.contactosHechos} max={calc.contactos} color="#D4A843" />
              <FunnelBar dark={t} label={`Conversaciones abiertas`} value={calc.aperturasSim} max={calc.contactos} color="#c4943a" />
              <FunnelBar dark={t} label={`Reuniones agendadas y concretadas`} value={calc.reunionesSim} max={calc.contactos} color="#a07030" />
              <FunnelBar dark={t} label={`Clientes`} value={calc.clientesSim} max={calc.contactos} color="#705020" />
            </div>

            {/* Resumen simulación */}
            <div style={{ background: t ? "#1f1f1f" : "#f5f0e8", borderRadius: 10, padding: "14px 16px" }}>
              <div style={{ fontSize: 11, color: sub, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Proyección actual</div>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                {[
                  ["Meta", fmtMoney(meta)],
                  ["Proyectado", fmtMoney(calc.ingresosSim)],
                  ["Clientes", fmt(calc.clientesSim)],
                  ["Reuniones", fmt(calc.reunionesSim)],
                ].map(([l, v]) => (
                  <div key={l} style={{ textAlign: "center", flex: 1, minWidth: 70 }}>
                    <div style={{ fontSize: 10, color: sub }}>{l}</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: l === "Proyectado" ? "#D4A843" : text }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!listo && (
          <div style={{ textAlign: "center", padding: "32px 0", color: t ? "#444" : "#bbb", fontSize: 13 }}>
            Ingresa tu meta y ticket promedio para ver la matemática →
          </div>
        )}
      </div>
    </div>
  );
}
