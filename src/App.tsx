import { Header } from './components/Header';
import { VoterLeaderboard } from './components/VoterLeaderboard';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <VoterLeaderboard />
      </main>
      <Footer />
    </div>
  );
}