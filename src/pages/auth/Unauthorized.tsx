import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold font-montserrat text-destructive">Zugriff verweigert</h1>
        <p className="text-muted-foreground font-lato">
          Sie haben keine Berechtigung, diesen Bereich zu betreten.
        </p>
        <Link to="/" className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-all">
          Zurück zur Startseite
        </Link>
      </div>
    </div>
  );
}
