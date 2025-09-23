import { cn } from "@/lib/utils";
import { FullStarIcon } from "../icons/full-star-icon";
import { HollowStarIcon } from "../icons/hollow-star-icon";

interface RatingStarsProps extends Omit<React.ComponentProps<"div">, "onChange"> {
  rating: number;
  max?: number;
  onRatingChange?: (value: number) => void;
  readonly?: boolean;
}

export const StarRating = ({
  rating,
  onRatingChange,
  readonly = false,
  max = 5,
  className,
  ...props
}: RatingStarsProps) => {
  return (
    <div className={cn("flex gap-2 items-center", className)} {...props}>
      {Array.from({ length: max }).map((_, i) => {
        const value = i + 1;
        const filled = i < rating;

        return (
          <button
            key={i}
            type="button"
            disabled={readonly}
            onClick={() => !readonly && onRatingChange?.(value)}
            className={cn(
              "size-6 flex items-center justify-center",
              readonly ? "cursor-default" : "cursor-pointer"
            )}
          >
            {filled ? <FullStarIcon /> : <HollowStarIcon />}
          </button>
        );
      })}
    </div>
  );
};
