import { useState, useEffect, useRef, useCallback } from "react";
import Icon from "@/components/ui/icon";

type LucideIconName = string;

// ─── smooth scroll helper ─────────────────────────────────────────────────────
function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

// ─── useParallax hook ─────────────────────────────────────────────────────────
function useParallax(speed = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  const onScroll = useCallback(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerY = rect.top + rect.height / 2 - window.innerHeight / 2;
    setOffset(centerY * speed);
  }, [speed]);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  return { ref, offset };
}

// ─── useScrollReveal hook ─────────────────────────────────────────────────────
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, visible };
}

// ─── ORDER MODAL (Заказать печать) ───────────────────────────────────────────
function OrderModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", comment: "", file: null as File | null });
  const [sent, setSent] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, file: e.target.files?.[0] ?? null });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  useEffect(() => {
    if (open) { setSent(false); setForm({ name: "", phone: "", email: "", comment: "", file: null }); }
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative z-10 card-dark rounded-2xl w-full max-w-lg p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors">
          <Icon name="X" size={20} />
        </button>

        {!sent ? (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 gradient-brand rounded-xl flex items-center justify-center">
                <Icon name="Printer" size={18} className="text-white" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-white">Заказать печать</h3>
                <p className="font-body text-xs text-white/50">Ответим за 30 минут с КП</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-body text-xs text-white/50 mb-1 block">Ваше имя *</label>
                  <input name="name" required value={form.name} onChange={handleChange}
                    placeholder="Иван Иванов"
                    className="w-full bg-brand-border/40 border border-brand-border rounded-xl px-3 py-2.5 font-body text-sm text-white placeholder-white/25 focus:outline-none focus:border-brand-orange/60 transition-colors" />
                </div>
                <div>
                  <label className="font-body text-xs text-white/50 mb-1 block">Телефон *</label>
                  <input name="phone" required value={form.phone} onChange={handleChange}
                    placeholder="+7 (999) 000-00-00"
                    className="w-full bg-brand-border/40 border border-brand-border rounded-xl px-3 py-2.5 font-body text-sm text-white placeholder-white/25 focus:outline-none focus:border-brand-orange/60 transition-colors" />
                </div>
              </div>
              <div>
                <label className="font-body text-xs text-white/50 mb-1 block">Email</label>
                <input name="email" value={form.email} onChange={handleChange}
                  placeholder="email@company.ru"
                  className="w-full bg-brand-border/40 border border-brand-border rounded-xl px-3 py-2.5 font-body text-sm text-white placeholder-white/25 focus:outline-none focus:border-brand-orange/60 transition-colors" />
              </div>
              <div>
                <label className="font-body text-xs text-white/50 mb-1 block">Опишите задачу</label>
                <textarea name="comment" value={form.comment} onChange={handleChange} rows={3}
                  placeholder="Вид продукции, тираж, формат, сроки..."
                  className="w-full bg-brand-border/40 border border-brand-border rounded-xl px-3 py-2.5 font-body text-sm text-white placeholder-white/25 focus:outline-none focus:border-brand-orange/60 transition-colors resize-none" />
              </div>

              {/* File attach */}
              <div>
                <label className="font-body text-xs text-white/50 mb-1 block">Приложите макет или ТЗ (необязательно)</label>
                <div
                  className="border border-dashed border-brand-border rounded-xl px-4 py-3 flex items-center gap-3 cursor-pointer hover:border-brand-orange/50 transition-colors"
                  onClick={() => fileRef.current?.click()}
                >
                  <Icon name="Paperclip" size={16} className="text-brand-orange" />
                  <span className="font-body text-sm text-white/40">
                    {form.file ? form.file.name : "PDF, AI, PSD, PNG — до 50 МБ"}
                  </span>
                  <input ref={fileRef} type="file" className="hidden" onChange={handleFile}
                    accept=".pdf,.ai,.psd,.png,.jpg,.zip" />
                </div>
              </div>

              <button type="submit"
                className="w-full gradient-brand text-white font-body font-bold py-3.5 rounded-xl hover:opacity-90 hover:shadow-lg hover:shadow-orange-500/40 transition-all duration-300">
                Отправить заявку
              </button>
              <p className="font-body text-xs text-white/25 text-center">
                Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
              </p>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 gradient-brand rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="CheckCircle" size={32} className="text-white" />
            </div>
            <h3 className="font-display text-2xl font-bold text-white mb-2">Заявка принята!</h3>
            <p className="font-body text-white/50 mb-6">Менеджер свяжется с вами в течение 30 минут</p>
            <button onClick={onClose} className="gradient-brand text-white font-body font-semibold px-6 py-3 rounded-xl">
              Закрыть
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── QUIZ MODAL ──────────────────────────────────────────────────────────────
function QuizModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ type: "", format: "", qty: "", deadline: "", name: "", phone: "" });
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (open) { setStep(0); setDone(false); setAnswers({ type: "", format: "", qty: "", deadline: "", name: "", phone: "" }); }
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const steps = [
    {
      title: "Что нужно напечатать?",
      subtitle: "Выберите вид продукции",
      field: "type" as const,
      options: [
        { label: "Каталог", icon: "BookOpen" },
        { label: "Журнал", icon: "FileText" },
        { label: "Брошюра", icon: "Layers" },
        { label: "Буклет / Листовка", icon: "File" },
      ],
    },
    {
      title: "Формат и объём",
      subtitle: "Выберите формат издания",
      field: "format" as const,
      options: [
        { label: "А6 (карманный)", icon: "Smartphone" },
        { label: "А5 (половина А4)", icon: "Tablet" },
        { label: "А4 (стандарт)", icon: "Monitor" },
        { label: "А3 (большой)", icon: "Layout" },
      ],
    },
    {
      title: "Тираж",
      subtitle: "Сколько экземпляров нужно?",
      field: "qty" as const,
      options: [
        { label: "До 500 шт.", icon: "Package" },
        { label: "500 — 2 000 шт.", icon: "Boxes" },
        { label: "2 000 — 10 000 шт.", icon: "Warehouse" },
        { label: "Более 10 000 шт.", icon: "Building2" },
      ],
    },
    {
      title: "Когда нужно?",
      subtitle: "Укажите желаемый срок",
      field: "deadline" as const,
      options: [
        { label: "Срочно — 1-2 дня", icon: "Zap" },
        { label: "3-5 дней", icon: "Clock3" },
        { label: "1-2 недели", icon: "CalendarDays" },
        { label: "Без ограничений", icon: "Infinity" },
      ],
    },
  ];

  const isContactStep = step === steps.length;
  const progress = isContactStep ? 100 : Math.round((step / steps.length) * 100);

  const handleOption = (val: string) => {
    const field = steps[step].field;
    setAnswers({ ...answers, [field]: val });
    setTimeout(() => setStep(step + 1), 250);
  };

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault();
    setDone(true);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
      <div
        className="relative z-10 card-dark rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress bar */}
        <div className="h-1 bg-brand-border">
          <div
            className="h-full gradient-brand transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-8">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors">
            <Icon name="X" size={20} />
          </button>

          {!done ? (
            <>
              {/* Step indicator */}
              <div className="flex items-center gap-2 mb-6">
                {steps.map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full flex-1 transition-all duration-300 ${i <= step ? "gradient-brand" : "bg-brand-border"}`} />
                ))}
              </div>

              {!isContactStep ? (
                <>
                  <div className="mb-6">
                    <p className="font-body text-xs text-brand-orange font-medium mb-1">
                      Шаг {step + 1} из {steps.length}
                    </p>
                    <h3 className="font-display text-2xl font-bold text-white mb-1">{steps[step].title}</h3>
                    <p className="font-body text-sm text-white/50">{steps[step].subtitle}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {steps[step].options.map((opt) => (
                      <button
                        key={opt.label}
                        onClick={() => handleOption(opt.label)}
                        className={`flex items-center gap-3 px-4 py-4 rounded-xl border text-left transition-all duration-200 hover:border-brand-orange/60 hover:bg-brand-orange/10 ${
                          (answers as Record<string, string>)[steps[step].field] === opt.label
                            ? "border-brand-orange bg-brand-orange/15 text-white"
                            : "border-brand-border text-white/60"
                        }`}
                      >
                        <Icon name={opt.icon as LucideIconName} size={18} className="text-brand-orange flex-shrink-0" />
                        <span className="font-body text-sm">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                  {step > 0 && (
                    <button onClick={() => setStep(step - 1)} className="mt-4 font-body text-sm text-white/30 hover:text-white/60 transition-colors flex items-center gap-1">
                      <Icon name="ChevronLeft" size={14} /> Назад
                    </button>
                  )}
                </>
              ) : (
                <>
                  <div className="mb-6">
                    <div className="w-12 h-12 gradient-brand rounded-xl flex items-center justify-center mb-4">
                      <Icon name="SendHorizontal" size={20} className="text-white" />
                    </div>
                    <h3 className="font-display text-2xl font-bold text-white mb-1">Готово! Последний шаг</h3>
                    <p className="font-body text-sm text-white/50">Оставьте контакты — пришлём КП с точными ценами</p>
                  </div>

                  {/* Summary */}
                  <div className="bg-brand-orange/5 border border-brand-orange/20 rounded-xl p-4 mb-6">
                    <p className="font-body text-xs text-brand-orange font-medium mb-2">Ваш запрос:</p>
                    {(Object.entries(answers) as [string, string][]).filter(([k, v]) => v && !["name", "phone"].includes(k)).map(([k, v]) => (
                      <div key={k} className="font-body text-xs text-white/60 flex gap-2">
                        <span className="text-white/30">·</span>{v}
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleContact} className="space-y-3">
                    <div>
                      <input name="name" required value={answers.name}
                        onChange={(e) => setAnswers({ ...answers, name: e.target.value })}
                        placeholder="Ваше имя"
                        className="w-full bg-brand-border/40 border border-brand-border rounded-xl px-4 py-3 font-body text-sm text-white placeholder-white/25 focus:outline-none focus:border-brand-orange/60 transition-colors" />
                    </div>
                    <div>
                      <input name="phone" required value={answers.phone}
                        onChange={(e) => setAnswers({ ...answers, phone: e.target.value })}
                        placeholder="+7 (999) 000-00-00"
                        className="w-full bg-brand-border/40 border border-brand-border rounded-xl px-4 py-3 font-body text-sm text-white placeholder-white/25 focus:outline-none focus:border-brand-orange/60 transition-colors" />
                    </div>
                    <button type="submit"
                      className="w-full gradient-brand text-white font-body font-bold py-3.5 rounded-xl hover:opacity-90 hover:shadow-lg hover:shadow-orange-500/40 transition-all duration-300">
                      Получить коммерческое предложение
                    </button>
                  </form>
                  <button onClick={() => setStep(step - 1)} className="mt-3 font-body text-sm text-white/30 hover:text-white/60 transition-colors flex items-center gap-1">
                    <Icon name="ChevronLeft" size={14} /> Назад
                  </button>
                </>
              )}
            </>
          ) : (
            /* Thank you page */
            <div className="text-center py-6">
              <div className="relative mx-auto w-24 h-24 mb-6">
                <div className="absolute inset-0 gradient-brand rounded-full opacity-20 animate-ping" />
                <div className="relative w-24 h-24 gradient-brand rounded-full flex items-center justify-center">
                  <Icon name="CheckCheck" size={40} className="text-white" />
                </div>
              </div>
              <h3 className="font-display text-3xl font-bold text-white mb-3">Заявка отправлена!</h3>
              <p className="font-body text-white/50 mb-2">Наш менеджер свяжется с вами <span className="text-white/80 font-semibold">в течение 30 минут</span></p>
              <p className="font-body text-sm text-white/40 mb-8">Пока ждёте — посмотрите наши примеры работ</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => { onClose(); setTimeout(() => scrollTo("portfolio"), 100); }}
                  className="gradient-brand text-white font-body font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-all"
                >
                  Смотреть портфолио
                </button>
                <button onClick={onClose} className="border border-brand-border text-white/60 font-body text-sm px-6 py-3 rounded-xl hover:text-white hover:border-brand-orange/40 transition-all">
                  Закрыть
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── PORTFOLIO GALLERY MODAL ─────────────────────────────────────────────────
const PORTFOLIO_IMAGES = [
  "https://cdn.poehali.dev/projects/da385d66-65ef-4fb8-ad72-1f323f1031fe/files/f68860e6-a6b2-4771-99fa-69c7dce9abeb.jpg",
  "https://cdn.poehali.dev/projects/da385d66-65ef-4fb8-ad72-1f323f1031fe/files/c55c724a-74ce-4e04-8533-b64dec268361.jpg",
  "https://cdn.poehali.dev/projects/da385d66-65ef-4fb8-ad72-1f323f1031fe/files/64f3262a-520d-4cab-aef9-6ed384fb3754.jpg",
  "https://cdn.poehali.dev/projects/da385d66-65ef-4fb8-ad72-1f323f1031fe/files/c99943b6-8dc2-4912-922e-3611a4017aa7.jpg",
];

function GalleryModal({ open, onClose, project }: { open: boolean; onClose: () => void; project: { title: string; category: string } | null }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (open) { setIdx(0); document.body.style.overflow = "hidden"; }
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open || !project) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-3xl card-dark rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border">
          <div>
            <h3 className="font-display text-lg font-bold text-white">{project.title}</h3>
            <span className="font-body text-xs text-brand-orange">{project.category}</span>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Main image */}
        <div className="relative aspect-video bg-brand-card">
          <img src={PORTFOLIO_IMAGES[idx]} alt={project.title} className="w-full h-full object-cover" />
          <button
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 hover:bg-brand-orange/80 rounded-full flex items-center justify-center transition-colors"
            onClick={() => setIdx((idx - 1 + PORTFOLIO_IMAGES.length) % PORTFOLIO_IMAGES.length)}
          >
            <Icon name="ChevronLeft" size={18} className="text-white" />
          </button>
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 hover:bg-brand-orange/80 rounded-full flex items-center justify-center transition-colors"
            onClick={() => setIdx((idx + 1) % PORTFOLIO_IMAGES.length)}
          >
            <Icon name="ChevronRight" size={18} className="text-white" />
          </button>
          <div className="absolute bottom-3 right-3 bg-black/60 text-white/70 font-body text-xs px-2.5 py-1 rounded-full">
            {idx + 1} / {PORTFOLIO_IMAGES.length}
          </div>
        </div>

        {/* Thumbnails */}
        <div className="flex gap-2 p-4">
          {PORTFOLIO_IMAGES.map((img, i) => (
            <button key={i} onClick={() => setIdx(i)}
              className={`flex-1 aspect-video rounded-lg overflow-hidden border-2 transition-all ${i === idx ? "border-brand-orange" : "border-transparent opacity-60 hover:opacity-100"}`}>
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── NAV ─────────────────────────────────────────────────────────────────────
function Nav({ onOrder }: { onOrder: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Услуги", id: "services" },
    { label: "Портфолио", id: "portfolio" },
    { label: "Калькулятор", id: "calculator" },
    { label: "Отзывы", id: "reviews" },
    { label: "Контакты", id: "contacts" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-brand-dark/95 backdrop-blur-md border-b border-brand-border shadow-lg" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between py-4">
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-9 h-9 gradient-brand rounded-lg flex items-center justify-center rotate-6 group-hover:rotate-0 transition-transform duration-300">
            <Icon name="Printer" size={18} className="text-white" />
          </div>
          <span className="font-display text-xl font-bold tracking-wider text-white">ПРИНТ<span className="gradient-text">МАСТЕР</span></span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <button key={l.id} onClick={() => scrollTo(l.id)}
              className="font-body text-sm text-white/70 hover:text-white transition-colors relative group">
              {l.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 gradient-brand group-hover:w-full transition-all duration-300" />
            </button>
          ))}
        </div>

        <button onClick={onOrder}
          className="hidden md:flex gradient-brand text-white font-body font-semibold text-sm px-5 py-2.5 rounded-lg hover:opacity-90 hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300">
          Заказать печать
        </button>

        <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
          <Icon name={menuOpen ? "X" : "Menu"} size={24} />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-brand-dark/98 border-t border-brand-border px-6 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <button key={l.id} onClick={() => { scrollTo(l.id); setMenuOpen(false); }}
              className="font-body text-white/80 hover:text-white py-2 border-b border-brand-border text-left">
              {l.label}
            </button>
          ))}
          <button onClick={() => { onOrder(); setMenuOpen(false); }}
            className="gradient-brand text-white font-body font-semibold text-center py-3 rounded-lg mt-2">
            Заказать печать
          </button>
        </div>
      )}
    </nav>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero({ onQuiz }: { onQuiz: () => void }) {
  const galleryItems = [
    { img: PORTFOLIO_IMAGES[0], label: "Каталог А4 · 96 стр." },
    { img: PORTFOLIO_IMAGES[1], label: "Корп. журнал · 48 стр." },
    { img: PORTFOLIO_IMAGES[2], label: "Брошюры · Евростандарт" },
    { img: PORTFOLIO_IMAGES[3], label: "Блокноты · Премиум" },
  ];
  const [activeGallery, setActiveGallery] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActiveGallery((i) => (i + 1) % galleryItems.length), 3000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-brand-dark">
      {/* Parallax background layers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Grid — moves slowest */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "linear-gradient(rgba(255,87,34,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,87,34,0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            transform: `translateY(${scrollY * 0.15}px)`,
          }}
        />
        {/* Blob 1 — slow */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-brand-orange/25 blur-3xl animate-float"
          style={{ transform: `translateY(${scrollY * 0.25}px)` }} />
        {/* Blob 2 — medium */}
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-brand-amber/20 blur-3xl animate-float"
          style={{ animationDelay: "2s", transform: `translateY(${scrollY * 0.35}px)` }} />
        {/* Blob 3 — faster */}
        <div className="absolute top-3/4 left-1/3 w-64 h-64 rounded-full bg-brand-orange/10 blur-3xl"
          style={{ transform: `translateY(${scrollY * 0.45}px)` }} />
        {/* Decorative ring */}
        <div className="absolute -right-24 top-1/2 w-[500px] h-[500px] rounded-full border border-brand-orange/8"
          style={{ transform: `translateY(${scrollY * 0.2}px) rotate(${scrollY * 0.02}deg)` }} />
        <div className="absolute -right-12 top-1/2 w-[350px] h-[350px] rounded-full border border-brand-orange/5"
          style={{ transform: `translateY(${scrollY * 0.3}px) rotate(${-scrollY * 0.015}deg)` }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16 grid lg:grid-cols-2 gap-16 items-center">
        {/* Text — slight upward drift */}
        <div className="animate-fade-up" style={{ transform: `translateY(${scrollY * 0.08}px)` }}>
          <div className="inline-flex items-center gap-2 bg-brand-orange/10 border border-brand-orange/30 rounded-full px-4 py-1.5 mb-6">
            <div className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
            <span className="font-body text-sm text-brand-orange font-medium">Москва · Печать от 1 дня</span>
          </div>

          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white mb-4">
            ПЕЧАТАЕМ<br /><span className="gradient-text">ВАШУ ИДЕЮ</span><br />В ЖИЗНЬ
          </h1>

          {/* New subheadline */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
              <Icon name="Package" size={16} className="text-brand-amber" />
              <span className="font-body text-sm text-white/80">от <span className="font-bold text-white">500 шт.</span> в Москве</span>
            </div>
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/25 rounded-xl px-4 py-2.5">
              <Icon name="BadgePercent" size={16} className="text-green-400" />
              <span className="font-body text-sm text-white/80">Скидка <span className="font-bold text-green-400">10%</span> для новых заказчиков</span>
            </div>
          </div>

          <p className="font-body text-base text-white/55 leading-relaxed mb-8 max-w-md">
            Каталоги, журналы, брошюры — профессиональная полиграфия для бизнеса. Быстро, качественно, с гарантией.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={onQuiz}
              className="gradient-brand text-white font-body font-bold text-base px-8 py-4 rounded-xl hover:opacity-90 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300 text-center">
              Рассчитать стоимость
            </button>
            <button onClick={() => scrollTo("portfolio")}
              className="border border-brand-border text-white font-body font-semibold text-base px-8 py-4 rounded-xl hover:border-brand-orange/50 hover:bg-brand-orange/5 transition-all duration-300 text-center">
              Смотреть работы
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-12 pt-10 border-t border-brand-border">
            {[{ num: "15+", label: "лет на рынке" }, { num: "4 000+", label: "проектов сдано" }, { num: "98%", label: "клиентов довольны" }].map((s) => (
              <div key={s.num}>
                <div className="font-display text-2xl font-bold gradient-text mb-1">{s.num}</div>
                <div className="font-body text-xs text-white/50">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Gallery — moves slightly opposite to text */}
        <div className="hidden lg:block" style={{ transform: `translateY(${-scrollY * 0.05}px)` }}>
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={galleryItems[activeGallery].img}
                alt={galleryItems[activeGallery].label}
                className="w-full h-72 object-cover transition-all duration-700"
                style={{ transform: `scale(1.08) translateY(${scrollY * 0.04}px)` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="font-body text-xs bg-brand-orange/90 text-white px-3 py-1 rounded-full">
                  {galleryItems[activeGallery].label}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 mt-2">
              {galleryItems.map((item, i) => (
                <button key={i} onClick={() => setActiveGallery(i)}
                  className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all duration-300 ${i === activeGallery ? "border-brand-orange scale-105" : "border-transparent opacity-60 hover:opacity-90"}`}>
                  <img src={item.img} alt={item.label} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <div className="absolute -top-3 -right-3 gradient-brand rounded-2xl p-3 shadow-lg animate-float z-10"
              style={{ transform: `translateY(${-scrollY * 0.12}px)` }}>
              <Icon name="Award" size={26} className="text-white" />
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

// ─── RevealCard wrapper ───────────────────────────────────────────────────────
function RevealCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div ref={ref}
      className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
      style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

// ─── SERVICES ────────────────────────────────────────────────────────────────
function Services() {
  const { ref: bgRef, offset: bgOffset } = useParallax(0.2);
  const { ref: titleRef, visible: titleVisible } = useScrollReveal();

  const services = [
    { icon: "BookOpen", title: "Каталоги", desc: "Профессиональные каталоги продукции. Полноцветная печать, любой формат.", features: ["А4, А5, А3", "До 500 страниц", "Полноцветная"], color: "from-orange-500 to-red-500" },
    { icon: "FileText", title: "Журналы", desc: "Корпоративные и рекламные журналы. Скоба или клей, любая бумага.", features: ["А4, B5, А5", "Скоба или КБС", "Мелованная"], color: "from-amber-500 to-orange-500" },
    { icon: "Layers", title: "Брошюры", desc: "Рекламные брошюры. Фальцовка, биговка, от 4 до 80 полос.", features: ["Любой формат", "Евростандарт", "Фальцовка"], color: "from-red-500 to-pink-500" },
    { icon: "Package", title: "Буклеты", desc: "Буклеты и листовки для промо и продаж. Срочная печать.", features: ["А4, А5, А6", "Лак, ламинация", "Срочная"], color: "from-orange-400 to-amber-400" },
    { icon: "BookMarked", title: "Блокноты", desc: "Корпоративные блокноты с логотипом. Отличный подарок.", features: ["А5, А6", "Твёрдая обложка", "Логотип"], color: "from-rose-500 to-orange-500" },
    { icon: "Newspaper", title: "Газеты", desc: "Корпоративные газеты на офсетной бумаге. Большие тиражи.", features: ["А2, А3", "Офсетная печать", "Большие тиражи"], color: "from-amber-400 to-yellow-500" },
  ];

  return (
    <section id="services" ref={bgRef} className="py-24 bg-brand-dark relative overflow-hidden">
      {/* Parallax blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/6 rounded-full blur-3xl pointer-events-none"
        style={{ transform: `translateY(${bgOffset * 0.6}px)` }} />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-amber/5 rounded-full blur-3xl pointer-events-none"
        style={{ transform: `translateY(${bgOffset * 0.9}px)` }} />
      {/* Parallax decorative text */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 font-display text-[180px] font-bold text-white/[0.015] pointer-events-none select-none leading-none"
        style={{ transform: `translateY(calc(-50% + ${bgOffset * 0.4}px))` }}>
        PRINT
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div ref={titleRef} className={`text-center mb-16 transition-all duration-700 ${titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="inline-flex items-center gap-2 bg-brand-orange/10 border border-brand-orange/30 rounded-full px-4 py-1.5 mb-4">
            <Icon name="Layers" size={14} className="text-brand-orange" />
            <span className="font-body text-sm text-brand-orange font-medium">Что мы печатаем</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">ВИДЫ <span className="gradient-text">ПОЛИГРАФИИ</span></h2>
          <p className="font-body text-white/50 max-w-xl mx-auto">Полный спектр печатной продукции для вашего бизнеса</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <RevealCard key={s.title} delay={i * 80}>
              <div className="card-dark rounded-2xl p-6 hover-lift group cursor-pointer h-full">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon name={s.icon as LucideIconName} size={22} className="text-white" />
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-3">{s.title}</h3>
                <p className="font-body text-white/50 text-sm leading-relaxed mb-5">{s.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {s.features.map((f) => (
                    <span key={f} className="font-body text-xs bg-brand-orange/10 border border-brand-orange/20 text-brand-orange px-2.5 py-1 rounded-md">{f}</span>
                  ))}
                </div>
              </div>
            </RevealCard>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── PORTFOLIO ───────────────────────────────────────────────────────────────
function Portfolio({ onShowAll }: { onShowAll: () => void }) {
  const [gallery, setGallery] = useState<{ title: string; category: string } | null>(null);
  const { ref: bgRef, offset: bgOffset } = useParallax(0.18);
  const { ref: titleRef, visible: titleVisible } = useScrollReveal();

  const projects = [
    { title: "Каталог Rossmann", category: "Каталог", pages: "96 стр · А4", qty: "5 000 шт.", img: PORTFOLIO_IMAGES[0] },
    { title: "Корп. журнал TechGroup", category: "Журнал", pages: "48 стр · B5", qty: "2 000 шт.", img: PORTFOLIO_IMAGES[1] },
    { title: "Брошюра Skolkovo", category: "Брошюра", pages: "24 стр · А4", qty: "10 000 шт.", img: PORTFOLIO_IMAGES[2] },
    { title: "Блокноты СберБанк", category: "Блокноты", pages: "80 стр · А5", qty: "3 000 шт.", img: PORTFOLIO_IMAGES[3] },
    { title: "Каталог Leroy Merlin", category: "Каталог", pages: "128 стр · А4", qty: "20 000 шт.", img: PORTFOLIO_IMAGES[0] },
    { title: "Журнал Fashion House", category: "Журнал", pages: "64 стр · А4", qty: "8 000 шт.", img: PORTFOLIO_IMAGES[1] },
  ];

  return (
    <>
      <GalleryModal open={!!gallery} onClose={() => setGallery(null)} project={gallery} />

      <section id="portfolio" ref={bgRef} className="py-24 bg-[#0A0806] relative overflow-hidden">
        {/* Parallax background */}
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-3xl pointer-events-none"
          style={{ transform: `translateY(${bgOffset * 0.7}px)` }} />
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-amber/4 rounded-full blur-3xl pointer-events-none"
          style={{ transform: `translateY(${bgOffset * 0.4}px)` }} />
        <div className="absolute left-0 top-1/2 font-display text-[200px] font-bold text-white/[0.012] pointer-events-none select-none leading-none"
          style={{ transform: `translateY(calc(-50% + ${bgOffset * 0.3}px))` }}>
          WORK
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div ref={titleRef} className={`text-center mb-16 transition-all duration-700 ${titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <div className="inline-flex items-center gap-2 bg-brand-orange/10 border border-brand-orange/30 rounded-full px-4 py-1.5 mb-4">
              <Icon name="Image" size={14} className="text-brand-orange" />
              <span className="font-body text-sm text-brand-orange font-medium">Наши работы</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4"><span className="gradient-text">ПОРТФОЛИО</span></h2>
            <p className="font-body text-white/50 max-w-xl mx-auto">Более 4 000 реализованных проектов для крупных брендов и малого бизнеса</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((p, i) => (
              <RevealCard key={p.title} delay={i * 70}>
                <div className="group relative rounded-2xl overflow-hidden cursor-pointer h-full"
                  onClick={() => setGallery({ title: p.title, category: p.category })}>
                  <div className="relative h-52 overflow-hidden">
                    <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="gradient-brand rounded-full p-3 shadow-lg scale-90 group-hover:scale-100 transition-transform duration-300">
                        <Icon name="Eye" size={20} className="text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="card-dark p-5 rounded-b-2xl border border-brand-border border-t-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-body text-xs bg-brand-orange/15 text-brand-orange px-2.5 py-1 rounded-md">{p.category}</span>
                      <span className="font-body text-xs text-white/40">{p.qty}</span>
                    </div>
                    <h3 className="font-display text-lg font-bold text-white mb-1">{p.title}</h3>
                    <p className="font-body text-sm text-white/40">{p.pages}</p>
                  </div>
                </div>
              </RevealCard>
            ))}
          </div>

          <div className="text-center mt-10">
            <button onClick={onShowAll}
              className="border border-brand-border text-white font-body font-semibold px-8 py-3.5 rounded-xl hover:border-brand-orange/50 hover:bg-brand-orange/5 transition-all duration-300">
              Показать все работы
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

// ─── CALCULATOR ──────────────────────────────────────────────────────────────
function Calculator({ onQuiz }: { onQuiz: () => void }) {
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
  const formatPrices: Record<string, number> = { A6: 0.8, A5: 1.0, A4: 1.5, A3: 2.2, B5: 1.2 };
  const paperMult = papers.find((p) => p.id === paper)?.mult ?? 1;
  const deadlineMult = deadlines.find((d) => d.id === deadline)?.mult ?? 1;
  const qtyDiscount = qty >= 5000 ? 0.75 : qty >= 1000 ? 0.85 : qty >= 500 ? 0.92 : 1;
  const total = Math.round((formatPrices[format] * pages * 0.25 * qty * paperMult * deadlineMult * qtyDiscount) / 100) * 100;
  const perUnit = Math.round(total / qty);
  const discountPct = qty >= 5000 ? 25 : qty >= 1000 ? 15 : qty >= 500 ? 8 : 0;

  const pagesTrack = `linear-gradient(to right, #FF5722 0%, #FF9800 ${((pages - 8) / (320 - 8)) * 100}%, #2A2520 ${((pages - 8) / (320 - 8)) * 100}%, #2A2520 100%)`;
  const qtyTrack = `linear-gradient(to right, #FF5722 0%, #FF9800 ${((qty - 100) / (20000 - 100)) * 100}%, #2A2520 ${((qty - 100) / (20000 - 100)) * 100}%, #2A2520 100%)`;

  return (
    <section id="calculator" className="py-24 bg-brand-dark relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-brand-orange/3 blur-3xl pointer-events-none" />
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-brand-orange/10 border border-brand-orange/30 rounded-full px-4 py-1.5 mb-4">
            <Icon name="Calculator" size={14} className="text-brand-orange" />
            <span className="font-body text-sm text-brand-orange font-medium">Онлайн-калькулятор</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">РАССЧИТАЙТЕ <span className="gradient-text">СТОИМОСТЬ</span></h2>
          <p className="font-body text-white/50">Настройте параметры и получите мгновенную оценку стоимости печати</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 card-dark rounded-2xl p-8 space-y-8">
            <div>
              <label className="font-body text-sm font-semibold text-white/70 block mb-3">Формат издания</label>
              <div className="flex gap-2 flex-wrap">
                {formats.map((f) => (
                  <button key={f} onClick={() => setFormat(f)}
                    className={`font-display text-sm font-bold px-4 py-2 rounded-lg transition-all duration-200 ${format === f ? "gradient-brand text-white shadow-lg shadow-orange-500/30" : "bg-brand-border/40 text-white/60 hover:text-white hover:bg-brand-border"}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-3">
                <label className="font-body text-sm font-semibold text-white/70">Количество страниц</label>
                <span className="font-display text-lg font-bold gradient-text">{pages}</span>
              </div>
              <input type="range" min={8} max={320} step={8} value={pages} onChange={(e) => setPages(Number(e.target.value))} className="w-full" style={{ background: pagesTrack }} />
              <div className="flex justify-between font-body text-xs text-white/30 mt-1"><span>8 стр</span><span>320 стр</span></div>
            </div>

            <div>
              <div className="flex justify-between mb-3">
                <label className="font-body text-sm font-semibold text-white/70">Тираж, экземпляров</label>
                <span className="font-display text-lg font-bold gradient-text">{qty.toLocaleString("ru")}</span>
              </div>
              <input type="range" min={100} max={20000} step={100} value={qty} onChange={(e) => setQty(Number(e.target.value))} className="w-full" style={{ background: qtyTrack }} />
              <div className="flex justify-between font-body text-xs text-white/30 mt-1"><span>100 шт</span><span>20 000 шт</span></div>
            </div>

            <div>
              <label className="font-body text-sm font-semibold text-white/70 block mb-3">Тип бумаги</label>
              <div className="grid grid-cols-2 gap-2">
                {papers.map((p) => (
                  <button key={p.id} onClick={() => setPaper(p.id)}
                    className={`font-body text-sm px-4 py-3 rounded-lg text-left transition-all duration-200 ${paper === p.id ? "bg-brand-orange/15 border border-brand-orange/50 text-white" : "bg-brand-border/30 border border-transparent text-white/50 hover:text-white hover:border-brand-border"}`}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-body text-sm font-semibold text-white/70 block mb-3">Срок изготовления</label>
              <div className="flex flex-col gap-2">
                {deadlines.map((d) => (
                  <button key={d.id} onClick={() => setDeadline(d.id)}
                    className={`font-body text-sm px-4 py-3 rounded-lg text-left flex items-center gap-3 transition-all duration-200 ${deadline === d.id ? "bg-brand-orange/15 border border-brand-orange/50 text-white" : "bg-brand-border/30 border border-transparent text-white/50 hover:text-white hover:border-brand-border"}`}>
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${d.id === "express" ? "bg-red-400" : d.id === "fast" ? "bg-amber-400" : "bg-green-400"}`} />
                    {d.label}
                    {d.mult > 1 && <span className="ml-auto text-xs text-white/30">+{Math.round((d.mult - 1) * 100)}%</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="card-glass rounded-2xl p-6 flex flex-col text-center h-full justify-center">
              <div className="font-body text-sm text-white/50 mb-2">Итоговая стоимость</div>
              <div className="font-display text-4xl font-bold gradient-text mb-1">{total.toLocaleString("ru")} ₽</div>
              <div className="font-body text-xs text-white/30 mb-8">{perUnit} ₽ за экземпляр</div>

              <div className="space-y-3 text-left mb-8">
                {[["Формат", format], ["Страниц", `${pages} стр.`], ["Тираж", `${qty.toLocaleString("ru")} шт.`], ["Бумага", papers.find((p) => p.id === paper)?.label ?? ""], ["Срок", deadlines.find((d) => d.id === deadline)?.label ?? ""]].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-2 border-b border-brand-border">
                    <span className="font-body text-xs text-white/40">{k}</span>
                    <span className="font-body text-xs text-white font-semibold">{v}</span>
                  </div>
                ))}
              </div>

              {discountPct > 0 && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 mb-6">
                  <div className="font-body text-xs text-green-400">🎉 Скидка за тираж {discountPct}% применена</div>
                </div>
              )}

              <button onClick={onQuiz}
                className="gradient-brand text-white font-body font-bold py-4 px-6 rounded-xl hover:opacity-90 hover:shadow-lg hover:shadow-orange-500/40 transition-all duration-300 text-center">
                Заказать сейчас
              </button>
              <button onClick={onQuiz} className="mt-3 font-body text-sm text-white/40 hover:text-white/70 transition-colors">
                Запросить точный расчёт
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── REVIEWS (Яндекс Бизнес стиль) ──────────────────────────────────────────
function Reviews() {
  const { ref: bgRef, offset: bgOffset } = useParallax(0.15);
  const { ref: titleRef, visible: titleVisible } = useScrollReveal();

  const reviews = [
    { name: "Алексей В.", date: "2 дня назад", text: "Работаем с ПринтМастером уже 4 года. Качество каталогов всегда на высоте, сроки никогда не срываются.", stars: 5, avatar: "А" },
    { name: "Мария С.", date: "1 неделю назад", text: "Журналы для корпоративного мероприятия. Глянцевая печать выглядит роскошно, клиенты в восторге!", stars: 5, avatar: "М" },
    { name: "Дмитрий К.", date: "2 недели назад", text: "Брошюры каждый квартал. Качество стабильное, цены честные. Менеджеры всегда на связи.", stars: 5, avatar: "Д" },
    { name: "Ольга П.", date: "3 недели назад", text: "Экспресс-тираж буклетов за сутки до выставки. Всё успели — качество отличное. Рекомендую!", stars: 5, avatar: "О" },
    { name: "Иван С.", date: "1 месяц назад", text: "Отличное соотношение цена/качество. Работаем больше 2 лет, ни разу не подвели.", stars: 5, avatar: "И" },
    { name: "Наталья И.", date: "1 месяц назад", text: "Каталоги для международной выставки. Мелованная бумага, яркие цвета, прекрасная брошюровка.", stars: 5, avatar: "Н" },
  ];

  return (
    <section id="reviews" ref={bgRef} className="py-24 bg-[#0A0806] relative overflow-hidden">
      {/* Parallax blobs */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-brand-amber/5 rounded-full blur-3xl pointer-events-none"
        style={{ transform: `translateY(${bgOffset * 0.5}px)` }} />
      <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-brand-orange/4 rounded-full blur-3xl pointer-events-none"
        style={{ transform: `translateY(${bgOffset * 0.8}px)` }} />
      {/* Ghost text */}
      <div className="absolute right-0 bottom-0 font-display text-[160px] font-bold text-white/[0.014] pointer-events-none select-none leading-none"
        style={{ transform: `translateY(${bgOffset * 0.35}px)` }}>
        5.0★
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div ref={titleRef} className={`text-center mb-16 transition-all duration-700 ${titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="inline-flex items-center gap-2 bg-brand-orange/10 border border-brand-orange/30 rounded-full px-4 py-1.5 mb-4">
            <Icon name="Star" size={14} className="text-brand-orange" />
            <span className="font-body text-sm text-brand-orange font-medium">Отзывы клиентов</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">НАС <span className="gradient-text">РЕКОМЕНДУЮТ</span></h2>

          <div className="inline-flex items-center gap-4 bg-[#1A1512] border border-brand-border rounded-2xl px-6 py-4 mt-4">
            <div className="text-left">
              <div className="font-display text-4xl font-bold text-white">5.0</div>
              <div className="flex gap-0.5 mt-1">
                {[1,2,3,4,5].map(i => <Icon key={i} name="Star" size={14} className="text-yellow-400" />)}
              </div>
              <div className="font-body text-xs text-white/40 mt-1">на Яндекс Картах</div>
            </div>
            <div className="w-px h-12 bg-brand-border" />
            <div className="text-left">
              <div className="font-display text-2xl font-bold text-white">186</div>
              <div className="font-body text-xs text-white/40">отзывов</div>
            </div>
            <div className="w-px h-12 bg-brand-border" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="font-display text-white font-bold text-sm">Я</span>
              </div>
              <div>
                <div className="font-body text-xs font-semibold text-white">Яндекс</div>
                <div className="font-body text-xs text-white/40">Бизнес</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map((r, i) => (
            <RevealCard key={r.name} delay={i * 60}>
              <div className="bg-[#141210] border border-brand-border rounded-2xl p-5 hover-lift h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full gradient-brand flex items-center justify-center flex-shrink-0">
                      <span className="font-display text-sm font-bold text-white">{r.avatar}</span>
                    </div>
                    <div>
                      <div className="font-body text-sm font-semibold text-white">{r.name}</div>
                      <div className="font-body text-xs text-white/35">{r.date}</div>
                    </div>
                  </div>
                  <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center flex-shrink-0">
                    <span className="font-display text-white font-bold text-xs">Я</span>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: r.stars }).map((_, j) => (
                    <Icon key={j} name="Star" size={13} className="text-yellow-400" />
                  ))}
                </div>
                <p className="font-body text-sm text-white/65 leading-relaxed">{r.text}</p>
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-brand-border">
                  <button className="flex items-center gap-1.5 text-white/30 hover:text-white/60 transition-colors">
                    <Icon name="ThumbsUp" size={13} />
                    <span className="font-body text-xs">Полезно</span>
                  </button>
                </div>
              </div>
            </RevealCard>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CONTACTS ────────────────────────────────────────────────────────────────
function Contacts() {
  const [form, setForm] = useState({ name: "", phone: "", comment: "" });
  const [sent, setSent] = useState(false);
  const { ref: bgRef, offset: bgOffset } = useParallax(0.12);
  const { ref: titleRef, visible: titleVisible } = useScrollReveal();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSent(true); };

  return (
    <section id="contacts" ref={bgRef} className="py-24 bg-brand-dark relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-orange/7 rounded-full blur-3xl pointer-events-none"
        style={{ transform: `translateY(${bgOffset * 0.6}px)` }} />
      <div className="absolute top-0 left-0 w-80 h-80 bg-brand-amber/5 rounded-full blur-3xl pointer-events-none"
        style={{ transform: `translateY(${bgOffset * 0.4}px)` }} />
      {/* Ghost text */}
      <div className="absolute right-0 top-1/2 font-display text-[150px] font-bold text-white/[0.015] pointer-events-none select-none leading-none"
        style={{ transform: `translateY(calc(-50% + ${bgOffset * 0.3}px))` }}>
        CALL
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div ref={titleRef} className={`text-center mb-16 transition-all duration-700 ${titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="inline-flex items-center gap-2 bg-brand-orange/10 border border-brand-orange/30 rounded-full px-4 py-1.5 mb-4">
            <Icon name="Phone" size={14} className="text-brand-orange" />
            <span className="font-body text-sm text-brand-orange font-medium">Свяжитесь с нами</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">ОСТАВЬТЕ <span className="gradient-text">ЗАЯВКУ</span></h2>
          <p className="font-body text-white/50">Ответим в течение 30 минут и подготовим точное коммерческое предложение</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          <div className="card-dark rounded-2xl p-8">
            <h3 className="font-display text-2xl font-bold text-white mb-6">Форма заявки</h3>
            {!sent ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="font-body text-sm text-white/60 mb-2 block">Ваше имя</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Иван Иванов" required
                    className="w-full bg-brand-border/40 border border-brand-border rounded-xl px-4 py-3 font-body text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-orange/60 transition-colors" />
                </div>
                <div>
                  <label className="font-body text-sm text-white/60 mb-2 block">Телефон</label>
                  <input name="phone" value={form.phone} onChange={handleChange} placeholder="+7 (495) 123-45-67" required
                    className="w-full bg-brand-border/40 border border-brand-border rounded-xl px-4 py-3 font-body text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-orange/60 transition-colors" />
                </div>
                <div>
                  <label className="font-body text-sm text-white/60 mb-2 block">Комментарий к заказу</label>
                  <textarea name="comment" value={form.comment} onChange={handleChange} rows={4}
                    placeholder="Опишите задачу: тип изделия, формат, тираж..."
                    className="w-full bg-brand-border/40 border border-brand-border rounded-xl px-4 py-3 font-body text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-orange/60 transition-colors resize-none" />
                </div>
                <button type="submit"
                  className="w-full gradient-brand text-white font-body font-bold py-4 rounded-xl hover:opacity-90 hover:shadow-lg hover:shadow-orange-500/40 transition-all duration-300">
                  Отправить заявку
                </button>
                <p className="font-body text-xs text-white/30 text-center">Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности</p>
              </form>
            ) : (
              <div className="text-center py-10">
                <div className="w-14 h-14 gradient-brand rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="CheckCircle" size={28} className="text-white" />
                </div>
                <h4 className="font-display text-xl font-bold text-white mb-2">Заявка принята!</h4>
                <p className="font-body text-sm text-white/50">Свяжемся с вами в течение 30 минут</p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-5">
            {[
              { icon: "Phone", title: "Телефон", lines: ["+7 (495) 123-45-67"] },
              { icon: "Mail", title: "Email", lines: ["info@printmaster.ru"] },
              { icon: "MapPin", title: "Адрес", lines: ["г. Москва, ул. Полиграфическая, д. 15", "м. Профсоюзная, 5 минут пешком"] },
              { icon: "Clock", title: "Режим работы", lines: ["Пн–Пт: 9:00 – 19:00", "Сб: 10:00 – 16:00"] },
            ].map((info) => (
              <div key={info.title} className="card-dark rounded-2xl p-5 flex items-start gap-4 hover-lift">
                <div className="w-11 h-11 gradient-brand rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon name={info.icon as LucideIconName} size={20} className="text-white" />
                </div>
                <div>
                  <div className="font-display text-base font-bold text-white mb-1.5">{info.title}</div>
                  {info.lines.map((l) => <div key={l} className="font-body text-sm text-white/60">{l}</div>)}
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
          <span className="font-display text-lg font-bold text-white">ПРИНТ<span className="gradient-text">МАСТЕР</span></span>
        </div>
        <p className="font-body text-xs text-white/30 text-center">© 2024 ПринтМастер. Профессиональная полиграфия в Москве</p>
        <div className="flex gap-5">
          {["Услуги", "Портфолио", "Контакты"].map((l) => (
            <button key={l} onClick={() => scrollTo(l.toLowerCase())}
              className="font-body text-xs text-white/40 hover:text-white transition-colors">
              {l}
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function Index() {
  const [orderOpen, setOrderOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);

  return (
    <div className="min-h-screen bg-brand-dark">
      <OrderModal open={orderOpen} onClose={() => setOrderOpen(false)} />
      <QuizModal open={quizOpen} onClose={() => setQuizOpen(false)} />
      <Nav onOrder={() => setOrderOpen(true)} />
      <Hero onQuiz={() => setQuizOpen(true)} />
      <Services />
      <Portfolio onShowAll={() => setOrderOpen(true)} />
      <Calculator onQuiz={() => setQuizOpen(true)} />
      <Reviews />
      <Contacts />
      <Footer />
    </div>
  );
}