import React, { useState } from 'react';

const OrderForm = ({ products, addOrder }) => {
  const [client, setClient] = useState({
    name: '',
    phone: '',
    deliveryDate: ''
  });

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');

  const handleClientChange = (e) => {
    const { name, value } = e.target;
    setClient(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProductSelect = (e) => {
    setSelectedProduct(e.target.value);
  };

  const handleAddProduct = () => {
    if (!selectedProduct) return;

    const product = products.find(p => p.SKU === selectedProduct);
    if (!product) return;

    const existingProduct = selectedProducts.find(p => p.SKU === selectedProduct);
    if (existingProduct) return;

    setSelectedProducts([
      ...selectedProducts,
      {
        ...product,
        quantity: '',
        unit: 'كيلوغرام'
      }
    ]);
    setSelectedProduct('');
  };

  const handleQuantityChange = (index, value) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts[index] = {
      ...updatedProducts[index],
      quantity: value
    };
    setSelectedProducts(updatedProducts);
  };

  const handleUnitChange = (index, value) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts[index] = {
      ...updatedProducts[index],
      unit: value
    };
    setSelectedProducts(updatedProducts);
  };

  const handleRemoveProduct = (index) => {
    setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!client.name || !client.phone || !client.deliveryDate || selectedProducts.length === 0) {
      return;
    }

    const order = {
      client,
      products: selectedProducts,
      date: new Date().toISOString()
    };

    addOrder(order);
    setClient({ name: '', phone: '', deliveryDate: '' });
    setSelectedProducts([]);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">إضافة طلب جديد</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block mb-1">اسم العميل</label>
            <input
              type="text"
              name="name"
              value={client.name}
              onChange={handleClientChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1">رقم الهاتف</label>
            <input
              type="tel"
              name="phone"
              value={client.phone}
              onChange={handleClientChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1">تاريخ التسليم</label>
            <input
              type="date"
              name="deliveryDate"
              value={client.deliveryDate}
              onChange={handleClientChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <div className="flex gap-2">
            <select
              value={selectedProduct}
              onChange={handleProductSelect}
              className="flex-1 border rounded p-2"
            >
              <option value="">اختر منتج</option>
              {products.map((product) => (
                <option key={product.SKU} value={product.SKU}>
                  {product.Name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleAddProduct}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              +
            </button>
          </div>
        </div>

        {selectedProducts.length > 0 && (
          <div className="mb-4">
            <h3 className="text-xl font-bold mb-2">المنتجات المختارة</h3>
            {selectedProducts.map((product, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <span className="font-bold flex-1">{product.Name}</span>
                <input
                  type="number"
                  value={product.quantity}
                  onChange={(e) => handleQuantityChange(index, e.target.value)}
                  className="border rounded p-2 w-24"
                  min="0"
                  step="0.1"
                  required
                />
                <select
                  value={product.unit}
                  onChange={(e) => handleUnitChange(index, e.target.value)}
                  className="border rounded p-2"
                >
                  <option value="كيلوغرام">كيلوغرام</option>
                  <option value="حبة">حبة</option>
                </select>
                <button
                  type="button"
                  onClick={() => handleRemoveProduct(index)}
                  className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                >
                  -
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
        >
          إضافة الطلب
        </button>
      </form>
    </div>
  );
};

export default OrderForm;
