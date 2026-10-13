import { useMemo, useRef, useState } from "react"
import "./index.css"
import Navbar from "./components/Navbar/Navbar"
import ProductCard from "./components/ProductCard/ProductCard"

const HERO_VISUAL =
  "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1200&q=85"

const categories = ["All parts", "Graphics", "Processors", "Motherboards", "Cooling"]

const products = [
  {
    id: 1,
    name: "RTX 4080 SUPER",
    category: "Graphics",
    eyebrow: "Graphics card",
    description: "A high-refresh powerhouse for 4K gaming, creative work, and real-time 3D.",
    price: "₱75,000",
    image:
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=900&q=85",
    tags: ["16GB GDDR6X", "320W", "PCIe 4.0"],
    accent: "violet",
  },
  {
    id: 2,
    name: "Ryzen 9 7950X",
    category: "Processors",
    eyebrow: "Desktop processor",
    description: "16-core Zen 4 performance built for demanding renders, edits, and multitasking.",
    price: "₱44,500",
    image:
      "https://images.unsplash.com/photo-1555617981-dac3880eac6e?auto=format&fit=crop&w=900&q=85",
    tags: ["16 cores", "5.7GHz boost", "AM5"],
    accent: "orange",
  },
  {
    id: 3,
    name: "Z790 Creator",
    category: "Motherboards",
    eyebrow: "ATX motherboard",
    description: "A creator-ready foundation with fast storage, stable power, and next-gen expansion.",
    price: "₱28,200",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=85",
    tags: ["DDR5", "Wi-Fi 6E", "PCIe 5.0"],
    accent: "cyan",
  },
  {
    id: 4,
    name: "Aurora 360 Loop",
    category: "Cooling",
    eyebrow: "Liquid cooler",
    description: "Quiet, efficient cooling with a clean glass-ready finish for modern builds.",
    price: "₱12,800",
    image:
      "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=900&q=85",
    tags: ["360mm", "ARGB", "Tri-fan"],
    accent: "green",
  },
  {
    id: 5,
    name: "Vengeance DDR5 Kit",
    category: "Processors",
    eyebrow: "Memory kit",
    description: "Fast, low-latency memory for fluid creative workflows and responsive gaming.",
    price: "₱9,600",
    image:
      "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=900&q=85",
    tags: ["32GB", "6000MT/s", "CL30"],
    accent: "blue",
  },
  {
    id: 6,
    name: "Blackout Gen 4 SSD",
    category: "Motherboards",
    eyebrow: "NVMe storage",
    description: "Compact, reliable storage for fast boots, quick project loads, and large libraries.",
    price: "₱8,400",
    image:
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=900&q=85",
    tags: ["2TB", "7,400MB/s", "Gen 4"],
    accent: "pink",
  },
]

function App() {
  const [activeCategory, setActiveCategory] = useState("All parts")
  const [search, setSearch] = useState("")
  const [selectedProduct, setSelectedProduct] = useState(null)
  const productsRef = useRef(null)

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase()
    return products.filter((product) => {
      const matchesCategory = activeCategory === "All parts" || product.category === activeCategory
      const matchesSearch =
        !query ||
        `${product.name} ${product.category} ${product.description} ${product.tags.join(" ")}`
          .toLowerCase()
          .includes(query)
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, search])

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <>
      <Navbar onNavigateProducts={scrollToProducts} />

      <main>
        <section className="showcase-hero">
          <div className="showcase-hero__content">
            <p className="eyebrow">The component edit / 2026</p>
            <h1>Hardware worth building around.</h1>
            <p className="lede">
              A visual catalog of standout PC parts for gaming, creation, and everything in between.
              Explore the pieces, compare the details, and find your next upgrade.
            </p>
            <button className="button button--primary" type="button" onClick={scrollToProducts}>
              Explore the collection <span aria-hidden="true">↘</span>
            </button>
          </div>
          <div className="showcase-hero__visual">
            <div className="showcase-hero__orb" />
            <img src={HERO_VISUAL} alt="Close-up view of a performance PC graphics card" />
            <span className="showcase-hero__label">01 / Featured hardware</span>
          </div>
        </section>

        <section className="catalog-section" id="products" ref={productsRef}>
          <div className="section-heading">
            <div>
              <p className="eyebrow">Curated components</p>
              <h2>Browse the collection</h2>
            </div>
            <p className="section-heading__count">
              {filteredProducts.length.toString().padStart(2, "0")} pieces
            </p>
          </div>

          <div className="catalog-toolbar">
            <div className="category-tabs" role="tablist" aria-label="Filter by component type">
              {categories.map((category) => (
                <button
                  className={activeCategory === category ? "is-active" : ""}
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={activeCategory === category}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
            <label className="search-field">
              <span className="sr-only">Search parts</span>
              <span aria-hidden="true">⌕</span>
              <input
                type="search"
                placeholder="Search parts"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
          </div>

          <div className="products-grid" aria-live="polite">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} {...product} onView={() => setSelectedProduct(product)} />
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <p className="empty-state">No parts match that search. Try another component or keyword.</p>
          )}
        </section>

        <section className="manifesto-section" id="about">
          <p className="eyebrow">Why this catalog exists</p>
          <h2>Good builds start with good choices.</h2>
          <p>
            No checkout noise. No complicated configurators. Just a focused place to discover the
            parts that make a build feel considered.
          </p>
        </section>
      </main>

      {selectedProduct && (
        <div className="product-modal-backdrop" role="presentation" onClick={() => setSelectedProduct(null)}>
          <article
            className="product-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="product-modal__close"
              type="button"
              aria-label="Close product details"
              onClick={() => setSelectedProduct(null)}
            >
              ×
            </button>
            <img src={selectedProduct.image} alt="" />
            <div>
              <p className="eyebrow">{selectedProduct.eyebrow}</p>
              <h2 id="product-modal-title">{selectedProduct.name}</h2>
              <p>{selectedProduct.description}</p>
              <div className="product-modal__footer">
                <strong>{selectedProduct.price}</strong>
                <span>{selectedProduct.tags.join(" · ")}</span>
              </div>
            </div>
          </article>
        </div>
      )}
    </>
  )
}

export default App
