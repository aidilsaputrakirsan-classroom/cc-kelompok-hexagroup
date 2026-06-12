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
      border: '1px solid var(--border-color)',
      borderRadius: '12px',
      padding: '20px',
      borderLeft: `4px solid ${statusColor[status] || '#6b7280'}`,
      background: 'var(--bg-card)',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      transition: 'background 0.3s ease',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--text-title)', fontWeight: '700' }}>
          {icon} {name}
        </h3>
        <span style={{
          background: statusColor[status],
          color: '#fff',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '700',
          textTransform: 'uppercase',
          flexShrink: 0,
        }}>
          {loading ? '...' : status}
        </span>
      </div>

      <div style={{ marginTop: '16px', fontSize: '14px', color: 'var(--text-main)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div style={{ color: 'var(--text-main)' }}>
            Requests: <strong style={{ color: 'var(--text-title)' }}>{metrics ? metrics.total_requests : '-'}</strong>
          </div>
          <div style={{ color: 'var(--text-main)' }}>
            Errors: <strong style={{ color: metrics?.total_errors > 0 ? '#ef4444' : 'var(--text-title)' }}>
              {metrics ? metrics.total_errors : '-'}
            </strong>
          </div>
          <div style={{ color: 'var(--text-main)' }}>
            Error Rate: <strong style={{ color: 'var(--text-title)' }}>{metrics ? `${metrics.error_rate_percent}%` : '-%'}</strong>
          </div>
          <div style={{ color: 'var(--text-main)' }}>
            Avg Latency: <strong style={{ color: 'var(--text-title)' }}>{metrics ? `${metrics.latency?.avg_ms || 0}ms` : '0ms'}</strong>
          </div>
          <div style={{ color: 'var(--text-main)' }}>
            p95 Latency: <strong style={{ color: 'var(--text-title)' }}>{metrics ? `${metrics.latency?.p95_ms || 0}ms` : '0ms'}</strong>
          </div>
          <div style={{ color: 'var(--text-main)' }}>
            Uptime: <strong style={{ color: 'var(--text-title)' }}>{metrics ? `${Math.round((metrics.uptime_seconds || 0) / 60)}min` : '0min'}</strong>
          </div>
        </div>
      </div>
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

  const handleMetricsFetched = useCallback((serviceName, rate) => {
    setErrorRates(prev => ({ ...prev, [serviceName]: rate }));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setLastChecked(new Date());
          return 10;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      marginTop: '104px',
      padding: '0 16px 40px',
      textAlign: 'left',
      boxSizing: 'border-box',
    }}>

      {/* HEADER ROW */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px',
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 'clamp(20px, 4vw, 28px)', color: 'var(--text-title)' }}>
            System Status
          </h1>
          <p style={{ color: 'var(--text-main)', marginTop: '4px', margin: '4px 0 0 0' }}>
            Real-time health monitoring
          </p>
        </div>

        {/* REFRESH INDICATOR */}
        <div style={{
          background: 'var(--bg-card)',
          padding: '10px 16px',
          borderRadius: '10px',
          border: '1px solid var(--border-color)',
          fontSize: '13px',
          color: 'var(--text-main)',
          flexShrink: 0,
          transition: 'background 0.3s ease',
        }}>
          <div style={{ color: 'var(--text-main)' }}>
            ⏰ Last checked:{' '}
            <strong style={{ color: 'var(--text-title)' }}>{lastChecked.toLocaleTimeString()}</strong>
          </div>
          <div style={{ marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              background: '#3b82f6',
              borderRadius: '50%',
              animation: 'statusPulse 1.5s infinite alternate',
              flexShrink: 0,
            }} />
            <span style={{ color: 'var(--text-main)' }}>
              ⌛ Next refresh in:{' '}
              <strong style={{ color: '#3b82f6' }}>{countdown}s</strong>
            </span>
          </div>
        </div>
      </div>

      {/* SERVICE CARDS GRID */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '16px',
      }}>
        <ServiceCard name="Auth Service"    icon="" healthUrl={`${API_URL}/auth/health`}    metricsUrl={`${API_URL}/auth/metrics`}    onMetricsFetched={handleMetricsFetched} />
        <ServiceCard name="Item Service"    icon="" healthUrl={`${API_URL}/items/health`}   metricsUrl={`${API_URL}/items/metrics`}   onMetricsFetched={handleMetricsFetched} />
        <ServiceCard name="Finance Service" icon="" healthUrl={`${API_URL}/finance/health`} metricsUrl={`${API_URL}/finance/metrics`} onMetricsFetched={handleMetricsFetched} />
        <ServiceCard name="Letters Service" icon="" healthUrl={`${API_URL}/letters/health`} metricsUrl={`${API_URL}/letters/metrics`} onMetricsFetched={handleMetricsFetched} />
        <ServiceCard name="API Gateway"     icon="" healthUrl={`${API_URL}/health`}          metricsUrl={null} />
      </div>

      {/* ERROR RATE CHART */}
      <div style={{
        marginTop: '32px',
        background: 'var(--bg-card)',
        padding: '24px',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        transition: 'background 0.3s ease',
      }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', color: 'var(--text-title)', fontWeight: '800' }}>
          Error Rate Chart (%)
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {Object.entries(errorRates).map(([service, rate]) => (
            <div key={service} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '120px',
                minWidth: '100px',
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--text-title)',
                flexShrink: 0,
              }}>
                {service}
              </div>
              <div style={{
                flex: 1,
                background: 'var(--border-color)',
                height: '16px',
                borderRadius: '8px',
                overflow: 'hidden',
                minWidth: '60px',
              }}>
                <div style={{
                  width: `${Math.min(Math.max(rate, 0), 100)}%`,
                  background: rate > 5 ? '#ef4444' : '#3b82f6',
                  height: '100%',
                  borderRadius: '8px',
                  transition: 'width 0.5s ease-in-out',
                }} />
              </div>
              <div style={{
                width: '42px',
                fontSize: '14px',
                textAlign: 'right',
                fontWeight: '700',
                color: 'var(--text-title)',
                flexShrink: 0,
              }}>
                {rate}%
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes statusPulse {
          from { opacity: 0.4; transform: scale(0.9); }
          to   { opacity: 1;   transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}