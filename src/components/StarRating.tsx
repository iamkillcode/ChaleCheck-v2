import { FaStar } from "react-icons/fa";

interface StarRatingProps {
  rating: number;
  setRating: (rating: number) => void;
  editable?: boolean;
}

export default function StarRating({ rating, setRating, editable = true }: StarRatingProps) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <FaStar
            key={index}
            className={`text-2xl cursor-pointer ${
              starValue <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
            onClick={() => editable && setRating(starValue)}
            onMouseEnter={() => editable && setRating(starValue)}
          />
        );
      })}
    </div>
  );
} 