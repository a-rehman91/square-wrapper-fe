import { useState } from "react";
import type { MenuItemDto } from "../types";
import { formatPrice } from "../lib/menu";

interface Props {
  item: MenuItemDto;
}

const DESCRIPTION_LIMIT = 100;

export function MenuItemCard({ item }: Props) {
  const [expanded, setExpanded] = useState(false);
  const isLong = item.description.length > DESCRIPTION_LIMIT;
  const shownDescription =
    isLong && !expanded
      ? `${item.description.slice(0, DESCRIPTION_LIMIT)}...`
      : item.description;

  return (
    <article className="menuCard">
      <div className="menuImageWrap">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="menuImage" />
        ) : (
          <div className="menuImagePlaceholder">No image</div>
        )}
      </div>
      <div className="menuContent">
        <h3>{item.name}</h3>
        <p className="description">
          {shownDescription || "No description"}
          {isLong && (
            <button
              type="button"
              className="textButton"
              onClick={() => setExpanded((value) => !value)}
            >
              {expanded ? " Read less" : " Read more"}
            </button>
          )}
        </p>
        {item.variations.length > 1 ? (
          <p className="variationLine">
            {item.variations
              .map((variation) => `${variation.name} ${formatPrice(variation.priceCents)}`)
              .join(" · ")}
          </p>
        ) : (
          <p className="price">{formatPrice(item.variations[0]?.priceCents ?? null)}</p>
        )}
      </div>
    </article>
  );
}
