import { X } from 'lucide-react';
import type { ShowcaseSlotFormState } from '../api/types';
import {
  SHOWCASE_SECTIONS,
  SHOWCASE_SLOTS,
  showcaseSlotAspectClass,
} from '../constants/showcaseSlots';

interface AdminShowcaseSectionsProps {
  slots: Record<string, ShowcaseSlotFormState>;
  primarySlot: string;
  compressingSlot: string | null;
  onPrimarySlotChange: (slot: string) => void;
  onUpload: (slotKey: string, file: File) => void | Promise<void>;
  onClear: (slotKey: string) => void;
}

function ImageSpecNote({ pixels, ratio, hint }: { pixels: string; ratio: string; hint: string }) {
  return (
    <div className="mt-2 rounded border border-white/10 bg-white/[0.03] px-3 py-2.5 space-y-1">
      <p className="text-[10px] text-white/70">
        <span className="text-white/45 uppercase tracking-wider text-[9px]">Recommended size </span>
        <span className="font-semibold text-pitty-gold">{pixels}</span>
        <span className="text-white/40"> · </span>
        <span>{ratio}</span>
      </p>
      <p className="text-[10px] text-white/40 leading-snug">{hint}</p>
      <p className="text-[9px] text-white/30">
        Format: JPG or PNG · Use the same ratio when cropping. Keep each file under ~500 KB when
        possible (compress before upload) to avoid server size limits.
      </p>
    </div>
  );
}

export default function AdminShowcaseSections({
  slots,
  primarySlot,
  compressingSlot,
  onPrimarySlotChange,
  onUpload,
  onClear,
}: AdminShowcaseSectionsProps) {
  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs uppercase tracking-wider text-white/50">Shop thumbnail</span>
        <p className="text-[11px] text-white/35 mt-1 mb-2">
          Choose which uploaded image is used on product cards in the shop. Model front view
          (1200 × 1600 px) works best.
        </p>
        <select
          value={primarySlot}
          onChange={(e) => onPrimarySlotChange(e.target.value)}
          className="w-full bg-black border border-white/20 px-3 py-2 text-sm focus:border-white outline-none"
        >
          {SHOWCASE_SLOTS.map((slot) => {
            const state = slots[slot.key];
            const hasImage =
              Boolean(state?.preview && !state.clearExisting) || Boolean(state?.pendingFile);
            return (
              <option key={slot.key} value={slot.key} disabled={!hasImage}>
                {slot.label}
                {!hasImage ? ' (empty)' : ''}
              </option>
            );
          })}
        </select>
      </div>

      {SHOWCASE_SECTIONS.map((section) => (
        <div key={section.id} className="border border-white/10 p-4 space-y-3">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-white/80">
              {section.title}
            </h3>
            <p className="text-[11px] text-white/40 mt-1">{section.description}</p>
            <ImageSpecNote {...section.imageSpec} />
          </div>
          <div
            className={`grid gap-3 ${
              section.id === 'macro'
                ? 'grid-cols-2'
                : section.id === 'detail'
                  ? 'grid-cols-1 sm:grid-cols-3'
                  : 'grid-cols-2 sm:grid-cols-4'
            }`}
          >
            {SHOWCASE_SLOTS.filter((slot) => slot.section === section.id).map((slot) => {
              const state = slots[slot.key];
              const showPreview = state?.preview && !state.clearExisting;
              const aspectClass = showcaseSlotAspectClass(section.id);
              const isCompressing = compressingSlot === slot.key;

              return (
                <div key={slot.key} className="border border-white/10 bg-white/[0.02]">
                  <div className="px-2 py-1.5 border-b border-white/10">
                    <p className="text-[9px] uppercase tracking-wider text-white/50">{slot.label}</p>
                    <p className="text-[8px] text-white/30 mt-0.5">{section.imageSpec.pixels}</p>
                  </div>
                  {showPreview ? (
                    <div className="relative">
                      <img
                        src={state.preview!}
                        alt=""
                        className={`w-full ${aspectClass} object-cover bg-pitty-gray`}
                      />
                      <button
                        type="button"
                        onClick={() => onClear(slot.key)}
                        className="absolute top-1 right-1 p-1 bg-black/70 text-white/70 hover:text-red-400"
                        aria-label={`Remove ${slot.label}`}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label
                      className={`flex flex-col items-center justify-center gap-1 ${aspectClass} cursor-pointer hover:bg-white/[0.03] transition-colors px-2 text-center ${
                        isCompressing ? 'pointer-events-none opacity-60' : ''
                      }`}
                    >
                      <span className="text-[10px] text-white/40">
                        {isCompressing ? 'Compressing…' : 'Upload'}
                      </span>
                      <span className="text-[8px] text-white/25 leading-tight">
                        {section.imageSpec.pixels}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={isCompressing}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) void onUpload(slot.key, file);
                          e.target.value = '';
                        }}
                      />
                    </label>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
