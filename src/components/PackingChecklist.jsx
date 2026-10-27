import { useEffect, useRef, useState } from "react";
import { Check, Plus, RotateCcw, Trash2 } from "lucide-react";
import packing from "../data/packing.json";
import { parsePackingState, storageKey } from "../utils/packing.js";

const starterIds = packing.categories.flatMap((category) =>
  category.items.map((item) => item.id),
);

export default function PackingChecklist() {
  const [state, setState] = useState(() => {
    try {
      return parsePackingState(localStorage.getItem(storageKey), starterIds);
    } catch {
      return parsePackingState(null, starterIds);
    }
  });
  const [storageError, setStorageError] = useState(false);
  const [newItem, setNewItem] = useState("");
  const [resetOpen, setResetOpen] = useState(false);
  const resetRef = useRef(null);
  const count = state.checked.length;
  const total = starterIds.length + state.custom.length;
  const percent = total ? Math.round((count / total) * 100) : 0;

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [state]);

  useEffect(() => {
    const sync = (event) => {
      if (event.key === storageKey || event.key === null)
        setState(parsePackingState(event.newValue, starterIds));
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  function toggle(id) {
    setState((previous) => ({
      ...previous,
      checked: previous.checked.includes(id)
        ? previous.checked.filter((item) => item !== id)
        : [...previous.checked, id],
    }));
  }

  function renderItems(items, custom = false) {
    return items.map((item) => (
      <div className="packing-item" key={item.id}>
        <label>
          <input
            type="checkbox"
            checked={state.checked.includes(item.id)}
            onChange={() => toggle(item.id)}
          />
          <span className="custom-check" aria-hidden="true">
            {state.checked.includes(item.id) && <Check size={13} />}
          </span>
          <span>{item.label}</span>
        </label>
        {custom && (
          <button
            className="icon-button"
            aria-label={`Xóa ${item.label}`}
            title={`Xóa ${item.label}`}
            onClick={() =>
              setState((previous) => ({
                ...previous,
                custom: previous.custom.filter((entry) => entry.id !== item.id),
                checked: previous.checked.filter((id) => id !== item.id),
              }))
            }
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>
    ));
  }

  return (
    <div className="packing-checklist">
      <div className="packing-progress-heading">
        <span>Hành trang của bạn</span>
        <strong aria-live="polite">
          {count}
          <span> / {total} món</span>
        </strong>
      </div>
      <div
        className="packing-progress"
        role="progressbar"
        aria-label="Tiến độ chuẩn bị"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <span style={{ width: `${percent}%` }} />
      </div>
      <p className="packing-disclaimer">
        Danh sách gợi ý, không có trong bảng lịch trình. Đã chuẩn bị {count},
        còn {total - count} món.
      </p>
      <div className="packing-categories">
        {packing.categories.map((category) => (
          <fieldset key={category.id}>
            <legend>{category.name}</legend>
            {renderItems(category.items)}
          </fieldset>
        ))}
        {state.custom.length > 0 && (
          <fieldset>
            <legend>Thêm cho riêng mình</legend>
            {renderItems(state.custom, true)}
          </fieldset>
        )}
      </div>
      <form
        className="packing-add"
        onSubmit={(event) => {
          event.preventDefault();
          const label = newItem.trim();
          if (!label || state.custom.length >= 100) return;
          setState((previous) => ({
            ...previous,
            custom: [
              ...previous.custom,
              { id: `custom-${crypto.randomUUID()}`, label },
            ],
          }));
          setNewItem("");
        }}
      >
        <label className="sr-only" htmlFor="packing-new">
          Thêm đồ cần mang
        </label>
        <input
          id="packing-new"
          value={newItem}
          onChange={(event) => setNewItem(event.target.value)}
          maxLength={120}
          placeholder="Thêm đồ cần mang…"
        />
        <button
          className="icon-button"
          aria-label="Thêm vào hành trang"
          title="Thêm vào hành trang"
          disabled={!newItem.trim() || state.custom.length >= 100}
        >
          <Plus size={19} />
        </button>
      </form>
      <div className="packing-bottom">
        <span>
          {storageError
            ? "Không thể lưu trên trình duyệt này. Tiến độ chỉ còn trong phiên hiện tại."
            : "Lưu trên trình duyệt này, không đồng bộ thiết bị."}
        </span>
        <button
          className="text-link"
          ref={resetRef}
          onClick={() => setResetOpen(!resetOpen)}
          aria-expanded={resetOpen}
        >
          <RotateCcw size={14} />
          Bỏ chọn tất cả
        </button>
      </div>
      {resetOpen && (
        <div
          className="reset-confirm"
          role="group"
          aria-label="Xác nhận bỏ chọn"
        >
          <p>
            Bỏ chọn tất cả món đã chuẩn bị? Các món bạn thêm vẫn được giữ lại.
          </p>
          <button
            className="button button-green"
            onClick={() => {
              setState((previous) => ({ ...previous, checked: [] }));
              setResetOpen(false);
              resetRef.current?.focus();
            }}
          >
            Bỏ chọn tất cả
          </button>
          <button
            className="text-link"
            onClick={() => {
              setResetOpen(false);
              resetRef.current?.focus();
            }}
          >
            Hủy
          </button>
        </div>
      )}
    </div>
  );
}
