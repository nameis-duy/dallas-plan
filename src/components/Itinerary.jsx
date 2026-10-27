import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BedDouble,
  Bus,
  ChevronDown,
  Coffee,
  MapPin,
  Moon,
  Sunrise,
  Utensils,
} from "lucide-react";
import { formatDate, formatTime } from "../utils/travel.js";

const dayStories = {
  "2026-10-29": [
    "Rời phố, lên đường.",
    "Một chuyến xe đêm từ Sài Gòn. Đà Lạt đang đợi.",
  ],
  "2026-10-30": [
    "Chào Đà Lạt.",
    "Nhận phòng, nghỉ ngơi, cà phê. Ngày đầu tiên cứ thong thả thôi.",
  ],
  "2026-10-31": [
    "Đi chơi, ăn ngon.",
    "Dinh III, Cao Nguyên Hoa và một buổi tối ở chợ Đà Lạt.",
  ],
  "2026-11-01": [
    "Hẹn với bình minh.",
    "Dậy sớm săn mây trên đồi Đa Phú, rồi ghé những quán quen trong kế hoạch.",
  ],
  "2026-11-02": [
    "Thêm một ly cà phê.",
    "Ngủ nướng, ghé Đậm Cafe, trả phòng và về nhà.",
  ],
};

function activityIcon(title) {
  if (/Cà phê|Cocktail/.test(title)) return Coffee;
  if (/Ăn|Nhậu|Mua bánh/.test(title)) return Utensils;
  if (/Check|ngủ|Nghỉ/i.test(title)) return BedDouble;
  if (/di chuyển|Limousine/.test(title)) return Bus;
  if (/mây|Ò ó o/.test(title)) return Sunrise;
  return MapPin;
}

