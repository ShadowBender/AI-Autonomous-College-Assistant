import StatusMessage from './StatusMessage';

export default function IntegrationNotice({ envName }) {
  return (
    <StatusMessage title="Backend route not configured">
      This screen is integration-ready. Add the backend's real route to <code>{envName}</code> in your <code>.env</code> file. No endpoint has been guessed.
    </StatusMessage>
  );
}
