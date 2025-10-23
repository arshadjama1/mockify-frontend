import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/login')({
  component: LoginRoute,
});

function LoginRoute() {
  return (
    <div>
      <h3> Coffee and Login "/"!</h3>

      <Link to="/">/home</Link>
    </div>
  );
}
