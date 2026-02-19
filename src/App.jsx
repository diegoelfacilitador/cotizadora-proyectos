import { useState, useMemo } from "react";

const fmtN = (n) => {
  const v = Math.ceil(n);
  return isFinite(v) ? v.toLocaleString("es-CL") : "0";
};
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

function FunnelStage({ label, value, prev, ritmoOk, dark, isFirst }) {
  const safeValue = isFinite(value) && value > 0 ? value : 0;
  const safePrev = isFinite(prev) && prev > 0 ? prev : 1;
  // ancho proporcional respecto a la etapa anterior (máximo 100%)
  const pct = isFirst ? 100 : Math.min((safeValue / safePrev) * 100, 100);
  const color = ritmoOk ? "#4CAF50" : "#e05555";
  const t = dark;
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, alignItems: "baseline" }}>
        <span style={{ fontSize: 12, color: t ? "#aaa" : "#666" }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: t ? "#f0f0f0" : "#111" }}>
          {fmtN(safeValue)}
          {!isFirst && <span style={{ fontSize: 10, fontWeight: 400, color: t ? "#555" : "#aaa" }}> ({Math.round(pct)}% del anterior)</span>}
        </span>
      </div>
      <div style={{ height: 10, background: t ? "#1a1a1a" : "#e8e8e8", borderRadius: 4 }}>
        <div style={{ height: "100%", width: pct + "%", background: color, borderRadius: 4, transition: "width 0.5s ease, background 0.4s ease", opacity: safeValue === 0 ? 0.2 : 1 }} />
      </div>
    </div>
  );
}

