const chartBars = [34, 52, 42, 68, 48, 78, 58, 91, 69, 100, 76, 88];

const transactions = [
  { icon: "+", title: "Ingreso recibido", date: "Hoy, 10:42 a. m.", amount: "+$240" },
  { icon: "↗", title: "Compra realizada", date: "Ayer, 6:18 p. m.", amount: "−$38" },
  { icon: "+", title: "Nuevo pago", date: "Ayer, 2:05 p. m.", amount: "+$125" },
];

export default function HeroMockups() {
  return (
    <div className="hero-showcase" aria-hidden="true">
      <div className="hero-showcase-glow" aria-hidden="true" />

      <div className="showcase-tag showcase-tag-web" aria-hidden="true">
        PÁGINAS WEB
      </div>

      <div className="monitor-mockup" aria-hidden="true">
        <div className="monitor-frame">
          <div className="monitor-screen">
            <div className="browser-toolbar">
              <span className="browser-dot" />
              <span className="browser-dot" />
              <span className="browser-dot" />
              <span className="browser-address">tu-negocio.com</span>
            </div>
            <div className="web-preview">
              <div className="web-preview-header">
                <div className="web-preview-brand">
                  <span className="web-brand-mark" />
                  CASA NORTE
                </div>
                <div className="web-preview-nav">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
              <div className="web-preview-main">
                <div className="web-preview-copy">
                  <span className="web-preview-kicker">ESPACIOS CON INTENCIÓN</span>
                  <h2 className="web-preview-title">Tu próximo lugar favorito.</h2>
                  <p className="web-preview-description">
                    Diseño local, detalles únicos y un espacio hecho para ti.
                  </p>
                  <span className="web-preview-button">CONOCE LA COLECCIÓN</span>
                </div>
                <div className="web-preview-art">
                  <span className="web-art-label">01 / INTERIORES</span>
                  <span className="web-art-footer">
                    <span>FORMA</span>
                    <span>FUNCIÓN</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="monitor-stand" />
        <div className="monitor-base" />
      </div>

      <div className="phone-mockup" aria-hidden="true">
        <div className="phone-screen">
          <div className="phone-camera" />
          <div className="phone-status">
            <span>9:41</span>
            <span className="phone-status-signals" />
          </div>
          <div className="app-preview">
            <div className="app-preview-top">
              <div>
                <span className="app-preview-date">MIÉRCOLES, 14 DE MAYO</span>
                <p className="app-preview-greeting">Hola, Andrea</p>
              </div>
              <span className="app-avatar">A</span>
            </div>

            <div className="app-balance-card">
              <span className="app-balance-label">Balance disponible</span>
              <strong className="app-balance-value">$4,820.50</strong>
              <span className="app-balance-change">↗ 12.8% este mes</span>
              <div className="app-chart" aria-hidden="true">
                {chartBars.map((height, index) => (
                  <span
                    key={`${height}-${index}`}
                    className="app-chart-bar"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>

            <div className="app-activity-heading">
              Actividad reciente
              <span>Ver todo</span>
            </div>

            {transactions.map((transaction) => (
              <div className="app-transaction" key={transaction.title}>
                <span className="app-transaction-icon">{transaction.icon}</span>
                <span className="app-transaction-copy">
                  <strong>{transaction.title}</strong>
                  <small>{transaction.date}</small>
                </span>
                <span className="app-transaction-amount">{transaction.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="showcase-tag showcase-tag-app" aria-hidden="true">
        APPS MÓVILES
      </div>
    </div>
  );
}