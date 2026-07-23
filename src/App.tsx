import { Header } from './components/Header/Header'
import { Hero } from './components/Hero/Hero'
import { DomainExpertise } from './components/DomainExpertise/DomainExpertise'
import { Projects } from './components/Projects/Projects'
import { Stack } from './components/Stack/Stack'
import { HowIWork } from './components/HowIWork/HowIWork'
import { Experience } from './components/Experience/Experience'
import { Contact } from './components/Contact/Contact'
import { Footer } from './components/Footer/Footer'

function App() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <Header />
      <main id="main-content">
        <Hero />
        <DomainExpertise />
        <Projects />
        <Stack />
        <HowIWork />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App
