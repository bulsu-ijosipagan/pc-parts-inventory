import "./product-card.css"

function ProductCard({ name, eyebrow, description, price, image, tags, accent, onView }) {
  return (
    <article className={`product-card product-card--${accent}`}>
      <div className="product-card__image">
        <img src={image} alt="" loading="lazy" />
        <span>{eyebrow}</span>
      </div>
      <div className="product-card__content">
        <div>
          <h3>{name}</h3>
          <p>{description}</p>
        </div>
        <div className="product-card__details">
          <strong>{price}</strong>
          <button type="button" onClick={onView}>View details <span aria-hidden="true">↗</span></button>
        </div>
        <ul className="product-card__tags" aria-label="Specifications">
          {tags.map((tag) => <li key={tag}>{tag}</li>)}
        </ul>
      </div>
    </article>
  )
}

export default ProductCard
