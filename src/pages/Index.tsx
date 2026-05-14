import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

type LucideIconName = string;

// ─── NAV ────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Услуги", href: "#services" },
    { label: "Портфолио", href: "#portfolio" },
    { label: "Калькулятор", href: "#calculator" },
    { label: "Отзывы", href: "#reviews" },
    { label: "Контакты", href: "#contacts" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-brand-dark/95 backdrop-blur-md border-b border-brand-border shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between py-4">
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-9 h-9 gradient-brand rounded-lg flex items-center justify-center rotate-6 group-hover:rotate-0 transition-transform duration-300">
            <Icon name="Printer" size={18} className="text-white" />
          </div>
          <span className="font-display text-xl font-bold tracking-wider text-white">
            ПРИНТ<span className="gradient-text">МАСТЕР</span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-body text-sm text-white/70 hover:text-white transition-colors relative group"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 gradient-brand group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>

        <a
          href="#contacts"
          className="hidden md:flex gradient-brand text-white font-body font-semibold text-sm px-5 py-2.5 rounded-lg hover:opacity-90 hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300"
        >
          Заказать печать
        </a>

        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Icon name={menuOpen ? "X" : "Menu"} size={24} />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-brand-dark/98 border-t border-brand-border px-6 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="font-body text-white/80 hover:text-white py-2 border-b border-brand-border"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contacts"
            onClick={() => setMenuOpen(false)}
            className="gradient-brand text-white font-body font-semibold text-center py-3 rounded-lg mt-2"
          >
            Заказать печать
          </a>
        </div>
      )}
    </nav>
  );
}

// ─── HERO ────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-brand-dark">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-brand-orange/20 blur-3xl animate-float" />
        <div
          className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-brand-amber/15 blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-orange/5 blur-3xl animate-float"
          style={{ animationDelay: "4s" }}
        />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,87,34,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,87,34,0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16 grid lg:grid-cols-2 gap-16 items-center">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 bg-brand-orange/10 border border-brand-orange/30 rounded-full px-4 py-1.5 mb-6">
            <div className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
            <span className="font-body text-sm text-brand-orange font-medium">
              Москва · Печать от 1 дня
            </span>
          </div>

          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white mb-6">
            ПЕЧАТАЕМ
            <br />
            <span className="gradient-text">ВАШУ ИДЕЮ</span>
            <br />
            В ЖИЗНЬ
          </h1>

          <p className="font-body text-lg text-white/60 leading-relaxed mb-10 max-w-md">
            Каталоги, журналы, брошюры — профессиональная полиграфия для бизнеса. Быстро, качественно, с гарантией.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#calculator"
              className="gradient-brand text-white font-body font-bold text-base px-8 py-4 rounded-xl hover:opacity-90 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300 text-center"
            >
              Рассчитать стоимость
            </a>
            <a
              href="#portfolio"
              className="border border-brand-border text-white font-body font-semibold text-base px-8 py-4 rounded-xl hover:border-brand-orange/50 hover:bg-brand-orange/5 transition-all duration-300 text-center"
            >
              Смотреть работы
            </a>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-14 pt-10 border-t border-brand-border">
            {[
              { num: "15+", label: "лет на рынке" },
              { num: "4 000+", label: "проектов сдано" },
              { num: "98%", label: "клиентов довольны" },
            ].map((s) => (
              <div key={s.num}>
                <div className="font-display text-2xl font-bold gradient-text mb-1">{s.num}</div>
                <div className="font-body text-xs text-white/50">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative hidden lg:flex items-center justify-center">
          <div className="relative w-full max-w-md">
            <div className="relative z-10 card-dark rounded-3xl p-8 shadow-2xl hover-lift">
              <div
                className="gradient-brand rounded-2xl h-48 mb-6 flex items-center justify-center relative overflow-hidden"
              >
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 11px)",
                  }}
                />
                <Icon name="BookOpen" size={64} className="text-white/80" />
              </div>
              <div className="font-display text-xl font-bold text-white mb-2">
                Каталог А4, 48 стр.
              </div>
              <div className="font-body text-white/50 text-sm mb-4">
                Мелованная бумага 130г · Тираж 500 шт.
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-body text-xs text-white/40 mb-0.5">Стоимость</div>
                  <div className="font-display text-2xl font-bold gradient-text">24 500 ₽</div>
                </div>
                <div className="bg-green-500/20 border border-green-500/30 text-green-400 font-body text-xs px-3 py-1.5 rounded-full">
                  Готов через 5 дней
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 gradient-brand rounded-2xl p-3 shadow-lg animate-float z-20">
              <Icon name="Award" size={28} className="text-white" />
            </div>
            <div
              className="absolute -bottom-4 -left-4 card-glass rounded-2xl px-4 py-3 shadow-lg animate-float z-20"
              style={{ animationDelay: "1.5s" }}
            >
              <div className="font-body text-xs text-white/60 mb-0.5">Новый заказ</div>
              <div className="font-body text-sm font-semibold text-white">
                Журнал B5 · 1000 шт.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="font-body text-xs text-white/30">Прокрутите вниз</span>
        <Icon name="ChevronDown" size={20} className="text-white/30" />
      </div>
    </section>
  );
}

