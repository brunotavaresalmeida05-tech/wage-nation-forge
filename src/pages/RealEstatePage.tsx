import { useState } from "react";
import { motion } from "framer-motion";
import PropertyCard, { Property } from "../components/PropertyCard";

const PROPERTIES: Property[] = [
  // North America
  { id: "RE-001-NYC", name: "Manhattan Penthouse — Upper East", type: "Luxury", location: "New York", region: "North America", price: 50000, dailyYield: 400, rarity: "unique", emoji: "🏙️", condoFee: 15 },
  { id: "RE-002-MIA", name: "Brickell Tower Suite", type: "Residential", location: "Miami, FL", region: "North America", price: 8000, dailyYield: 48, rarity: "epic", emoji: "🌴", condoFee: 2.5 },
  { id: "RE-003-LA", name: "Beverly Hills Estate", type: "Luxury", location: "Los Angeles, CA", region: "North America", price: 35000, dailyYield: 280, rarity: "legendary", emoji: "🏡", condoFee: 10 },
  { id: "RE-004-SF", name: "SOMA Tech Office", type: "Commercial", location: "San Francisco, CA", region: "North America", price: 12000, dailyYield: 72, rarity: "epic", emoji: "🏢", condoFee: 4 },
  { id: "RE-005-CHI", name: "Loop District Condo", type: "Residential", location: "Chicago, IL", region: "North America", price: 2500, dailyYield: 15, rarity: "rare", emoji: "🏠", condoFee: 0.8 },
  { id: "RE-006-TOR", name: "Yorkville Luxury Flat", type: "Residential", location: "Toronto, Canada", region: "North America", price: 5000, dailyYield: 30, rarity: "rare", emoji: "🏠", condoFee: 1.5 },
  
  // Europe
  { id: "RE-010-LDN", name: "Mayfair Townhouse", type: "Luxury", location: "London, UK", region: "Europe", price: 45000, dailyYield: 360, rarity: "unique", emoji: "🏰", condoFee: 12 },
  { id: "RE-011-PAR", name: "Champs-Élysées Apartment", type: "Luxury", location: "Paris, France", region: "Europe", price: 30000, dailyYield: 240, rarity: "legendary", emoji: "🗼", condoFee: 8 },
  { id: "RE-012-ZUR", name: "Bahnhofstrasse Office", type: "Prime", location: "Zürich, Switzerland", region: "Europe", price: 20000, dailyYield: 160, rarity: "legendary", emoji: "🏦", condoFee: 6 },
  { id: "RE-013-BCN", name: "Eixample Boutique Hotel", type: "Hospitality", location: "Barcelona, Spain", region: "Europe", price: 10000, dailyYield: 60, rarity: "epic", emoji: "🏨", condoFee: 3 },
  { id: "RE-014-BER", name: "Mitte Co-Working Hub", type: "Commercial", location: "Berlin, Germany", region: "Europe", price: 4000, dailyYield: 24, rarity: "rare", emoji: "🏢", condoFee: 1.2 },
  { id: "RE-015-AMS", name: "Canal District Studio", type: "Residential", location: "Amsterdam, Netherlands", region: "Europe", price: 3000, dailyYield: 18, rarity: "rare", emoji: "🏠", condoFee: 0.9 },
  
  // Asia-Pacific
  { id: "RE-020-TOK", name: "Shibuya Crossing Tower", type: "Mixed-Use", location: "Tokyo, Japan", region: "Asia-Pacific", price: 40000, dailyYield: 320, rarity: "unique", emoji: "🏯", condoFee: 10 },
  { id: "RE-021-SGP", name: "Marina Bay Penthouse", type: "Luxury", location: "Singapore", region: "Asia-Pacific", price: 25000, dailyYield: 200, rarity: "legendary", emoji: "🌃", condoFee: 7 },
  { id: "RE-022-HKG", name: "Victoria Peak Residence", type: "Luxury", location: "Hong Kong", region: "Asia-Pacific", price: 38000, dailyYield: 304, rarity: "legendary", emoji: "🌆", condoFee: 10 },
  { id: "RE-023-SYD", name: "Harbour Bridge Apartment", type: "Residential", location: "Sydney, Australia", region: "Asia-Pacific", price: 6000, dailyYield: 36, rarity: "epic", emoji: "🏠", condoFee: 2 },
  { id: "RE-024-SEL", name: "Gangnam District Office", type: "Commercial", location: "Seoul, South Korea", region: "Asia-Pacific", price: 7000, dailyYield: 42, rarity: "epic", emoji: "🏢", condoFee: 2.2 },
  
  // Middle East
  { id: "RE-030-DXB", name: "Burj Khalifa Suite", type: "Luxury", location: "Dubai, UAE", region: "Middle East", price: 55000, dailyYield: 440, rarity: "unique", emoji: "🕌", condoFee: 18 },
  { id: "RE-031-DXB2", name: "Palm Jumeirah Villa", type: "Hospitality", location: "Dubai, UAE", region: "Middle East", price: 18000, dailyYield: 144, rarity: "legendary", emoji: "🏖️", condoFee: 5 },
  
  // Industrial & Data Centers
  { id: "RE-040-TX", name: "Texas Data Center", type: "Data Center", location: "Austin, TX", region: "North America", price: 15000, dailyYield: 120, rarity: "epic", emoji: "🖥️", condoFee: 5 },
  { id: "RE-041-VA", name: "Virginia Server Farm", type: "Data Center", location: "Ashburn, VA", region: "North America", price: 22000, dailyYield: 176, rarity: "legendary", emoji: "🖥️", condoFee: 7 },
  { id: "RE-042-DET", name: "Industrial Warehouse Complex", type: "Industrial", location: "Detroit, MI", region: "North America", price: 3500, dailyYield: 21, rarity: "rare", emoji: "🏭", condoFee: 1 },
  
  // Entry-level
  { id: "RE-050-ATL", name: "Midtown Studio Apartment", type: "Residential", location: "Atlanta, GA", region: "North America", price: 500, dailyYield: 3, rarity: "common", emoji: "🏠", condoFee: 0.15 },
  { id: "RE-051-LIS", name: "Suburban Flat", type: "Residential", location: "Lisbon, Portugal", region: "Europe", price: 250, dailyYield: 1.2, rarity: "common", emoji: "🏠", condoFee: 0.1 },
  { id: "RE-052-BKK", name: "Sukhumvit Condo", type: "Residential", location: "Bangkok, Thailand", region: "Asia-Pacific", price: 300, dailyYield: 1.8, rarity: "common", emoji: "🏠", condoFee: 0.1 },
];

