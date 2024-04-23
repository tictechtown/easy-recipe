type Props = {
  ratingValue: number;
  ratingCount: string;
};

export default function Ratings(props: Props) {
  const { ratingValue, ratingCount } = props;

  return (
    <div className="flex flex-row gap-2 justify-content">
      <div className="rating rating-md rating-half">
        <input
          type="radio"
          name="rating-10"
          className="mask mask-star-2 bg-orange-400 mask-half-1"
          readOnly
          checked={ratingValue == 5}
        />

        <input
          type="radio"
          name="rating-10"
          className="mask mask-star-2 bg-orange-400 mask-half-2"
          readOnly
          checked={ratingValue == 10}
        />
        <input
          type="radio"
          name="rating-10"
          className="mask mask-star-2 bg-orange-400 mask-half-1"
          readOnly
          checked={ratingValue == 15}
        />

        <input
          type="radio"
          name="rating-10"
          className="mask mask-star-2 bg-orange-400 mask-half-2"
          readOnly
          checked={ratingValue == 20}
        />
        <input
          type="radio"
          name="rating-10"
          className="mask mask-star-2 bg-orange-400 mask-half-1"
          readOnly
          checked={ratingValue == 25}
        />

        <input
          type="radio"
          name="rating-10"
          className="mask mask-star-2 bg-orange-400 mask-half-2"
          readOnly
          checked={ratingValue == 30}
        />
        <input
          type="radio"
          name="rating-10"
          className="mask mask-star-2 bg-orange-400 mask-half-1"
          readOnly
          checked={ratingValue == 35}
        />

        <input
          type="radio"
          name="rating-10"
          className="mask mask-star-2 bg-orange-400 mask-half-2"
          readOnly
          checked={ratingValue == 40}
        />
        <input
          type="radio"
          name="rating-10"
          className="mask mask-star-2 bg-orange-400 mask-half-1"
          readOnly
          checked={ratingValue == 45}
        />

        <input
          type="radio"
          name="rating-10"
          className="mask mask-star-2 bg-orange-400 mask-half-2"
          readOnly
          checked={ratingValue == 50}
        />
      </div>
      ({ratingCount})
    </div>
  );
}
