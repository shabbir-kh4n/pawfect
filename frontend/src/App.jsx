import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import HomePage from './pages/HomePage';
import AdoptPage from './pages/AdoptPage';
import PetDetailPage from './pages/PetDetailPage';
import DonatePetPage from './pages/DonatePetPage';
import AdoptionQuizPage from './pages/AdoptionQuizPage';
import HealthTrackerPage from './pages/HealthTrackerPage';
import PetServicesPage from './pages/PetServicesPage';
import NameGeneratorPage from './pages/NameGeneratorPage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import PetCareGuidePage from './pages/PetCareGuidePage';
import AdoptionProcessPage from './pages/AdoptionProcessPage';
import HealthResourcesPage from './pages/HealthResourcesPage';
import SupportPage from './pages/SupportPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<HomePage />} />
          <Route path="adopt" element={<AdoptPage />} />
          <Route path="adopt/:id" element={<PetDetailPage />} />
          <Route path="donate-pet" element={<DonatePetPage />} />
          <Route path="adoption-quiz" element={<AdoptionQuizPage />} />
          <Route path="health-tracker" element={<HealthTrackerPage />} />
          <Route path="pet-services" element={<PetServicesPage />} />
          <Route path="name-generator" element={<NameGeneratorPage />} />
          <Route path="signup" element={<SignUpPage />} />
          <Route path="get-started" element={<SignUpPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="pet-care-guide" element={<PetCareGuidePage />} />
          <Route path="adoption-process" element={<AdoptionProcessPage />} />
          <Route path="health-resources" element={<HealthResourcesPage />} />
          <Route path="support" element={<SupportPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