export default function App() {
  const [dark, setDark] = useState(true);
  const t = dark;
  const bg = t ? "#111" : "#f5f5f0";
  const card = t ? "#181818" : "#ffffff";
  const border = t ? "#2a2a2a" : "#e0e0e0";
  const text = t ? "#f0f0f0" : "#111";
  const sub = t ? "#888" : "#666";

  // bloque 01
  const [meta, setMeta] = useState(10000000);
  const [ticket, setTicket] = useState(2000000);

  // bloque 02
  const [apertura, setApertura] = useState(5);
  const [asistencia, setAsistencia] = useState(70);
  const [convRate, setConvRate] = useState(20);
  const [showRatios, setShowRatios] = useState(false);

  // bloque 04
  const [progreso, setProgreso] = useState(0);
  const [diaDelMes, setDiaDelMes] = useState(15);

  // bloque 05
  const [showEcuacion, setShowEcuacion] = useState(false);
  const [activeVar, setActiveVar] = useState(null);
  const [eqRA, setEqRA] = useState(10);
  const [eqTC, setEqTC] = useState(20);
  const [eqTP, setEqTP] = useState(1000000);

  // cálculo principal
  const calc = useMemo(() => {
    const m = parseFloat(meta) || 0;
    const tk = parseFloat(ticket) || 1;
    const clientes = m / tk;
    const reuniones = clientes / (convRate / 100);
    const agendadas = reuniones / (asistencia / 100);
    const contactos = agendadas * apertura;
    const porSemana = contactos / 4;

    // targets del embudo — cuántos necesito en total para cerrar la meta
    const targetContactos = isFinite(contactos) && contactos > 0 ? contactos : 1;
    const targetConversaciones = isFinite(agendadas) && agendadas > 0 ? agendadas : 1;
    const targetReuniones = isFinite(reuniones) && reuniones > 0 ? reuniones : 1;

    // simulación — cada etapa depende SOLO de los contactos hechos
    const contactosHechos = progreso;
    const conversacionesSim = contactosHechos / apertura;              // 1 de cada X contactos agenda
    const reunionesSim = conversacionesSim * (asistencia / 100);       // % de agendadas que se concretan
    const clientesSim = reunionesSim * (convRate / 100);               // % de reuniones que cierran
    const ingresosSim = clientesSim * tk;

    return {
      clientes, reuniones, agendadas, contactos, porSemana,
      targetContactos, targetConversaciones, targetReuniones,
      contactosHechos, conversacionesSim, reunionesSim, clientesSim, ingresosSim
    };
  }, [meta, ticket, apertura, asistencia, convRate, progreso]);

  const listo = parseFloat(meta) > 0 && parseFloat(ticket) > 0;

  return (
    <div style={{ minHeight: "100vh", background: bg, color: text, fontFamily: "'Inter','Helvetica Neue',sans-serif", padding: "24px 16px", transition: "background 0.3s" }}>
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
            style={{ background: t ? "#222" : "#e8e8e8", border: `1px solid ${border}`, borderRadius: 20, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontWeight: 600, color: text }}>
            {t ? "☀ Claro" : "☾ Oscuro"}
          </button>
        </div>

        {/* 01 Meta */}
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: 20, marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#D4A843", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>01 — Tu Meta</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: sub, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>¿Cuánto quieres vender este mes?</span>
                <span style={{ fontSize: 22, fontWeight: 900, color: "#D4A843" }}>{fmtMoney(meta)}</span>
              </div>
              <input type="range" min={2000000} max={100000000} step={500000} value={meta}
                onChange={e => setMeta(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#D4A843", cursor: "pointer" }} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                <span style={{ fontSize: 10, color: t ? "#555" : "#bbb" }}>$2.000.000</span>
                <span style={{ fontSize: 10, color: t ? "#555" : "#bbb" }}>$100.000.000</span>
              </div>
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: sub, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>¿Cuál es tu ticket promedio?</span>
                <span style={{ fontSize: 15, fontWeight: 800, color: "#D4A843" }}>{fmtMoney(ticket)}</span>
              </div>
              <input type="range" min={1000000} max={100000000} step={500000} value={ticket}
                onChange={e => setTicket(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#D4A843", cursor: "pointer" }} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                <span style={{ fontSize: 10, color: t ? "#555" : "#bbb" }}>$1.000.000</span>
                <span style={{ fontSize: 10, color: t ? "#555" : "#bbb" }}>$100.000.000</span>
              </div>
            </div>
          </div>
          {listo && (
            <div style={{ marginTop: 14, padding: "10px 14px", background: t ? "#1f1f1f" : "#f5f0e8", borderRadius: 8, borderLeft: "3px solid #D4A843", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: text }}>Clientes que necesitas:</span>
              <span style={{ fontWeight: 800, fontSize: 28, color: text }}>{fmtN(calc.clientes)}</span>
            </div>
          )}
        </div>

        {/* 02 Tus Números */}
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: 20, marginBottom: 12 }}>
          <button onClick={() => setShowRatios(!showRatios)}
            style={{ background: "none", border: "none", cursor: "pointer", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: 0, color: "inherit" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#D4A843", letterSpacing: "0.1em", textTransform: "uppercase" }}>02 — Tus Números</span>
            <span style={{ fontSize: 12, color: sub }}>{showRatios ? "▲ ocultar" : "▼ ajustar"}</span>
          </button>
          {!showRatios && (
            <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
              {[["Agenda", "1 de " + apertura], ["Asistencia", asistencia + "%"], ["Conversión", convRate + "%"]].map(([l, v]) => (
                <div key={l} style={{ flex: 1, background: t ? "#1a1a1a" : "#f5f5f0", borderRadius: 8, padding: "8px 6px", textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: sub, marginBottom: 2 }}>{l}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#D4A843" }}>{v}</div>
                </div>
              ))}
            </div>
          )}
          {showRatios && (
            <div style={{ marginTop: 16 }}>
              <Slider dark={t} label="De cada X contactos, 1 agenda una reunión" value={apertura} onChange={setApertura} min={1} max={20} step={1} suffix=" contactos" />
              <Slider dark={t} label="% de reuniones agendadas que se concretan" value={asistencia} onChange={setAsistencia} min={10} max={100} />
              <Slider dark={t} label="% de reuniones que se convierten en venta" value={convRate} onChange={setConvRate} min={5} max={80} />
            </div>
          )}
        </div>

        {/* 03 El Número */}
        {listo && (
          <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: 20, marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#D4A843", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>03 — El Número que Importa</div>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: sub, marginBottom: 8 }}>Personas a contactar durante este mes</div>
              <div style={{ fontSize: 72, fontWeight: 900, color: text, lineHeight: 1, letterSpacing: "-0.04em" }}>{fmtN(calc.contactos)}</div>
            </div>
            <div style={{ background: "#D4A843", borderRadius: 10, padding: "14px 18px", textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "#111", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Esta semana contacta a</div>
              <div style={{ fontSize: 40, fontWeight: 900, color: "#111", lineHeight: 1 }}>{fmtN(calc.porSemana)}</div>
              <div style={{ fontSize: 11, color: "#333", marginTop: 2 }}>personas</div>
            </div>
          </div>
        )}

        {/* 04 Embudo */}
        {listo && (
          <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: 20, marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#D4A843", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>04 — El Embudo</div>
            <Slider dark={t} label="Personas contactadas este mes" value={progreso} onChange={setProgreso} min={0} max={500} step={1} suffix=" personas" />
            <Slider dark={t} label="Día del mes" value={diaDelMes} onChange={setDiaDelMes} min={1} max={30} step={1} suffix="" />
            <div style={{ marginBottom: 16 }}>
              {(() => {
                const diasTranscurridos = Math.max(diaDelMes, 1);
                const diasRestantes = Math.max(30 - diaDelMes, 1);
                const ritmoActual = progreso / diasTranscurridos;
                const faltan = Math.max(Math.ceil(calc.targetContactos) - progreso, 0);
                const ritmoNecesario = faltan / diasRestantes;
                const contactosOk = ritmoActual >= ritmoNecesario;

                const conversaciones = calc.conversacionesSim;
                const reuniones = calc.reunionesSim;
                const convOk = conversaciones / Math.max(progreso, 1) >= (1 / apertura) * 0.8;
                const reunOk = reuniones / Math.max(conversaciones, 1) >= (asistencia / 100) * 0.8;

                return (
                  <>
                    <FunnelStage dark={t} label="Personas contactadas" value={progreso} prev={progreso} ritmoOk={contactosOk} isFirst={true} />
                    <FunnelStage dark={t} label="Conversaciones establecidas" value={conversaciones} prev={progreso} ritmoOk={convOk} />
                    <FunnelStage dark={t} label="Reuniones agendadas y concretadas" value={reuniones} prev={conversaciones} ritmoOk={reunOk} />
                  </>
                );
              })()}
            </div>


            <div style={{ background: t ? "#1f1f1f" : "#f5f0e8", borderRadius: 10, padding: "18px 20px", border: `1px solid ${t ? "#3a3a2a" : "#d4c090"}` }}>
              <div style={{ fontSize: 12, color: "#D4A843", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>Proyección actual</div>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                {[["Meta", fmtMoney(meta)], ["Proyectado", fmtMoney(calc.ingresosSim)], ["Clientes", fmtN(calc.clientesSim)], ["Reuniones", fmtN(calc.reunionesSim)]].map(([l, v]) => (
                  <div key={l} style={{ textAlign: "center", flex: 1, minWidth: 70 }}>
                    <div style={{ fontSize: 11, color: sub, marginBottom: 4 }}>{l}</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: l === "Proyectado" ? (calc.ingresosSim >= parseFloat(meta) ? "#4CAF50" : "#e05555") : text }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 05 La Ecuación */}
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: 20, marginBottom: 12 }}>
          <button onClick={() => {
            if (!showEcuacion) {
              setEqRA(Math.min(70, Math.ceil(calc.reuniones) || 10));
              setEqTC(convRate);
              setEqTP(Math.min(30000000, parseFloat(ticket) || 1000000));
            }
            setShowEcuacion(!showEcuacion);
          }} style={{ background: "none", border: "none", cursor: "pointer", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: 0, color: "inherit" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#D4A843", letterSpacing: "0.1em", textTransform: "uppercase" }}>05 — La Ecuación del Vendedor</span>
            <span style={{ fontSize: 12, color: sub }}>{showEcuacion ? "▲ cerrar" : "▼ abrir"}</span>
          </button>
          {showEcuacion && (
            <div style={{ marginTop: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap", marginBottom: 24, padding: "12px 0", borderBottom: `1px solid ${border}` }}>
                {[["RA", "Reuniones agendadas"], ["×", null], ["TC", "Tasa de cierre"], ["×", null], ["TP", "Ticket promedio"], ["=", null], ["EV", "Ingresos"]].map(([symbol, tooltip], i) =>
                  tooltip ? (
                    <div key={i} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 20, fontWeight: 900, transition: "color 0.2s", color: symbol === activeVar ? "#D4A843" : symbol === "EV" ? (activeVar ? sub : "#D4A843") : text }}>{symbol}</div>
                      <div style={{ fontSize: 9, color: sub, marginTop: 2, maxWidth: 60, lineHeight: 1.2 }}>{tooltip}</div>
                    </div>
                  ) : (
                    <div key={i} style={{ fontSize: 22, fontWeight: 300, color: sub, paddingBottom: 14 }}>{symbol}</div>
                  )
                )}
              </div>
              <div onMouseEnter={() => setActiveVar("RA")} onMouseLeave={() => setActiveVar(null)}>
                <Slider dark={t} label="Reuniones agendadas" value={eqRA} onChange={setEqRA} min={1} max={70} step={1} suffix=" reuniones" />
              </div>
              <div onMouseEnter={() => setActiveVar("TC")} onMouseLeave={() => setActiveVar(null)}>
                <Slider dark={t} label="Tasa de cierre" value={eqTC} onChange={setEqTC} min={5} max={100} step={5} suffix="%" />
              </div>
              <div onMouseEnter={() => setActiveVar("TP")} onMouseLeave={() => setActiveVar(null)}>
                <Slider dark={t} label="Ticket promedio" value={eqTP} onChange={setEqTP} min={100000} max={30000000} step={100000} suffix="" />
              </div>
              <div style={{ marginTop: 8, background: "#D4A843", borderRadius: 10, padding: "16px 20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <span style={{ fontSize: 22, fontWeight: 900, color: "#111" }}>{fmtMoney(Math.round(eqRA * (eqTC / 100) * eqTP))}</span>
                    <span style={{ fontSize: 10, color: "#5a4010", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Ingresos proyectados</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#5a4010", textAlign: "right", lineHeight: 1.6 }}>
                    <div>{eqRA} reuniones</div>
                    <div>× {eqTC}% cierre</div>
                    <div>× {fmtMoney(eqTP)}</div>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[
                  { label: "Menos reuniones, mejor ticket", ra: 5, tc: 40, tp: 2000000 },
                  { label: "Mejor cierre, más ventas", ra: 20, tc: 60, tp: 500000 },
                  { label: "Volumen alto, ticket bajo", ra: 40, tc: 25, tp: 200000 },
                ].map((p, i) => (
                  <button key={i} onClick={() => { setEqRA(p.ra); setEqTC(p.tc); setEqTP(p.tp); }}
                    style={{ flex: 1, minWidth: 120, background: t ? "#1a1a1a" : "#f0f0f0", border: `1px solid ${border}`, borderRadius: 8, padding: "8px 10px", cursor: "pointer", fontSize: 11, color: sub, fontWeight: 600, lineHeight: 1.3, textAlign: "center" }}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {!listo && (
          <div style={{ textAlign: "center", padding: "32px 0", color: t ? "#444" : "#bbb", fontSize: 13 }}>
            Mueve los sliders para ver la matemática →
          </div>
        )}
      </div>
    </div>
  );
}
