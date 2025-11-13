# 🚌 BLR Transit - Bangalore Traffic Solution

## Solving Bangalore's Traffic Crisis with Smart Public Transport

BLR Transit is a comprehensive web platform that visualizes Bangalore's traffic crisis and proposes data-driven solutions through optimized public transport systems. Built with Next.js, TypeScript, and modern web technologies.

![BLR Transit](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-14.0.4-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)

## 🌟 Features

### 📊 **Real-Time Traffic Analytics**
- Interactive data visualizations showing Bangalore's traffic patterns
- Heat maps displaying congestion across major IT corridors
- Time-based traffic flow analysis
- Economic impact metrics (₹20,000 crores annually lost)

### 🗺️ **Interactive Bangalore Map**
- Live traffic visualization using OpenStreetMap/Leaflet
- 21 residential areas and 11 major IT hubs mapped
- Commuter flow patterns between residential and work areas
- Real-time congestion indicators

### 💰 **Smart Transport Calculator**
- Cost comparison across 9 transport modes (BMTC, Metro, Ola/Uber, Auto, etc.)
- Real-time fare calculations with peak hour adjustments
- Monthly expense projections
- Environmental impact assessment
- Personalized recommendations based on user preferences (cost/time/comfort/eco)

### 📈 **Comprehensive Data Dashboard**
- Vehicle growth vs road infrastructure trends
- Modal split analysis
- Time distribution patterns
- Success stories from MoveInSync, ORRCA, Routematic
- Infrastructure project timelines

### 📱 **Mobile-First Responsive Design**
- Optimized for all devices (phones, tablets, desktops)
- Touch-friendly interfaces
- Progressive Web App capabilities
- Fast loading with optimized performance

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0 or higher
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/peersclub/blr-transit.git

# Navigate to project directory
cd blr-transit

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🛠️ Tech Stack

- **Frontend Framework:** Next.js 14.0.4
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Maps:** Leaflet with react-leaflet
- **Charts:** Recharts
- **Animations:** Framer Motion
- **Icons:** Lucide React

## 📂 Project Structure

```
bangalore-traffic-solution/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Homepage
│   ├── transport/         # Transport calculator page
│   └── it-hubs/          # IT hubs information page
├── components/
│   ├── sections/          # Page sections (Hero, DataViz, etc.)
│   ├── transport/         # Transport-related components
│   └── map/              # Map components
├── lib/
│   └── data/             # Data files and utilities
│       ├── trafficData.ts
│       ├── bangaloreLocations.ts
│       └── transportationRoutes.ts
├── public/               # Static assets
└── styles/              # Global styles
```

## 📊 Key Statistics

- **3rd worst traffic globally** (TomTom 2024)
- **11.8 million vehicles** in Bangalore
- **132 hours** lost annually per driver
- **₹20,000 crores** economic impact
- **17.6 km/h** average speed

## 🗂️ Available Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with traffic overview and solutions |
| `/transport` | Smart transport calculator and comparison tools |
| `/it-hubs` | Detailed IT hub information with map |

## 🔧 Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Type checking
npm run type-check
```

## 📈 Transport Modes Analyzed

1. **BMTC Ordinary Bus** - Most economical
2. **BMTC Volvo AC** - Comfortable public transport
3. **Namma Metro** - Fastest during peak hours
4. **Ola/Uber** - Door-to-door convenience
5. **Auto Rickshaw** - Quick short distances
6. **Rapido Bike** - Navigate through traffic
7. **Company Shuttle** - Corporate transport
8. **Personal Vehicle** - Maximum flexibility

## 🌍 Environmental Impact

- **37% CO₂ reduction** possible with public transport adoption
- **2.8 million liters** daily fuel waste
- **80,000 cars** can be replaced daily with efficient bus services

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Traffic data from TomTom Traffic Index 2024
- Bangalore vehicle registration data from RTO Karnataka
- OpenStreetMap contributors
- BMTC and Namma Metro for transport data

## 📧 Contact

Project Link: [https://github.com/peersclub/blr-transit](https://github.com/peersclub/blr-transit)

---

**Built with ❤️ for Bangalore** - *Transforming commutes, one route at a time*