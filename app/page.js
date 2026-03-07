"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { FaWhatsapp, FaComments, FaArrowRight, FaPhone, FaMapMarkerAlt, FaEnvelope, FaBars, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const services = [
  {
    title: "Tenuta della contabilità",
    description:
      "Sistemi digitali evoluti per fornire report e analisi per aiutare l'imprenditore a capire davvero l'andamento della propria attività.",
  },
  {
    title: "Gestione del personale dipendente",
    description:
      "Un supporto concreto nella gestione dei rapporti col personale per prevenire criticità che potrebbero trasformarsi in problemi più seri.",
  },
  {
    title: "Consulenza fiscale e societaria",
    description:
      "Un affiancamento costante per la gestione di tutti gli adempimenti fiscali, per ridurre i rischi, cogliere le opportunità normative e prevenire situazioni critiche. Un supporto nella scelta della forma giuridica più adatta in ottica fiscale, per una tutela patrimoniale dei soggetti coinvolti.",
  },
  {
    title: "Analisi finanziaria e business plan",
    description:
      "La fotografia della situazione economica e patrimoniale dell'impresa come base numerica solida per ogni decisione strategica dell'imprenditore. Previsione di scenari e valutazione di investimenti per sostenere decisioni consapevoli e lungimiranti prima di avviare un nuovo progetto o investimento, evitando errori costosi e massimizzando le possibilità di successo.",
  },
  {
    title: "Operazioni straordinarie",
    description:
      "Competenze tecniche e visione d'insieme per strutturare e gestire fusioni, scissioni, trasformazioni, cessioni e acquisizioni garantendo sicurezza, trasparenza e coerenza con gli obiettivi aziendali e personali.",
  },
  {
    title: "Revisione legale",
    description:
      "Rigore, indipendenza e attenzione al dettaglio per fornire un giudizio obiettivo e affidabile delle informazioni economico-finanziarie delle imprese, a tutela di soci, stakeholder e investitori.",
  },
];

const specializations = [
  "Medici e professioni sanitarie",
  "Farmacie",
  "Edilizia",
  "Agenzie di viaggio",
  "Beni e autoveicoli usati",
  "Tabacchi",
  "Influencer",
  "Criptovalute",
  "Commercio con l'estero",
  "Affitti brevi e locazioni turistiche",
  "Lavoro domestico",
  "Contribuenti forfettari",
];

const specializationsRow1 = specializations.slice(0, Math.ceil(specializations.length / 2));
const specializationsRow2 = specializations.slice(Math.ceil(specializations.length / 2));

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.65, ease: "easeOut" },
};

