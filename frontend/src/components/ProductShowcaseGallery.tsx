import { Dumbbell, Heart, Mountain, PawPrint } from 'lucide-react';
import type { ProductImage } from '../api/types';
import { LOGO_IMAGE } from '../constants/images';

const MODEL_VIEW_LABELS = ['Front View', 'Right Side View', 'Back View', 'Left Side View'];
const MACRO_LABELS = ['Premium Fabric', 'Flatlock Stitching'];

function buildShowcaseLabels(productName: string) {
  const name = productName.trim() || 'Product';

  return {
    model: MODEL_VIEW_LABELS,
    details: [`${name} — Front Detail`, `${name} — Back Detail`, `${name} — Detail`],
    flat: [
      `${name} (Front)`,
      `${name} (Back)`,
      `${name} (Side)`,
      `${name} (Detail)`,
      `${name} (Alternate)`,
    ],
    macros: MACRO_LABELS,
  };
}

const VALUE_PROPS = [
  { icon: Dumbbell, label: 'Builds Strength' },
  { icon: Heart, label: 'Improves Health' },
  { icon: Mountain, label: 'Chase Goals' },
  { icon: PawPrint, label: 'Be a Better You' },
] as const;

export type ShowcaseCell = { src: string; label: string };

const SLOT_GROUPS = {
  model: ['model_0', 'model_1', 'model_2', 'model_3'],
  details: ['detail_0', 'detail_1', 'detail_2'],
  flat: ['flat_0', 'flat_1', 'flat_2', 'flat_3', 'flat_4'],
  macros: ['macro_0', 'macro_1'],
} as const;

function expandImages(urls: string[], count: number): string[] {
  return Array.from({ length: count }, (_, i) => urls[i % urls.length]);
}

function cellsFromSlots(
  bySlot: Map<string, string>,
  keys: readonly string[],
  labelList: string[],
): ShowcaseCell[] {
  return keys
    .map((key, index) => {
      const src = bySlot.get(key);
      if (!src) return null;
      return { src, label: labelList[index] ?? key };
    })
    .filter((cell): cell is ShowcaseCell => cell !== null);
}

export function partitionShowcaseImages(
  images: ProductImage[],
  productName: string,
): {
  model: ShowcaseCell[];
  details: ShowcaseCell[];
  flat: ShowcaseCell[];
  macros: ShowcaseCell[];
} {
  const labels = buildShowcaseLabels(productName);
  const bySlot = new Map(
    images
      .filter((img) => img.showcase_slot && img.image)
      .map((img) => [img.showcase_slot as string, img.image]),
  );

  if (bySlot.size > 0) {
    return {
      model: cellsFromSlots(bySlot, SLOT_GROUPS.model, labels.model),
      details: cellsFromSlots(bySlot, SLOT_GROUPS.details, labels.details),
      flat: cellsFromSlots(bySlot, SLOT_GROUPS.flat, labels.flat),
      macros: cellsFromSlots(bySlot, SLOT_GROUPS.macros, labels.macros),
    };
  }

  const urls = [...new Set(images.map((img) => img.image).filter(Boolean))];
  if (urls.length === 0) {
    return { model: [], details: [], flat: [], macros: [] };
  }

  const expanded = expandImages(urls, 14);
  return {
    model: expanded.slice(0, 4).map((src, i) => ({ src, label: labels.model[i] })),
    details: expanded.slice(4, 7).map((src, i) => ({ src, label: labels.details[i] })),
    flat: expanded.slice(7, 12).map((src, i) => ({ src, label: labels.flat[i] })),
    macros: expanded.slice(12, 14).map((src, i) => ({ src, label: labels.macros[i] })),
  };
}

type TileVariant = 'model' | 'detail' | 'flat' | 'macro';

function ShowcaseCaption({ label }: { label: string }) {
  return (
    <figcaption className="shrink-0 bg-[#1a1a1a] px-1.5 pt-1.5 pb-2 text-center">
      <div className="mx-auto mb-1.5 h-px w-full max-w-[88%] bg-white/25" aria-hidden />
      <p className="text-[6px] sm:text-[7px] font-medium uppercase tracking-[0.1em] text-white/90 leading-tight line-clamp-2">
        {label}
      </p>
    </figcaption>
  );
}

/** Fills a desktop grid cell; keeps 3∶4 model / 1∶1 detail geometry via the parent grid. */
function DesktopGridTile({ cell }: { cell: ShowcaseCell }) {
  return (
    <figure className="flex h-full min-h-0 flex-col bg-[#2e2e2e]">
      <div className="relative min-h-0 flex-1 overflow-hidden bg-[#3a3a3a]">
        <img
          src={cell.src}
          alt={cell.label}
          className="absolute inset-0 h-full w-full object-contain object-center"
          loading="lazy"
        />
      </div>
      <ShowcaseCaption label={cell.label} />
    </figure>
  );
}

function ShowcaseTile({ cell, variant }: { cell: ShowcaseCell; variant: TileVariant }) {
  const aspectClass =
    variant === 'model'
      ? 'aspect-[3/4]'
      : variant === 'flat'
        ? 'aspect-[4/5]'
        : 'aspect-square';

  const frameClass = `relative w-full ${aspectClass} overflow-hidden bg-[#3a3a3a]`;
  const imagePadding = variant === 'flat' ? 'p-1' : '';

  return (
    <figure className="flex w-full flex-col bg-[#2e2e2e]">
      <div className={frameClass}>
        <img
          src={cell.src}
          alt={cell.label}
          className={`absolute inset-0 h-full w-full object-contain object-center ${imagePadding}`}
          loading="lazy"
        />
      </div>
      <ShowcaseCaption label={cell.label} />
    </figure>
  );
}

