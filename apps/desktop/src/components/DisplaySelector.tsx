import { useEffect, useState } from "react";

export type DisplayInfo = {
  id: number;

  index: number;

  label: string;

  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };

  size: {
    width: number;
    height: number;
  };
};

export function DisplaySelector() {
  const [displays, setDisplays] = useState<DisplayInfo[]>([]);

  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    window.displayAPI
      .list()
      .then((items) => {
        setDisplays(items);

        if (items.length > 0) {
          setSelected(items[0].id);
        }
      })
      .catch(console.error);
  }, []);

  async function changeDisplay(id: number) {
    await window.displayAPI.select(id);

    setSelected(id);
  }

  if (displays.length === 0) {
    return null;
  }

  return (
    <section className="display-card">
      <h2>表示ディスプレイ</h2>

      <div className="display-list">
        {displays.map((display) => (
          <label
            key={display.id}
            className={
              selected === display.id ? "display-item selected" : "display-item"
            }
          >
            <input
              type="radio"
              name="display"
              value={display.id}
              checked={selected === display.id}
              onChange={() => changeDisplay(display.id)}
            />

            <div>
              <strong>{display.label}</strong>

              <p>
                {display.size.width}×{display.size.height}
              </p>
            </div>
          </label>
        ))}
      </div>
    </section>
  );
}
