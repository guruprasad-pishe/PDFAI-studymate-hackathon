import Sidebar from '@/components/Sidebar';
import MainContent from '@/components/MainContent';

const Index = () => {
  return (
    <div className="h-screen flex bg-background overflow-hidden">
      <Sidebar />
      <MainContent />
    </div>
  );
};

export default Index;
