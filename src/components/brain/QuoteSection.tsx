export function QuoteSection() {
  return (
    <section className="mb-8">
      <div className="relative py-8 px-6 bg-vb-subtle rounded-3xl text-center">
        {/* 따옴표 */}
        <span className="absolute top-4 left-6 text-6xl text-vb-silver/30 font-serif">
          &ldquo;
        </span>

        {/* 명언 */}
        <blockquote className="relative z-10">
          <p className="font-serif text-xl text-vb-charcoal leading-relaxed italic">
            알츠하이머 유전자가 있어도
            <br />
            발병하지 않을 수 있습니다.
            <br />
            <span className="text-vb-coral font-semibold">핵심은 습관입니다.</span>
          </p>
        </blockquote>

        {/* 출처 */}
        <p className="mt-4 text-sm text-vb-muted">
          — 뇌과학 연구 기반
        </p>
      </div>
    </section>
  );
}
