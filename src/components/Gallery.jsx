import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Expand,
  MapPin,
  X,
} from "lucide-react";
import { assetUrl } from "../utils/travel.js";

function Lightbox({ photos, index, onChange, onClose, onShowLocation }) {
  const dialogRef = useRef(null);
  const touchStart = useRef(null);
  const reduced = useReducedMotion();
  const photo = photos[index];

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, []);

  function handleKey(event) {
    if (event.key === "Escape") onClose();
    if (event.key === "ArrowRight") {
      event.preventDefault();
      onChange((index + 1) % photos.length);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      onChange((index - 1 + photos.length) % photos.length);
    }
    if (event.key === "Tab") {
      const controls = [
        ...dialogRef.current.querySelectorAll("button,a[href]"),
      ];
      const first = controls[0];
      const last = controls.at(-1);
      if (
        event.shiftKey &&
        (document.activeElement === first ||
          document.activeElement === dialogRef.current)
      ) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
  }

  return createPortal(
    <motion.div
      className="lightbox-backdrop"
      initial={{ opacity: reduced ? 1 : 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0 : 0.2 }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Thư viện ảnh Đà Lạt"
        tabIndex={-1}
        className="lightbox"
        onKeyDown={handleKey}
      >
        <div className="lightbox-top">
          <span>Đà Lạt qua khung hình</span>
          <span>
            {index + 1} / {photos.length}
          </span>
          <button
            className="icon-button"
            aria-label="Đóng ảnh"
            title="Đóng ảnh"
            onClick={onClose}
          >
            <X />
          </button>
        </div>
        <div
          className="lightbox-photo"
          onTouchStart={(event) => {
            touchStart.current = event.touches[0].clientX;
          }}
          onTouchEnd={(event) => {
            if (touchStart.current === null) return;
            const delta = event.changedTouches[0].clientX - touchStart.current;
            if (Math.abs(delta) > 45)
              onChange(
                (index + (delta < 0 ? 1 : -1) + photos.length) % photos.length,
              );
            touchStart.current = null;
          }}
        >
          <img
            key={photo.id}
            src={assetUrl(photo.src)}
            alt={photo.alt}
            onError={(event) => {
              event.currentTarget.alt = `Không tải được ảnh: ${photo.caption}`;
            }}
          />
        </div>
        <div className="lightbox-caption" aria-live="polite">
          <div>
            <h3>{photo.caption}</h3>
            <p>
              Ảnh minh họa · {photo.credit} · {photo.license}
            </p>
            <a href={photo.sourceUrl} target="_blank" rel="noreferrer">
              Nguồn ảnh <ArrowUpRight size={13} />
            </a>
            {photo.locationId && (
              <button
                className="text-link"
                onClick={() => {
                  onClose();
                  onShowLocation(photo.locationId);
                }}
              >
                <MapPin size={14} />
                Xem địa điểm
              </button>
            )}
          </div>
          <div className="lightbox-arrows">
            <button
              className="icon-button"
              aria-label="Ảnh trước"
              title="Ảnh trước"
              onClick={() =>
                onChange((index - 1 + photos.length) % photos.length)
              }
            >
              <ArrowLeft />
            </button>
            <button
              className="icon-button"
              aria-label="Ảnh tiếp theo"
              title="Ảnh tiếp theo"
              onClick={() => onChange((index + 1) % photos.length)}
            >
              <ArrowRight />
            </button>
          </div>
        </div>
      </div>
    </motion.div>,
    document.body,
  );
}

export default function Gallery({ photos, onShowLocation }) {
  const [activeIndex, setActiveIndex] = useState(null);
  return (
    <>
      <div className="photo-grid">
        {photos.map((photo, index) => (
          <figure key={photo.id} className={`photo-tile photo-tile-${index}`}>
            <button
              className="photo-button"
              aria-label={`Mở ảnh: ${photo.caption}`}
              onClick={() => setActiveIndex(index)}
            >
              <img
                src={assetUrl(photo.src)}
                alt={photo.alt}
                loading="lazy"
                width={photo.width}
                height={photo.height}
                onError={(event) => {
                  event.currentTarget.style.visibility = "hidden";
                }}
              />
              <span className="photo-expand">
                <Expand size={18} />
              </span>
            </button>
            <figcaption>
              <span>{photo.caption}</span>
              <span>Ảnh minh họa</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <details className="photo-credits" id="photo-credits">
        <summary>Nguồn ảnh & giấy phép</summary>
        <p>
          Ảnh điểm đến từ Wikimedia Commons, không phải ảnh chuyến đi cá nhân.
          Thung Lũng Vàng và hồ Xuân Hương là ảnh bối cảnh, không được thêm vào
          lịch trình.
        </p>
        {photos.map((photo) => (
          <p key={photo.id}>
            <a href={photo.sourceUrl} target="_blank" rel="noreferrer">
              {photo.caption}
            </a>{" "}
            · {photo.credit} ·{" "}
            <a href={photo.licenseUrl} target="_blank" rel="noreferrer">
              {photo.license}
            </a>
            . Cắt khung khi hiển thị.
          </p>
        ))}
      </details>
      <AnimatePresence>
        {activeIndex !== null && (
          <Lightbox
            photos={photos}
            index={activeIndex}
            onChange={setActiveIndex}
            onClose={() => setActiveIndex(null)}
            onShowLocation={onShowLocation}
          />
        )}
      </AnimatePresence>
    </>
  );
}