const TYPE_FILTERS = ["All", "Residential", "Commercial", "Luxury", "Hospitality", "Prime", "Mixed-Use", "Industrial", "Data Center"];
const REGION_FILTERS = ["All Regions", "North America", "Europe", "Asia-Pacific", "Middle East"];

const RealEstatePage = () => {
  const [typeFilter, setTypeFilter] = useState("All");
  const [regionFilter, setRegionFilter] = useState("All Regions");

  const filtered = PROPERTIES.filter(p => {
    const typeMatch = typeFilter === "All" || p.type === typeFilter;
    const regionMatch = regionFilter === "All Regions" || p.region === regionFilter;
    return typeMatch && regionMatch;
  });

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-5xl mx-auto px-4 lg:px-6 py-4 lg:py-6 space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="font-display font-bold text-xl lg:text-2xl">🏢 Real Estate</h1>
          <span className="text-xs bg-secondary px-2 py-1 rounded-full font-body text-muted-foreground">{PROPERTIES.length} properties</span>
        </div>

        {/* Portfolio Stats */}
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { label: "Properties", value: "3", icon: "🏠" },
            { label: "Rent/day", value: "3.6 $W", icon: "💰" },
            { label: "Total Value", value: "1,230 $W", icon: "📊" },
          ].map((s) => (
            <div key={s.label} className="card-clean p-3 text-center">
              <span className="text-lg">{s.icon}</span>
              <p className="text-sm font-display font-bold mt-0.5">{s.value}</p>
              <p className="text-[10px] text-muted-foreground font-body">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Pending Rent */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card-clean border-primary/30 border-2 bg-primary/5 p-4 flex items-center justify-between"
        >
          <div>
            <p className="text-xs text-muted-foreground font-body">Pending Rent</p>
            <p className="text-xl font-display font-bold text-primary">7.2 $WAGE</p>
            <p className="text-[10px] text-muted-foreground font-body">Accrued over 2 days</p>
          </div>
          <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm tap-shrink">
            Collect 💰
          </button>
        </motion.div>

        {/* Region Filter */}
        <div>
          <p className="text-[10px] text-muted-foreground font-body uppercase tracking-wider mb-2">Region</p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {REGION_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setRegionFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-body whitespace-nowrap tap-shrink ${
                  regionFilter === f ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Type Filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {TYPE_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setTypeFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-body whitespace-nowrap tap-shrink border ${
                typeFilter === f ? "bg-primary text-primary-foreground border-primary" : "bg-transparent text-muted-foreground border-border"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((property, i) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <PropertyCard property={property} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RealEstatePage;
