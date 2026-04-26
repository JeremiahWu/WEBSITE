export default function Values() {
  return (
    <section id="values" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
          价值观
        </h2>
        <div className="divider mb-10" />

        <div className="space-y-6 text-lg text-muted leading-relaxed">
          <p>
            我相信这个世上还是有一些东西是用金钱无法量度的，我们生活的意义是为了给这个世界带来一些力所能及的改变。
          </p>
          <p>在最难搞的时候不要忘记微笑，也不要忘记斜眼笑。</p>
        </div>

        <blockquote className="mt-12 border-l-4 border-primary pl-6 text-left max-w-lg mx-auto">
          <p className="italic text-muted/80">
            Through many dangers, toils and snares,
            <br />I have already come;
            <br />
            &apos;Tis grace hath brought me safe thus far,
            <br />
            And grace will lead me home.
          </p>
        </blockquote>

        <p className="mt-10 text-muted">
          我们欢迎任何人以任何方式来到这里。我们可以说的很多，也可以走的很远。
        </p>
      </div>

      {/* Divider quote */}
      <div className="mt-16 py-16 bg-dark text-white text-center">
        <p className="text-xl md:text-2xl italic max-w-3xl mx-auto px-4">
          &ldquo;So we beat on, boats against the current, borne back
          ceaselessly into the past.&rdquo;
        </p>
      </div>
    </section>
  );
}
