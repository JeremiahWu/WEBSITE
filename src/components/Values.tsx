import { values } from "@/config/values";

export default function Values() {
  return (
    <section id="values" className="home-section home-values">
      <div className="home-container">
        <header className="values-page-heading">
          <p className="home-eyebrow">WHAT WE BELIEVE</p>
          <h1>老吴咖啡实验室<br/><span>价值观。</span></h1>
        </header>
        <ol className="values-principles">
          {values.map(value => (
            <li key={value.number}>
              <span className="values-principle-number" aria-hidden="true">{value.number}</span>
              <div><h2>{value.title}</h2><p>{value.description}</p></div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
