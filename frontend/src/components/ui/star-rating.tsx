import * as React from "react";
import { FullStarIcon } from "@/components/icons/full-star-icon";
import { HollowStarIcon } from "@/components/icons/hollow-star-icon";
import { cn } from "@/lib/utils";

interface RatingStarsProps extends React.ComponentProps<"div"> {
  rating: number;
  max?: number;
}

function RatingStars({ rating, max=5, className, children, ...props }: RatingStarsProps) {
    return(
        <div 
            data-slot="rating"
            className={cn(`flex gap-2 items-center`, className)} {...props}
        >
            {Array.from({ length: max }).map((_, i) =>
            i < rating ? <FullStarIcon key={i} /> : <HollowStarIcon key={i} />
      )}
        </div>
    )
}



export const StarRating = {
  Stars: RatingStars
}
