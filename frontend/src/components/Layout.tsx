import Footer from './Footer';
import Header from './Header';
import MobileFooter from './MobileFooter';

interface LayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
}

export default function Layout({ children, hideFooter = false }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 overflow-x-hidden">{children}</main>
      {!hideFooter && (
        <>
          <MobileFooter />
          <Footer />
        </>
      )}
    </div>
  );
}
