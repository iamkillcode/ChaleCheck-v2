import StarRating from "./StarRating";

export default function Review({ rating, comment, user, date }) {
  return (
    <div className="border rounded-lg p-4">
      <StarRating rating={rating} setRating={() => {}} editable={false} />
      <p className="mt-2">{comment}</p>
      {/* ... other review details */}
    </div>
  );
} 