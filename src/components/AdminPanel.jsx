import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://tasktrackr-61z3.onrender.com/api/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUsers(response.data);
      setError(null);
    } catch (error) {
      console.error('AdminPanel.jsx: Error fetching users:', error.response?.status, error.message);
      setError(error.response?.data?.message || 'Failed to fetch users');
    }
  };

  const handleDeleteUser = async (id, email) => {
    if (window.confirm(`Are you sure you want to delete user ${email}?`)) {
      try {
        await axios.delete(`https://tasktrackr-61z3.onrender.com/api/users/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const updatedUsers = users.filter((u) => String(u._id) !== String(id));
        console.log('AdminPanel.jsx: Updated users after delete:', updatedUsers);
        setUsers(updatedUsers);
        setError(null);
      } catch (error) {
        console.error('AdminPanel.jsx: Error deleting user:', error.response?.status, error.message);
        setError(error.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  if (!user || user.role !== 'ADMIN') {
    console.log('AdminPanel.jsx: Not rendering (role:', user?.role, ')');
    return null;
  }

  return (
    <div className="admin-panel p-4 bg-[var(--card-bg)] rounded-lg shadow-md w-full">
      <h2 className="text-xl font-semibold mb-3 text-[var(--text-color)]">Admin Dashboard</h2>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2 text-[var(--text-color)]">Users</h3>
        {users.length > 0 ? (
          <table className="w-full border-collapse table-auto">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="p-2 text-left text-[var(--text-color)] text-sm font-medium">Email</th>
                <th className="p-2 text-left text-[var(--text-color)] text-sm font-medium">Role</th>
                <th className="p-2 text-left text-[var(--text-color)] text-sm font-medium">Created At</th>
                <th className="p-2 text-left text-[var(--text-color)] text-sm font-medium">Last Logged In</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.email} className="border-b border-[var(--border-color)] hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="p-2 text-[var(--text-color)] text-sm truncate max-w-[200px]">{u.email}</td>
                  <td className="p-2 text-[var(--text-color)] text-sm">{u.role}</td>
                  <td className="p-2 text-[var(--text-color)] text-sm truncate max-w-[120px]">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-2 text-[var(--text-color)] text-sm truncate max-w-[120px]">
                    {u.lastLoggedIn ? new Date(u.lastLoggedIn).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="p-2 text-[var(--text-color)]">
                    {u.role === 'USER' && (
                      <button
                        onClick={() => handleDeleteUser(u._id, u.email)}
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No users found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;