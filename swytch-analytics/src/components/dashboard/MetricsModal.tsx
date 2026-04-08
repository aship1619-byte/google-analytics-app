"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

const ALL_METRICS = [
  { key: "users", label: "Visitors" },
  { key: "newUsers", label: "New Visitors" },
  { key: "sessions", label: "Sessions" },
  { key: "pageViews", label: "Page Views" },
  { key: "bounceRate", label: "Bounce Rate" },
  { key: "avgSessionDuration", label: "Avg Session Duration" },
  { key: "customerActions", label: "Customer Actions" },
  { key: "conversionRate", label: "Conversion Rate" },
];

type MetricsModalProps = {
  isOpen: boolean;
  onCloseAction: () => void;
  onSaveAction: (metrics: string[]) => void;
  currentSelection: string[];
};

export default function MetricsModal({ isOpen, onCloseAction, onSaveAction, currentSelection }: MetricsModalProps) {
  const [selected, setSelected] = useState<string[]>(currentSelection.length > 0 ? currentSelection : ["users", "newUsers", "customerActions", "conversionRate"]);

  // Reset selected state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelected(currentSelection.length > 0 ? currentSelection : ["users", "newUsers", "customerActions", "conversionRate"]);
    }
  }, [isOpen, currentSelection]);

  const toggle = (key: string) => {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onCloseAction} title="Customize Metrics">
      <div className="space-y-3">
        {ALL_METRICS.map(({ key, label }) => (
          <label key={key} className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={selected.includes(key)}
              onChange={() => toggle(key)}
              className="w-4 h-4 accent-[#1B3A6B]"
            />
            <span className="text-sm text-[#1A1814]">{label}</span>
          </label>
        ))}
        <div className="flex justify-end pt-2">
          <Button onClick={() => { onSaveAction(selected); onCloseAction(); }} disabled={selected.length === 0}>
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
}