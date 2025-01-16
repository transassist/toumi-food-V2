import React, { useState } from 'react';
import DateRangePicker from './DateRangePicker';

const OrderList = ({ orders }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const filterOrdersByDateRange = (orders, startDate, endDate) => {
    if (!startDate || !endDate) {
      return orders;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    return orders.filter((order) => {
      const orderDate = new Date(order.date);
      return orderDate >= start && orderDate <= end;
    });
  };

  const handleExport = () => {
    const filteredOrders = filterOrdersByDateRange(orders, startDate, endDate);
    const aggregatedData = {};

    filteredOrders.forEach((order) => {
      order.products.forEach((product) => {
        const sku = product.SKU;
        if (!aggregatedData[sku]) {
          aggregatedData[sku] = {
            name: product.Name,
            quantity: 0,
            unit: product.unit,
          };
        }
        aggregatedData[sku].quantity += parseFloat(product.quantity);
      });
    });

    const csvContent = [
      ['SKU', 'الاسم', 'الكمية', 'الوحدة'],
      ...Object.entries(aggregatedData).map(([sku, { name, quantity, unit }]) => [
        sku,
        name,
        quantity,
        unit,
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const startDateFormatted = startDate ? new Date(startDate).toLocaleDateString('ar-EG') : '';
    const endDateFormatted = endDate ? new Date(endDate).toLocaleDateString('ar-EG') : '';
    const dateRange = startDate && endDate ? `-${startDateFormatted}_${endDateFormatted}` : '';
    link.setAttribute('href', url);
    link.setAttribute('download', `الطلبات_المجمعة${dateRange}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredOrders = filterOrdersByDateRange(orders, startDate, endDate);
  const groupedOrders = filteredOrders.reduce((acc, order) => {
    const date = order.date.split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(order);
    return acc;
  }, {});

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          handleStartDateChange={handleStartDateChange}
          handleEndDateChange={handleEndDateChange}
        />
        <button 
          onClick={handleExport} 
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          تصدير الطلبات المجمعة
        </button>
      </div>
      
      {Object.keys(groupedOrders).length === 0 ? (
        <div className="text-center">لا توجد طلبات لعرضها</div>
      ) : (
        Object.entries(groupedOrders).map(([date, orders]) => (
          <div key={date} className="mb-6">
            <h3 className="text-xl font-bold mb-2">{formatDate(date)}</h3>
            <div className="space-y-2">
              {orders.map((order) => (
                <div 
                  key={order.orderNumber} 
                  className="bg-white rounded-lg shadow p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpandedOrder(expandedOrder === order.orderNumber ? null : order.orderNumber)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-bold ml-2">اسم العميل:</span>
                      {order.client.name}
                    </div>
                    <div className="text-gray-600">#{order.orderNumber}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderList;
