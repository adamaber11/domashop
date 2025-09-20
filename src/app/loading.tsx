// src/app/loading.tsx

export default function Loading() {
  // The spinner styles are already defined in globals.css
  // This component will be automatically shown by Next.js during page navigations.
  return (
    <div className="page-loader-overlay">
      <div className="page-loader-spinner"></div>
    </div>
  );
}
