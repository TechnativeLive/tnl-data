export default async function Unauthenticated() {
  return (
    <div className="flex-1 grid place-content-center gap-8 justify-center items-center text-center">
      <p>You are not authorized to view that page</p>
      {'<DashboardLink />'}
      <p className="text-sm mt-32 justify-self-end text-foreground/70">
        If you believe this is an error, please{' '}
        <a className="text-secondary" href="mailto:EMAIL">
          get in touch
        </a>
      </p>
    </div>
  );
}
