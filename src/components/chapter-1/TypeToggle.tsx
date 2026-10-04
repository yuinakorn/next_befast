"use client";

export type StrokeType = "clot" | "bleed";

type Props = {
  value: StrokeType | null;
  onChange: (value: StrokeType) => void;
  captions: Record<StrokeType, string>;
};

/** "ตัน / แตก" switch in chapter 1 step 6: highlights one half of the split scene. */
export function TypeToggle({ value, onChange, captions }: Props) {
  return (
    <div className="type-toggle">
      <div className="type-toggle-buttons" role="group" aria-label="ดูความต่างของสโตรกสองแบบ">
        <button type="button" aria-pressed={value === "clot"} onClick={() => onChange("clot")}>ตัน</button>
        <button type="button" aria-pressed={value === "bleed"} onClick={() => onChange("bleed")}>แตก</button>
      </div>
      <p className="type-toggle-caption" aria-live="polite">{value ? captions[value] : "แตะเพื่อดูทีละแบบ"}</p>
    </div>
  );
}
