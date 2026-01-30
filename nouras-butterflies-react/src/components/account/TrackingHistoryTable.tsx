import React from 'react';
import type { TrackingEvent } from '../../types/account';

interface TrackingHistoryTableProps {
  events: TrackingEvent[];
  timezone?: string;
}

export const TrackingHistoryTable: React.FC<TrackingHistoryTableProps> = ({
  events,
  timezone = 'UTC',
}) => {
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    };
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'out for delivery':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'in transit':
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'picked up':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'check_circle';
      case 'out for delivery':
        return 'delivery_dining';
      case 'in transit':
      case 'shipped':
        return 'local_shipping';
      case 'processing':
        return 'pending';
      case 'picked up':
        return 'inventory_2';
      default:
        return 'info';
    }
  };

  if (events.length === 0) {
    return (
      <div className="text-center py-8">
        <span className="material-symbols-rounded text-4xl text-gray-300 mb-3">history</span>
        <p className="text-gray-500">No tracking events available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((event, index) => {
              const { date, time } = formatDateTime(event.timestamp);
              const isLatest = index === 0;

              return (
                <tr
                  key={event.id}
                  className={`
                    ${isLatest ? 'bg-pink-50' : 'hover:bg-gray-50'}
                    transition-colors duration-200
                  `}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">{date}</div>
                      <div className="text-gray-500">{time}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{event.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`
                        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                        ${getStatusColor(event.status)}
                      `}
                    >
                      <span className="material-symbols-rounded text-xs mr-1">
                        {getStatusIcon(event.status)}
                      </span>
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{event.description}</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Timeline View */}
      <div className="lg:hidden">
        <div className="p-4">
          {events.map((event, index) => {
            const { date, time } = formatDateTime(event.timestamp);
            const isLatest = index === 0;

            return (
              <div
                key={event.id}
                className={`
                  relative pl-8 pb-6 last:pb-0
                  ${isLatest ? 'bg-pink-50 -mx-4 px-4 py-3 rounded-lg mb-3' : ''}
                `}
              >
                {/* Timeline Line */}
                {index < events.length - 1 && (
                  <div
                    className={`
                      absolute left-4 top-8 bottom-0 w-0.5
                      ${isLatest ? 'bg-pink-200' : 'bg-gray-200'}
                    `}
                  />
                )}

                {/* Timeline Dot */}
                <div
                  className={`
                    absolute left-2 top-2 w-4 h-4 rounded-full border-2
                    ${isLatest ? 'bg-pink-500 border-pink-500' : 'bg-white border-gray-300'}
                  `}
                >
                  {isLatest && (
                    <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5 animate-pulse" />
                  )}
                </div>

                {/* Event Content */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span
                        className={`
                          inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                          ${getStatusColor(event.status)}
                        `}
                      >
                        <span className="material-symbols-rounded text-xs mr-1">
                          {getStatusIcon(event.status)}
                        </span>
                        {event.status}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{date}</div>
                      <div className="text-xs text-gray-500">{time}</div>
                    </div>
                  </div>

                  <div className="text-sm text-gray-700">
                    <div className="font-medium">{event.location}</div>
                    <div className="text-gray-600 mt-1">{event.description}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 px-6 py-3 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Timezone: {timezone}</span>
          <span>
            Last updated: {formatDateTime(events[0]?.timestamp || new Date().toISOString()).time}
          </span>
        </div>
      </div>
    </div>
  );
};
