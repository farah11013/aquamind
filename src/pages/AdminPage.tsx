import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { profileApi } from '@/db/api';
import type { Profile } from '@/types/database';
import { Shield, Users, Database, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    loadProfiles();
  }, [profile, navigate]);

  const loadProfiles = async () => {
    try {
      const data = await profileApi.getAllProfiles();
      setProfiles(data);
    } catch (error) {
      console.error('Failed to load profiles:', error);
      toast({
        title: 'Error',
        description: 'Failed to load user profiles',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdating(userId);
    try {
      await profileApi.updateUserRole(userId, newRole);
      toast({
        title: 'Success',
        description: 'User role updated successfully',
      });
      await loadProfiles();
    } catch (error) {
      console.error('Failed to update role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user role',
        variant: 'destructive',
      });
    } finally {
      setUpdating(null);
    }
  };

  if (profile?.role !== 'admin') {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="gradient-text">Admin Panel</span>
          </h1>
          <p className="text-muted-foreground">
            Manage users, roles, and platform settings
          </p>
        </div>

        <Alert className="mb-8">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            You are logged in as an administrator. You have full access to manage users and platform data.
          </AlertDescription>
        </Alert>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profiles.length}</div>
              <p className="text-xs text-muted-foreground">Registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scientists</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {profiles.filter((p) => p.role === 'scientist').length}
              </div>
              <p className="text-xs text-muted-foreground">Active scientists</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admins</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {profiles.filter((p) => p.role === 'admin').length}
              </div>
              <p className="text-xs text-muted-foreground">Platform administrators</p>
            </CardContent>
          </Card>
        </div>

        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              Manage user roles and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading users...</div>
            ) : (
              <div className="space-y-4">
                {profiles.map((user) => (
                  <div
                    key={user.id}
                    className="flex flex-col xl:flex-row xl:items-center justify-between p-4 border border-border rounded-lg gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{user.username}</h3>
                        {user.id === profile?.id && (
                          <Badge variant="outline" className="text-xs">You</Badge>
                        )}
                      </div>
                      {user.email && (
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      )}
                      {user.organization && (
                        <p className="text-sm text-muted-foreground">{user.organization}</p>
                      )}
                      <div className="flex gap-2 mt-2">
                        <Badge variant="secondary" className="capitalize">
                          {user.role}
                        </Badge>
                        <Badge variant="outline">
                          Joined {new Date(user.created_at).toLocaleDateString()}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={user.role}
                        onValueChange={(value) => handleRoleChange(user.id, value)}
                        disabled={updating === user.id || user.id === profile?.id}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="guest">Guest</SelectItem>
                          <SelectItem value="scientist">Scientist</SelectItem>
                          <SelectItem value="policymaker">Policymaker</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      {user.id === profile?.id && (
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
