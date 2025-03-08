# ExpenseCal - Technical Specification

## 1. Architecture Overview

### 1.1 System Architecture
ExpenseCal is a client-side web application built with Next.js, following a component-based architecture. The application runs entirely in the browser with no backend server requirements, using local storage for data persistence.

### 1.2 Technology Stack
- **Framework**: Next.js 14 (React)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand with persist middleware
- **Data Visualization**: Chart.js with react-chartjs-2
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Build Tool**: Next.js built-in tooling

### 1.3 Key Technical Decisions

#### 1.3.1 Next.js
Next.js was chosen for its excellent developer experience, built-in optimizations, and future-proofing capabilities. While the current application is client-side only, Next.js provides a path to server-side rendering and API routes if needed in the future.

#### 1.3.2 TypeScript
TypeScript provides type safety and better developer tooling, reducing runtime errors and improving code maintainability.

#### 1.3.3 Zustand
Zustand was selected for state management due to its simplicity, small bundle size, and built-in persistence capabilities. It provides a more straightforward approach compared to Redux while still offering powerful state management features.

#### 1.3.4 Local Storage
The application uses browser local storage for data persistence, allowing users to maintain their data between sessions without requiring a backend server.

## 2. Component Structure

### 2.1 Component Hierarchy
```
App
├── Layout
│   ├── Header
│   │   ├── MonthSelector
│   │   └── Navigation
│   └── Main Content
│       ├── Summary
│       ├── TransactionList
│       ├── TransactionDetails
│       ├── AddTransactionForm
│       ├── ExpenseChart
│       └── Drawer
```

### 2.2 Key Components

#### 2.2.1 Page Components
- **Home**: Main page component that orchestrates the application flow
- **Layout**: Provides the overall structure and common elements

#### 2.2.2 Shared Components
- **MonthSelector**: Allows users to select the month and year
- **Summary**: Displays income, expenses, and balance for the selected month
- **TransactionList**: Shows a list of transactions grouped by date
- **TransactionDetails**: Displays detailed information about a transaction
- **ExpenseChart**: Visualizes expense breakdown by category
- **Drawer**: Side menu for navigation and additional options

#### 2.2.3 Form Components
- **AddTransactionForm**: Form for adding or editing transactions

#### 2.2.4 UI Components
- **Button**: Reusable button component with various styles
- **Input**: Text input component
- **Select**: Dropdown selection component
- **Modal**: Modal dialog component

## 3. Data Model

### 3.1 Core Data Types

#### 3.1.1 Transaction
```typescript
type TransactionType = 'income' | 'expense';

type Transaction = {
  id: string;
  amount: number;
  description: string;
  date: string; // ISO string
  categoryId: string;
  type: TransactionType;
};
```

#### 3.1.2 Category
```typescript
type Category = {
  id: string;
  name: string;
  icon: string;
  type: TransactionType;
};
```

#### 3.1.3 MonthData
```typescript
type MonthData = {
  income: number;
  expenses: number;
  balance: number;
  transactions: Transaction[];
};
```

### 3.2 State Management

#### 3.2.1 App State
```typescript
type AppState = {
  currentMonth: string; // Format: 'YYYY-MM'
  categories: Category[];
  transactions: Transaction[];
  
  // Derived data
  monthlyData: Record<string, MonthData>;
  
  // Actions
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  updateTransaction: (id: string, transaction: Partial<Omit<Transaction, 'id'>>) => void;
  setCurrentMonth: (month: string) => void;
  
  // Import/Export
  exportData: () => string;
  importData: (data: string) => void;
};
```

#### 3.2.2 State Updates
- State updates are handled through Zustand actions
- All state modifications are immutable
- Derived data is recalculated when relevant state changes

### 3.3 Data Persistence
- Application state is persisted to local storage using Zustand's persist middleware
- Data is automatically saved when state changes
- Data is loaded from local storage on application startup

## 4. Key Functionality Implementation

### 4.1 Transaction Management

#### 4.1.1 Adding Transactions
- User inputs are collected through the AddTransactionForm
- Form data is validated client-side
- New transaction is added to the state with a generated ID
- Monthly data is recalculated to include the new transaction

#### 4.1.2 Editing Transactions
- Existing transaction data is loaded into the form
- User modifies the data as needed
- Updated transaction replaces the original in the state
- Monthly data is recalculated with the updated transaction

#### 4.1.3 Deleting Transactions
- User confirms deletion from the transaction details view
- Transaction is removed from the state
- Monthly data is recalculated without the deleted transaction

### 4.2 Financial Calculations

#### 4.2.1 Monthly Summaries
- Transactions are filtered by month
- Income and expenses are calculated separately
- Balance is computed as income minus expenses

#### 4.2.2 Category Breakdowns
- Transactions are grouped by category
- Totals and percentages are calculated for each category
- Data is formatted for visualization in charts

### 4.3 Data Visualization

#### 4.3.1 Pie Chart
- Category data is transformed into chart.js format
- Colors are assigned to different categories
- Chart is rendered using react-chartjs-2

### 4.4 Data Import/Export

#### 4.4.1 Export
- Application state is serialized to JSON
- JSON data is converted to a downloadable blob
- File is offered to the user for download

#### 4.4.2 Import
- User selects a JSON file
- File is read and parsed
- Data is validated for correct format
- Valid data replaces the current application state

## 5. Client-Side Rendering Considerations

### 5.1 Hydration Strategy
- Initial state is rendered with placeholders
- Client-side hydration is managed with useEffect hooks
- Components use isMounted state to prevent hydration mismatches

### 5.2 Performance Optimizations
- Memoization of expensive calculations
- Lazy loading of non-critical components
- Efficient re-rendering with React's memo and useMemo

## 6. Testing Strategy

### 6.1 Unit Testing
- Component testing with React Testing Library
- State management testing with isolated store instances
- Utility function testing with Jest

### 6.2 Integration Testing
- Testing component interactions
- Testing state updates through user interactions
- Testing data persistence

### 6.3 End-to-End Testing
- Testing complete user flows
- Testing data persistence across sessions
- Testing import/export functionality

## 7. Deployment

### 7.1 Build Process
- TypeScript compilation
- Next.js production build
- Static HTML export

### 7.2 Hosting Options
- Static site hosting (Vercel, Netlify, GitHub Pages)
- No server-side requirements
- CDN distribution for optimal performance

### 7.3 CI/CD
- Automated testing on pull requests
- Automated builds on merge to main
- Automated deployments to staging/production

## 8. Future Technical Considerations

### 8.1 Backend Integration
- API routes for data synchronization
- User authentication and authorization
- Server-side rendering for improved SEO

### 8.2 Performance Enhancements
- Web workers for heavy calculations
- Service workers for offline functionality
- IndexedDB for larger datasets

### 8.3 Advanced Features
- Data synchronization across devices
- Push notifications for budget alerts
- Progressive Web App capabilities 