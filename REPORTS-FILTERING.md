# Reports Filtering Feature

This document explains the new filtering functionality added to the Reports page.

## Overview

The Reports page now includes filtering capabilities that allow users to filter the team statistics and visualizations by:

- **Team**: Filter reports to show data for a specific team
- **Role**: Filter reports to show data for people with a specific role
- **Seniority**: Filter reports to show data for people with a specific seniority level

## Features

### 1. **Interactive Filters**
- **Show/Hide Filters**: Toggle button to show or hide the filter controls
- **Real-time Updates**: Reports update immediately when filters are applied
- **Active Filter Tags**: Visual indicators showing currently active filters
- **Clear All Filters**: Quick action to remove all active filters

### 2. **Filter Options**
- **Team Filter**: Dropdown with all available teams
- **Role Filter**: Dropdown with all available roles
- **Seniority Filter**: Dropdown with all seniority levels (JR I, JR II, SSR I, SSR II, SR I, SR II)

### 3. **Dynamic Statistics**
- **Total People**: Updates to show count of people matching the filters
- **Role Distribution**: Shows role distribution within the filtered dataset
- **Seniority Distribution**: Shows seniority distribution within the filtered dataset
- **Team Distribution**: Shows team distribution within the filtered dataset

## Implementation Details

### Components Added

1. **`ReportsFilters` Component** (`/src/components/reports-filters.tsx`)
   - Handles the filter UI and state management
   - Communicates filter changes to parent component
   - Shows active filters and provides clear functionality

2. **`ReportsContent` Component** (`/src/components/reports-content.tsx`)
   - Client-side component that manages the filtered data
   - Handles loading states during filter operations
   - Renders the charts and statistics with filtered data

### Service Updates

**`ReportsService.getTeamStats()` Method**
- Now accepts optional `filters` parameter
- Filters the people dataset before calculating statistics
- Returns filtered statistics for all three categories (role, seniority, team)

### Usage Example

```typescript
// Get all reports (no filters)
const allReports = await ReportsService.getTeamStats();

// Filter by team
const teamFiltered = await ReportsService.getTeamStats({ 
  selectedTeam: "Frontend Team" 
});

// Filter by role
const roleFiltered = await ReportsService.getTeamStats({ 
  selectedRole: "Frontend" 
});

// Filter by seniority
const seniorityFiltered = await ReportsService.getTeamStats({ 
  selectedSeniority: "SR I" 
});

// Combined filters
const combinedFiltered = await ReportsService.getTeamStats({ 
  selectedTeam: "Frontend Team",
  selectedRole: "Frontend",
  selectedSeniority: "SR I"
});
```

## User Experience

### How to Use the Filters

1. **Navigate to Reports Page**: Go to `/reports`
2. **Show Filters**: Click the "Show Filters" button
3. **Select Filters**: Choose from the dropdown menus:
   - Team: Select a specific team or "All Teams"
   - Role: Select a specific role or "All Roles"
   - Seniority: Select a specific seniority level or "All Seniorities"
4. **View Results**: The charts and statistics update automatically
5. **Clear Filters**: Click "Clear all filters" to reset to show all data

### Visual Indicators

- **Filter Pills**: Active filters are shown as colored pills below the filter controls
- **Loading State**: A loading overlay appears while filtering is in progress
- **Updated Statistics**: All four summary cards update to reflect the filtered data
- **Dynamic Charts**: All three distribution charts update with filtered data

## Technical Details

### Architecture

The filtering system uses a hybrid approach:
- **Server-side Initial Load**: The page loads with all data server-side
- **Client-side Filtering**: Filter operations happen client-side for better performance
- **Data Fetching**: Fresh data is fetched when filters change

### Performance Considerations

- **Efficient Filtering**: Multiple filters are applied in a single pass
- **Minimal Re-renders**: Only relevant components re-render when filters change
- **Loading States**: User feedback during filter operations

### Error Handling

- **Graceful Degradation**: If filtering fails, the previous data is maintained
- **Error Logging**: Errors are logged to the console for debugging
- **User Feedback**: Loading states prevent user confusion during operations

## Future Enhancements

Potential improvements that could be added:

1. **Search Functionality**: Add text search within filtered results
2. **Date Range Filters**: Filter by hire date or other time-based criteria
3. **Multiple Selection**: Allow selecting multiple teams/roles/seniorities
4. **Save Filter Presets**: Allow users to save and load common filter combinations
5. **Export Filtered Data**: Export filtered results to CSV or other formats
6. **Advanced Statistics**: Additional metrics for filtered datasets
7. **Filter History**: Navigation between recent filter states

## Testing

The filtering functionality has been tested with:
- Empty datasets
- Single filter applications
- Multiple filter combinations
- Filter clearing operations
- Real-time updates

A test script is available at `/test-reports-filtering.js` for programmatic testing.