function ProductShowcaseTitle({ productName }: { productName: string }) {
  return (
    <h2
      className="mt-3 px-2 text-center text-base font-black uppercase leading-tight tracking-[0.08em] bg-gradient-to-b from-[#f0f0f0] via-[#bdbdbd] to-[#707070] bg-clip-text text-transparent"
      style={{ WebkitBackgroundClip: 'text' }}
    >
      {productName}
    </h2>
  );
}

interface ProductShowcaseGalleryProps {
  productName: string;
  images: ProductImage[];
}

function DesktopShowcase({
  productName,
  model,
  details,
  flat,
  macros,
}: {
  productName: string;
  model: ShowcaseCell[];
  details: ShowcaseCell[];
  flat: ShowcaseCell[];
  macros: ShowcaseCell[];
}) {
  return (
    <div className="hidden lg:block w-full max-w-[1600px] mx-auto bg-[#1a1a1a] p-[2px]">
      {/* Top band: 4× 3∶4 model columns + 3× 1∶1 detail cells, shared height (no extra gap) */}
      {details.length > 0 ? (
        <div className="w-full aspect-[10/3]">
          <div
            className="grid h-full w-full gap-[2px]"
            style={{
              gridTemplateColumns: 'repeat(4, minmax(0, 2.25fr)) minmax(0, 1fr)',
              gridTemplateRows: 'repeat(3, minmax(0, 1fr))',
            }}
          >
            {model.map((cell, index) => (
              <div
                key={cell.label}
                className="min-h-0 h-full"
                style={{ gridColumn: index + 1, gridRow: '1 / span 3' }}
              >
                <DesktopGridTile cell={cell} />
              </div>
            ))}
            {details.map((cell, index) => (
              <div
                key={cell.label}
                className="min-h-0 h-full"
                style={{ gridColumn: 5, gridRow: index + 1 }}
              >
                <DesktopGridTile cell={cell} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-[2px]">
          {model.map((cell) => (
            <ShowcaseTile key={cell.label} cell={cell} variant="model" />
          ))}
        </div>
      )}

      {flat.length > 0 && (
        <div className="mt-[2px] grid grid-cols-5 gap-[2px]">
          {flat.map((cell, index) => (
            <ShowcaseTile key={`${cell.label}-${index}`} cell={cell} variant="flat" />
          ))}
        </div>
      )}

      <div
        className="mt-[2px] grid grid-cols-[minmax(0,1.05fr)_minmax(0,1.35fr)_minmax(0,0.95fr)] gap-[2px] h-[clamp(120px,13vw,160px)]"
      >
        <div className="flex h-full min-h-0 flex-col items-center justify-center bg-[#141414] px-4 py-3">
          <img src={LOGO_IMAGE} alt="Pitty Fit" className="h-9 w-auto shrink-0" />
          <p className="mt-1.5 text-[9px] uppercase tracking-[0.2em] text-white/45">
            Discipline and Consistency
          </p>
          <ProductShowcaseTitle productName={productName} />
        </div>

        <div className="grid h-full grid-cols-4 divide-x divide-white/12 bg-[#141414]">
          {VALUE_PROPS.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center gap-2 px-1 py-2"
            >
              <Icon className="text-white" size={18} strokeWidth={1.15} aria-hidden />
              <p className="text-[6px] font-semibold uppercase tracking-[0.08em] text-white/85 text-center leading-tight">
                {label}
              </p>
            </div>
          ))}
        </div>

        <div className="grid h-full grid-cols-2 gap-[2px]">
          {macros.map((cell, index) => (
            <ShowcaseTile key={`macro-${index}`} cell={cell} variant="macro" />
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileShowcase({
  model,
  details,
  flat,
  macros,
  productName,
}: {
  model: ShowcaseCell[];
  details: ShowcaseCell[];
  flat: ShowcaseCell[];
  macros: ShowcaseCell[];
  productName: string;
}) {
  return (
    <div className="lg:hidden w-full space-y-[2px] bg-[#1a1a1a]">
      <div className="grid grid-cols-2 gap-[2px]">
        {model.map((cell) => (
          <ShowcaseTile key={cell.label} cell={cell} variant="model" />
        ))}
      </div>
      <div className="px-2">
        <div className="mx-auto grid max-w-md grid-cols-3 gap-[2px]">
          {details.map((cell) => (
            <ShowcaseTile key={cell.label} cell={cell} variant="detail" />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-[2px]">
        {flat.map((cell, index) => (
          <ShowcaseTile key={`${cell.label}-${index}`} cell={cell} variant="flat" />
        ))}
      </div>
      <div className="bg-[#141414] px-6 py-6 text-center">
        <img src={LOGO_IMAGE} alt="Pitty Fit" className="h-10 w-auto mx-auto" />
        <ProductShowcaseTitle productName={productName} />
      </div>
      <div className="grid grid-cols-2 gap-[2px]">
        {macros.map((cell, index) => (
          <ShowcaseTile key={`m-${index}`} cell={cell} variant="macro" />
        ))}
      </div>
    </div>
  );
}

export default function ProductShowcaseGallery({ productName, images }: ProductShowcaseGalleryProps) {
  const { model, details, flat, macros } = partitionShowcaseImages(images, productName);

  if (model.length === 0) {
    return (
      <div className="aspect-[4/5] max-h-[50vh] bg-[#2a2a2a] flex items-center justify-center text-white/40 text-sm uppercase tracking-widest">
        No images available
      </div>
    );
  }

  return (
    <>
      <DesktopShowcase
        productName={productName}
        model={model}
        details={details}
        flat={flat}
        macros={macros}
      />
      <MobileShowcase
        productName={productName}
        model={model}
        details={details}
        flat={flat}
        macros={macros}
      />
    </>
  );
}