// ─── SERVICES ────────────────────────────────────────────────────────────────
function Services() {
  const services = [
    {
      icon: "BookOpen",
      title: "Каталоги",
      desc: "Профессиональные каталоги продукции и услуг. Полноцветная печать, твёрдая и мягкая обложка, любой формат.",
      features: ["А4, А5, А3", "До 500 страниц", "Полноцветная"],
      color: "from-orange-500 to-red-500",
    },
    {
      icon: "FileText",
      title: "Журналы",
      desc: "Корпоративные и рекламные журналы. Брошюровка скобой или на клею, мелованная и офсетная бумага.",
      features: ["А4, B5, А5", "Скоба или КБС", "Мелованная"],
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: "Layers",
      title: "Брошюры",
      desc: "Информационные и рекламные брошюры. Фальцовка, биговка, любое количество полос от 4 до 80.",
      features: ["Любой формат", "Евростандарт", "Фальцовка"],
      color: "from-red-500 to-pink-500",
    },
    {
      icon: "Package",
      title: "Буклеты",
      desc: "Фирменные буклеты и листовки для промо-акций, выставок и продаж. Быстрый срок изготовления.",
      features: ["А4, А5, А6", "Лак, ламинация", "Срочная"],
      color: "from-orange-400 to-amber-400",
    },
    {
      icon: "BookMarked",
      title: "Блокноты",
      desc: "Корпоративные блокноты и записные книжки с вашим логотипом. Отличный корпоративный подарок.",
      features: ["А5, А6", "Твёрдая обложка", "Логотип"],
      color: "from-rose-500 to-orange-500",
    },
    {
      icon: "Newspaper",
      title: "Газеты",
      desc: "Корпоративные и рекламные газеты на офсетной бумаге. Большие тиражи по выгодным ценам.",
      features: ["А2, А3", "Офсетная печать", "Большие тиражи"],
      color: "from-amber-400 to-yellow-500",
    },
  ];

  return (
    <section id="services" className="py-24 bg-brand-dark relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-brand-orange/10 border border-brand-orange/30 rounded-full px-4 py-1.5 mb-4">
            <Icon name="Layers" size={14} className="text-brand-orange" />
            <span className="font-body text-sm text-brand-orange font-medium">Что мы печатаем</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            ВИДЫ <span className="gradient-text">ПОЛИГРАФИИ</span>
          </h2>
          <p className="font-body text-white/50 max-w-xl mx-auto">
            Полный спектр печатной продукции для вашего бизнеса
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <div key={s.title} className="card-dark rounded-2xl p-6 hover-lift group cursor-pointer">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
              >
                <Icon name={s.icon as LucideIconName} size={22} className="text-white" />
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-3">{s.title}</h3>
              <p className="font-body text-white/50 text-sm leading-relaxed mb-5">{s.desc}</p>
              <div className="flex flex-wrap gap-2">
                {s.features.map((f) => (
                  <span
                    key={f}
                    className="font-body text-xs bg-brand-orange/10 border border-brand-orange/20 text-brand-orange px-2.5 py-1 rounded-md"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── PORTFOLIO ───────────────────────────────────────────────────────────────
function Portfolio() {
  const projects = [
    { title: "Каталог Rossmann", category: "Каталог", pages: "96 стр · А4", qty: "5 000 шт.", color: "from-orange-600 to-red-700", icon: "BookOpen" },
    { title: "Корп. журнал TechGroup", category: "Журнал", pages: "48 стр · B5", qty: "2 000 шт.", color: "from-amber-500 to-orange-600", icon: "FileText" },
    { title: "Брошюра Skolkovo", category: "Брошюра", pages: "24 стр · А4", qty: "10 000 шт.", color: "from-red-600 to-rose-700", icon: "Layers" },
    { title: "Каталог Leroy Merlin", category: "Каталог", pages: "128 стр · А4", qty: "20 000 шт.", color: "from-orange-500 to-amber-600", icon: "BookOpen" },
    { title: "Блокноты СберБанк", category: "Блокноты", pages: "80 стр · А5", qty: "3 000 шт.", color: "from-rose-500 to-orange-600", icon: "BookMarked" },
    { title: "Журнал Fashion House", category: "Журнал", pages: "64 стр · А4", qty: "8 000 шт.", color: "from-amber-400 to-orange-500", icon: "Newspaper" },
  ];

  return (
    <section id="portfolio" className="py-24 bg-[#0A0806] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-brand-orange/10 border border-brand-orange/30 rounded-full px-4 py-1.5 mb-4">
            <Icon name="Image" size={14} className="text-brand-orange" />
            <span className="font-body text-sm text-brand-orange font-medium">Наши работы</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="gradient-text">ПОРТФОЛИО</span>
          </h2>
          <p className="font-body text-white/50 max-w-xl mx-auto">
            Более 4 000 реализованных проектов для крупных брендов и малого бизнеса
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p) => (
            <div key={p.title} className="group relative rounded-2xl overflow-hidden cursor-pointer">
              <div className={`bg-gradient-to-br ${p.color} h-52 flex items-center justify-center relative overflow-hidden`}>
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(255,255,255,0.15) 8px, rgba(255,255,255,0.15) 9px)",
                  }}
                />
                <Icon
                  name={p.icon as LucideIconName}
                  size={56}
                  className="text-white/50 group-hover:text-white/70 group-hover:scale-110 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="gradient-brand rounded-full p-3">
                    <Icon name="Eye" size={20} className="text-white" />
                  </div>
                </div>
              </div>
              <div className="card-dark p-5 rounded-b-2xl border border-brand-border border-t-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-body text-xs bg-brand-orange/15 text-brand-orange px-2.5 py-1 rounded-md">
                    {p.category}
                  </span>
                  <span className="font-body text-xs text-white/40">{p.qty}</span>
                </div>
                <h3 className="font-display text-lg font-bold text-white mb-1">{p.title}</h3>
                <p className="font-body text-sm text-white/40">{p.pages}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button className="border border-brand-border text-white font-body font-semibold px-8 py-3.5 rounded-xl hover:border-brand-orange/50 hover:bg-brand-orange/5 transition-all duration-300">
            Показать все работы
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── CALCULATOR ──────────────────────────────────────────────────────────────
function Calculator() {
  const [format, setFormat] = useState("A4");
  const [pages, setPages] = useState(48);
  const [qty, setQty] = useState(500);
  const [paper, setPaper] = useState("coated130");
  const [deadline, setDeadline] = useState("standard");

  const formats = ["A6", "A5", "A4", "A3", "B5"];
  const papers = [
    { id: "offset80", label: "Офсет 80г", mult: 1.0 },
    { id: "coated130", label: "Мелованная 130г", mult: 1.3 },
    { id: "coated170", label: "Мелованная 170г", mult: 1.5 },
    { id: "premium200", label: "Премиум 200г", mult: 1.9 },
  ];
  const deadlines = [
    { id: "standard", label: "Стандарт 7 дней", mult: 1.0 },
    { id: "fast", label: "Срочно 3 дня", mult: 1.3 },
    { id: "express", label: "Экспресс 1 день", mult: 1.7 },
  ];

  const formatPrices: Record<string, number> = {
    A6: 0.8, A5: 1.0, A4: 1.5, A3: 2.2, B5: 1.2,
  };

  const paperMult = papers.find((p) => p.id === paper)?.mult ?? 1;
  const deadlineMult = deadlines.find((d) => d.id === deadline)?.mult ?? 1;
  const qtyDiscount = qty >= 5000 ? 0.75 : qty >= 1000 ? 0.85 : qty >= 500 ? 0.92 : 1;
  const total =
    Math.round(
      (formatPrices[format] * pages * 0.25 * qty * paperMult * deadlineMult * qtyDiscount) / 100
    ) * 100;
  const perUnit = Math.round(total / qty);
  const discountPct = qty >= 5000 ? 25 : qty >= 1000 ? 15 : qty >= 500 ? 8 : 0;

  const pagesTrack = `linear-gradient(to right, #FF5722 0%, #FF9800 ${((pages - 8) / (320 - 8)) * 100}%, #2A2520 ${((pages - 8) / (320 - 8)) * 100}%, #2A2520 100%)`;
  const qtyTrack = `linear-gradient(to right, #FF5722 0%, #FF9800 ${((qty - 100) / (20000 - 100)) * 100}%, #2A2520 ${((qty - 100) / (20000 - 100)) * 100}%, #2A2520 100%)`;

  return (
    <section id="calculator" className="py-24 bg-brand-dark relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-brand-orange/3 blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-brand-orange/10 border border-brand-orange/30 rounded-full px-4 py-1.5 mb-4">
            <Icon name="Calculator" size={14} className="text-brand-orange" />
            <span className="font-body text-sm text-brand-orange font-medium">Онлайн-калькулятор</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            РАССЧИТАЙТЕ <span className="gradient-text">СТОИМОСТЬ</span>
          </h2>
          <p className="font-body text-white/50">
            Настройте параметры и получите мгновенную оценку стоимости печати
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Controls */}
          <div className="lg:col-span-3 card-dark rounded-2xl p-8 space-y-8">
            {/* Format */}
            <div>
              <label className="font-body text-sm font-semibold text-white/70 block mb-3">
                Формат издания
              </label>
              <div className="flex gap-2 flex-wrap">
                {formats.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className={`font-display text-sm font-bold px-4 py-2 rounded-lg transition-all duration-200 ${
                      format === f
                        ? "gradient-brand text-white shadow-lg shadow-orange-500/30"
                        : "bg-brand-border/40 text-white/60 hover:text-white hover:bg-brand-border"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Pages */}
            <div>
              <div className="flex justify-between mb-3">
                <label className="font-body text-sm font-semibold text-white/70">
                  Количество страниц
                </label>
                <span className="font-display text-lg font-bold gradient-text">{pages}</span>
              </div>
              <input
                type="range"
                min={8}
                max={320}
                step={8}
                value={pages}
                onChange={(e) => setPages(Number(e.target.value))}
                className="w-full"
                style={{ background: pagesTrack }}
              />
              <div className="flex justify-between font-body text-xs text-white/30 mt-1">
                <span>8 стр</span>
                <span>320 стр</span>
              </div>
            </div>

            {/* Qty */}
            <div>
              <div className="flex justify-between mb-3">
                <label className="font-body text-sm font-semibold text-white/70">
                  Тираж, экземпляров
                </label>
                <span className="font-display text-lg font-bold gradient-text">
                  {qty.toLocaleString("ru")}
                </span>
              </div>
              <input
                type="range"
                min={100}
                max={20000}
                step={100}
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="w-full"
                style={{ background: qtyTrack }}
              />
              <div className="flex justify-between font-body text-xs text-white/30 mt-1">
                <span>100 шт</span>
                <span>20 000 шт</span>
              </div>
            </div>

            {/* Paper */}
            <div>
              <label className="font-body text-sm font-semibold text-white/70 block mb-3">
                Тип бумаги
              </label>
              <div className="grid grid-cols-2 gap-2">
                {papers.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPaper(p.id)}
                    className={`font-body text-sm px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      paper === p.id
                        ? "bg-brand-orange/15 border border-brand-orange/50 text-white"
                        : "bg-brand-border/30 border border-transparent text-white/50 hover:text-white hover:border-brand-border"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Deadline */}
            <div>
              <label className="font-body text-sm font-semibold text-white/70 block mb-3">
                Срок изготовления
              </label>
              <div className="flex flex-col gap-2">
                {deadlines.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDeadline(d.id)}
                    className={`font-body text-sm px-4 py-3 rounded-lg text-left flex items-center gap-3 transition-all duration-200 ${
                      deadline === d.id
                        ? "bg-brand-orange/15 border border-brand-orange/50 text-white"
                        : "bg-brand-border/30 border border-transparent text-white/50 hover:text-white hover:border-brand-border"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        d.id === "express"
                          ? "bg-red-400"
                          : d.id === "fast"
                          ? "bg-amber-400"
                          : "bg-green-400"
                      }`}
                    />
                    {d.label}
                    {d.mult > 1 && (
                      <span className="ml-auto text-xs text-white/30">
                        +{Math.round((d.mult - 1) * 100)}%
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Result */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="card-glass rounded-2xl p-6 flex-1 flex flex-col justify-center text-center">
              <div className="font-body text-sm text-white/50 mb-2">Итоговая стоимость</div>
              <div className="font-display text-4xl font-bold gradient-text mb-1">
                {total.toLocaleString("ru")} ₽
              </div>
              <div className="font-body text-xs text-white/30 mb-8">{perUnit} ₽ за экземпляр</div>

              <div className="space-y-3 text-left mb-8">
                {[
                  ["Формат", format],
                  ["Страниц", `${pages} стр.`],
                  ["Тираж", `${qty.toLocaleString("ru")} шт.`],
                  ["Бумага", papers.find((p) => p.id === paper)?.label ?? ""],
                  [
                    "Срок",
                    deadlines.find((d) => d.id === deadline)?.label ?? "",
                  ],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-2 border-b border-brand-border">
                    <span className="font-body text-xs text-white/40">{k}</span>
                    <span className="font-body text-xs text-white font-semibold">{v}</span>
                  </div>
                ))}
              </div>

              {discountPct > 0 && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 mb-6 text-center">
                  <div className="font-body text-xs text-green-400">
                    🎉 Скидка за тираж {discountPct}% применена
                  </div>
                </div>
              )}

              <a
                href="#contacts"
                className="gradient-brand text-white font-body font-bold py-4 px-6 rounded-xl hover:opacity-90 hover:shadow-lg hover:shadow-orange-500/40 transition-all duration-300 text-center block"
              >
                Заказать сейчас
              </a>
              <button className="mt-3 font-body text-sm text-white/40 hover:text-white/70 transition-colors">
                Запросить точный расчёт
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── REVIEWS ─────────────────────────────────────────────────────────────────
function Reviews() {
  const reviews = [
    {
      name: "Алексей Воронов",
      company: "Директор маркетинга, TechGroup",
      text: "Работаем с ПринтМастером уже 4 года. Качество каталогов всегда на высоте, сроки никогда не срываются. Особенно ценим оперативность при срочных заказах.",
      stars: 5,
      avatar: "АВ",
    },
    {
      name: "Мария Соколова",
      company: "Бренд-менеджер, Fashion House",
      text: "Заказывали журналы для корпоративного мероприятия. Результат превзошёл ожидания — глянцевая печать выглядит роскошно, клиенты в восторге!",
      stars: 5,
      avatar: "МС",
    },
    {
      name: "Дмитрий Кузнецов",
      company: "Владелец, СтройПлюс",
      text: "Печатаем рекламные брошюры каждый квартал. Качество стабильное, цены честные. Менеджеры всегда на связи и помогают с макетом.",
      stars: 5,
      avatar: "ДК",
    },
    {
      name: "Ольга Петрова",
      company: "Ивент-менеджер, EventPro",
      text: "Экспресс-тираж буклетов заказали за сутки до выставки. Всё успели — качество отличное, никаких замечаний. Рекомендую!",
      stars: 5,
      avatar: "ОП",
    },
    {
      name: "Иван Смирнов",
      company: "CEO, Digital Agency",
      text: "Долго искали типографию с хорошим соотношением цена/качество. ПринтМастер — оптимальный вариант для нашего бизнеса. Работаем больше 2 лет.",
      stars: 5,
      avatar: "ИС",
    },
    {
      name: "Наталья Иванова",
      company: "PR-директор, MedTech",
      text: "Печать каталогов для международной выставки. Высококачественная мелованная бумага, яркие цвета, прекрасная брошюровка. Спасибо команде!",
      stars: 5,
      avatar: "НИ",
    },
  ];

  return (
    <section id="reviews" className="py-24 bg-[#0A0806] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-amber/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-brand-orange/10 border border-brand-orange/30 rounded-full px-4 py-1.5 mb-4">
            <Icon name="Star" size={14} className="text-brand-orange" />
            <span className="font-body text-sm text-brand-orange font-medium">Отзывы клиентов</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            НАС <span className="gradient-text">РЕКОМЕНДУЮТ</span>
          </h2>
          <p className="font-body text-white/50">Более 1 200 довольных клиентов по всей России</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((r) => (
            <div key={r.name} className="card-dark rounded-2xl p-6 hover-lift">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: r.stars }).map((_, j) => (
                  <Icon key={j} name="Star" size={14} className="text-brand-amber" />
                ))}
              </div>
              <p className="font-body text-sm text-white/70 leading-relaxed mb-6">"{r.text}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-brand-border">
                <div className="w-10 h-10 rounded-full gradient-brand flex items-center justify-center flex-shrink-0">
                  <span className="font-display text-xs font-bold text-white">{r.avatar}</span>
                </div>
                <div>
                  <div className="font-body text-sm font-semibold text-white">{r.name}</div>
                  <div className="font-body text-xs text-white/40">{r.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CONTACTS ────────────────────────────────────────────────────────────────
function Contacts() {
  const [form, setForm] = useState({ name: "", phone: "", comment: "" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <section id="contacts" className="py-24 bg-brand-dark relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-orange/8 rounded-full blur-3xl" />
        <div className="absolute top-0 left-0 w-64 h-64 bg-brand-amber/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-brand-orange/10 border border-brand-orange/30 rounded-full px-4 py-1.5 mb-4">
            <Icon name="Phone" size={14} className="text-brand-orange" />
            <span className="font-body text-sm text-brand-orange font-medium">Свяжитесь с нами</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            ОСТАВЬТЕ <span className="gradient-text">ЗАЯВКУ</span>
          </h2>
          <p className="font-body text-white/50">
            Ответим в течение 30 минут и подготовим точное коммерческое предложение
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          <div className="card-dark rounded-2xl p-8">
            <h3 className="font-display text-2xl font-bold text-white mb-6">Форма заявки</h3>
            <div className="space-y-4">
              <div>
                <label className="font-body text-sm text-white/60 mb-2 block">Ваше имя</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Иван Иванов"
                  className="w-full bg-brand-border/40 border border-brand-border rounded-xl px-4 py-3 font-body text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-orange/60 transition-colors"
                />
              </div>
              <div>
                <label className="font-body text-sm text-white/60 mb-2 block">Телефон</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+7 (999) 000-00-00"
                  className="w-full bg-brand-border/40 border border-brand-border rounded-xl px-4 py-3 font-body text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-orange/60 transition-colors"
                />
              </div>
              <div>
                <label className="font-body text-sm text-white/60 mb-2 block">Комментарий к заказу</label>
                <textarea
                  name="comment"
                  value={form.comment}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Опишите задачу: тип изделия, формат, тираж..."
                  className="w-full bg-brand-border/40 border border-brand-border rounded-xl px-4 py-3 font-body text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-orange/60 transition-colors resize-none"
                />
              </div>
              <button className="w-full gradient-brand text-white font-body font-bold py-4 rounded-xl hover:opacity-90 hover:shadow-lg hover:shadow-orange-500/40 transition-all duration-300">
                Отправить заявку
              </button>
              <p className="font-body text-xs text-white/30 text-center">
                Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            {[
              {
                icon: "Phone",
                title: "Телефон",
                lines: ["+7 (495) 123-45-67", "+7 (800) 000-00-00 (бесплатно)"],
              },
              {
                icon: "Mail",
                title: "Email",
                lines: ["info@printmaster.ru", "zakaz@printmaster.ru"],
              },
              {
                icon: "MapPin",
                title: "Адрес",
                lines: [
                  "г. Москва, ул. Полиграфическая, д. 15",
                  "м. Профсоюзная, 5 минут пешком",
                ],
              },
              {
                icon: "Clock",
                title: "Режим работы",
                lines: ["Пн–Пт: 9:00 – 19:00", "Сб: 10:00 – 16:00"],
              },
            ].map((info) => (
              <div key={info.title} className="card-dark rounded-2xl p-5 flex items-start gap-4 hover-lift">
                <div className="w-11 h-11 gradient-brand rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon name={info.icon as LucideIconName} size={20} className="text-white" />
                </div>
                <div>
                  <div className="font-display text-base font-bold text-white mb-1.5">
                    {info.title}
                  </div>
                  {info.lines.map((l) => (
                    <div key={l} className="font-body text-sm text-white/60">
                      {l}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-[#080604] border-t border-brand-border py-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 gradient-brand rounded-lg flex items-center justify-center">
            <Icon name="Printer" size={16} className="text-white" />
          </div>
          <span className="font-display text-lg font-bold text-white">
            ПРИНТ<span className="gradient-text">МАСТЕР</span>
          </span>
        </div>
        <p className="font-body text-xs text-white/30 text-center">
          © 2024 ПринтМастер. Профессиональная полиграфия в Москве
        </p>
        <div className="flex gap-5">
          {["Услуги", "Портфолио", "Контакты"].map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="font-body text-xs text-white/40 hover:text-white transition-colors"
            >
              {l}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function Index() {
  return (
    <div className="min-h-screen bg-brand-dark">
      <Nav />
      <Hero />
      <Services />
      <Portfolio />
      <Calculator />
      <Reviews />
      <Contacts />
      <Footer />
    </div>
  );
}