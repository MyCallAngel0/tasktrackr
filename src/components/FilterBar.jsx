import { useState } from 'react';
import { endOfWeek, endOfMonth, addWeeks, startOfWeek } from 'date-fns';

const FilterBar = ({ setFilter }) => {
  const today = new Date();
  const filters = [
    { label: 'Today', value: 'today' },
    { label: 'This Week', value: 'thisWeek' },
    { label: 'Next Week', value: 'nextWeek' },
    { label: 'This Month', value: 'thisMonth' },
    { label: 'All', value: 'all' },
  ];

  const [selectedFilter, setSelectedFilter] = useState('all');

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    switch (filter) {
      case 'today':
        setFilter({
          start: today,
          end: today,
        });
        break;
      case 'thisWeek':
        setFilter({
          start: today,
          end: endOfWeek(today, { weekStartsOn: 1 }),
        });
        break;
      case 'nextWeek':
        setFilter({
          start: startOfWeek(addWeeks(today, 1), { weekStartsOn: 1 }),
          end: endOfWeek(addWeeks(today, 1), { weekStartsOn: 1 }),
        });
        break;
      case 'thisMonth':
        setFilter({
          start: today,
          end: endOfMonth(today),
        });
        break;
      case 'all':
      default:
        setFilter(null);
        break;
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => handleFilterChange(filter.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            selectedFilter === filter.value
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;