export default function Itinerary({
  days,
  selectedDay,
  onDayChange,
  selectedActivity,
  locations,
  onShowLocation,
}) {
  const [expanded, setExpanded] = useState(null);
  const tabsRef = useRef(null);
  const reduced = useReducedMotion();
  const index = Math.max(
    0,
    days.findIndex((day) => day.id === selectedDay),
  );
  const day = days[index];
  useEffect(() => {
    setExpanded(selectedActivity || null);
  }, [selectedDay, selectedActivity]);
  useEffect(() => {
    const tabs = tabsRef.current;
    const selected = tabs?.querySelector('[aria-selected="true"]');
    if (tabs && selected) {
      tabs.scrollTo({
        left: selected.offsetLeft - tabs.offsetLeft - 16,
        behavior: "instant",
      });
    }
  }, [selectedDay]);

  function selectByKey(event, tabIndex) {
    let next = tabIndex;
    if (event.key === "ArrowRight") next = (tabIndex + 1) % days.length;
    else if (event.key === "ArrowLeft")
      next = (tabIndex - 1 + days.length) % days.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = days.length - 1;
    else return;
    event.preventDefault();
    onDayChange(days[next].id);
    tabsRef.current.children[next].focus();
  }

  if (!day) return <p>Chưa có lịch trình. Hãy cập nhật dữ liệu chuyến đi.</p>;

  return (
    <>
      <div
        className="day-tabs"
        role="tablist"
        aria-label="Ngày trong hành trình"
        ref={tabsRef}
      >
        {days.map((item, tabIndex) => (
          <button
            key={item.id}
            id={`tab-${item.id}`}
            role="tab"
            type="button"
            aria-selected={item.id === day.id}
            aria-controls={`panel-${item.id}`}
            tabIndex={item.id === day.id ? 0 : -1}
            onClick={() => onDayChange(item.id)}
            onKeyDown={(event) => selectByKey(event, tabIndex)}
          >
            <span>Ngày {tabIndex + 1}</span>
            <strong>{formatDate(item.date)}</strong>
            <small>
              {
                ["Thứ năm", "Thứ sáu", "Thứ bảy", "Chủ nhật", "Thứ hai"][
                  tabIndex
                ]
              }
            </small>
          </button>
        ))}
      </div>
      <div
        className="day-layout"
        id={`panel-${day.id}`}
        role="tabpanel"
        aria-labelledby={`tab-${day.id}`}
        tabIndex={0}
      >
        <aside className="day-intro">
          <div className="day-number">
            {String(index + 1).padStart(2, "0")}
            <span>/ 05</span>
          </div>
          <h3>{dayStories[day.date]?.[0] || formatDate(day.date)}</h3>
          <p>{dayStories[day.date]?.[1]}</p>
          <div className="day-summary">
            <span>{day.activities.length} hoạt động</span>
            <span>
              <Moon size={14} />
              {day.sourceLabel}
            </span>
          </div>
          <div className="day-arrows">
            <button
              className="icon-button"
              aria-label="Ngày trước"
              title="Ngày trước"
              disabled={index === 0}
              onClick={() => onDayChange(days[index - 1].id)}
            >
              <ArrowLeft size={18} />
            </button>
            <button
              className="icon-button"
              aria-label="Ngày tiếp theo"
              title="Ngày tiếp theo"
              disabled={index === days.length - 1}
              onClick={() => onDayChange(days[index + 1].id)}
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </aside>
        <motion.div
          className="timeline"
          key={day.id}
          initial={false}
          animate={reduced ? {} : { opacity: [0.55, 1], y: [8, 0] }}
          transition={{ duration: 0.3 }}
        >
          {day.activities.map((activity, activityIndex) => {
            const Icon = activityIcon(activity.title);
            const open = expanded === activity.id;
            const location = locations.find(
              (item) => item.id === activity.locationId,
            );
            const subtitle =
              activity.place && activity.place !== activity.title
                ? activity.place.split("\n")[0]
                : null;
            return (
              <motion.article
                className={`activity ${open ? "activity-open" : ""}`}
                key={activity.id}
                initial={false}
                whileInView={reduced ? {} : { opacity: [0.8, 1] }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(activityIndex * 0.03, 0.18) }}
              >
                <div className="activity-time">
                  <time>{formatTime(activity)}</time>
                  <span className="timeline-dot" />
                </div>
                <div className="activity-content">
                  <button
                    id={`trigger-${activity.id}`}
                    className="activity-trigger"
                    aria-expanded={open}
                    aria-controls={`detail-${activity.id}`}
                    onClick={() => setExpanded(open ? null : activity.id)}
                  >
                    <span className="activity-icon">
                      <Icon size={18} />
                    </span>
                    <span className="activity-label">
                      <strong>{activity.title}</strong>
                      {subtitle && <span>{subtitle}</span>}
                    </span>
                    <ChevronDown
                      size={18}
                      className={open ? "chevron-open" : ""}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        id={`detail-${activity.id}`}
                        role="region"
                        aria-labelledby={`trigger-${activity.id}`}
                        className="activity-detail"
                        initial={{
                          height: reduced ? "auto" : 0,
                          opacity: reduced ? 1 : 0,
                        }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: reduced ? "auto" : 0, opacity: 0 }}
                        transition={{ duration: reduced ? 0 : 0.25 }}
                      >
                        <div>
                          {activity.place && (
                            <p className="preserve-lines">{activity.place}</p>
                          )}
                          {activity.note && (
                            <p className="activity-note preserve-lines">
                              {activity.note}
                            </p>
                          )}
                          {!activity.time && (
                            <p className="muted">
                              Chưa có giờ cụ thể trong kế hoạch.
                            </p>
                          )}
                          {activity.cost && (
                            <p className="cost">
                              {activity.cost.source}
                              <span>
                                · Theo kế hoạch, chưa xác nhận giá hiện tại
                              </span>
                            </p>
                          )}
                          {location && (
                            <button
                              className="text-link"
                              onClick={() => onShowLocation(location.id)}
                            >
                              <MapPin size={15} />
                              Xem địa điểm <ArrowUpRight size={15} />
                            </button>
                          )}
                          {activity.links
                            .filter((link) => /^https?:/.test(link))
                            .map((link, linkIndex) => (
                              <a
                                className="text-link"
                                href={link}
                                key={link}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {linkIndex
                                  ? `Liên kết ${linkIndex + 1}`
                                  : "Mở Google Maps"}
                                <ArrowUpRight size={15} />
                              </a>
                            ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </>
  );
}
