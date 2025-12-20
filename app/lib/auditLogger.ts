import { auditLogApi } from './api/audit-log';

// Generate or retrieve session ID
const getSessionId = (): string => {
  if (typeof window === 'undefined') return '';
  
  let sessionId = sessionStorage.getItem('audit_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('audit_session_id', sessionId);
  }
  return sessionId;
};

// Detect device type
const getDeviceType = (): string => {
  if (typeof window === 'undefined') return 'unknown';
  
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

// Parse user agent to get browser and OS
const parseUserAgent = (userAgent: string): { browser: string; os: string } => {
  let browser = 'unknown';
  let os = 'unknown';

  // Detect OS
  if (userAgent.includes('Windows')) os = 'Windows';
  else if (userAgent.includes('Mac')) os = 'macOS';
  else if (userAgent.includes('Linux')) os = 'Linux';
  else if (userAgent.includes('Android')) os = 'Android';
  else if (userAgent.includes('iOS') || userAgent.includes('iPhone') || userAgent.includes('iPad')) os = 'iOS';

  // Detect Browser
  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) browser = 'Chrome';
  else if (userAgent.includes('Firefox')) browser = 'Firefox';
  else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browser = 'Safari';
  else if (userAgent.includes('Edg')) browser = 'Edge';
  else if (userAgent.includes('Opera')) browser = 'Opera';

  return { browser, os };
};

// Get IP address (will be handled by backend from request headers)
const getClientInfo = () => {
  if (typeof window === 'undefined') {
    return {
      userAgent: '',
      deviceType: 'unknown',
      browser: 'unknown',
      os: 'unknown',
      sessionId: '',
      referer: '',
    };
  }

  const userAgent = navigator.userAgent;
  const { browser, os } = parseUserAgent(userAgent);

  return {
    userAgent,
    deviceType: getDeviceType(),
    browser,
    os,
    sessionId: getSessionId(),
    referer: document.referrer || '',
  };
};

// Get customer last login from localStorage
const getCustomerLastLogin = (): string | undefined => {
  if (typeof window === 'undefined') return undefined;
  
  try {
    const customerData = localStorage.getItem('customer');
    if (customerData) {
      const customer = JSON.parse(customerData);
      if (customer.lastLogin) {
        return new Date(customer.lastLogin).toISOString();
      }
    }
  } catch (error) {
    console.error('Error parsing customer data for lastLogin:', error);
  }
  return undefined;
};

export const logPageVisit = async (
  page: string,
  customerId?: string,
  email?: string,
  metadata?: Record<string, any>
) => {
  const clientInfo = getClientInfo();
  const lastLogged = getCustomerLastLogin();
  
  // Include customer id and email in metadata
  const enrichedMetadata: Record<string, any> = {
    ...metadata,
  };
  
  if (customerId) {
    enrichedMetadata.customerId = customerId;
  }
  
  if (email) {
    enrichedMetadata.customerEmail = email;
  }
  
  await auditLogApi.create({
    visitedPage: page,
    activity: 'page_visit',
    ...clientInfo,
    customerId,
    userId: customerId, // Set userId same as customerId for customers
    email,
    lastLogged,
    method: 'GET',
    metadata: enrichedMetadata,
  });
};

export const logActivity = async (
  activity: string,
  customerId?: string,
  email?: string,
  metadata?: Record<string, any>
) => {
  const clientInfo = getClientInfo();
  const lastLogged = getCustomerLastLogin();
  
  // Include customer id and email in metadata
  const enrichedMetadata: Record<string, any> = {
    ...metadata,
  };
  
  if (customerId) {
    enrichedMetadata.customerId = customerId;
  }
  
  if (email) {
    enrichedMetadata.customerEmail = email;
  }
  
  await auditLogApi.create({
    activity,
    ...clientInfo,
    customerId,
    userId: customerId, // Set userId same as customerId for customers
    email,
    lastLogged,
    metadata: enrichedMetadata,
  });
};

