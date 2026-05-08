"use client";

import { useState } from "react";
import { User, Mail, Lock, Bell, Shield, Globe, Save, Upload, Eye, EyeOff } from "lucide-react";
import DashboardLayout from "../DashboardLayout";
import styles from "../dashboard.module.css";

export default function SettingsPage() {
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    bio: "Senior investor with 5+ years of experience in cryptocurrency trading."
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: true,
    securityAlerts: true
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurityData(prev => ({ ...prev, [name]: value }));
  };

  const handleNotificationToggle = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    console.log("Profile updated:", profileData);
    // In a real app, you would make an API call here
    alert("Profile updated successfully!");
  };

  const handleSecuritySubmit = (e) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    console.log("Security settings updated:", securityData);
    // In a real app, you would make an API call here
    alert("Security settings updated successfully!");
    setSecurityData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <DashboardLayout>
      <div className={styles.settingsPage}>
        <h1 style={{ fontSize: "1.875rem", fontWeight: "700", marginBottom: "var(--spacing-xl)", color: "var(--primary)" }}>
          Account Settings
        </h1>

        <div className={styles.settingsGrid}>
          {/* Profile Settings */}
          <section className={styles.settingsSection}>
            <h2 className={styles.settingsSectionTitle}>
              <User size={20} style={{ marginRight: "var(--spacing-sm)", verticalAlign: "middle" }} />
              Profile Information
            </h2>
            
            <div className={styles.profileImageContainer}>
              <div className={styles.profileImagePlaceholder}>
                {profileData.firstName[0]}{profileData.lastName[0]}
              </div>
              <div>
                <button className={`${styles.btn} ${styles.btnSecondary}`} style={{ marginBottom: "var(--spacing-sm)" }}>
                  <Upload size={16} />
                  Upload Photo
                </button>
                <p className={styles.formHelp}>JPG, GIF or PNG. Max size of 2MB.</p>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleProfileChange}
                    className={styles.formInput}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleProfileChange}
                    className={styles.formInput}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="email">
                  <Mail size={16} style={{ marginRight: "var(--spacing-xs)", verticalAlign: "middle" }} />
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  className={styles.formInput}
                  required
                />
                <p className={styles.formHelp}>We'll never share your email with anyone else.</p>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  className={styles.formInput}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={profileData.bio}
                  onChange={handleProfileChange}
                  className={styles.formInput}
                  rows="4"
                  style={{ resize: "vertical" }}
                />
                <p className={styles.formHelp}>Tell us a little about yourself.</p>
              </div>

              <div className={styles.buttonGroup}>
                <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
                  <Save size={16} />
                  Save Changes
                </button>
                <button type="button" className={`${styles.btn} ${styles.btnSecondary}`}>
                  Cancel
                </button>
              </div>
            </form>
          </section>

          {/* Security Settings */}
          <section className={styles.settingsSection}>
            <h2 className={styles.settingsSectionTitle}>
              <Shield size={20} style={{ marginRight: "var(--spacing-sm)", verticalAlign: "middle" }} />
              Security Settings
            </h2>

            <form onSubmit={handleSecuritySubmit}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="currentPassword">
                  <Lock size={16} style={{ marginRight: "var(--spacing-xs)", verticalAlign: "middle" }} />
                  Current Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    id="currentPassword"
                    name="currentPassword"
                    value={securityData.currentPassword}
                    onChange={handleSecurityChange}
                    className={styles.formInput}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    style={{
                      position: "absolute",
                      right: "var(--spacing-md)",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--text-light)"
                    }}
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="newPassword">New Password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      id="newPassword"
                      name="newPassword"
                      value={securityData.newPassword}
                      onChange={handleSecurityChange}
                      className={styles.formInput}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      style={{
                        position: "absolute",
                        right: "var(--spacing-md)",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--text-light)"
                      }}
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="confirmPassword">Confirm New Password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={securityData.confirmPassword}
                      onChange={handleSecurityChange}
                      className={styles.formInput}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{
                        position: "absolute",
                        right: "var(--spacing-md)",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--text-light)"
                      }}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className={styles.buttonGroup}>
                <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
                  <Lock size={16} />
                  Update Password
                </button>
                <button type="button" className={`${styles.btn} ${styles.btnSecondary}`}>
                  Cancel
                </button>
              </div>
            </form>

            <div style={{ marginTop: "var(--spacing-xl)" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "var(--spacing-md)", color: "var(--primary)" }}>
                Two-Factor Authentication
              </h3>
              <p className={styles.formHelp} style={{ marginBottom: "var(--spacing-md)" }}>
                Add an extra layer of security to your account by enabling two-factor authentication.
              </p>
              <button className={`${styles.btn} ${styles.btnSecondary}`}>
                Enable 2FA
              </button>
            </div>
          </section>

          {/* Notification Settings */}
          <section className={styles.settingsSection}>
            <h2 className={styles.settingsSectionTitle}>
              <Bell size={20} style={{ marginRight: "var(--spacing-sm)", verticalAlign: "middle" }} />
              Notification Preferences
            </h2>

            <div className={styles.switchContainer}>
              <div className={styles.switchLabel}>
                <div style={{ fontWeight: "500", color: "var(--primary)" }}>Email Notifications</div>
                <div className={styles.switchDescription}>Receive notifications about your account activity via email</div>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={notifications.emailNotifications}
                  onChange={() => handleNotificationToggle("emailNotifications")}
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.switchContainer}>
              <div className={styles.switchLabel}>
                <div style={{ fontWeight: "500", color: "var(--primary)" }}>Push Notifications</div>
                <div className={styles.switchDescription}>Receive push notifications in your browser</div>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={notifications.pushNotifications}
                  onChange={() => handleNotificationToggle("pushNotifications")}
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.switchContainer}>
              <div className={styles.switchLabel}>
                <div style={{ fontWeight: "500", color: "var(--primary)" }}>Marketing Emails</div>
                <div className={styles.switchDescription}>Receive emails about new features and promotions</div>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={notifications.marketingEmails}
                  onChange={() => handleNotificationToggle("marketingEmails")}
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.switchContainer} style={{ borderBottom: "none" }}>
              <div className={styles.switchLabel}>
                <div style={{ fontWeight: "500", color: "var(--primary)" }}>Security Alerts</div>
                <div className={styles.switchDescription}>Receive alerts for important security events</div>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={notifications.securityAlerts}
                  onChange={() => handleNotificationToggle("securityAlerts")}
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.buttonGroup} style={{ marginTop: "var(--spacing-xl)" }}>
              <button 
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={() => {
                  console.log("Notification preferences saved:", notifications);
                  alert("Notification preferences saved!");
                }}
              >
                Save Preferences
              </button>
            </div>
          </section>

          {/* Preferences */}
          <section className={styles.settingsSection}>
            <h2 className={styles.settingsSectionTitle}>
              <Globe size={20} style={{ marginRight: "var(--spacing-sm)", verticalAlign: "middle" }} />
              Preferences
            </h2>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="language">Language</label>
              <select id="language" className={styles.formInput}>
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="zh">Chinese</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="timezone">Timezone</label>
              <select id="timezone" className={styles.formInput}>
                <option value="utc-5">UTC-5 (Eastern Time)</option>
                <option value="utc-8">UTC-8 (Pacific Time)</option>
                <option value="utc+0">UTC+0 (GMT)</option>
                <option value="utc+1">UTC+1 (Central European Time)</option>
                <option value="utc+5">UTC+5 (Pakistan Standard Time)</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="currency">Currency</label>
              <select id="currency" className={styles.formInput}>
                <option value="usd">USD - US Dollar</option>
                <option value="eur">EUR - Euro</option>
                <option value="gbp">GBP - British Pound</option>
                <option value="jpy">JPY - Japanese Yen</option>
                <option value="cad">CAD - Canadian Dollar</option>
              </select>
            </div>

            <div className={styles.buttonGroup}>
              <button className={`${styles.btn} ${styles.btnPrimary}`}>
                Save Preferences
              </button>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}