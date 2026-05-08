"use client";

import DashboardLayout from "../DashboardLayout";
import styles from "../dashboard.module.css";

export default function TestPage() {
  return (
    <DashboardLayout>
      <div className={styles.dashboardOverview}>
        <h1 style={{ fontSize: "1.875rem", fontWeight: "700", marginBottom: "var(--spacing-xl)", color: "var(--primary)" }}>
          Responsive Dashboard Test
        </h1>
        
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <div>
                <div className={styles.statTitle}>Mobile First Test</div>
                <div className={styles.statValue}>Success</div>
                <div className={`${styles.statChange} ${styles.positive}`}>
                  ✓ Responsive
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <div>
                <div className={styles.statTitle}>Sidebar</div>
                <div className={styles.statValue}>Collapsible</div>
                <div className={`${styles.statChange} ${styles.positive}`}>
                  ✓ Mobile Menu
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <div>
                <div className={styles.statTitle}>CSS Grid</div>
                <div className={styles.statValue}>Working</div>
                <div className={`${styles.statChange} ${styles.positive}`}>
                  ✓ Auto Layout
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <div>
                <div className={styles.statTitle}>Flexbox</div>
                <div className={styles.statValue}>Implemented</div>
                <div className={`${styles.statChange} ${styles.positive}`}>
                  ✓ Sidebar + Content
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.contentGrid}>
          <div className={styles.recentTransactions}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Responsive Test</h2>
            </div>
            <div style={{ padding: "var(--spacing-lg)" }}>
              <h3 style={{ marginBottom: "var(--spacing-md)", color: "var(--primary)" }}>Media Queries Test</h3>
              <p style={{ marginBottom: "var(--spacing-md)", color: "var(--text-light)" }}>
                This dashboard uses mobile-first CSS media queries:
              </p>
              <ul style={{ paddingLeft: "var(--spacing-lg)", color: "var(--text-light)" }}>
                <li style={{ marginBottom: "var(--spacing-sm)" }}><strong>Mobile (less than 768px):</strong> Sidebar becomes hamburger menu</li>
                <li style={{ marginBottom: "var(--spacing-sm)" }}><strong>Tablet (768px-1023px):</strong> Sidebar width reduced to 220px</li>
                <li style={{ marginBottom: "var(--spacing-sm)" }}><strong>Desktop (greater than 1024px):</strong> Full sidebar (250px) visible</li>
                <li style={{ marginBottom: "var(--spacing-sm)" }}><strong>CSS Grid:</strong> Cards automatically rearrange based on screen size</li>
                <li style={{ marginBottom: "var(--spacing-sm)" }}><strong>Flexbox:</strong> Used for sidebar-content layout</li>
              </ul>
            </div>
          </div>

          <div className={styles.recentTransactions}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Features Checklist</h2>
            </div>
            <div style={{ padding: "var(--spacing-lg)" }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "var(--spacing-md)" }}>
                <div style={{ width: "20px", height: "20px", borderRadius: "50%", backgroundColor: "#10b981", marginRight: "var(--spacing-sm)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "12px" }}>✓</div>
                <span>Responsive sidebar with flexbox</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "var(--spacing-md)" }}>
                <div style={{ width: "20px", height: "20px", borderRadius: "50%", backgroundColor: "#10b981", marginRight: "var(--spacing-sm)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "12px" }}>✓</div>
                <span>CSS Grid for stat cards</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "var(--spacing-md)" }}>
                <div style={{ width: "20px", height: "20px", borderRadius: "50%", backgroundColor: "#10b981", marginRight: "var(--spacing-sm)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "12px" }}>✓</div>
                <span>CSS Variables for theming</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "var(--spacing-md)" }}>
                <div style={{ width: "20px", height: "20px", borderRadius: "50%", backgroundColor: "#10b981", marginRight: "var(--spacing-sm)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "12px" }}>✓</div>
                <span>Hover and active states</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "var(--spacing-md)" }}>
                <div style={{ width: "20px", height: "20px", borderRadius: "50%", backgroundColor: "#10b981", marginRight: "var(--spacing-sm)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "12px" }}>✓</div>
                <span>Mobile-first media queries</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "var(--spacing-md)" }}>
                <div style={{ width: "20px", height: "20px", borderRadius: "50%", backgroundColor: "#10b981", marginRight: "var(--spacing-sm)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "12px" }}>✓</div>
                <span>Clean typography and shadows</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "var(--spacing-2xl)", padding: "var(--spacing-lg)", backgroundColor: "var(--card-bg)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "var(--spacing-md)", color: "var(--primary)" }}>Color Palette</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "var(--spacing-md)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
              <div style={{ width: "40px", height: "40px", backgroundColor: "var(--primary)", borderRadius: "var(--radius-sm)" }}></div>
              <div>
                <div style={{ fontWeight: "600" }}>Primary</div>
                <div style={{ fontSize: "0.875rem", color: "var(--text-light)" }}>#1e293b (Deep Navy)</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
              <div style={{ width: "40px", height: "40px", backgroundColor: "var(--accent)", borderRadius: "var(--radius-sm)" }}></div>
              <div>
                <div style={{ fontWeight: "600" }}>Accent</div>
                <div style={{ fontSize: "0.875rem", color: "var(--text-light)" }}>#6366f1 (Vibrant Indigo)</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
              <div style={{ width: "40px", height: "40px", backgroundColor: "var(--background)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}></div>
              <div>
                <div style={{ fontWeight: "600" }}>Background</div>
                <div style={{ fontSize: "0.875rem", color: "var(--text-light)" }}>#f8fafc (Light Grey)</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
              <div style={{ width: "40px", height: "40px", backgroundColor: "var(--text)", borderRadius: "var(--radius-sm)" }}></div>
              <div>
                <div style={{ fontWeight: "600" }}>Text</div>
                <div style={{ fontSize: "0.875rem", color: "var(--text-light)" }}>#334155 (Slate Dark)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}