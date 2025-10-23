import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: HomeRoute,
});

function HomeRoute() {
  return (
    <div>
      <h3> Hello "/"!</h3>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <Link to="/docs">/docs</Link>
        <Link to="/login">/login</Link>
      </div>
    </div>
  );
}
