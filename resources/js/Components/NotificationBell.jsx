import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import axios from 'axios';

export default function NotificationBell() {
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        fetchUnreadCount();
        // Optionally fetch full list on mount
    }, []);

    const fetchUnreadCount = () => {
        axios.get('/admin/notifications/unread-count')
            .then(response => setUnreadCount(response.data.count))
            .catch(console.error);
    };

    const fetchNotifications = () => {
        axios.get('/admin/notifications')
            .then(response => setNotifications(response.data))
            .catch(console.error);
    };

    const markAsRead = (id) => {
        axios.put(`/admin/notifications/${id}/read`)
            .then(() => {
                setNotifications(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
                setUnreadCount(prev => Math.max(0, prev - 1));
            })
            .catch(console.error);
    };

    const markAllAsRead = () => {
        axios.put('/admin/notifications/read-all')
            .then(() => {
                setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
                setUnreadCount(0);
            })
            .catch(console.error);
    };

    const toggleDropdown = () => {
        if (!open) {
            fetchNotifications();
        }
        setOpen(!open);
    };

    const getNotificationMessage = (notif) => {
        if (notif.type === 'new_order') {
            return `New order #${notif.data.order_number} from ${notif.data.customer_name} - R${notif.data.total}`;
        } else if (notif.type === 'low_stock') {
            const products = notif.data.products.map(p => p.name).join(', ');
            return `Low stock alert: ${products}`;
        }
        return 'Notification';
    };

    return (
        <div className="relative">
            <button
                onClick={toggleDropdown}
                className="relative text-gray-700 hover:text-indigo-600 focus:outline-none"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs text-blue-600 hover:text-blue-800"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <p className="px-4 py-3 text-gray-500 text-sm">No notifications</p>
                        ) : (
                            notifications.map(notif => (
                                <div
                                    key={notif.id}
                                    className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${!notif.read_at ? 'bg-blue-50' : ''}`}
                                    onClick={() => markAsRead(notif.id)}
                                >
                                    <p className="text-sm text-gray-800">{getNotificationMessage(notif)}</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {new Date(notif.created_at).toLocaleString()}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}