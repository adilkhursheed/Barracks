<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Barracks Management System

A comprehensive employee, asset, and team management system built with React, TypeScript, and modern web technologies.

**View in AI Studio**: https://ai.studio/apps/drive/1WZ2wu7x_j3zamOzDZ2Qk9HR8n7-DHIps

## 🌟 Features

- **Employee Management**: Track employee information, status, and assignments
- **Asset Tracking**: Monitor and allocate organizational assets
- **Team Organization**: Create and manage teams with member assignments
- **Onboarding Workflows**: Structured employee onboarding process
- **Dashboard Analytics**: Visual insights and statistics
- **Import/Export**: Excel and PDF data export capabilities
- **Cloud Integration**: Azure Cosmos DB support for data persistence

📖 See [FEATURES.md](FEATURES.md) for a complete feature overview.

## 🚀 Quick Start

**Prerequisites**: Node.js (v16 or higher)

1. **Clone the repository**
   ```bash
   git clone https://github.com/adilkhursheed/Barracks.git
   cd Barracks
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment** (optional)
   ```bash
   cp .env.example .env.local
   # Edit .env.local and add your GEMINI_API_KEY and Azure Cosmos DB credentials
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📚 Documentation

- **[DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)** - Complete development guide with architecture details
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - How to contribute to this project
- **[FEATURES.md](FEATURES.md)** - Detailed feature documentation
- **[AZURE_DEPLOYMENT.md](AZURE_DEPLOYMENT.md)** - Azure deployment instructions

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Express.js, Node.js
- **Database**: Azure Cosmos DB (optional), Local Storage
- **Export**: XLSX, jsPDF
- **Icons**: Lucide React
- **Deployment**: Azure App Service, Static Hosting

## 📦 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm start            # Run production server
npm run azure:deploy # Build and deploy to Azure
```

## 🤝 Contributing

We welcome contributions! Whether you want to:

- 🐛 Fix bugs
- ✨ Add new features
- 📚 Improve documentation
- 🎨 Enhance UI/UX
- 🧪 Add tests
- 🔒 Improve security

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to get started.

## 📝 What Can You Do?

This system helps you:

- **HR Teams**: Manage employee records and onboarding
- **IT Departments**: Track asset allocation and inventory
- **Team Leads**: Organize project teams and resources
- **Administrators**: Monitor organizational metrics and activities

For developers, you can:

- Add new features and integrations
- Improve existing functionality
- Enhance the user interface
- Add testing infrastructure
- Optimize performance
- Improve accessibility

See [CONTRIBUTING.md](CONTRIBUTING.md) for a complete list of contribution opportunities.

## 🚢 Deployment

### Azure App Service
```bash
bash deploy-azure.sh
```

### Static Hosting
```bash
npm run build
# Deploy the dist/ folder to any static host (Netlify, Vercel, etc.)
```

See [AZURE_DEPLOYMENT.md](AZURE_DEPLOYMENT.md) for detailed deployment instructions.

## 📄 License

This project is available for use and modification. Please check with the repository owner for specific licensing terms.

## 🙏 Acknowledgments

Built with modern web technologies and best practices for enterprise management systems.

---

**Need Help?** Check out the [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) or open an issue!
