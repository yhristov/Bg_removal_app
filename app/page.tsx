import ImageUploader from '../components/image-uploader';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Background Removal App</h1>
        <ImageUploader />
      </main>
      <Footer />
    </div>
  );
}
