
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

const UserPermissionsDisplay: React.FC = () => {
  const { permissions, profile } = useAuth();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Permissions</CardTitle>
        <CardDescription>
          Active permissions and quota information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {profile && (
          <div>
            <p className="text-sm font-medium text-gray-700">
              Request Quota: {profile.request_prompt_quota}
            </p>
          </div>
        )}
        
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Active Permissions:</p>
          {permissions.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {permissions.map((permission, index) => (
                <Badge key={index} variant="outline">
                  {permission.permission_key}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No special permissions yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserPermissionsDisplay;
