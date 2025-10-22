import axios from "axios";
import { useEffect, useState } from "react";

const CustomerOrder = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrder = async () => {
    try {
      const respone = await axios.get("http://localhost:25569/api/order/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });
      console.log(`Order json data ${JSON.stringify(respone.data.orders[0])}`);
      if (respone.data.success) {
        setOrders(respone.data.orders);
      } else {
        alert(respone.data.message);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(error.response.data.message);
      } else {
        alert("Internal server error");
      }
      console.error("Error fetching Order:", error);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Orders</h1>
      <div>
        <table className="w-full border-collapse border border-gray-300 mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">S NO</th>
              <th className="border border-gray-300 p-2">Product Name</th>
              <th className="border border-gray-300 p-2">Category Name</th>
              <th className="border border-gray-300 p-2">Quantity</th>
              <th className="border border-gray-300 p-2">Total Price</th>
              <th className="border border-gray-300 p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order, index) => (
                <tr key={order._id || index}>
                  <td className="border border-gray-300 p-2">{index + 1}</td>
                  <td className="border border-gray-300 p-2">
                    {order.product.name}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {order.product.category.categoryName}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {order.quantity}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {order.totalPrice}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="border border-gray-300 p-2 text-center"
                  colSpan={6}
                >
                  No Order have been placed
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerOrder;
