import Head from 'next/head';
import Card from '../components/Card';
import AlertBanner from '../components/AlertBanner';

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>ScamMail AI - Dashboard</title>
      </Head>
      <main style={{ padding: '1rem' }}>
        <h1>Dashboard</h1>
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <Card title="Total Scans">123</Card>
          <Card title="Phishing Rate">45%</Card>
          <Card title="Avg. Confidence">87%</Card>
          <Card title="False Positives">2%</Card>
        </div>
        <AlertBanner type="info">Charts would appear here.</AlertBanner>
      </main>
    </>
  );
}
