import { Component, lazy, Suspense, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  Compass,
  ExternalLink,
  House,
  MapPin,
  Menu,
  Mountain,
  Users,
  X,
} from "lucide-react";
import trip from "./data/trip.json";
import itinerary from "./data/itinerary.json";
import sourceLocations from "./data/locations.json";
import verifications from "./data/location-verifications.json";
import photos from "./data/gallery.json";
import Itinerary from "./components/Itinerary.jsx";
import Gallery from "./components/Gallery.jsx";
import PackingChecklist from "./components/PackingChecklist.jsx";
import { assetUrl, navigationUrl } from "./utils/travel.js";

const TripMap = lazy(() => import("./components/TripMap.jsx"));
const locations = sourceLocations.map((location) => ({
  ...location,
  ...verifications.find((item) => item.id === location.id),
}));
const links = [
  ["overview", "Chuyến đi"],
  ["itinerary", "Lịch trình"],
  ["map", "Bản đồ"],
  ["gallery", "Khoảnh khắc"],
  ["packing", "Hành trang"],
];

class MapBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="map-fallback">
        <p role="status">
          Bản đồ chưa tải được. Bạn vẫn có thể mở địa điểm và xem lịch trình bên
          dưới.
        </p>
        <ul>
          {this.props.locations.map((location) => (
            <li key={location.id}>
              <strong>{location.name}</strong>
              <div>
                {navigationUrl(location) && (
                  <a
                    className="text-link"
                    href={navigationUrl(location)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Mở chỉ đường <ArrowUpRight size={14} />
                  </a>
                )}
                <button
                  className="text-link"
                  onClick={() =>
                    this.props.onShowActivity(location.activityIds[0])
                  }
                >
                  Xem lịch trình <ArrowUpRight size={14} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    ) : (
      this.props.children
    );
  }
}

function Reveal({ children, className = "" }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={false}
      whileInView={reduced ? {} : { opacity: [0.85, 1], y: [16, 0] }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.65 }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [selectedDay, setSelectedDay] = useState(
    itinerary[1]?.id || itinerary[0]?.id,
  );
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef(null);
  const menuButtonRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setActiveSection(entry.target.id);
      },
      { rootMargin: "-15% 0px -65% 0px" },
    );
    links.forEach(([id]) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    const resetAtTop = () => {
      if (window.scrollY < 100) setActiveSection("overview");
    };
    window.addEventListener("scroll", resetAtTop, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", resetAtTop);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMapReady(true);
          observer.disconnect();
        }
      },
      { rootMargin: "350px" },
    );
    if (mapRef.current) observer.observe(mapRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [menuOpen]);

  function showLocation(id) {
    setSelectedLocation(id);
    setMapReady(true);
    document
      .getElementById("map")
      .scrollIntoView({ behavior: reduced ? "instant" : "smooth" });
  }

  function showActivity(activityId) {
    const day = itinerary.find((item) =>
      item.activities.some((activity) => activity.id === activityId),
    );
    if (!day) return;
    setSelectedDay(day.id);
    setSelectedActivity(activityId);
    document
      .getElementById("itinerary")
      .scrollIntoView({ behavior: reduced ? "instant" : "smooth" });
  }

  return (
    <>
      <a className="skip-link" href="#itinerary">
        Đến lịch trình
      </a>
      <header className="masthead">
        <a className="brand" href="#top" aria-label="Dallas, về đầu trang">
          dallas<span className="brand-dot">.</span>
        </a>
        <nav className="desktop-nav" aria-label="Điều hướng chính">
          {links.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={activeSection === id ? "location" : undefined}
            >
              {label}
            </a>
          ))}
        </nav>
        <span className="header-trip">
          <span className="status-dot" />
          Đà Lạt, 2026
        </span>
        <button
          ref={menuButtonRef}
          className="icon-button mobile-menu-button"
          aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
        {menuOpen && (
          <nav
            id="mobile-nav"
            className="mobile-nav"
            aria-label="Điều hướng di động"
          >
            {links.map(([id, label]) => (
              <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>
                {label}
                <ArrowUpRight size={18} />
              </a>
            ))}
          </nav>
        )}
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <motion.img
            className="hero-image"
            src={assetUrl(photos[0].src)}
            alt={photos[0].alt}
            fetchPriority="high"
            initial={false}
            animate={reduced ? {} : { scale: [1.035, 1] }}
            transition={{ duration: 2.8, ease: "easeOut" }}
            onError={(event) => {
              event.currentTarget.style.visibility = "hidden";
            }}
          />
          <div className="hero-shade" />
          <div className="hero-content">
            <div className="hero-date">
              <span>29.10 — 02.11.2026</span>
              <span className="hero-date-rule" />
              <span>Sài Gòn → Đà Lạt</span>
            </div>
            <motion.h1
              id="hero-title"
              initial={false}
              animate={reduced ? {} : { y: [22, 0], opacity: [0.65, 1] }}
              transition={{ duration: 0.9 }}
            >
              Đà Lạt,
              <br />
              <em>mình đi nhé.</em>
            </motion.h1>
            <p>
              Để lại phố sau lưng.
              <br />
              Mang về những ngày thật đáng nhớ.
            </p>
            <a className="button button-light" href="#itinerary">
              Khám phá hành trình <ArrowUpRight size={19} />
            </a>
          </div>
          <div className="hero-bottom">
            <a href="#overview" className="scroll-link">
              <ArrowDown size={17} /> Chậm lại một chút, đi xa một chút.
            </a>
            <span>Thung Lũng Vàng · Ảnh minh họa</span>
          </div>
          <div className="hero-side">MỘT CHUYẾN ĐI, NHIỀU KỶ NIỆM</div>
        </section>

        <section
          id="overview"
          className="section overview-section"
          aria-labelledby="overview-title"
        >
          <Reveal className="overview-intro">
            <div>
              <h2 id="overview-title">
                Một cuộc hẹn
                <br />
                với <em>cao nguyên.</em>
              </h2>
            </div>
            <div>
              <p>{trip.introduction}</p>
              <p className="muted">Không cần vội. Chỉ cần đi cùng nhau.</p>
            </div>
          </Reveal>
          <div className="trip-facts">
            <div>
              <CalendarDays size={21} />
              <span>
                <strong>29.10 — 02.11</strong>
                <small>5 ngày lịch · 2026</small>
              </span>
            </div>
            <div>
              <Users size={21} />
              <span>
                <strong>11 người bạn</strong>
                <small>Cùng một chuyến đi</small>
              </span>
            </div>
            <div>
              <House size={21} />
              <span>
                <strong>Villa C39 An Sơn</strong>
                <small>30.10, 06:00 → 02.11, 12:00</small>
              </span>
            </div>
          </div>
          <div className="overview-note">
            <Check size={16} />
            <span>
              Lịch trình từ kế hoạch của nhóm. Thời gian hiển thị theo giờ Việt
              Nam.
            </span>
            <a href={trip.sourceUrl} target="_blank" rel="noreferrer">
              Bản gốc <ExternalLink size={13} />
            </a>
          </div>
        </section>

        <section
          id="itinerary"
          className="section itinerary-section"
          aria-labelledby="itinerary-title"
        >
          <Reveal className="section-heading">
            <h2 id="itinerary-title">
              Từng ngày,
              <br />
              <em>một câu chuyện.</em>
            </h2>
            <p>
              Từ chuyến xe đêm đến buổi cà phê cuối.
              <br />
              Mọi cuộc hẹn, ở ngay đây.
            </p>
          </Reveal>
          <Itinerary
            days={itinerary}
            selectedDay={selectedDay}
            onDayChange={(id) => {
              setSelectedDay(id);
              setSelectedActivity(null);
            }}
            selectedActivity={selectedActivity}
            locations={locations}
            onShowLocation={showLocation}
          />
        </section>

        <section
          className="photo-interlude"
          aria-label="Đà Lạt qua những bức ảnh"
        >
          <img
            src={assetUrl(photos[1].src)}
            alt={photos[1].alt}
            loading="lazy"
            onError={(event) => {
              event.currentTarget.style.visibility = "hidden";
            }}
          />
          <div>
            <Mountain size={28} />
            <p>
              Có những ngày,
              <br />
              chỉ muốn ở lại <em>lâu hơn.</em>
            </p>
            <span>Hồ Xuân Hương · Ảnh minh họa</span>
          </div>
        </section>

        <section
          id="map"
          ref={mapRef}
          className="section map-section"
          aria-labelledby="map-title"
        >
          <Reveal className="section-heading">
            <h2 id="map-title">
              Những nơi
              <br />
              <em>mình sẽ đến.</em>
            </h2>
            <p>
              Một điểm hẹn, một món ngon,
              <br />
              một góc Đà Lạt để thương.
            </p>
          </Reveal>
          <MapBoundary locations={locations} onShowActivity={showActivity}>
            {mapReady ? (
              <Suspense
                fallback={
                  <div className="map-loading" role="status">
                    <Compass /> Đang mở bản đồ Đà Lạt…
                  </div>
                }
              >
                <TripMap
                  locations={locations}
                  selectedId={selectedLocation}
                  onSelect={setSelectedLocation}
                  onShowActivity={showActivity}
                />
              </Suspense>
            ) : (
              <div className="map-loading">
                <Compass /> Bản đồ Đà Lạt
              </div>
            )}
          </MapBoundary>
        </section>

        <section
          id="gallery"
          className="section gallery-section"
          aria-labelledby="gallery-title"
        >
          <Reveal className="section-heading">
            <h2 id="gallery-title">
              Đà Lạt,
              <br />
              <em>qua khung hình.</em>
            </h2>
            <p>
              Ảnh điểm đến để chờ ngày lên đường.
              <br />
              Kỷ niệm của chúng mình sẽ đến sau.
            </p>
          </Reveal>
          <Gallery photos={photos} onShowLocation={showLocation} />
        </section>

        <section
          id="packing"
          className="packing-section"
          aria-labelledby="packing-title"
        >
          <div className="section packing-inner">
            <Reveal className="packing-intro">
              <h2 id="packing-title">
                Mang vừa đủ.
                <br />
                <em>Đi thật vui.</em>
              </h2>
              <p>
                Một chiếc áo ấm, đôi giày quen.
                <br />
                Và một chút háo hức.
              </p>
              <div className="packing-illustration">
                <Mountain size={58} strokeWidth={0.75} />
                <span>Hẹn nhau trên cao nguyên.</span>
              </div>
            </Reveal>
            <PackingChecklist />
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-top">
          <a className="brand" href="#top">
            dallas<span className="brand-dot">.</span>
          </a>
          <p>Đi cùng nhau. Nhớ thật lâu.</p>
          <a href="#top" className="text-link">
            Về đầu trang <ArrowRight size={17} className="rotate-up" />
          </a>
        </div>
        <div className="footer-bottom">
          <span>Sài Gòn — Đà Lạt · 29.10 – 02.11.2026</span>
          <span>
            Ảnh minh họa: Wikimedia Commons ·{" "}
            <a href="#photo-credits">Nguồn ảnh</a>
          </span>
        </div>
      </footer>
    </>
  );
}
