# ExpenseCal - Expense Calculator

A mobile-first web application for tracking personal expenses and income with a clean, intuitive interface.

## Overview

ExpenseCal is designed to help users track their personal finances by recording and categorizing income and expenses. The application provides a simple, intuitive interface for managing financial transactions and visualizing spending patterns.

## Features

1. **Transaction Management**
   - Add expenses or income transactions
   - Choose from predefined categories with icons
   - Enter amount with calculator functionality
   - Add descriptions and select dates for transactions
   - Edit and delete existing transactions

2. **Financial Overview**
   - Monthly summary showing total income vs expenses
   - Running balance calculation
   - Visual representation of income/expense ratio
   - Transaction list grouped by date

3. **Data Visualization**
   - Pie chart showing expense breakdown by category
   - Category-wise expense listing with percentages
   - Color-coded representation of different categories

4. **Time Period Management**
   - Default view of current month
   - Ability to switch between months and years
   - Transaction list filtered by selected month

5. **Data Management**
   - Export financial data (JSON format)
   - Import previously exported data
   - Local storage for offline functionality

## Design Principles

ExpenseCal follows a clean, minimalist design approach with a focus on:

- **Simplicity**: Intuitive interfaces with minimal cognitive load
- **Accessibility**: Clear visual hierarchy and readable typography
- **Consistency**: Uniform design patterns throughout the application
- **Mobile-first**: Optimized for touch interactions and smaller screens

### Color Scheme

- **Primary Colors**:
  - Indigo: Used for income-related elements
  - Rose: Used for expense-related elements
  - Amber: Used for action buttons and highlights

## Tech Stack

- **Framework**: Next.js 14 (React)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand with persist middleware
- **UI Components**: Shadcn/ui
- **Data Visualization**: Chart.js with react-chartjs-2
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Data Storage**: Local Storage (for MVP)

## Project Structure

```
ExpenseCal/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── providers/
├── components/
│   ├── ui/
│   ├── forms/
│   └── shared/
├── lib/
│   ├── store/
│   ├── utils/
│   └── types/
├── public/
│   └── icons/
└── styles/
```

## Key Components

- **Summary**: Displays income, expenses, and balance for the selected month
- **TransactionList**: Shows a list of transactions grouped by date
- **TransactionDetails**: Displays detailed information about a transaction
- **AddTransactionForm**: Form for adding or editing transactions
- **ExpenseChart**: Visualizes expense breakdown by category
- **MonthSelector**: Allows users to select the month and year

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Development Phases

1. **Phase 1**: Setup & Basic Structure
   - Project initialization with Next.js
   - Component structure setup
   - Basic styling with Tailwind CSS

2. **Phase 2**: Core Features
   - Transaction management implementation
   - Financial calculations
   - State management with Zustand

3. **Phase 3**: UI/UX
   - Responsive design implementation
   - Interactive components
   - Data visualization

4. **Phase 4**: Data Management
   - Local storage implementation
   - Import/export functionality
   - Data validation

5. **Phase 5**: Testing & Refinement
   - Unit and integration testing
   - Performance optimization
   - Bug fixes and polish

## Future Enhancements

1. **User Authentication**
   - User accounts with secure login
   - Cloud synchronization across devices

2. **Budget Planning**
   - Setting monthly budgets by category
   - Budget vs actual spending comparison
   - Alerts for budget overruns

3. **Reports and Analytics**
   - Advanced financial reports
   - Spending trend analysis
   - Year-over-year comparisons

4. **Recurring Transactions**
   - Setting up recurring income/expenses
   - Automatic transaction creation

5. **Dark Mode**
   - Alternative color scheme for low-light environments 