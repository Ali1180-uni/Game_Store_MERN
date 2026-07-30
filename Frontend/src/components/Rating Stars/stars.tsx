import { useState } from "react";
import { Star } from "lucide-react";

type StarRatingProps = {
  value: number;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: number;
};

const StarRating = ({ value, onChange, readOnly = false, size = 22 }: StarRatingProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  const displayValue = hovered ?? value;

  return (
    <div
      className="flex items-center gap-1"
      onMouseLeave={() => setHovered(null)}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onClick={() => !readOnly && onChange?.(star)}
          className={`transition-transform ${
            readOnly ? "cursor-default" : "cursor-pointer hover:scale-110"
          }`}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
        >
          <Star
            size={size}
            className="transition-colors"
            fill={star <= displayValue ? "#a78bfa" : "transparent"}
            stroke={star <= displayValue ? "#a78bfa" : "#525252"}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;