import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/docs')({
  component: DocsRoute,
});

function DocsRoute() {
  return (
    <div>
      <h3> We are at "/docs"!</h3>

      <Link to="/">/home</Link>
    </div>
  );
}
