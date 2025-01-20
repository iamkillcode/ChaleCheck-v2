import StarRating from "./StarRating";

interface ReviewProps {
  rating: number;
  comment: string;
  user: {
    name: string | null;
    image: string | null;
  };
  date: string;
}

export default function Review({ rating, comment, user, date }: ReviewProps) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        {user.name && (
          <span className="font-medium">{user.name}</span>
        )}
        <span className="text-gray-500 text-sm">
          {new Date(date).toLocaleDateString()}
        </span>
      </div>
      <StarRating rating={rating} setRating={() => {}} editable={false} />
      <p className="mt-2 text-gray-700">{comment}</p>
    </div>
  );
} 