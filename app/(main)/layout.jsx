import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="flex-1 mt-20">{children}</main>
      <Footer />
    </>
  );
}
