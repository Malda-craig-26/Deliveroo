import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminHeader from "@/components/AdminHeader";
import AdminSidebar from "@/components/AdminSidebar";
import AddDriverModal from "@/components/AddDriverModal";
import { 
  Users, 
  Package, 
  TrendingUp, 
  DollarSign, 
  Search,
  Edit,
  Trash2,
  UserPlus,
  Plus,
  FileText,
  Truck,
  BarChart3
} from "lucide-react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  joinDate: string;
}

interface Order {
  id: string;
  userId: string;
  userName: string;
  pickup: string;
  destination: string;
  status: string;
  amount: number;
  createdAt: string;
  driverId?: string;
}

interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicle: string;
  status: string;
  rating: number;
  completedOrders: number;
}

const AdminDashboard = () => {
  const { isAuthenticated,loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDriverModalOpen, setIsAddDriverModalOpen] = useState(false);

  // Mock data
  const [users, setUsers] = useState<User[]>([
    { id: "1", name: "John Doe", email: "john@example.com", role: "Customer", status: "Active", joinDate: "2024-01-15" },
    { id: "2", name: "Jane Smith", email: "jane@example.com", role: "Customer", status: "Active", joinDate: "2024-01-20" },
    { id: "3", name: "Mike Wilson", email: "mike@example.com", role: "Driver", status: "Active", joinDate: "2024-02-01" },
  ]);

  const [orders, setOrders] = useState<Order[]>([
    { id: "ORD001", userId: "1", userName: "John Doe", pickup: "123 Main St", destination: "456 Oak Ave", status: "Delivered", amount: 25.99, createdAt: "2024-01-25", driverId: "3" },
    { id: "ORD002", userId: "2", userName: "Jane Smith", pickup: "789 Pine St", destination: "321 Elm St", status: "In Transit", amount: 18.50, createdAt: "2024-01-26", driverId: "3" },
    { id: "ORD003", userId: "1", userName: "John Doe", pickup: "555 Cedar Ave", destination: "777 Birch Ln", status: "Pending", amount: 32.75, createdAt: "2024-01-26" },
  ]);

  const [drivers, setDrivers] = useState<Driver[]>([
    { id: "1", name: "Mike Wilson", email: "mike@example.com", phone: "+1234567890", vehicle: "Honda Civic", status: "Available", rating: 4.8, completedOrders: 150 },
    { id: "2", name: "Sarah Johnson", email: "sarah@example.com", phone: "+1234567891", vehicle: "Toyota Camry", status: "Busy", rating: 4.9, completedOrders: 203 },
  ]);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, loading, navigate]);
  
 if (loading) return <div>Loading...</div>;
