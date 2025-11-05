// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ErrorPageProps = {
  error: Error & { digest?: string };
  reset?: () => void;
};
