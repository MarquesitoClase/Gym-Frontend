export function LoadingState({ lines = 4 }) {
  return (
    <div className="loading-state">
      <div className="loading-state__card" />
      <div className="loading-state__body">
        {Array.from({ length: lines }).map((_, index) => (
          <span className="loading-state__line" key={index} />
        ))}
      </div>
    </div>
  );
}