const CHAT_API_BASE = process.env.NEXT_PUBLIC_CHAT_API || "https://servermalacarne.onrender.com/api";
const SESSION_RESPONSE_KEY = "malacarne_chat_last_response_id";
const PONSACCO_IMAGES = [
  "/images/Ponsacco1.jpg",
  "/images/Ponsacco2.jpg",
  "/images/Ponsacco3.jpg",
  "/images/Ponsacco4.jpg",
  "/images/Ponsacco5.jpg",
];

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lastResponseId, setLastResponseId] = useState(null);
  const [messages, setMessages] = useState([
    { id: 1, text: "Ciao! Come posso aiutarti oggi?", isAssistant: true },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [ponsaccoImageIndex, setPonsaccoImageIndex] = useState(0);
  const abortControllerRef = useRef(null);
  const messagesRef = useRef(null);
  const chatInputRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedResponseId = sessionStorage.getItem(SESSION_RESPONSE_KEY);
    if (savedResponseId) setLastResponseId(savedResponseId);
  }, []);

  useEffect(() => {
    if (!messagesRef.current) return;
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages, isTyping]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setPonsaccoImageIndex((prev) => (prev + 1) % PONSACCO_IMAGES.length);
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  const handleNewChat = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setLastResponseId(null);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(SESSION_RESPONSE_KEY);
    }
    setMessages([{ id: 1, text: "Ciao! Come posso aiutarti oggi?", isAssistant: true }]);
    setInputValue("");
    setIsTyping(false);
  };

  const handleSendMessage = async (rawMessage) => {
    const message = rawMessage.trim();
    if (!message || isTyping) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setMessages((prev) => [...prev, { id: prev.length + 1, text: message, isAssistant: false }]);
    setInputValue("");
    setIsTyping(true);

    try {
      const requestBody = lastResponseId
        ? { message, previousResponseId: lastResponseId }
        : { message };

      const convResponse = await fetch(`${CHAT_API_BASE}/conversation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
        signal: abortController.signal,
      });

      if (!convResponse.ok) {
        throw new Error("Errore nella risposta del server");
      }

      const convData = await convResponse.json();
      const assistantText = (convData.output_text || "").trim();
      const nextResponseId = convData.responseId || null;
      const leadSubmitted = Boolean(convData.leadSubmitted);

      if (nextResponseId) {
        setLastResponseId(nextResponseId);
        if (typeof window !== "undefined") {
          sessionStorage.setItem(SESSION_RESPONSE_KEY, nextResponseId);
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: assistantText || "Ricevuto. Ti rispondo al più presto.",
          isAssistant: true,
        },
        ...(leadSubmitted
          ? [
              {
                id: prev.length + 2,
                text: "Dati ricevuti, ti contatteremo presto.",
                isAssistant: true,
              },
            ]
          : []),
      ]);
    } catch (error) {
      if (error.name !== "AbortError") {
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            text: "Mi dispiace, si è verificato un errore. Riprova tra poco.",
            isAssistant: true,
          },
        ]);
      }
    } finally {
      setIsTyping(false);
      abortControllerRef.current = null;
    }
  };

  const handleFocusChat = () => {
    chatInputRef.current?.focus();
  };

  const handlePrevPonsaccoImage = () => {
    setPonsaccoImageIndex((prev) => (prev - 1 + PONSACCO_IMAGES.length) % PONSACCO_IMAGES.length);
  };

  const handleNextPonsaccoImage = () => {
    setPonsaccoImageIndex((prev) => (prev + 1) % PONSACCO_IMAGES.length);
  };

  return (
    <div className="site">
      <header className="navbar">
        <div className="container nav-inner">
          <a href="#home" className="brand">
            <Image
              src="/images/LogoEsteso.png"
              alt="Studio Malacarne"
              width={260}
              height={80}
              priority
              className="brand-logo"
            />
          </a>
          <nav className="nav-links">
            <a href="#home">Home</a>
            <a href="#chi-siamo">Chi Siamo</a>
            <a href="#servizi">I nostri servizi</a>
            <a href="#studio">Lo Studio</a>
            <a href="#contatti">Contatti</a>
          </nav>
          <a className="cta-small" href="tel:+390587732559" aria-label="Chiama il numero 0587 732559">
            <FaPhone aria-hidden="true" focusable="false" />
            <span>Chiama</span>
          </a>
          <button
            type="button"
            className="mobile-menu-toggle"
            aria-label="Apri menu"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            {isMobileMenuOpen ? <FaTimes aria-hidden="true" focusable="false" /> : <FaBars aria-hidden="true" focusable="false" />}
          </button>
        </div>
        <div className={`mobile-menu-panel ${isMobileMenuOpen ? "open" : ""}`}>
          <a href="#home" onClick={() => setIsMobileMenuOpen(false)}>Home</a>
          <a href="#chi-siamo" onClick={() => setIsMobileMenuOpen(false)}>Chi Siamo</a>
          <a href="#servizi" onClick={() => setIsMobileMenuOpen(false)}>I nostri servizi</a>
          <a href="#studio" onClick={() => setIsMobileMenuOpen(false)}>Lo Studio</a>
          <a href="#contatti" onClick={() => setIsMobileMenuOpen(false)}>Contatti</a>
          <a
            className="mobile-whatsapp-link"
            href="tel:+390587732559"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FaPhone aria-hidden="true" focusable="false" />
            <span>Chiama 0587 732559</span>
          </a>
        </div>
      </header>

      <main>
        <section id="home" className="hero">
          <div className="container hero-grid">
            <motion.div className="hero-copy" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h1>Affidabilità, competenza e visione per la tua impresa.</h1>
              <p className="lead">
                Un partner professionale che trasforma la complessità amministrativa in chiarezza gestionale, con due sedi sul territorio e oltre vent&apos;anni di esperienza.
              </p>
              <div className="hero-actions">
                <a href="#contatti" className="cta-main">Prenota una consulenza</a>
                <button type="button" className="cta-chat-pulse" onClick={handleFocusChat}>
                  <span>Hai domande? Chiedi pure</span>
                  <FaArrowRight aria-hidden="true" focusable="false" />
                </button>
              </div>
            </motion.div>
            <motion.div
              className="hero-chat-panel"
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.12 }}
            >
              <div className="hero-chat-head">
                <div className="chat-live-icon" aria-label="Chat attiva">
                  <FaComments aria-hidden="true" focusable="false" />
                </div>
                <button type="button" className="chat-reset-btn" onClick={handleNewChat}>
                  Nuova chat
                </button>
              </div>
              <div className="hero-chat-messages" ref={messagesRef}>
                <AnimatePresence initial={false}>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      className={`chat-bubble ${message.isAssistant ? "assistant" : "user"}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.28, ease: "easeOut" }}
                    >
                      {message.isAssistant ? (
                        <div className="chat-markdown">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              a: ({ ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
                            }}
                          >
                            {message.text}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        message.text
                      )}
                    </motion.div>
                  ))}
                  {isTyping && (
                    <motion.div
                      key="typing"
                      className="chat-bubble assistant typing-bubble"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                      <span className="typing-label">Sto pensando</span>
                      <span className="typing-dots" aria-hidden="true">
                        <span />
                        <span />
                        <span />
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="hero-chat-quick">
                <button type="button" onClick={() => handleSendMessage("Cosa è un forfettario?")}>
                  Cosa è un forfettario?
                </button>
                <button type="button" onClick={() => handleSendMessage("Vorrei aprire un'attività")}>
                  Vorrei aprire un&apos;attività
                </button>
              </div>
              <div className="hero-chat-input-wrap">
                <input
                  ref={chatInputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Scrivi un messaggio..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage(inputValue);
                    }
                  }}
                />
                <button type="button" onClick={() => handleSendMessage(inputValue)}>
                  Invia
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        <motion.section id="chi-siamo" className="section light" {...fadeInUp}>
          <div className="container about-section">
            <div className="about-header">
              <p className="eyebrow">Chi siamo</p>
              <h2 className="center">
                Una consulenza concreta,
                <br />
                pensata per chi fa impresa ogni giorno.
              </h2>
              <p className="about-subtitle center">
                Lo Studio Malacarne assiste gli imprenditori offrendo un supporto concreto e qualificato nella gestione
                della loro attività.
              </p>
            </div>
            <div className="about-stack">
              <article className="about-row-card">
                <div className="about-row-media">
                  <Image src="/images/MM-crop.jpg" alt="Dott. Marco Malacarne" width={520} height={520} />
                </div>
                <div className="about-row-body">
                  <div className="about-row-profile">
                    <h3>Dott. Marco Malacarne</h3>
                    <p className="about-doctor-spec">
                      Laureato in Economia e Commercio presso l&apos;università di Pisa, specializzato in consulenza
                      aziendale, analisi finanziaria e gestione del personale.
                    </p>
                  </div>
                  <div className="about-row-philosophy">
                    <p className="philosophy-lead">La filosofia dello Studio si fonda su due principi essenziali:</p>
                    <p>
                      1. Fornire strumenti chiari per comprendere, analizzare e sviluppare la propria impresa con
                      consapevolezza.
                    </p>
                    <p>
                      2. Rendere la gestione aziendale semplice ed efficiente, liberando l&apos;imprenditore dal peso
                      degli adempimenti e permettendogli di concentrarsi pienamente sulla crescita del proprio
                      business.
                    </p>
                  </div>
                </div>
              </article>

              <article className="about-row-card reverse">
                <div className="about-row-media">
                  <Image src="/images/SM-crop.jpg" alt="Dott. Simone Malacarne" width={520} height={520} />
                </div>
                <div className="about-row-body">
                  <div className="about-row-profile">
                    <h3>Dott. Simone Malacarne</h3>
                    <p className="about-doctor-spec">
                      Laureato in Economia e Commercio presso l&apos;università di Pisa, specializzato in consulenza
                      societaria, operazioni straordinarie e revisione legale.
                    </p>
                  </div>
                  <div className="about-row-philosophy">
                    <p className="philosophy-lead">Esperienza e affidabilità al servizio della tua impresa:</p>
                    <p>
                      L&apos;esperienza maturata in oltre vent&apos;anni di attività consente allo Studio Malacarne di essere
                      un punto di riferimento affidabile per chi desidera un partner professionale capace di
                      trasformare la complessità amministrativa in valore e chiarezza gestionale.
                    </p>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </motion.section>

        <motion.section id="servizi" className="section" {...fadeInUp}>
          <div className="container">
            <p className="eyebrow center">I nostri servizi</p>
            <h2 className="center">
              Competenze integrate
              <br />
              per accompagnare ogni fase della tua attività.
            </h2>
            <div className="cards-grid">
              {services.map((service) => (
                <article key={service.title} className="service-card">
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </article>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section id="studio" className="section light" {...fadeInUp}>
          <div className="container">
            <p className="eyebrow center">Lo studio</p>
            <h2 className="center">
              Due sedi, un unico metodo:
              <br />
              precisione, ascolto e risultati.
            </h2>
            <p className="studio-subtitle center">
              Due sedi, un&apos;unica visione per accompagnare imprenditori e professionisti con consulenza su misura nel
              loro percorso di crescita
            </p>
          </div>
          <div className="studio-fullbleed">
            <article className="studio-tile">
              <Image src="/images/castelfrancoangolazione.jpeg" alt="Studio Castelfranco" width={1200} height={850} />
              <div className="studio-overlay" />
              <div className="studio-tile-content">
                <div className="studio-top">
                  <h3>Castelfranco Di Sotto</h3>
                  <p>
                    Lo Studio Malacarne nasce a Castelfranco di Sotto, nel cuore del comprensorio del cuoio. Un
                    contesto unico, che ha formato la nostra esperienza e ci ha insegnato il valore della precisione,
                    della competenza e del lavoro ben fatto.
                  </p>
                </div>
                <div className="studio-bottom">
                  <p>Piazza XX Settembre n.11 - 56020 Castelfranco Di Sotto (PI)</p>
                  <p>Orario: 9:00 - 13:00 15:00 - 19:00</p>
                  <p>
                    <a href="tel:+390571489029">0571 489029</a> -{" "}
                    <a href="mailto:cf@studiomalacarne.com">cf@studiomalacarne.com</a>
                  </p>
                  <div className="studio-tile-links">
                    <a href="tel:+390571489029" className="studio-tile-link" aria-label="Chiama la sede di Castelfranco" title="Chiama">
                      <FaPhone aria-hidden="true" focusable="false" />
                    </a>
                    <a
                      href="https://wa.me/390571489029"
                      target="_blank"
                      rel="noreferrer"
                      className="studio-tile-link"
                      aria-label="WhatsApp sede di Castelfranco"
                      title="WhatsApp"
                    >
                      <FaWhatsapp aria-hidden="true" focusable="false" />
                    </a>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Piazza+XX+Settembre+11+Castelfranco+Di+Sotto+PI"
                      target="_blank"
                      rel="noreferrer"
                      className="studio-tile-link"
                      aria-label="Apri navigazione per sede di Castelfranco"
                      title="Naviga"
                    >
                      <FaMapMarkerAlt aria-hidden="true" focusable="false" />
                    </a>
                    <a
                      href="mailto:cf@studiomalacarne.com"
                      className="studio-tile-link"
                      aria-label="Invia email alla sede di Castelfranco"
                      title="Email"
                    >
                      <FaEnvelope aria-hidden="true" focusable="false" />
                    </a>
                  </div>
                </div>
              </div>
            </article>
            <article className="studio-tile">
              <AnimatePresence initial={false}>
                <motion.div
                  key={PONSACCO_IMAGES[ponsaccoImageIndex]}
                  className="studio-image-layer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                >
                  <Image
                    src={PONSACCO_IMAGES[ponsaccoImageIndex]}
                    alt="Studio Ponsacco"
                    fill
                    sizes="(max-width: 1040px) 100vw, 50vw"
                  />
                </motion.div>
              </AnimatePresence>
              <button
                type="button"
                className="studio-carousel-arrow left"
                aria-label="Foto precedente sede di Ponsacco"
                onClick={handlePrevPonsaccoImage}
              >
                <FaChevronLeft aria-hidden="true" focusable="false" />
              </button>
              <button
                type="button"
                className="studio-carousel-arrow right"
                aria-label="Foto successiva sede di Ponsacco"
                onClick={handleNextPonsaccoImage}
              >
                <FaChevronRight aria-hidden="true" focusable="false" />
              </button>
              <div className="studio-overlay" />
              <div className="studio-tile-content">
                <div className="studio-top">
                  <h3>Ponsacco</h3>
                  <p>
                    A Ponsacco, storica città del mobile, offriamo consulenza a imprese e professionisti che
                    affrontano un mercato in evoluzione, aiutandoli a rinnovarsi e a costruire nuove opportunità.
                  </p>
                </div>
                <div className="studio-bottom">
                  <p>Via Togliatti n.5 - 56038 Ponsacco (PI)</p>
                  <p>Orario: 8:30 - 12:30 15:00 - 19:00</p>
                  <p>
                    <a href="tel:+390587732559">0587 732559</a> -{" "}
                    <a href="mailto:ponsacco@studiomalacarne.com">ponsacco@studiomalacarne.com</a>
                  </p>
                  <div className="studio-tile-links">
                    <a href="tel:+390587732559" className="studio-tile-link" aria-label="Chiama la sede di Ponsacco" title="Chiama">
                      <FaPhone aria-hidden="true" focusable="false" />
                    </a>
                    <a
                      href="https://wa.me/390587732559"
                      target="_blank"
                      rel="noreferrer"
                      className="studio-tile-link"
                      aria-label="WhatsApp sede di Ponsacco"
                      title="WhatsApp"
                    >
                      <FaWhatsapp aria-hidden="true" focusable="false" />
                    </a>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Via+Togliatti+5+Ponsacco+PI"
                      target="_blank"
                      rel="noreferrer"
                      className="studio-tile-link"
                      aria-label="Apri navigazione per sede di Ponsacco"
                      title="Naviga"
                    >
                      <FaMapMarkerAlt aria-hidden="true" focusable="false" />
                    </a>
                    <a
                      href="mailto:ponsacco@studiomalacarne.com"
                      className="studio-tile-link"
                      aria-label="Invia email alla sede di Ponsacco"
                      title="Email"
                    >
                      <FaEnvelope aria-hidden="true" focusable="false" />
                    </a>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </motion.section>

        <motion.section id="specializzazioni" className="section" {...fadeInUp}>
          <div className="container">
            <p className="eyebrow center">Specializzazioni</p>
            <h2 className="center">
              Settori specifici,
              <br />
              risposte precise.
            </h2>
            <div className="specializations-marquee">
              <div className="marquee-row">
                <div className="marquee-track marquee-track-right">
                  {[...specializationsRow1, ...specializationsRow1].map((item, idx) => (
                    <span key={`row1-${idx}-${item}`} className="chip marquee-chip">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="marquee-row">
                <div className="marquee-track marquee-track-left">
                  {[...specializationsRow2, ...specializationsRow2].map((item, idx) => (
                    <span key={`row2-${idx}-${item}`} className="chip marquee-chip">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      <footer id="contatti" className="footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <Image
              src="/images/LogoDefinitivoBianco.svg"
              alt="Studio Malacarne"
              width={260}
              height={80}
              className="footer-logo-img"
            />
            <div className="footer-brand-copy">
              <p className="footer-text">
                Affidabilità e competenza per 
                <br />
                la tua attività.
              </p>
            </div>
          </div>
          <div className="footer-location">
            <h4>Castelfranco</h4>
            <p>Piazza XX Settembre n.11 - 56020 Castelfranco Di Sotto (PI)</p>
            <p>Tel: <a href="tel:+390571489029">0571 489029</a></p>
            <p>Email: <a href="mailto:cf@studiomalacarne.com">cf@studiomalacarne.com</a></p>
            <p>Orario: 9:00 - 13:00 15:00 - 19:00</p>
            <iframe
              src="https://www.google.com/maps?q=Piazza+XX+Settembre+11+Castelfranco+Di+Sotto+PI&output=embed"
              className="footer-map"
              title="Mappa Castelfranco"
              loading="lazy"
            />
          </div>
          <div className="footer-location">
            <h4>Ponsacco</h4>
            <p>Via Togliatti n.5 - 56038 Ponsacco (PI)</p>
            <p>Tel: <a href="tel:+390587732559">0587 732559</a></p>
            <p>Email: <a href="mailto:ponsacco@studiomalacarne.com">ponsacco@studiomalacarne.com</a></p>
            <p>Orario: 8:30 - 12:30 15:00 - 19:00</p>
            <iframe
              src="https://www.google.com/maps?q=Via+Togliatti+5+Ponsacco+PI&output=embed"
              className="footer-map"
              title="Mappa Ponsacco"
              loading="lazy"
            />
          </div>
        </div>
        <div className="container footer-bottom">
          <p>© 2025 Studio Malacarne. Tutti i diritti riservati. | P.IVA 02028030506</p>
          <p>
            <a href="/informativa-privacy">Informativa sulla privacy</a> |{" "}
            <a href="/termini-condizioni">Termini e condizioni</a>
          </p>
          <p>
            Powered by{" "}
            <a href="https://www.webbitz.it" target="_blank" rel="noopener noreferrer">
              Webbitz
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
