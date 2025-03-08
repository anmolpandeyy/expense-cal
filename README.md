# ExpenseCal - Expense Calculator

A mobile-first web application for tracking personal expenses and income.

## Features

1. **Transaction Management**
   - Add expenses or income
   - Choose from predefined categories
   - Enter amount and description for each transaction

2. **Financial Overview**
   - Monthly summary showing total income vs expenses
   - Running balance calculation
   - Visual representation of income/expense ratio

3. **Time Period Management**
   - Default view of current month
   - Ability to switch between months
   - Transaction list filtered by selected month

4. **Data Management**
   - Export financial data (JSON/CSV format)
   - Import previously exported data
   - Local storage for offline functionality

## Tech Stack

- **Frontend**: Next.js 14 (React framework)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **UI Components**: Shadcn/ui
- **Icons**: Lucide Icons
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

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Development Phases

1. **Phase 1**: Setup & Basic Structure
2. **Phase 2**: Core Features
3. **Phase 3**: UI/UX
4. **Phase 4**: Data Management
5. **Phase 5**: Testing & Refinement 