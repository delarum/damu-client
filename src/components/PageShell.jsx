import Footer from "./Footer";

export default function PageShell({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      {children}
      <Footer />
    </div>
  );
}
