"use client";

import { useState } from "react";
import { Search, Filter, UserPlus, Edit, Trash2, Eye, Download, MoreVertical, CheckCircle, XCircle, Clock } from "lucide-react";
import DashboardLayout from "@/app/dashboard/DashboardLayout";
import styles from "../admin.module.css";

export default function UserManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Sample user data
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "User", status: "active", joinDate: "2024-01-15", lastActive: "2024-03-15" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Premium", status: "active", joinDate: "2024-02-10", lastActive: "2024-03-14" },
    { id: 3, name: "Robert Johnson", email: "robert@example.com", role: "Admin", status: "active", joinDate: "2024-01-05", lastActive: "2024-03-15" },
    { id: 4, name: "Sarah Williams", email: "sarah@example.com", role: "User", status: "inactive", joinDate: "2024-02-20", lastActive: "2024-02-25" },
    { id: 5, name: "Michael Brown", email: "michael@example.com", role: "User", status: "suspended", joinDate: "2024-01-30", lastActive: "2024-02-15" },
    { id: 6, name: "Emily Davis", email: "emily@example.com", role: "Premium", status: "active", joinDate: "2024-03-01", lastActive: "2024-03-15" },
    { id: 7, name: "David Wilson", email: "david@example.com", role: "User", status: "pending", joinDate: "2024-03-10", lastActive: "2024-03-10" },
    { id: 8, name: "Lisa Taylor", email: "lisa@example.com", role: "User", status: "active", joinDate: "2024-02-15", lastActive: "2024-03-14" },
    { id: 9, name: "Thomas Anderson", email: "thomas@example.com", role: "Admin", status: "active", joinDate: "2024-01-20", lastActive: "2024-03-15" },
    { id: 10, name: "Amanda Clark", email: "amanda@example.com", role: "Premium", status: "inactive", joinDate: "2024-02-05", lastActive: "2024-02-28" },
  ];

  // Filter users based on search and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const handleStatusChange = (userId, newStatus) => {
    console.log(`Changing user ${userId} status to ${newStatus}`);
    // In a real app, you would make an API call here
    alert(`User ${userId} status changed to ${newStatus}`);
  };

  const handleDeleteUser = (userId) => {
    if (confirm("Are you sure you want to delete this user?")) {
      console.log(`Deleting user ${userId}`);
      // In a real app, you would make an API call here
      alert(`User ${userId} deleted`);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active": return <CheckCircle size={14} />;
      case "inactive": return <XCircle size={14} />;
      case "pending": return <Clock size={14} />;
      case "suspended": return <XCircle size={14} />;
      default: return null;
    }
  };

  return (
    <DashboardLayout isAdmin={true}>
      <div className={styles.adminDashboard}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--spacing-xl)" }}>
          <h1 style={{ fontSize: "1.875rem", fontWeight: "700", color: "var(--primary)" }}>
            User Management
          </h1>
          <button className={`${styles.btn} ${styles.btnPrimary}`} style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
            <UserPlus size={18} />
            Add New User
          </button>
        </div>

        {/* Quick Stats */}
        <div className={styles.adminStatsGrid}>
          <div className={styles.adminStatCard}>
            <div className={styles.adminStatHeader}>
              <div>
                <div className={styles.adminStatTitle}>Total Users</div>
                <div className={styles.adminStatValue}>{users.length}</div>
                <div className={styles.adminStatSubtitle}>+5 this month</div>
              </div>
              <div className={`${styles.adminStatIcon} ${styles.purple}`}>
                <UserPlus size={24} />
              </div>
            </div>
          </div>
          
          <div className={styles.adminStatCard}>
            <div className={styles.adminStatHeader}>
              <div>
                <div className={styles.adminStatTitle}>Active Users</div>
                <div className={styles.adminStatValue}>{users.filter(u => u.status === "active").length}</div>
                <div className={styles.adminStatSubtitle}>85% of total</div>
              </div>
              <div className={`${styles.adminStatIcon} ${styles.green}`}>
                <CheckCircle size={24} />
              </div>
            </div>
          </div>
          
          <div className={styles.adminStatCard}>
            <div className={styles.adminStatHeader}>
              <div>
                <div className={styles.adminStatTitle}>Pending Verification</div>
                <div className={styles.adminStatValue}>{users.filter(u => u.status === "pending").length}</div>
                <div className={styles.adminStatSubtitle}>Requires action</div>
              </div>
              <div className={`${styles.adminStatIcon} ${styles.orange}`}>
                <Clock size={24} />
              </div>
            </div>
          </div>
          
          <div className={styles.adminStatCard}>
            <div className={styles.adminStatHeader}>
              <div>
                <div className={styles.adminStatTitle}>Suspended Users</div>
                <div className={styles.adminStatValue}>{users.filter(u => u.status === "suspended").length}</div>
                <div className={styles.adminStatSubtitle}>Needs review</div>
              </div>
              <div className={`${styles.adminStatIcon} ${styles.blue}`}>
                <XCircle size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className={styles.filterBar}>
          <div className={styles.filterGroup}>
            <Search size={18} color="var(--text-light)" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.filterInput}
            />
          </div>
          
          <div className={styles.filterGroup}>
            <Filter size={18} color="var(--text-light)" />
            <label className={styles.filterLabel}>Status:</label>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <button className={`${styles.btn} ${styles.btnSecondary}`} style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
            <Download size={16} />
            Export CSV
          </button>
        </div>

        {/* Data Grid */}
        <div className={styles.dataGridContainer}>
          <div className={styles.dataGridHeader}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "var(--primary)" }}>
              Users ({filteredUsers.length})
            </h2>
            <div className={styles.dataGridActions}>
              <button className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`}>
                Bulk Actions
              </button>
            </div>
          </div>

          <table className={styles.dataGrid}>
            <thead>
              <tr>
                <th style={{ width: "40px" }}>
                  <input type="checkbox" />
                </th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Join Date</th>
                <th>Last Active</th>
                <th style={{ textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "var(--accent)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "600" }}>
                        {user.name[0]}
                      </div>
                      <span style={{ fontWeight: "500" }}>{user.name}</span>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span style={{ 
                      padding: "0.25rem 0.75rem", 
                      borderRadius: "9999px", 
                      fontSize: "0.75rem", 
                      fontWeight: "600",
                      backgroundColor: user.role === "Admin" ? "rgba(99, 102, 241, 0.1)" : 
                                     user.role === "Premium" ? "rgba(245, 158, 11, 0.1)" : "rgba(203, 213, 225, 0.1)",
                      color: user.role === "Admin" ? "var(--accent)" : 
                            user.role === "Premium" ? "#f59e0b" : "#64748b"
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className={`${styles.userStatus} ${styles[user.status]}`}>
                      {getStatusIcon(user.status)}
                      {user.status}
                    </span>
                  </td>
                  <td>{user.joinDate}</td>
                  <td>{user.lastActive}</td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button 
                        className={`${styles.actionButton} ${styles.view}`}
                        onClick={() => console.log(`View user ${user.id}`)}
                        title="View"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className={`${styles.actionButton} ${styles.edit}`}
                        onClick={() => console.log(`Edit user ${user.id}`)}
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className={`${styles.actionButton} ${styles.delete}`}
                        onClick={() => handleDeleteUser(user.id)}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button 
                        className={styles.actionButton}
                        title="More"
                      >
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <div className={styles.paginationInfo}>
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
              </div>
              <div className={styles.paginationControls}>
                <button 
                  className={styles.paginationButton}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      className={`${styles.paginationButton} ${currentPage === pageNum ? styles.active : ""}`}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button 
                  className={styles.paginationButton}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div style={{ marginTop: "var(--spacing-2xl)" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "var(--spacing-lg)", color: "var(--primary)" }}>
            Quick Actions
          </h2>
          <div className={styles.quickActions}>
            <div className={styles.quickActionCard} onClick={() => alert("Import users feature")}>
              <div className={`${styles.quickActionIcon} ${styles.blue}`}>
                <Download size={24} />
              </div>
              <div className={styles.quickActionTitle}>Import Users</div>
              <div className={styles.quickActionDescription}>Bulk import from CSV</div>
            </div>
            
            <div className={styles.quickActionCard} onClick={() => alert("Send broadcast message")}>
              <div className={`${styles.quickActionIcon} ${styles.green}`}>
                <UserPlus size={24} />
              </div>
              <div className={styles.quickActionTitle}>Send Message</div>
              <div className={styles.quickActionDescription}>Broadcast to all users</div>
            </div>
            
            <div className={styles.quickActionCard} onClick={() => alert("Generate user report")}>
              <div className={`${styles.quickActionIcon} ${styles.purple}`}>
                <Filter size={24} />
              </div>
              <div className={styles.quickActionTitle}>Generate Report</div>
              <div className={styles.quickActionDescription}>User analytics report</div>
            </div>
            
            <div className={styles.quickActionCard} onClick={() => alert("Verify pending users")}>
              <div className={`${styles.quickActionIcon} ${styles.orange}`}>
                <CheckCircle size={24} />
              </div>
              <div className={styles.quickActionTitle}>Verify Users</div>
              <div className={styles.quickActionDescription}>Approve pending accounts</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}