# Task: Build CMLRE Marine Data Platform

## Plan
- [x] Step 1: Project Structure Analysis and Setup
  - [x] Analyze requirements and design references
  - [x] Call required MCP tools (api_match, get_pre_code_requirements)
  - [x] Scan project structure
  - [x] Read key configuration files
- [x] Step 2: Design System and Theme Configuration
  - [x] Create marine-themed color system (deep ocean blue, cyan/turquoise accents)
  - [x] Update index.css with design tokens
  - [x] Configure tailwind.config.js
- [x] Step 3: Database Schema and Supabase Setup
  - [x] Initialize Supabase
  - [x] Create database schema (users, datasets, uploads, metadata)
  - [x] Set up authentication with role-based access
  - [x] Create storage buckets for images and data files
  - [x] Configure RLS policies
- [x] Step 4: Core Components Development
  - [x] Create layout components (Header, Sidebar, Footer)
  - [x] Build reusable UI components (charts, cards, data tables)
  - [x] Implement authentication components (Login, Register)
  - [x] Create file upload components
- [x] Step 5: Page Implementation
  - [x] Home page with platform overview
  - [x] Features page with capability showcase
  - [x] Visualizations page with interactive dashboards
  - [x] Dashboard page for personalized data views
  - [x] API documentation page
  - [x] About page with CMLRE information
  - [x] Admin panel for user management
- [x] Step 6: Data Integration Features
  - [x] Data upload functionality (CSV, Excel, JSON, images)
  - [x] Data validation and processing
  - [x] Metadata management
- [x] Step 7: Visualization Features
  - [x] Interactive charts (bar, pie, radar, line)
  - [x] Tabbed visualization interface (Biodiversity, Fisheries, Oceanography, Climate Impact)
  - [x] Custom filters and export functionality
- [x] Step 8: AI Features (Placeholder UI)
  - [x] Fish species identification interface
  - [x] Otolith image analysis interface
  - [x] eDNA analysis interface
  - [x] Correlation analysis interface
- [x] Step 9: Testing and Validation
  - [x] Run npm run lint and fix issues
  - [x] Test all features and navigation
  - [x] Verify authentication and authorization
  - [x] Test file uploads and data processing

## Notes
- Application name: CMLRE Marine Data Platform
- Design reference: "Samudra Setu" with deep ocean blue theme
- Authentication: Role-based (Scientists, Policymakers, Data administrators, Guest users)
- Key features: Data upload, interactive visualizations, AI analysis, species identification
- Database: Supabase with RLS policies
- File storage: Supabase Storage for images and data files
- No external APIs available
- Aesthetic template search failed - will create custom marine theme

## Important Information
- **First registered user automatically becomes admin**
- Admin users can manage other users' roles through the Admin Panel
- Username format: letters, numbers, and underscores only
- Password minimum length: 6 characters
- Email verification is disabled for easier testing
- Public routes: Home, Features, Visualizations, API, About, Login, Register
- Protected routes: Dashboard, Admin (admin only)

## Database Schema
- profiles: User information with role-based access
- datasets: Marine datasets (oceanographic, fish_survey, otolith_image, edna, species_data)
- species: Marine species catalog with 5 sample species
- fish_identifications: AI-powered fish identification records
- oceanographic_data: Ocean parameters (temperature, salinity, pH, oxygen, currents)
- fish_survey_data: Fish population and distribution data
- Storage buckets: marine_images (public), datasets (authenticated)

## Sample Species in Database
1. Thunnus albacares (Yellowfin Tuna)
2. Katsuwonus pelamis (Skipjack Tuna)
3. Sardinella longiceps (Indian Oil Sardine)
4. Rastrelliger kanagurta (Indian Mackerel)
5. Scomberomorus commerson (Narrow-barred Spanish Mackerel)
