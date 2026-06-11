import { useState, useEffect, useCallback } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost';

function ServiceCard({ name, icon, healthUrl, metricsUrl, onMetricsFetched }) {
  const [health, setHealth] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = useCallback(async () => {
    try {
      const healthRes = await fetch(healthUrl);
      const healthData = await healthRes.json();
      setHealth(healthData);
    } catch {
      setHealth({ status: 'unreachable' });
    }

    try {
      if (metricsUrl) {
        const metricsRes = await fetch(metricsUrl);
        const metricsData = await metricsRes.json();
        setMetrics(metricsData);
        // Kirim data error rate ke komponen utama untuk di-render di chart
        if (onMetricsFetched) {
          onMetricsFetched(name, metricsData.error_rate_percent || 0);
        }
      }
    } catch {
      setMetrics(null);
      if (onMetricsFetched) onMetricsFetched(name, 0);
    }

    setLoading(false);
  }, [healthUrl, metricsUrl, name, onMetricsFetched]);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  const statusColor = {
    healthy: '#22c55e',
    degraded: '#f59e0b',
    unhealthy: '#ef4444',
    unreachable: '#6b7280',
  };

  const status = health?.status || 'unreachable';

  return (
    <div style={{
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '20px',
      borderLeft: `4px solid ${statusColor[status] || '#6b7280'}`,
      background: '#fff',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '18px' }}>{icon} {name}</h3>
        <span style={{
          background: statusColor[status],
          color: '#fff',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600',
          textTransform: 'uppercase',
        }}>
          {loading ? '...' : status}
        </span>
      </div>

      {metrics && (
        <div style={{ marginTop: '16px', fontSize: '14px', color: '#64748b' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div>Requests: <strong>{metrics.total_requests}</strong></div>
            <div>Errors: <strong style={{ color: metrics.total_errors > 0 ? '#ef4444' : 'inherit' }}>
              {metrics.total_errors}
            </strong></div>
            <div>Error Rate: <strong>{metrics.error_rate_percent}%</strong></div>
            <div>Avg Latency: <strong>{metrics.latency?.avg_ms || 0}ms</strong></div>
            <div>p95 Latency: <strong>{metrics.latency?.p95_ms || 0}ms</strong></div>
            <div>Uptime: <strong>{Math.round((metrics.uptime_seconds || 0) / 60)}min</strong></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StatusPage() {
  const [lastChecked, setLastChecked] = useState(new Date());
  const [countdown, setCountdown] = useState(10);
  const [errorRates, setErrorRates] = useState({
    "Auth Service": 0,
    "Item Service": 0,
    "Finance Service": 0,
    "Letters Service": 0
  });

  // Fungsi untuk mencatat data error rate terbaru dari tiap service card
  const handleMetricsFetched = useCallback((serviceName, rate) => {
    setErrorRates(prev => ({ ...prev, [serviceName]: rate }));
  }, []);

  // Timer Efek untuk Auto-Refresh Indicator (Countdown)
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setLastChecked(new Date());
          return 10; // Reset ke 10 detik
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px', textAlign: 'left' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: 0 }}>📊 System Status</h1>
          <p style={{ color: '#64748b', marginTop: '4px' }}>Real-time health monitoring</p>
        </div>
        
        {/* REFRESH INDICATOR & TIMESTAMP */}
        <div style={{ 
          background: '#f8fafc', 
          padding: '10px 16px', 
          borderRadius: '8px', 
          border: '1px solid #e2e8f0',
          fontSize: '13px',
          color: '#64748b'
        }}>
          <div>⏰ Last checked: <strong>{lastChecked.toLocaleTimeString()}</strong></div>
          <div style={{ marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="refresh-spinner" style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              background: '#3b82f6',
              borderRadius: '50%',
              animation: 'pulse 1.5s infinite alternate'
            }}></span>
            ⌛ Next refresh in: <strong style={{ color: '#3b82f6' }}>{countdown}s</strong>
          </div>
        </div>
      </div>

      {/* RESPONSIVE GRID DESIGN */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '16px', 
        marginTop: '24px' 
      }}>
        <ServiceCard
          name="Auth Service"
          icon="🔐"
          healthUrl={`${API_URL}/auth/health`}
          metricsUrl={`${API_URL}/auth/metrics`}
          onMetricsFetched={handleMetricsFetched}
        />
        <ServiceCard
          name="Item Service"
          icon="📦"
          healthUrl={`${API_URL}/items/health`}
          metricsUrl={`${API_URL}/items/metrics`}
          onMetricsFetched={handleMetricsFetched}
        />
        <ServiceCard
          name="Finance Service"
          icon="💰"
          healthUrl={`${API_URL}/finance/health`}
          metricsUrl={`${API_URL}/finance/metrics`}
          onMetricsFetched={handleMetricsFetched}
        />
        <ServiceCard
          name="Letters Service"
          icon="📧"
          healthUrl={`${API_URL}/letters/health`}
          metricsUrl={`${API_URL}/letters/metrics`}
          onMetricsFetched={handleMetricsFetched}
        />
        <ServiceCard
          name="API Gateway"
          icon="🚪"
          healthUrl={`${API_URL}/health`}
          metricsUrl={null}
        />
      </div>

      {/* VISUAL CHART SEDERHANA (BAR CHART ERROR RATE) */}
      <div style={{ 
        marginTop: '32px', 
        background: '#fff', 
        padding: '24px', 
        borderRadius: '12px', 
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '16px' }}>📉 Error Rate Chart (%)</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {Object.entries(errorRates).map(([service, rate]) => (
            <div key={service} style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ width: '120px', fontSize: '14px', fontWeight: '500' }}>{service}</div>
              <div style={{ flex: 1, minWidth: '150px', background: '#f1f5f9', height: '16px', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${Math.min(Math.max(rate, 0), 100)}%`, 
                  background: rate > 5 ? '#ef4444' : '#3b82f6', 
                  height: '100%', 
                  borderRadius: '8px',
                  transition: 'width 0.5s ease-in-out'
                }} />
              </div>
              <div style={{ width: '40px', fontSize: '14px', textAlign: 'right', fontWeight: '600' }}>{rate}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Style Tambahan untuk Efek Pulse Indikator */}
      <style>{`
        @keyframes pulse {
          from { opacity: 0.4; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}