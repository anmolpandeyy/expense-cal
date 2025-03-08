# ExpenseCal - Design Document

## 1. Design Overview

### 1.1 Design Philosophy
ExpenseCal follows a clean, minimalist design approach with a focus on usability and clarity. The design prioritizes:
- **Simplicity**: Intuitive interfaces with minimal cognitive load
- **Accessibility**: Clear visual hierarchy and readable typography
- **Consistency**: Uniform design patterns throughout the application
- **Mobile-first**: Optimized for touch interactions and smaller screens

### 1.2 Design System
The application uses a cohesive design system with the following components:

#### 1.2.1 Color Palette
- **Primary Colors**:
  - Indigo (`#818cf8`): Used for income-related elements
  - Rose (`#f87171`): Used for expense-related elements
  - Amber (`#fbbf24`): Used for action buttons and highlights
  
- **Neutral Colors**:
  - Slate (`#f8fafc`, `#f1f5f9`, `#e2e8f0`, etc.): Used for backgrounds and subtle elements
  - White (`#ffffff`): Used for card backgrounds and contrast
  
- **Semantic Colors**:
  - Emerald (`#10b981`): Used for positive values and success states
  - Rose (`#f43f5e`): Used for negative values and error states

#### 1.2.2 Typography
- **Font Family**: System fonts (San Francisco on iOS, Roboto on Android)
- **Font Sizes**:
  - Extra Large (24px): For main headings
  - Large (20px): For section headings
  - Medium (16px): For body text
  - Small (14px): For secondary information
  - Extra Small (12px): For tertiary information

#### 1.2.3 Spacing
- Base unit: 4px
- Common spacing values: 4px, 8px, 16px, 24px, 32px, 48px

#### 1.2.4 Iconography
- Simple, recognizable icons for categories
- Consistent icon sizes (24px for UI elements, 40px for category icons)
- Emoji icons for categories to ensure cross-platform compatibility

#### 1.2.5 Components
- **Cards**: Rounded corners (8px), subtle shadows
- **Buttons**: Rounded corners (8px for rectangular, fully rounded for circular)
- **Inputs**: Clear input areas with appropriate padding
- **Lists**: Clean separation between items

## 2. User Interface Design

### 2.1 Main Screen
The main screen is divided into several key sections:

#### 2.1.1 Header
- Month selector with dropdown
- Menu button (hamburger icon)
- Refresh button

#### 2.1.2 Summary Card
- Split design showing income and expenses
- Income section (left): Indigo background, white text
- Expense section (right): Rose background, white text
- Balance indicator in the center

#### 2.1.3 Transaction List
- Grouped by date
- Each date section shows total for that day
- Individual transactions show:
  - Category icon
  - Transaction name/description
  - Amount (color-coded by type)
- Tap interaction to view details

#### 2.1.4 Add Transaction Button
- Floating action button (FAB)
- Positioned at the bottom center
- Amber background with white plus icon

### 2.2 Transaction Form

#### 2.2.1 Header
- Back button
- Title ("Add" or "Edit")
- Date picker button

#### 2.2.2 Transaction Type Selector
- Segmented control (Expenses/Income)
- Color changes based on selection

#### 2.2.3 Category Grid
- 4-column grid of category options
- Each category shows icon and name
- Selected category has subtle highlight

#### 2.2.4 Amount and Description
- Description input field
- Amount display
- Numpad for amount entry
- Calculator operators for basic calculations

#### 2.2.5 Save Button
- Full-width button at bottom
- Changes to "=" during calculations
- Color reflects transaction type

### 2.3 Transaction Details

#### 2.3.1 Header
- Back button
- Title ("Details")
- Delete button

#### 2.3.2 Details Card
- Category icon and name
- Transaction details in list format:
  - Category type
  - Amount
  - Date
  - Description (if available)
- Edit button at bottom

### 2.4 Chart View

#### 2.4.1 Header
- Back button
- Month selector
- Title

#### 2.4.2 Type Selector
- Segmented control (Expenses/Income)
- Color changes based on selection

#### 2.4.3 Chart Section
- Total amount display
- Pie chart visualization
- Empty state for no data

#### 2.4.4 Category Breakdown
- List of categories with:
  - Category icon
  - Name
  - Percentage
  - Amount

### 2.5 Side Menu (Drawer)

#### 2.5.1 User Profile
- User avatar
- Username

#### 2.5.2 Menu Items
- Chart
- Categories
- Export
- Import
- Rate Us
- About

## 3. Interaction Design

### 3.1 Gestures and Interactions
- **Tap**: Primary interaction for buttons and selections
- **Swipe**: Used for navigating between months (future enhancement)
- **Long Press**: Potential for additional options (future enhancement)

### 3.2 Feedback and States
- **Active State**: Subtle highlight on tap
- **Selected State**: Clear visual indication for selected items
- **Disabled State**: Reduced opacity for unavailable options
- **Loading State**: Simple loading indicators where needed

### 3.3 Transitions and Animations
- **Page Transitions**: Simple fade or slide transitions
- **Button Animations**: Subtle scale effect on press
- **Form Transitions**: Smooth transitions between form states

## 4. Responsive Design

### 4.1 Breakpoints
- **Mobile** (320px - 480px): Primary design target
- **Tablet** (481px - 768px): Adjusted layouts with more space
- **Desktop** (769px+): Enhanced layouts with side-by-side views

### 4.2 Adaptation Strategies
- Fluid layouts that adjust to screen width
- Consistent touch targets regardless of screen size
- Optimized spacing for different device sizes

## 5. Accessibility Considerations

### 5.1 Color Contrast
- All text meets WCAG AA standards for contrast
- Important information not conveyed by color alone

### 5.2 Text Sizing
- Text can scale up to 200% without loss of functionality
- Adequate spacing between interactive elements

### 5.3 Screen Readers
- Semantic HTML structure
- Appropriate ARIA labels where needed
- Logical tab order

## 6. Design Assets

### 6.1 Icons and Graphics
- Category icons: Emoji or SVG icons
- UI icons: Lucide icon set
- Empty state illustrations: Simple SVG graphics

### 6.2 Design Specifications
- Component specifications available in the codebase
- Tailwind CSS classes for consistent styling

## 7. Future Design Considerations

### 7.1 Dark Mode
- Alternative color scheme for low-light environments
- Preserved contrast and readability

### 7.2 Theming
- Potential for user-selectable color themes
- Consistent application of theme colors across components

### 7.3 Advanced Visualizations
- Enhanced charts and graphs for financial insights
- Interactive data visualizations 