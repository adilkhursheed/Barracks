# Developer Guide - Barracks Management System

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm preview

# Start production server
npm start
```

## Project Structure

```
/home/runner/work/Barracks/Barracks/
├── components/           # React components
│   ├── Dashboard.tsx
│   ├── EmployeesTable.tsx
│   ├── AssetsTable.tsx
│   ├── TeamsTable.tsx
│   ├── EmployeeDetail.tsx
│   ├── TeamDetail.tsx
│   ├── AssetDetail.tsx
│   ├── OnboardingListView.tsx
│   ├── OnboardingWizard.tsx
│   ├── Settings.tsx
│   └── Modals.tsx
├── services/            # Service layer
│   └── persistence.ts   # Data persistence service
├── scripts/             # Build and deployment scripts
├── App.tsx              # Main application component
├── types.ts             # TypeScript type definitions
├── constants.tsx        # Application constants and initial data
├── env.ts               # Environment configuration
├── exportUtils.ts       # Export functionality (Excel/PDF)
├── index.tsx            # Application entry point
├── server.js            # Express server for production
├── vite.config.ts       # Vite configuration
└── tsconfig.json        # TypeScript configuration
```

## Key Technologies

### Core Framework
- **React 18.2.0**: UI library with hooks
- **TypeScript 5.3.3**: Static type checking
- **Vite 5.1.0**: Build tool and dev server

### UI Components
- **Lucide React**: Icon library for beautiful icons
- Inline Tailwind-style CSS classes

### Data Management
- **Local Storage**: Client-side persistence
- **Azure Cosmos DB**: Cloud database (optional)

### Export/Import
- **XLSX**: Excel file operations
- **jsPDF**: PDF generation
- **jsPDF-AutoTable**: PDF table formatting

## Available Scripts

### `npm run dev`
Starts the development server with hot module replacement at `http://localhost:5173`

### `npm run build`
- Runs TypeScript type checking (`tsc --noEmit`)
- Builds the production bundle with Vite
- Output to `dist/` directory

### `npm run preview`
Previews the production build locally

### `npm start`
Runs the Express.js server for production deployment

### `npm run azure:deploy`
Builds the application and starts the Azure-compatible server

## Environment Variables

Create a `.env.local` file (copy from `.env.example`):

```env
GEMINI_API_KEY=your_api_key_here
VITE_COSMOS_ENDPOINT=your_cosmos_endpoint
VITE_COSMOS_KEY=your_cosmos_key
VITE_COSMOS_DATABASE=your_database_name
VITE_COSMOS_CONTAINER=your_container_name
```

## TypeScript Types

Main type definitions in `types.ts`:

### Core Enums
- `UserRole`: ADMIN, MANAGER, EMPLOYEE
- `EmploymentStatus`: ACTIVE, ON_LEAVE, TERMINATED
- `AllocationStatus`: AVAILABLE, ASSIGNED, IN_MAINTENANCE
- `AssetType`: LAPTOP, MONITOR, PHONE, DESK, CHAIR, OTHER
- `OnboardingStatus`: NOT_STARTED, IN_PROGRESS, COMPLETED, ON_HOLD

### Core Interfaces
- `Employee`: Employee data structure
- `Asset`: Asset data structure
- `Team`: Team data structure
- `AuditLog`: Audit trail entries
- `TeamAssignment`: Team membership
- `AssetAssignment`: Asset allocation

## Component Architecture

### App.tsx (Main Component)
- Manages global state (employees, assets, teams)
- Routing and view management
- Toast notifications
- Modal management
- Search functionality

### Dashboard
- Overview statistics
- Visual charts and graphs
- Recent activity feed

### Tables (Employees, Assets, Teams)
- Paginated data display
- Sorting and filtering
- Bulk operations
- Quick actions

### Detail Views
- Individual record details
- Edit capabilities
- Related records display
- Action history

### Modals
- Form-based data entry
- Import/export dialogs
- Assignment management

## Data Flow

```
User Action → App Component → State Update → Component Re-render
                ↓
         Persistence Service
                ↓
    Local Storage / Cosmos DB
```

## Styling Approach

The application uses inline className strings with Tailwind CSS utility patterns:

```tsx
<div className="flex items-center gap-4 px-6 py-4 rounded-2xl shadow-xl">
  {/* Content */}
</div>
```

Common patterns:
- Flexbox layouts: `flex`, `items-center`, `justify-between`
- Spacing: `gap-4`, `px-6`, `py-4`, `mt-8`, `mb-4`
- Colors: `bg-blue-600`, `text-slate-700`, `border-slate-200`
- Rounded corners: `rounded-lg`, `rounded-xl`, `rounded-2xl`
- Shadows: `shadow-sm`, `shadow-lg`, `shadow-xl`

## Adding New Features

### 1. Adding a New Entity Type

1. Define types in `types.ts`:
```typescript
export interface NewEntity {
  id: string;
  name: string;
  // ... other fields
}
```

2. Add to `constants.tsx`:
```typescript
export const INITIAL_NEW_ENTITIES: NewEntity[] = [];
```

3. Create component in `components/`:
```typescript
// components/NewEntityTable.tsx
const NewEntityTable: React.FC = () => {
  // Component implementation
};
```

4. Add to `App.tsx` state and routing

### 2. Adding a New View

1. Create component in `components/`
2. Add navigation item in App.tsx
3. Add routing logic
4. Update navigation menu

### 3. Adding Export Format

Edit `exportUtils.ts`:
```typescript
export const exportToNewFormat = (data: any[]) => {
  // Implementation
};
```

## Debugging Tips

### Development Mode
```bash
# Check for TypeScript errors
npx tsc --noEmit

# View console logs in browser DevTools
# React DevTools extension recommended
```

### Common Issues

**Build Errors**
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf .vite`

**Type Errors**
- Run `npx tsc --noEmit` to see all TypeScript errors
- Ensure all imports have proper types

**State Issues**
- Check React DevTools for component state
- Verify persistence service is working

## Testing

Currently, no automated tests exist. To add testing:

```bash
# Install testing libraries
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest

# Create test files
# components/__tests__/Dashboard.test.tsx
```

## Deployment

### Azure App Service
1. Configure environment variables in Azure portal
2. Use `deploy-azure.sh` script
3. Monitor with Azure Application Insights

### Static Hosting
```bash
npm run build
# Deploy dist/ folder to any static host
```

### Docker (Future)
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

## Best Practices

1. **Type Safety**: Always define proper TypeScript types
2. **Component Size**: Keep components focused and small
3. **State Management**: Lift state to appropriate level
4. **Performance**: Use React.memo for expensive components
5. **Accessibility**: Add ARIA labels and keyboard navigation
6. **Error Handling**: Always handle errors gracefully
7. **Code Style**: Use consistent formatting (Prettier recommended)

## Useful Commands

```bash
# Find component usage
grep -r "ComponentName" --include="*.tsx"

# Find TODO items
grep -r "TODO\|FIXME" --include="*.ts" --include="*.tsx"

# Count lines of code
find . -name "*.tsx" -o -name "*.ts" | xargs wc -l

# Check bundle size
npm run build && du -sh dist/
```

## Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Azure Cosmos DB Docs](https://docs.microsoft.com/azure/cosmos-db/)

## Getting Help

- Review existing code and patterns
- Check deployment guides in the repository
- Open an issue for questions or bugs
- Review commit history for context

Happy coding! 🚀
