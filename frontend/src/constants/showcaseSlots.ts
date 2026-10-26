export type ShowcaseSectionId = 'model' | 'detail' | 'flat' | 'macro';

export interface ShowcaseSlotDefinition {
  key: string;
  section: ShowcaseSectionId;
  label: string;
}

export const SHOWCASE_SLOTS: ShowcaseSlotDefinition[] = [
  { key: 'model_0', section: 'model', label: 'Front View' },
  { key: 'model_1', section: 'model', label: 'Right Side View' },
  { key: 'model_2', section: 'model', label: 'Back View' },
  { key: 'model_3', section: 'model', label: 'Left Side View' },
  { key: 'detail_0', section: 'detail', label: 'Front Detail' },
  { key: 'detail_1', section: 'detail', label: 'Back Detail' },
  { key: 'detail_2', section: 'detail', label: 'Product Detail' },
  { key: 'flat_0', section: 'flat', label: 'Front' },
  { key: 'flat_1', section: 'flat', label: 'Back' },
  { key: 'flat_2', section: 'flat', label: 'Side' },
  { key: 'flat_3', section: 'flat', label: 'Detail' },
  { key: 'flat_4', section: 'flat', label: 'Alternate' },
  { key: 'macro_0', section: 'macro', label: 'Premium Fabric' },
  { key: 'macro_1', section: 'macro', label: 'Flatlock Stitching' },
];

export interface ShowcaseImageSpec {
  /** Target export size (width × height in pixels). */
  pixels: string;
  ratio: string;
  hint: string;
}

export const SHOWCASE_SECTIONS: {
  id: ShowcaseSectionId;
  title: string;
  description: string;
  imageSpec: ShowcaseImageSpec;
}[] = [
  {
    id: 'model',
    title: 'Model views',
    description: 'Four full-body angles for the top showcase row.',
    imageSpec: {
      pixels: '1200 × 1600 px',
      ratio: '3∶4 portrait',
      hint: 'Full-body model, head to feet visible, neutral background.',
    },
  },
  {
    id: 'detail',
    title: 'Detail shots',
    description: 'Close-ups shown in the right column on desktop.',
    imageSpec: {
      pixels: '900 × 900 px',
      ratio: '1∶1 square',
      hint: 'Tight crop on logo, strap, waistband, or texture.',
    },
  },
  {
    id: 'flat',
    title: 'Flat / ghost views',
    description: 'Product-only shots for the middle row.',
    imageSpec: {
      pixels: '1000 × 1250 px',
      ratio: '4∶5 portrait',
      hint: 'Flat lay or ghost mannequin, centered product, even padding.',
    },
  },
  {
    id: 'macro',
    title: 'Fabric & stitching',
    description: 'Macro texture shots for the footer row.',
    imageSpec: {
      pixels: '800 × 800 px',
      ratio: '1∶1 square',
      hint: 'Close macro of fabric weave or seam stitching.',
    },
  },
];

const SECTION_ASPECT: Record<ShowcaseSectionId, string> = {
  model: 'aspect-[3/4]',
  detail: 'aspect-square',
  flat: 'aspect-[4/5]',
  macro: 'aspect-square',
};

export function showcaseSlotAspectClass(section: ShowcaseSectionId): string {
  return SECTION_ASPECT[section];
}

export function createEmptyShowcaseSlotState(): Record<
  string,
  { existingImageId?: number; preview: string | null; pendingFile?: File; clearExisting: boolean }
> {
  return Object.fromEntries(
    SHOWCASE_SLOTS.map((slot) => [slot.key, { preview: null, clearExisting: false }]),
  );
}