if (!isAuthenticated) return null; 

  const stats = [
    { title: "Total Users", value: users.length, icon: Users, change: "+12%", color: "text-blue-600" },
    { title: "Total Orders", value: orders.length, icon: Package, change: "+8%", color: "text-green-600" },
    { title: "Revenue", value: `$${orders.reduce((sum, order) => sum + order.amount, 0).toFixed(2)}`, icon: DollarSign, change: "+15%", color: "text-purple-600" },
    { title: "Active Drivers", value: drivers.filter(d => d.status === "Available" || d.status === "Busy").length, icon: TrendingUp, change: "+5%", color: "text-orange-600" },
  ];

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const deleteUser = (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers(prev => prev.filter(user => user.id !== userId));
    }
  };

  const updateUserStatus = (userId: string, newStatus: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
  };

  const addDriver = (newDriver: Driver) => {
    setDrivers(prev => [...prev, newDriver]);
  };

  const deleteDriver = (driverId: string) => {
    if (confirm("Are you sure you want to delete this driver?")) {
      setDrivers(prev => prev.filter(driver => driver.id !== driverId));
      toast.success("Driver deleted successfully!");
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <AdminHeader />
      
      <div className="flex">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-64"
                  />
                </div>
              </div>
            </div>

            {activeTab === "overview" && (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          {stat.title}
                        </CardTitle>
                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground">
                          <span className="text-green-600">{stat.change}</span> from last month
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>Recent Orders</CardTitle>
                      <CardDescription>Latest order activities</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {orders.slice(0, 5).map((order) => (
                          <div key={order.id} className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{order.id}</p>
                              <p className="text-sm text-muted-foreground">{order.userName}</p>
                            </div>
                            <div className="text-right">
                              <Badge variant={order.status === "Delivered" ? "default" : order.status === "In Transit" ? "secondary" : "outline"}>
                                {order.status}
                              </Badge>
                              <p className="text-sm font-medium">${order.amount}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>Driver Performance</CardTitle>
                      <CardDescription>Top performing drivers</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {drivers.map((driver) => (
                          <div key={driver.id} className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{driver.name}</p>
                              <p className="text-sm text-muted-foreground">{driver.completedOrders} orders</p>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium">⭐ {driver.rating}</div>
                              <Badge variant={driver.status === "Available" ? "default" : "secondary"}>
                                {driver.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}

            {activeTab === "users" && (
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>User Management</CardTitle>
                      <CardDescription>Manage all system users</CardDescription>
                    </div>
                    <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add User
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Join Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{user.role}</Badge>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={user.status}
                              onValueChange={(value) => updateUserStatus(user.id, value)}
                            >
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">Inactive</SelectItem>
                                <SelectItem value="Suspended">Suspended</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>{user.joinDate}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => deleteUser(user.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {activeTab === "orders" && (
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Order Management</CardTitle>
                  <CardDescription>Manage all delivery orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Pickup</TableHead>
                        <TableHead>Destination</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.userName}</TableCell>
                          <TableCell>{order.pickup}</TableCell>
                          <TableCell>{order.destination}</TableCell>
                          <TableCell>
                            <Select
                              value={order.status}
                              onValueChange={(value) => updateOrderStatus(order.id, value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="In Transit">In Transit</SelectItem>
                                <SelectItem value="Delivered">Delivered</SelectItem>
                                <SelectItem value="Cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>${order.amount}</TableCell>
                          <TableCell>{order.createdAt}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {activeTab === "drivers" && (
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Driver Management</CardTitle>
                      <CardDescription>Manage delivery drivers</CardDescription>
                    </div>
                    <Button 
                      className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                      onClick={() => setIsAddDriverModalOpen(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Driver
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Vehicle</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Orders</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {drivers.map((driver) => (
                        <TableRow key={driver.id}>
                          <TableCell className="font-medium">{driver.name}</TableCell>
                          <TableCell>{driver.email}</TableCell>
                          <TableCell>{driver.phone}</TableCell>
                          <TableCell>{driver.vehicle}</TableCell>
                          <TableCell>
                            <Badge variant={driver.status === "Available" ? "default" : "secondary"}>
                              {driver.status}
                            </Badge>
                          </TableCell>
                          <TableCell>⭐ {driver.rating}</TableCell>
                          <TableCell>{driver.completedOrders}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => deleteDriver(driver.id)}
                                className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {activeTab === "analytics" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>Revenue Analytics</CardTitle>
                      <CardDescription>Monthly revenue trends</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600">$12,456</div>
                      <p className="text-sm text-muted-foreground">+18.3% from last month</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>Order Volume</CardTitle>
                      <CardDescription>Orders processed this month</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-600">1,247</div>
                      <p className="text-sm text-muted-foreground">+12.5% from last month</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>Customer Satisfaction</CardTitle>
                      <CardDescription>Average rating this month</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-purple-600">4.8⭐</div>
                      <p className="text-sm text-muted-foreground">+0.2 from last month</p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                    <CardDescription>Key performance indicators</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Delivery Success Rate</span>
                          <span className="font-semibold">96.8%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: '96.8%' }}></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Average Delivery Time</span>
                          <span className="font-semibold">28 min</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "reports" && (
              <div className="space-y-6">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Report Generation</CardTitle>
                    <CardDescription>Generate and download various reports</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <Button variant="outline" className="h-24 flex flex-col">
                        <FileText className="w-8 h-8 mb-2" />
                        <span>Monthly Sales Report</span>
                      </Button>
                      <Button variant="outline" className="h-24 flex flex-col">
                        <Users className="w-8 h-8 mb-2" />
                        <span>Customer Report</span>
                      </Button>
                      <Button variant="outline" className="h-24 flex flex-col">
                        <Truck className="w-8 h-8 mb-2" />
                        <span>Driver Performance</span>
                      </Button>
                      <Button variant="outline" className="h-24 flex flex-col">
                        <Package className="w-8 h-8 mb-2" />
                        <span>Order Analytics</span>
                      </Button>
                      <Button variant="outline" className="h-24 flex flex-col">
                        <DollarSign className="w-8 h-8 mb-2" />
                        <span>Revenue Report</span>
                      </Button>
                      <Button variant="outline" className="h-24 flex flex-col">
                        <BarChart3 className="w-8 h-8 mb-2" />
                        <span>Custom Report</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Recent Reports</CardTitle>
                    <CardDescription>Previously generated reports</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Report Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Generated Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>December Sales Report</TableCell>
                          <TableCell>Sales</TableCell>
                          <TableCell>2024-01-01</TableCell>
                          <TableCell><Badge>Completed</Badge></TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">Download</Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Driver Performance Q4</TableCell>
                          <TableCell>Performance</TableCell>
                          <TableCell>2024-01-02</TableCell>
                          <TableCell><Badge>Completed</Badge></TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">Download</Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "payments" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">$45,678.90</div>
                      <p className="text-sm text-muted-foreground">This month</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>Pending Payments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-orange-600">$2,345.67</div>
                      <p className="text-sm text-muted-foreground">Awaiting processing</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>Failed Payments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-600">$123.45</div>
                      <p className="text-sm text-muted-foreground">Requires attention</p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Payment Transactions</CardTitle>
                    <CardDescription>Recent payment activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Transaction ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Method</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>TXN001</TableCell>
                          <TableCell>John Doe</TableCell>
                          <TableCell>$25.99</TableCell>
                          <TableCell>Credit Card</TableCell>
                          <TableCell><Badge>Completed</Badge></TableCell>
                          <TableCell>2024-01-26</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>TXN002</TableCell>
                          <TableCell>Jane Smith</TableCell>
                          <TableCell>$18.50</TableCell>
                          <TableCell>PayPal</TableCell>
                          <TableCell><Badge variant="secondary">Pending</Badge></TableCell>
                          <TableCell>2024-01-26</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>TXN003</TableCell>
                          <TableCell>Mike Wilson</TableCell>
                          <TableCell>$32.75</TableCell>
                          <TableCell>Credit Card</TableCell>
                          <TableCell><Badge variant="destructive">Failed</Badge></TableCell>
                          <TableCell>2024-01-25</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-6">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>System Settings</CardTitle>
                    <CardDescription>Configure system preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">General Settings</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Email Notifications</label>
                            <Button variant="outline" size="sm">Configure</Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">SMS Notifications</label>
                            <Button variant="outline" size="sm">Configure</Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Auto-assign Orders</label>
                            <Button variant="outline" size="sm">Enable</Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Pricing Settings</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Base Delivery Fee</label>
                            <Input className="w-24" placeholder="$5.00" />
                          </div>
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Per Mile Rate</label>
                            <Input className="w-24" placeholder="$1.50" />
                          </div>
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Rush Hour Multiplier</label>
                            <Input className="w-24" placeholder="1.5x" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage admin users and permissions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-medium">Admin Users</h4>
                      <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add Admin
                      </Button>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Last Login</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Admin User</TableCell>
                          <TableCell>admin@example.com</TableCell>
                          <TableCell><Badge>Super Admin</Badge></TableCell>
                          <TableCell>2024-01-26</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
      
      <AddDriverModal 
        isOpen={isAddDriverModalOpen}
        onClose={() => setIsAddDriverModalOpen(false)}
        onAddDriver={addDriver}
      />
    </div>
  );
};

export default AdminDashboard;