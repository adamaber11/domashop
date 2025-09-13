export function Footer() {
  return (
    <footer className="bg-muted py-6 mt-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Bazaar Bliss. All rights reserved.</p>
      </div>
    </footer>
  );
}
