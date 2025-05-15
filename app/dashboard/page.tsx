import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const session = await getServerSession();
  
  if (!session?.user) {
    redirect('/login');
  }
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold">RFP Portal Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">Active RFPs</h2>
          <p className="text-gray-600">You have no active RFPs</p>
        </div>
        
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">Drafts</h2>
          <p className="text-gray-600">You have no draft RFPs</p>
        </div>
        
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">Recent Activity</h2>
          <p className="text-gray-600">No recent activity</p>
        </div>
      </div>
    </div>
  );
} 