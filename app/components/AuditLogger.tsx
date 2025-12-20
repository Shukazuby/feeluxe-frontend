'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { logPageVisit } from '../lib/auditLogger';

export default function AuditLogger() {
  const pathname = usePathname();
  const { isAuthenticated, token } = useAuth();

  useEffect(() => {
    // Only log on client side
    if (typeof window === 'undefined') return;

    // Get customer info if authenticated
    let customerId: string | undefined;
    let email: string | undefined;

    if (isAuthenticated && typeof window !== 'undefined') {
      try {
        const customerData = localStorage.getItem('customer');
        if (customerData) {
          const customer = JSON.parse(customerData);
          customerId = customer.id || customer._id;
          email = customer.email;
        }
      } catch (error) {
        console.error('Error parsing customer data:', error);
      }
    }

    // Log page visit with customer info in metadata
    logPageVisit(pathname, customerId, email, {
      timestamp: new Date().toISOString(),
      authenticated: isAuthenticated,
      // customerId and email will be automatically added to metadata by logPageVisit
    });
  }, [pathname, isAuthenticated]);

  return null; // This component doesn't render anything
}

