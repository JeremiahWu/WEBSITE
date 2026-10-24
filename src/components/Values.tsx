import { values } from "@/config/values";

export default function Values() {
  return (
    <section id="values" className="home-section home-values">
      <div className="home-container">
        <header className="values-page-heading">
          <p className="home-eyebrow">OUR VALUES</p>
          <h2>价值观</h2>
        </header>
        <ol className="values-principles">
          {values.map(value => (
            <li key={value.number}>
              <span className="values-principle-number" aria-hidden="true">{value.number}</span>
              <div><h3>{value.title}</h3><p>{value.description}</p></div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
