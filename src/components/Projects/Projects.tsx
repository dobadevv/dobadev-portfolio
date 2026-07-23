import { SectionHeading } from '../shared/SectionHeading/SectionHeading'
import { RevealOnScroll } from '../shared/RevealOnScroll/RevealOnScroll'
import { projects } from './data'
import styles from './Projects.module.css'

export function Projects() {
  return (
    <section id="projects" className="section" aria-labelledby="projects-heading">
      <div className="container">
        <SectionHeading number="02" kicker="My projects" headingId="projects-heading" />
        <div className={styles.grid}>
          {projects.map((project, index) => (
            <RevealOnScroll key={project.title} delayMs={index * 80}>
              <article className={styles.card}>
                <h3 className={styles.title}>
                  <a href={project.url} target="_blank" rel="noopener noreferrer">
                    {project.title}
                  </a>
                </h3>
                <p className={styles.subtitle}>{project.subtitle}</p>
                <p className={styles.description}>{project.description}</p>
                <ul className={styles.tags}>
                  {project.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </article>
            </RevealOnScroll>
          ))}
          <div className={styles.placeholder}>more projects in progress</div>
        </div>
      </div>
    </section>
  )
}
